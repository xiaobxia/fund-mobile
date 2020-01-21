<template>
  <div class="my-net-value-line">
    <mt-header title="净值曲线" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
      <mt-button slot="right">
        <i class="fas fa-bars" @click="addHandler"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div class="detail-info-wrap">
        <span class="item"><span class="label">年收益：</span><span :class="['value', stockNumberClass(yearIncome)]">{{yearIncome}}</span></span>
        <span class="item"><span class="label">月收益：</span><span :class="['value', stockNumberClass(monthIncome)]">{{monthIncome}}</span></span>
      </div>
      <div class="page-content-title">月K线</div>
      <div class="chart-wrap">
        <ve-line
          :yAxis="chartYAxis"
          :textStyle="chartTextStyle"
          :height="chartHeight"
          :legend="chartLegend"
          :data="chartData"
          :settings="chartSettings"
          :tooltip="tooltip"
          :grid="grid"
          :theme="lineTheme"
        ></ve-line>
      </div>
      <div class="page-content-title">收益表</div>
      <div class="table-wrap">
        <table width="100%" cellspacing="0" cellpadding="15">
          <tr>
            <th>指数</th>
            <th>本月</th>
            <th>本年</th>
          </tr>
          <tr>
            <td>我的</td>
            <td>{{nowMonthRate.my}}%</td>
            <td>{{nowYearRate.my}}%</td>
          </tr>
          <tr v-for="(item, index) in webDataKeys" :key="index">
            <td>{{webDataMap[item].name}}</td>
            <td>{{nowMonthRate[item]}}%<div :class="stockNumberClass(nowMonthRate.my - nowMonthRate[item])">({{keepTwoDecimals(nowMonthRate.my - nowMonthRate[item])}}%)</div></td>
            <td>{{nowYearRate[item]}}%<div :class="stockNumberClass(nowYearRate.my - nowYearRate[item])">({{keepTwoDecimals(nowYearRate.my - nowYearRate[item])}}%)</div></td>
          </tr>
        </table>
      </div>
      <div class="page-content-title">月收益图</div>
      <div class="chart-wrap">
        <ve-histogram
          :grid="monthRateGrid"
          :yAxis="chartYAxis"
          :textStyle="chartTextStyle"
          :height="monthRateChartHeight"
          :legend="monthRateChartLegend"
          :settings="chartSettings"
          :tooltip="tooltip"
          :series="monthRateChartSeries"
          :xAxis="monthRateChartXAxis"
        >
        </ve-histogram>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import indexListAll from '@/common/indexListAll.js'
import {Indicator} from 'mint-ui'
import { mapGetters } from 'vuex'

const zoom = window.adaptive.zoom
const baseFontSize = 22

let rateChartSelected = {}
let webDataNames = []
let webDataKeyRateMap = {}
let webDataListMap = {}
let webDataMap = {}
let webDataKeys = []
indexListAll.forEach((item) => {
  if (item.mix) {
    rateChartSelected[item.name] = item.name === '300'
    webDataNames.push(item.name)
    webDataKeys.push(item.key)
    webDataKeyRateMap[item.key] = 0
    webDataListMap[item.key] = []
    webDataMap[item.key] = {
      ...item
    }
  }
})

export default {
  name: 'MyNetValueLine',
  data () {
    // 图表部分
    const chartPart = {
      grid: {
        top: '10%',
        left: '8%',
        right: '0%'
      },
      monthRateGrid: {
        top: '10%',
        left: '0%',
        right: '0%',
        bottom: '0%'
      },
      tooltip: {
        trigger: 'axis',
        textStyle: {
          fontSize: baseFontSize * zoom
        }
      },
      chartHeight: (500 / 20) + 'rem',
      monthRateChartHeight: (500 / 20) + 'rem',
      chartTextStyle: {
        fontSize: baseFontSize * zoom
      },
      chartYAxis: {
        axisLabel: {
          fontSize: baseFontSize * zoom * 0.8,
          formatter: '{value} %'
        },
        scale: [true, true],
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dotted'
          }
        },
        axisLine: {
          show: false
        }
      },
      monthRateChartLegend: {
      },
      chartLegend: {
        selected: {
          '我的组合': true,
          ...rateChartSelected
        }
      },
      chartSettings: {
        lineStyle: {
          width: 4 * zoom
        }
      },
      lineTheme: {
        line: {
          smooth: false,
          showSymbol: false
        }
      }
    }
    return {
      ...chartPart,
      popupVisible: false,
      myList: [],
      webDataListMap,
      webDataKeys,
      webDataMap,
      nowMonthRate: {
        my: 0,
        ...webDataKeyRateMap
      },
      nowYearRate: {
        my: 0,
        ...webDataKeyRateMap
      },
      myIncomeRateInfo: {
        nowMonth: 0,
        all: 0
      },
      netValueMonthRate: [],
      monthIncome: 0,
      yearIncome: 0
    }
  },

  computed: {
    ...mapGetters([
      'userFundAccountInfo'
    ]),
    chartData () {
      // 起码有一个不然没有显示的必要
      if (!(this.myList.length > 0)) {
        return {}
      }
      // 验证指数的数据
      let oneKey = ''
      for (let key in this.webDataListMap) {
        oneKey = key
        if (!(this.webDataListMap[key] && this.webDataListMap[key].length > 0)) {
          return {}
        }
      }
      let myList = this.copy(this.myList)
      const baseMy = myList[0]['pre_net_value']
      const firstData = {
        '日期': moment().format('YYYY-MM'),
        '我的组合': 0
      }
      for (let key in this.webDataMap) {
        firstData[webDataMap[key].name] = 0
      }
      // 创建第一个
      let row = [firstData]
      let myNewestNetValue = 1
      this.webDataListMap[oneKey].forEach((item, index) => {
        let data = {}
        let my = 0
        data['日期'] = item['trade_date']
        for (let i = 0; i < myList.length; i++) {
          if (moment(myList[i]['net_value_date']).format('YYYYMMDD') === item['trade_date']) {
            my = this.countDifferenceRate(myList[i]['net_value'], baseMy)
            myNewestNetValue = myList[i]['net_value']
            break
          }
        }
        if (my) {
          data['我的组合'] = my
        } else {
          if (myNewestNetValue === 1) {
            data['我的组合'] = 0
          } else {
            data['我的组合'] = this.countDifferenceRate(myNewestNetValue, baseMy)
          }
        }
        for (let key in this.webDataListMap) {
          const base = this.webDataListMap[key][0].preClose
          data[webDataMap[key].name] = this.countDifferenceRate(this.webDataListMap[key][index].close, base)
        }
        row.push(data)
      })
      return {
        columns: ['日期', '我的组合', ...webDataNames],
        rows: row
      }
    },
    // 月收益率图表
    monthRateChartData () {
      if (!this.netValueMonthRate.length > 0) {
        return {}
      }
      const listMonth = this.netValueMonthRate
      let row = []
      listMonth.forEach(function (item) {
        let data = {}
        data['日期'] = item['yearMonth']
        data['收益率'] = item['rate']
        row.push(data)
      })
      return {
        columns: ['日期', '收益率'],
        rows: row
      }
    },
    monthRateChartSeries () {
      if (!this.netValueMonthRate.length > 0) {
        return [{
          name: '收益率',
          type: 'bar',
          data: []
        }]
      }
      const listMonth = this.netValueMonthRate
      let row = []
      listMonth.forEach(function (item) {
        row.push({
          value: item['netChangeRatio'],
          itemStyle: {
            color: item['netChangeRatio'] > 0 ? 'rgb(244, 51, 60)' : 'rgb(62, 179, 121)'
          }
        })
      })
      return [{
        name: '收益率',
        type: 'bar',
        data: row
      }]
    },
    monthRateChartXAxis () {
      if (!this.netValueMonthRate.length > 0) {
        return {}
      }
      const listMonth = this.netValueMonthRate
      let row = []
      listMonth.forEach(function (item) {
        row.push(item['yearMonth'])
      })
      return [
        {
          type: 'category',
          data: row
        }
      ]
    }
  },
  created () {
    this.initPage()
  },
  methods: {
    initPage () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      // 总涨幅
      const userNewestNetValue = this.userFundAccountInfo.userNewestNetValue
      this.myIncomeRateInfo.all = this.countDifferenceRate(userNewestNetValue.net_value, 1)
      // 获取我的净值数据
      this.$http.get('userFund/getUserNetValuesByStart', {
        start: moment().format('YYYY-MM')
      }).then((data) => {
        if (data.success) {
          this.myList = data.data.list
        }
      })
      let queryList = []
      // 我的
      // 年涨幅
      queryList.push(this.$http.get('userFund/getUserNetValueNowYearNetChangeRatio').then((res) => {
        this.nowYearRate.my = (res.data && res.data.netChangeRatio) || 0
        this.myIncomeRateInfo.nowYear = (res.data && res.data.netChangeRatio) || 0
      }))
      // 月涨幅
      queryList.push(this.$http.get('userFund/getUserNetValueNowMonthNetChangeRatio').then((res) => {
        this.nowMonthRate.my = (res.data && res.data.netChangeRatio) || 0
        this.myIncomeRateInfo.nowMonth = (res.data && res.data.netChangeRatio) || 0
      }))
      for (let key in webDataMap) {
        queryList.push(this.$http.get(`stock/getStockPriceDayKlineByStart`, {
          code: webDataMap[key].code,
          start: moment().format('YYYY-MM')
        }).then((data) => {
          if (data.success) {
            this.webDataListMap[key] = data.data
          }
        }))
        // 年涨幅
        queryList.push(this.$http.get('stock/getStockPriceNowYearNetChangeRatio', {
          code: webDataMap[key].code
        }).then((res) => {
          this.nowYearRate[key] = (res.data && res.data.netChangeRatio) || 0
        }))
        // 月涨幅
        queryList.push(this.$http.get('stock/getStockPriceNowMonthNetChangeRatio', {
          code: webDataMap[key].code
        }).then((res) => {
          this.nowMonthRate[key] = (res.data && res.data.netChangeRatio) || 0
        }))
      }
      Promise.all(queryList).then(() => {
        Indicator.close()
      })
      // 每月收益数据
      this.$http.get('userFund/getUserNetValueMonthKline', {
        start: moment().subtract(24, 'months').format('YYYY-MM')
      }).then((data) => {
        if (data.success) {
          this.netValueMonthRate = data.data.list
        }
      })
      this.$http.get('user/getUserIncome', {
        start: moment().format('YYYY-MM'),
        end: moment().add(1, 'months').format('YYYY-MM')
      }).then((data) => {
        if (data.success) {
          this.monthIncome = data.data
        }
      })
      this.$http.get('user/getUserIncome', {
        start: moment().format('YYYY'),
        end: moment().add(1, 'years').format('YYYY')
      }).then((data) => {
        if (data.success) {
          this.yearIncome = data.data
        }
      })
    },
    toPath (path) {
      this.$router.push(path)
    },
    backHandler () {
      this.$router.history.go(-1)
    },
    addHandler () {
      this.$router.push({path: '/page/myNetValueRecord'})
    },
    formatWebDataList (list) {
      let newList = []
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        newList.push({
          net_value_date: moment(item.date).format('YYYY-MM-DD'),
          ...item.kline,
          net_value: item.kline.close
        })
      }
      return newList.reverse()
    },
    copy (list) {
      let temp = []
      for (let i = 0; i < list.length; i++) {
        temp[i] = list[i]
      }
      return temp
    }
  }
}
</script>
