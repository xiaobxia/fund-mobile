<template>
  <div class="index-detail">
    <mt-header :title="queryData.name" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div class="b-tab" @click="dianwei = !dianwei">
        <span>点位指标</span>
      </div>
      <div v-if="dianwei" class="d-b">
        <mt-field label="目标位" placeholder="请输入" v-model="targetUpClose"></mt-field>
        <mt-field label="止盈位" placeholder="请输入" v-model="targetDownClose"></mt-field>
        <div>
          <mt-button type="primary" @click="updateStockIndexTargetClose" class="main-btn">完成</mt-button>
        </div>
      </div>
      <div class="grey fm-warn">指数是否z45</div>
      <div class="filter-select-wrap">
        <span class="name">{{z45}}</span>
        <mt-button type="primary" @click="z45ChangeHandler">改变</mt-button>
      </div>
      <div class="grey fm-warn">指数近期状态</div>
      <div class="filter-select-wrap">
        <span class="name">{{recentStatus}}</span>
        <mt-button type="primary" @click="recentStatusChangeHandler">改变</mt-button>
      </div>
      <div class="grey fm-warn">指数单日底</div>
      <div class="filter-select-wrap">
        <span class="name">{{oneDeep}}</span>
        <mt-button type="primary" @click="oneDeepChangeHandler">改变</mt-button>
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
          :mark-line="chartLine"
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
      <div class="detail-info-wrap">
        <div class="item">
          <span class="label">幅度：</span>
          <span class="value">
              <span :class="stockNumberClass(indexChangeRatio)">{{indexChangeRatio}}%</span>
          </span>
        </div>
        <div class="item">
          <span class="label">定卖：</span>
          <span class="value">{{$route.query.fsr}}</span>
        </div>
      </div>
      <div class="detail-info-wrap">
        <div class="item">
          <span class="label">定投金额：</span>
          <span class="value">{{fixSum}}</span>
        </div>
        <div class="item">
          <span class="label">波段金额：</span>
          <span class="value">{{bondSum}}</span>
        </div>
      </div>
      <div class="detail-info-wrap">
        <div class="item">
          <span class="label">比例：</span>
          <span class="value">1/18</span>
        </div>
        <div class="item">
          <span class="label">金额：</span>
          <span class="value">{{parseInt(fixSum / 18)}}</span>
        </div>
        <div class="item">
          <span class="label">比例：</span>
          <span class="value">1/15</span>
        </div>
        <div class="item">
          <span class="label">金额：</span>
          <span class="value">{{parseInt(fixSum / 15)}}</span>
        </div>
        <div class="item">
          <span class="label">比例：</span>
          <span class="value">1/12</span>
        </div>
        <div class="item">
          <span class="label">金额：</span>
          <span class="value">{{parseInt(fixSum / 12)}}</span>
        </div>
        <div class="item">
          <span class="label">比例：</span>
          <span class="value">1/10</span>
        </div>
        <div class="item">
          <span class="label">金额：</span>
          <span class="value">{{parseInt(fixSum / 10)}}</span>
        </div>
        <div class="item">
          <span class="label">比例：</span>
          <span class="value">1/8</span>
        </div>
        <div class="item">
          <span class="label">金额：</span>
          <span class="value">{{parseInt(fixSum / 8)}}</span>
        </div>
        <div class="item">
          <span class="label">比例：</span>
          <span class="value">1/6</span>
        </div>
        <div class="item">
          <span class="label">金额：</span>
          <span class="value">{{parseInt(fixSum / 6)}}</span>
        </div>
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
            <div>
              <div class="d-t-i">
                <span>持有金额：</span>
                <span>{{item.sum}}</span>
              </div>
              <div class="d-t-i">
                <span>可卖金额：</span>
                <span>{{item.canSellSum}}</span>
              </div>
            </div>
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
    <mt-popup
      v-model="popupRecentStatusVisible"
      position="bottom">
      <ul class="filter-select-list">
        <li class="filter-select-item" v-for="(item) in filterRecentStatusList" :key="item" @click="onRecentStatusChangeHandler(item)">{{item || '正常'}}</li>
      </ul>
    </mt-popup>
    <mt-popup
      v-model="popupOneDeepVisible"
      position="bottom">
      <ul class="filter-select-list">
        <li class="filter-select-item" v-for="(item) in filterOneDeepList" :key="item" @click="onOneDeepChangeHandler(item)">{{item || '否'}}</li>
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
      popupRecentStatusVisible: false,
      popupOneDeepVisible: false,
      filterList: ['正常', '小反', '大反', '禁买'],
      filterSList: ['正常', '定投', '顶部', '探底'],
      filterNList: ['正常', '锁仓', '锁转交'],
      filterCList: ['关闭', '开启'],
      filterQList: ['关闭', '开启'],
      filterZList: ['关闭', '开启'],
      filterRecentStatusList: ['正常', '见底'],
      filterOneDeepList: ['是', '否'],
      niuXiong: '',
      status: '',
      noSellStatus: '',
      quarterHot: '',
      z45: '',
      recentStatus: '',
      oneDeep: '',
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
      nowClose: 0,
      dianwei: false,
      targetUpClose: 0,
      targetDownClose: 0,
      fixSum: 0,
      bondSum: 0
    }
  },

  computed: {
    chartLine () {
      let dataList = []
      if (this.targetDownClose) {
        dataList.push({
          yAxis: this.targetDownClose,
          lineStyle: {
            color: 'green',
            width: 3 * zoom
          }
        })
      }
      if (this.targetUpClose) {
        dataList.push({
          yAxis: this.targetUpClose,
          lineStyle: {
            color: 'red',
            width: 3 * zoom
          }
        })
      }
      return {
        silent: true,
        data: dataList
      }
    },
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
    recentStatusChangeHandler () {
      this.popupRecentStatusVisible = true
    },
    oneDeepChangeHandler () {
      this.popupOneDeepVisible = true
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
    onRecentStatusChangeHandler (text) {
      const query = this.$router.history.current.query
      this.$http.post('stock/updateStockIndex', {
        key: query.key,
        recent_status: text
      }).then((data) => {
        if (data.success) {
          Toast.success('操作成功')
        } else {
          Toast.error('操作失败')
        }
      })
      this.popupRecentStatusVisible = false
    },
    onOneDeepChangeHandler (text) {
      const query = this.$router.history.current.query
      this.$http.post('stock/updateStockIndex', {
        key: query.key,
        one_deep: text
      }).then((data) => {
        if (data.success) {
          Toast.success('操作成功')
        } else {
          Toast.error('操作失败')
        }
      })
      this.popupOneDeepVisible = false
    },
    initPage () {
      const query = this.$router.history.current.query
      this.queryData = Object.assign({}, query)
      this.niuXiong = storageUtil.getData('stockIndexFlag', query.key)
      this.status = storageUtil.getData('stockIndexStatus', query.key) || '正常'
      this.recentStatus = storageUtil.getData('stockIndexRecentStatus', query.key) || '正常'
      this.oneDeep = storageUtil.getData('stockIndexOneDeep', query.key) || '否'
      this.quarterHot = storageUtil.getData('stockIndexQuarterHot', query.key) || '关闭'
      this.z45 = storageUtil.getData('stockIndexZ45', query.key) || '关闭'
      this.noSellStatus = storageUtil.getData('stockIndexNoSellStatus', query.key) || '正常'
      this.targetUpClose = storageUtil.getData('stockIndexTargetUpClose', query.key) || 0
      this.targetDownClose = storageUtil.getData('stockIndexTargetDownClose', query.key) || 0
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
        const list = res.data.list
        list.sort((a, b) => {
          if (a.strategy > b.strategy) {
            return 1
          }
          if (a.strategy < b.strategy) {
            return -1
          }
          if (a.strategy === b.strategy) {
            if (a.change_ratio > b.change_ratio) {
              return 1
            } else {
              return -1
            }
          }
        })
        let fixSum = 0
        let bondSum = 0
        list.forEach((v) => {
          if (v.strategy === '1') {
            bondSum += v.sum
          } else {
            fixSum += v.sum
          }
        })
        this.bondSum = this.keepTwoDecimals(bondSum)
        this.fixSum = this.keepTwoDecimals(fixSum)
        this.list = list
      })
    },
    ifFixedInvestment (item) {
      return fundAccountUtil.ifFixedInvestment(item)
    },
    backHandler () {
      this.$router.history.go(-1)
    },
    updateStockIndexTargetClose () {
      const query = this.$router.history.current.query
      this.$http.post('stock/updateStockIndex', {
        key: query.key,
        target_down_close: this.targetDownClose || 0,
        target_up_close: this.targetUpClose || 0
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
<style rel="stylesheet/scss" lang="scss" scoped>
  .content-body {
    padding: 30px;
  }
  .b-tab {
    background-color: rgba(244, 148, 110, 0.1);
    padding: 20px 20px;
  }
  .d-b {
    padding: 20px;
  }
  .d-t-i {
    margin-top: 10px;
    display: inline-block;
    width: 48%;
  }
</style>
