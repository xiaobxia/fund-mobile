<template>
  <div class="index-detail">
    <mt-header :title="queryData.name" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div class="theme-wrap">
        <span class="name">{{niuXiong}}</span>
        <mt-button type="primary" @click="niuXiongChangeHandler">改变</mt-button>
      </div>
      <mt-field label="指数仓位" placeholder="请输入" v-model="position"></mt-field>
      <mt-button type="primary" @click="positionOkHandler" class="main-btn">完成</mt-button>
      <div class="content-body">
        <ve-line :mark-point="chartPoint" :yAxis="chartYAxis" :textStyle="chartTextStyle"
                 :height="chartHeight" :data="chartDataNetValue" :theme="lineTheme"
                 :settings="chartSettings" :tooltip="chartTooltip" :grid="grid" :dataZoom="dataZoom"></ve-line>
      </div>
      <div class="index-rate">
        <span :class="numberClass(indexChangeRatio)">{{indexChangeRatio}}%</span>
      </div>
      <div class="fund-list simple">
        <mt-cell-swipe v-for="(item) in list" :key="item.code" :to="'/page/fundDetail?code='+item.code" :class="item.has?'has-back':''">
          <div slot="title">
            <h3 :class="{lowRate: item.low_rate}">
              {{item.code}} {{formatFundName(item.name)}}
              <i class="lock-tag" v-if="item.ifAllLock"></i>
              <i class="dingtou-tag" v-if="ifFixedInvestment(item)"></i>
              <span style="float: right" :class="numberClass(item.change_ratio)">{{item.change_ratio}}%</span>
            </h3>
            <p class="buysell"><span>买入: {{item.buy_rate_one}}</span><span>卖出: {{item.sell_rate_two}}</span><span>成本: {{keepTwoDecimals(item.buy_rate_one + item.sell_rate_two)}}</span></p>
          </div>
        </mt-cell-swipe>
      </div>
    </div>
    <mt-popup
      v-model="popupVisible"
      position="bottom">
      <ul class="theme-list">
        <li class="theme-item" v-for="(item) in filterList" :key="item" @click="onNiuXiongChangeHandler(item)">{{item || '正常'}}</li>
      </ul>
    </mt-popup>
  </div>
</template>

<script>
import indexInfoUtilXiong from '@/util/indexInfoUtilXiong.js'
import indexInfoUtilJian from '@/util/indexInfoUtilJian.js'
import stockDataUtil from '@/util/stockDataUtil.js'
import storageUtil from '@/util/storageUtil.js'
import Toast from '@/common/toast.js'
import fundAccountUtil from '@/util/fundAccountUtil.js'

const codeMap = indexInfoUtilXiong.codeMap
const formatData = indexInfoUtilXiong.formatData

let InfoUtil = indexInfoUtilXiong.Util
let fnMap = indexInfoUtilXiong.fnMap

const zoom = window.adaptive.zoom
const baseFontSize = 22
export default {
  name: 'IndexDetail',
  data () {
    return {
      popupVisible: false,
      filterList: ['正常', '牛', '熊'],
      niuXiong: '',
      grid: {
        top: '15%',
        left: '-8%',
        bottom: '0%'
      },
      dataZoom: [{
        type: 'inside',
        start: 80,
        end: 100
      }],
      chartTooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            width: 2 * zoom
          },
          label: {
            fontSize: baseFontSize * zoom
          }
        },
        textStyle: {
          fontSize: baseFontSize * zoom
        }
      },
      chartHeight: (650 / 20) + 'rem',
      chartTextStyle: {
        fontSize: baseFontSize * zoom
      },
      chartYAxis: {
        axisLabel: {
          fontSize: baseFontSize * zoom
        },
        scale: [true, true],
        splitLine: {
          lineStyle: {
            type: 'dotted'
          }
        }
      },
      chartSettings: {
        lineStyle: {
          width: 3 * zoom
        }
      },
      lineTheme: {
        line: {
          smooth: false
        }
      },
      queryData: {},
      netValue: [],
      buyList: [],
      sellList: [],
      sameList: [],
      list: [],
      indexChangeRatio: 0,
      pointType: '',
      type: 'xiong',
      position: 100
    }
  },

  computed: {
    chartPoint () {
      let dataList = []
      this.buyList.forEach((item) => {
        dataList.push({
          coord: [item['date'], item['close']],
          itemStyle: {
            normal: {
              color: 'rgb(244, 51, 60)'
            }
          },
          label: {
            show: false
          }
        })
      })
      this.sellList.forEach((item) => {
        dataList.push({
          coord: [item['date'], item['close']],
          itemStyle: {
            normal: {
              color: 'rgb(62, 179, 121)'
            }
          },
          label: {
            show: false
          }
        })
      })
      this.sameList.forEach((item) => {
        dataList.push({
          coord: [item['date'], item['close']],
          itemStyle: {
            normal: {
              color: this.pointType === 'buy' ? 'purple' : 'blue'
            }
          },
          label: {
            show: false
          }
        })
      })
      return {
        data: dataList,
        symbol: 'circle',
        symbolSize: 10 * zoom
      }
    },
    chartDataNetValue () {
      if (!(this.netValue.length > 1)) {
        return {}
      }
      let netValue = this.netValue
      let row = []
      netValue.forEach(function (item, index) {
        let data = {}
        data['日期'] = item['date']
        data['净值'] = item['close']
        row.unshift(data)
      })
      return {
        columns: ['日期', '净值'],
        rows: row
      }
    }
  },
  mounted () {
    const query = this.$router.history.current.query
    this.type = query.type
    if (query.type === 'jian') {
      InfoUtil = indexInfoUtilJian.Util
      fnMap = indexInfoUtilJian.fnMap
    } else {
      InfoUtil = indexInfoUtilXiong.Util
      fnMap = indexInfoUtilXiong.fnMap
    }
    this.initPage()
  },

  methods: {
    niuXiongChangeHandler () {
      this.popupVisible = true
    },
    onNiuXiongChangeHandler (text) {
      const query = this.$router.history.current.query
      this.$http.post('market/updateIndexNiuXiong', {
        key: query.key,
        value: text
      }).then((data) => {
        if (data.success) {
          Toast.success('操作成功')
        } else {
          Toast.error('操作失败')
        }
      })
      this.popupVisible = false
    },
    initPage () {
      const query = this.$router.history.current.query
      this.queryData = Object.assign({}, query)
      this.niuXiong = storageUtil.getIndexNiuXiong(query.key)
      this.position = storageUtil.getIndexPosition(query.key)
      this.$http.get(`webData/${stockDataUtil.getAllUrl()}`, {
        code: query.code,
        days: 200
      }).then((data) => {
        if (data.success) {
          const list = data.data.list
          const info = formatData(list)
          const infoUtil = new InfoUtil({
            threshold: parseFloat(query.threshold),
            rate: parseFloat(query.rate),
            wave: parseFloat(query.wave)
          })
          const infoList = info.list
          this.indexChangeRatio = this.keepTwoDecimals(infoList[0].netChangeRatio) || 0
          const recentNetValue = infoList
          this.netValue = infoList
          // 近的在前
          let hasOne = false
          let sameType = ''
          let pointType = ''
          let buyList = []
          let sellList = []
          let sameList = []
          console.log(infoUtil.getFlag(recentNetValue[0]))
          for (let i = 0; i < (recentNetValue.length - 3); i++) {
            const nowRecord = recentNetValue[i]
            const oneDayRecord = recentNetValue[i + 1]
            const twoDayRecord = recentNetValue[i + 2]
            let buyFlag = infoUtil[fnMap[query.key + 'Buy']](nowRecord, oneDayRecord, twoDayRecord)
            let sellFlag = infoUtil[fnMap[query.key + 'Sell']](nowRecord, oneDayRecord, twoDayRecord)
            if ((buyFlag === true) || (buyFlag !== false && buyFlag.flag === true)) {
              if (!hasOne) {
                hasOne = true
                pointType = 'buy'
                if (buyFlag !== true && buyFlag !== false) {
                  sameType = buyFlag.text
                  sameList.push(nowRecord)
                } else {
                  buyList.push(nowRecord)
                }
              } else {
                if (buyFlag !== true && buyFlag !== false && buyFlag.text === sameType) {
                  sameList.push(nowRecord)
                } else {
                  buyList.push(nowRecord)
                }
              }
            } else if ((sellFlag === true) || (sellFlag !== false && sellFlag.flag === true)) {
              if (!hasOne) {
                hasOne = true
                pointType = 'sell'
                if (sellFlag !== true && sellFlag !== false) {
                  sameType = sellFlag.text
                  sameList.push(nowRecord)
                } else {
                  sellList.push(nowRecord)
                }
              } else {
                if (sellFlag !== true && sellFlag !== false && sellFlag.text === sameType) {
                  sameList.push(nowRecord)
                } else {
                  sellList.push(nowRecord)
                }
              }
            }
          }
          this.pointType = pointType
          this.sellList = sellList
          this.buyList = buyList
          this.sameList = sameList
        }
      })
      this.queryRecord()
    },
    queryRecord () {
      const query = this.$router.history.current.query
      this.$http.get('userFund/getFundsByThemeWithUserFund', {theme: query.name}).then((res) => {
        let funds = res.data.list
        funds.sort((a, b) => {
          return (a.buy_rate_one + a.sell_rate_two) - (b.buy_rate_one + b.sell_rate_two)
        })
        this.list = funds
      })
    },
    ifFixedInvestment (item) {
      return fundAccountUtil.ifFixedInvestment(item)
    },
    backHandler () {
      this.$router.history.go(-1)
    },
    positionOkHandler () {
      const query = this.$router.history.current.query
      this.$http.post('market/updateIndexPosition', {
        key: query.key,
        value: this.position
      }).then((data) => {
        if (data.success) {
          Toast.success('操作成功')
        } else {
          Toast.error('操作失败')
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .content-body {
    padding: 30px;
  }
</style>
