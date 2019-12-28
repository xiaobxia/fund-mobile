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
      <div class="">
        <ve-line :yAxis="chartYAxis" :textStyle="chartTextStyle"
                 :height="chartHeight" :legend="chartLegend"
                 :data="chartData" :settings="chartSettings"
                 :tooltip="tooltip" :grid="grid"
                 :theme="lineTheme"
        ></ve-line>
        <div class="my-net-value-info">
          <span>本月：{{myIncomeRateInfo.nowMonth}}%</span>
          <span>总收益：{{myIncomeRateInfo.all}}%</span>
          <span>本年：{{myIncomeRateInfo.nowYear}}%</span>
        </div>
        <table width="100%" cellspacing="1" cellpadding="20">
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
        <ve-histogram :grid="monthRateGrid"
                      :yAxis="chartYAxis" :textStyle="chartTextStyle"
                      :height="chartHeight" :legend="chartLegend"
                      :settings="chartSettings" :tooltip="tooltip"
                      :series="monthRateChartSeries" :xAxis="chartXAxis"
        ></ve-histogram>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import indexListAll from '@/common/indexListAll.js'
import dateUtil from '@/util/dateUtil.js'
import arrayUtil from '@/util/arrayUtil.js'
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
    webDataListMap[item.key + 'DataList'] = []
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
        top: '18%',
        left: '8%',
        right: '2%'
      },
      monthRateGrid: {
        top: '10%'
      },
      tooltip: {
        trigger: 'axis',
        textStyle: {
          fontSize: baseFontSize * zoom
        }
      },
      chartHeight: (700 / 20) + 'rem',
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
      chartLegend: {
        itemGap: 20 * zoom,
        itemWidth: 50 * zoom,
        itemHeight: 30 * zoom,
        selected: {
          '我的组合': true,
          ...rateChartSelected
        }
      },
      chartSettings: {
        lineStyle: {
          width: 3.5 * zoom
        },
        offsetY: 350 * zoom
      },
      lineTheme: {
        line: {
          smooth: false
        }
      }
    }
    return {
      ...chartPart,
      popupVisible: false,
      myList: [],
      ...webDataListMap,
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
      netValueMonthRate: []
    }
  },

  computed: {
    ...mapGetters([
      'userFundAccountInfo'
    ]),
    chartData () {
      if (!(this.myList.length > 0)) {
        return {}
      }
      let myList = this.copy(this.myList)
      // 近一年数据
      let startIndex = dateUtil.findSameRangeStartNetValueIndex(myList, 'month')
      myList = myList.slice(startIndex)
      const baseMy = myList[0]['net_value']
      const baseDate = myList[0]['net_value_date']
      let webDataList = {}
      let webDataDay = 0
      for (let key in webDataListMap) {
        if (!(this[key].length > 0)) {
          return {}
        }
        let temp = this.copy(this[key])
        webDataList[key] = temp.slice(arrayUtil.findIndex(temp, 'net_value_date', baseDate))
        webDataDay = webDataList[key].length
      }
      let row = []
      myList.forEach((item, index) => {
        let data = {}
        data['日期'] = item['net_value_date']
        data['我的组合'] = this.keepTwoDecimals(((item['net_value'] - baseMy) / baseMy) * 100)
        for (let key in webDataMap) {
          const base = webDataList[key + 'DataList'][0].close
          data[webDataMap[key].name] = this.keepTwoDecimals(((webDataList[key + 'DataList'][index].close - base) / base) * 100)
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
          value: item['rate'],
          itemStyle: {
            color: item['rate'] > 0 ? 'rgb(244, 51, 60)' : 'rgb(62, 179, 121)'
          }
        })
      })
      return [{
        name: '收益率',
        type: 'bar',
        data: row
      }]
    },
    chartXAxis () {
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
      // 近一年的最大
      const days = 30
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
          this.myList = data.data.list.reverse()
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
            this[key + 'DataList'] = data.data.list
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
      this.$http.get('userFund/getUserNetValueMonthKline').then((data) => {
        if (data.success) {
          this.netValueMonthRate = data.data.list
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
