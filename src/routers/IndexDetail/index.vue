<template>
  <div class="index-detail">
    <mt-header :title="queryData.name" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div class="grey fm-warn">指数是否z45</div>
      <div class="filter-select-wrap">
        <span class="name">{{z45}}</span>
        <mt-button type="primary" @click="z45ChangeHandler">改变</mt-button>
      </div>
      <div class="grey fm-warn">指数是季度过热</div>
      <div class="filter-select-wrap">
        <span class="name">{{quarterHot}}</span>
        <mt-button type="primary" @click="quarterHotChangeHandler">改变</mt-button>
      </div>
      <div class="grey fm-warn">指数锁仓状态</div>
      <div class="filter-select-wrap">
        <span class="name">{{noSellStatus}}</span>
        <mt-button type="primary" @click="noSellStatusChangeHandler">改变</mt-button>
      </div>
      <div class="grey fm-warn">指数所处阶段</div>
      <div class="filter-select-wrap">
        <span class="name">{{status}}</span>
        <mt-button type="primary" @click="statusChangeHandler">改变</mt-button>
      </div>
      <div class="yellow fm-warn">设置禁买的条件:在高位,持续利空,大V不看好</div>
      <div class="filter-select-wrap">
        <span class="name">{{niuXiong}}</span>
        <mt-button type="primary" @click="niuXiongChangeHandler">改变</mt-button>
      </div>
      <div class="chart-wrap">
        <ve-line
          :mark-point="chartPoint"
          :yAxis="chartYAxis"
          :textStyle="chartTextStyle"
          :height="chartHeight"
          :data="chartDataNetValue"
          :theme="lineTheme"
          :settings="chartSettings"
          :tooltip="chartTooltip"
          :grid="grid">
        </ve-line>
      </div>
      <div class="index-rate">
        <span :class="stockNumberClass(indexChangeRatio)">{{indexChangeRatio}}%</span>
      </div>
      <div class="fund-list simple">
        <mt-cell-swipe v-for="(item) in list" :key="item.code" :to="'/page/fundDetail?code='+item.code" :class="item.has?'has-back':''">
          <div slot="title">
            <h3>
              {{item.code}} {{formatFundName(item.name)}}
              <i class="fm-icon lock" v-if="item.ifAllLock"></i>
              <i class="fm-icon dingtou" v-if="ifFixedInvestment(item)"></i>
              <span style="float: right" :class="stockNumberClass(item.change_ratio)">{{item.change_ratio}}%</span>
            </h3>
          </div>
        </mt-cell-swipe>
      </div>
    </div>
    <mt-popup
      v-model="popupVisible"
      position="bottom">
      <ul class="filter-select-list">
        <li class="filter-select-item" v-for="(item) in filterList" :key="item" @click="onNiuXiongChangeHandler(item)">{{item || '正常'}}</li>
      </ul>
    </mt-popup>
    <mt-popup
      v-model="popupSVisible"
      position="bottom">
      <ul class="filter-select-list">
        <li class="filter-select-item" v-for="(item) in filterSList" :key="item" @click="onStatusChangeHandler(item)">{{item || '正常'}}</li>
      </ul>
    </mt-popup>
    <mt-popup
      v-model="popupNVisible"
      position="bottom">
      <ul class="filter-select-list">
        <li class="filter-select-item" v-for="(item) in filterNList" :key="item" @click="onNoSellStatusChangeHandler(item)">{{item || '正常'}}</li>
      </ul>
    </mt-popup>
    <mt-popup
      v-model="popupQVisible"
      position="bottom">
      <ul class="filter-select-list">
        <li class="filter-select-item" v-for="(item) in filterQList" :key="item" @click="onQuarterHotChangeHandler(item)">{{item || '关闭'}}</li>
      </ul>
    </mt-popup>
    <mt-popup
      v-model="popupZVisible"
      position="bottom">
      <ul class="filter-select-list">
        <li class="filter-select-item" v-for="(item) in filterZList" :key="item" @click="onZ45ChangeHandler(item)">{{item || '关闭'}}</li>
      </ul>
    </mt-popup>
  </div>
</template>

<script>
import indexInfoUtilXiong from '@/util/indexInfoUtilXiong.js'
import indexInfoUtilJian from '@/util/indexInfoUtilJian.js'
import stockApiUtil from '@/util/stockApiUtil.js'
import storageUtil from '@/util/storageUtil.js'
import Toast from '@/common/toast.js'
import fundAccountUtil from '@/util/fundAccountUtil.js'

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
      popupSVisible: false,
      popupNVisible: false,
      popupCVisible: false,
      popupQVisible: false,
      popupZVisible: false,
      filterList: ['正常', '小反', '大反', '禁买'],
      filterSList: ['正常', '定投', '顶部', '探底'],
      filterNList: ['正常', '锁仓', '锁转交'],
      filterCList: ['关闭', '开启'],
      filterQList: ['关闭', '开启'],
      filterZList: ['关闭', '开启'],
      niuXiong: '',
      status: '',
      noSellStatus: '',
      quarterHot: '',
      z45: '',
      grid: {
        top: '10%',
        left: '0%',
        bottom: '0%',
        right: '0%'
      },
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
      chartHeight: (400 / 20) + 'rem',
      chartTextStyle: {
        fontSize: baseFontSize * zoom
      },
      chartYAxis: {
        axisLabel: {
          fontSize: baseFontSize * zoom
        },
        axisLine: {
          show: false
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
          width: 4 * zoom,
          color: 'rgba(18,150,219, 1)'
        }
      },
      lineTheme: {
        line: {
          smooth: false,
          showSymbol: false
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
      nowClose: 0
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
              color: 'rgb(246, 67, 70)'
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
              color: 'rgb(21, 187, 113)'
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
        symbolSize: 14 * zoom
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
  created () {
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
    statusChangeHandler () {
      this.popupSVisible = true
    },
    noSellStatusChangeHandler () {
      this.popupNVisible = true
    },
    z45ChangeHandler () {
      this.popupZVisible = true
    },
    quarterHotChangeHandler () {
      this.popupQVisible = true
    },
    onNiuXiongChangeHandler (text) {
      const query = this.$router.history.current.query
      this.$http.post('stock/updateStockIndex', {
        key: query.key,
        flag: text
      }).then((data) => {
        if (data.success) {
          Toast.success('操作成功')
        } else {
          Toast.error('操作失败')
        }
      })
      this.popupVisible = false
    },
    onStatusChangeHandler (text) {
      const query = this.$router.history.current.query
      this.$http.post('stock/updateStockIndex', {
        key: query.key,
        status: text
      }).then((data) => {
        if (data.success) {
          Toast.success('操作成功')
        } else {
          Toast.error('操作失败')
        }
      })
      this.popupSVisible = false
    },
    onNoSellStatusChangeHandler (text) {
      const query = this.$router.history.current.query
      this.$http.post('stock/updateStockIndex', {
        key: query.key,
        no_sell_status: text
      }).then((data) => {
        if (data.success) {
          Toast.success('操作成功')
        } else {
          Toast.error('操作失败')
        }
      })
      this.popupNVisible = false
    },
    onQuarterHotChangeHandler (text) {
      const query = this.$router.history.current.query
      this.$http.post('stock/updateStockIndex', {
        key: query.key,
        danger: text
      }).then((data) => {
        if (data.success) {
          Toast.success('操作成功')
        } else {
          Toast.error('操作失败')
        }
      })
      this.popupQVisible = false
    },
    onZ45ChangeHandler (text) {
      const query = this.$router.history.current.query
      this.$http.post('stock/updateStockIndex', {
        key: query.key,
        z45: text
      }).then((data) => {
        if (data.success) {
          Toast.success('操作成功')
        } else {
          Toast.error('操作失败')
        }
      })
      this.popupZVisible = false
    },
    initPage () {
      const query = this.$router.history.current.query
      this.queryData = Object.assign({}, query)
      this.niuXiong = storageUtil.getData('stockIndexFlag', query.key)
      this.status = storageUtil.getData('stockIndexStatus', query.key) || '正常'
      this.quarterHot = storageUtil.getData('stockIndexQuarterHot', query.key) || '关闭'
      this.z45 = storageUtil.getData('stockIndexZ45', query.key) || '关闭'
      this.noSellStatus = storageUtil.getData('stockIndexNoSellStatus', query.key) || '正常'
      this.$http.get(`stock/${stockApiUtil.getAllUrl()}`, {
        code: query.code,
        days: 40
      }).then((data) => {
        if (data.success) {
          const list = data.data.list
          const info = formatData(list)
          const indexRate = parseFloat(query.rate)
          const infoUtil = new InfoUtil({
            threshold: parseFloat(query.threshold),
            rate: parseFloat(query.rate),
            wave: parseFloat(query.wave)
          })
          const infoList = info.list
          this.indexChangeRatio = this.keepTwoDecimals(infoList[0].netChangeRatio) || 0
          this.nowClose = this.keepTwoDecimals(infoList[0].close) || 0
          const recentNetValue = infoList
          this.netValue = infoList
          // 近的在前
          let hasOne = false
          let sameType = ''
          let pointType = ''
          let buyList = []
          let sellList = []
          let sameList = []
          for (let i = 0; i < (recentNetValue.length - 3); i++) {
            const nowRecord = recentNetValue[i]
            const oneDayRecord = recentNetValue[i + 1]
            const twoDayRecord = recentNetValue[i + 2]
            let buyFlag = infoUtil[fnMap[query.key + 'Buy']](nowRecord, oneDayRecord, twoDayRecord)
            let sellFlag = infoUtil[fnMap[query.key + 'Sell']](nowRecord, oneDayRecord, twoDayRecord)
            if ((buyFlag === true) || (buyFlag !== false && buyFlag.flag === true)) {
              if (nowRecord.netChangeRatio <= -(indexRate)) {
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
        this.list = res.data.list
      })
    },
    ifFixedInvestment (item) {
      return fundAccountUtil.ifFixedInvestment(item)
    },
    backHandler () {
      this.$router.history.go(-1)
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
