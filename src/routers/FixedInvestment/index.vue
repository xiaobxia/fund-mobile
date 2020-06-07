<template>
  <div class="operating-info">
    <mt-header title="定投" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-cell-swipe v-for="(item) in list" :key="item.code" :class="[hasInfo[item.name] ? 'has':'no-has', 'line-type']">
        <div slot="title">
          <h3>
            <span class="index-name">{{item.name}}</span>
            <span style="float: right" :class="stockNumberClass(rateInfo[item.key])">{{rateInfo[item.key]}}%</span>
          </h3>
          <p class="netChange wn">
            <span v-for="(subItem, index) in klineMap[item.key]" :key="index"
                  :class="numberBgClass(subItem.netChangeRatio)">{{subItem.netChangeRatio}}%</span>
          </p>
          <p class="explain">
            <span v-for="(subItem, index) in allInfo[item.key]" :key="subItem + index"
                  :class="getClass(subItem)">{{subItem}}</span>
          </p>
          <div class="other-text">
             <span class="item">
              <span class="label">持有金额：</span>
              <span class="value">{{hasCount[item.name]}}</span>
            </span>
            <span class="item">
              <span class="label">年线偏离：</span>
              <span class="value">
                <span :class="stockNumberClass(averageDiff[item.key])">{{averageDiff[item.key]}}</span>
              </span>
            </span>
            <span class="item">
              <span class="label">买入金额：</span>
              <span class="value red-text">{{canBuy[item.key]}}</span>
            </span>
            <span class="item">
              <span class="label">卖出金额：</span>
              <span class="value green-text">{{canSell[item.key]}}</span>
            </span>
          </div>
        </div>
      </mt-cell-swipe>
      <mt-button type="primary" @click="okHandler" class="main-btn">发送</mt-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import storageUtil from '@/util/storageUtil.js'
import fixedInvestment from '@/util/platformFixedInvestment.js'
import stockApiUtil from '@/util/stockApiUtil.js'
import stockAnalysisUtil from '@/util/stockAnalysisUtil.js'
import { mapGetters } from 'vuex'

const codeMap = fixedInvestment.codeMap
const InfoUtil = fixedInvestment.Util
const fnMap = fixedInvestment.fnMap
const formatData = fixedInvestment.formatData

// 适用于宽基
// 和年线分析有关
function getBuyRate (rate, a, b, c) {
  // c是0轴线
  // a是高估线只能0.25得买
  // b是低估线
  rate = rate - c
  a = a - c
  if (rate >= 0) {
    if (rate <= a) {
      return 1 - ((rate / a) * 0.75)
    } else {
      return 0.25
    }
  }
  // 年线下
  if (rate < 0) {
    if (rate >= b) {
      return 1 + (rate / b)
    } else {
      return 2
    }
  }
  return 1
}

// 适用于优质行业
// 和年线分析有关
function getBuyRateH (rate, a, b, c) {
  // c是0轴线
  // a是高估线只能0.25得买
  // b是低估线
  rate = rate - c
  a = a - c
  if (rate >= 0) {
    if (rate <= a) {
      return 2 - ((rate / a) * 1.6)
    } else {
      return 0.4
    }
  }
  // 年线下
  if (rate < 0) {
    if (rate >= b) {
      return 2 + 2 * (rate / b)
    } else {
      return 4
    }
  }
  return 2
}

// 为以后做准备，偏离度60以上的时候
function getSellRate (rate) {
  // 年线下
  return 0
}

function getNetChangeRatioList (list, index) {
  const newList = []
  for (let i = 0; i < 10; i++) {
    newList.push(list[index + i].netChangeRatio)
  }
  return newList
}

export default {
  name: 'FixedInvestment',
  data () {
    let allInfo = {}
    let list = []
    let rateInfo = {}
    let hasInfo = {}
    let hasCount = {}
    let canBuy = {}
    let canSell = {}
    let averageDiff = {}
    let klineMap = {}
    for (let key in codeMap) {
      list.push({
        key: key,
        code: codeMap[key].code,
        name: codeMap[key].name,
        mix: codeMap[key].mix,
        threshold: codeMap[key].threshold,
        wave: codeMap[key].wave,
        rate: codeMap[key].rate
      })
      allInfo[key] = []
      rateInfo[key] = 0
      hasInfo[codeMap[key].name] = false
      hasCount[codeMap[key].name] = 0
      canBuy[key] = 0
      canSell[key] = 0
      averageDiff[key] = 0
      klineMap[key] = [{}]
    }
    return {
      list: list,
      allInfo: allInfo,
      rateInfo: rateInfo,
      hasInfo,
      hasCount,
      canBuy,
      canSell,
      averageDiff,
      averageMap: {
        'sh000852': 5169.89,
        'sh000905': 4855.45,
        'sh000300': 3447.624,
        'sh000016': 2569.2,
        'sz399006': 1462.85,
        'sz399997': 5400,
        'sz399989': 7464,
        'sz399441': 2537,
        'sz399396': 17800
      },
      // 配比根据估值，还有行业中和判断
      indexParams: {
        // 中证1000
        // 这东西很危险压根就不能定投，但是现在属于出清了一次，所以又拿出来投
        // 出清线是年线-25
        'sh000852': {
          buy: 0.7,
          sell: 1.3,
          a: 20,
          b: -20,
          c: -8.5
        },
        // 沪深500
        // 这东西很危险压根就不能定投，但是现在属于出清了一次，所以又拿出来投
        // 出清线是年线-20
        'sh000905': {
          buy: 1.3,
          sell: 0.7,
          a: 20,
          b: -20,
          c: -10
        },
        // 沪深300
        'sh000300': {
          buy: 1.15,
          sell: 0.85,
          a: 15,
          b: -15,
          c: -5.5
        },
        // 上证50
        'sh000016': {
          buy: 1.3,
          sell: 0.7,
          a: 20,
          b: -10,
          c: -3
        },
        // 创业板
        // 这东西很危险压根就不能定投，但是现在属于出清了一次，所以又拿出来投
        // 出清线是年线-20
        'sz399006': {
          buy: 0.85,
          sell: 1.15,
          a: 25,
          b: -20,
          c: -8.5
        },
        // 白酒
        'sz399997': {
          buy: 1.3,
          sell: 1,
          a: 40,
          b: -20,
          c: -8
        },
        // 食品
        'sz399396': {
          buy: 1.3,
          sell: 1,
          a: 30,
          b: -20,
          c: -5
        },
        // 医疗
        'sz399989': {
          buy: 1.3,
          sell: 1,
          a: 20,
          b: -18,
          c: -9
        },
        // 生物
        'sz399441': {
          buy: 1.3,
          sell: 1,
          a: 20,
          b: -18,
          c: -9
        }
      },
      klineMap
    }
  },
  computed: {
    ...mapGetters([
      'stockIndexAll',
      'userFundAccountInfo'
    ])
  },
  created () {
    this.initPage()
  },
  methods: {
    getClass (subItem) {
      if (subItem.indexOf('买少') !== -1) {
        return 'active-2 has-text'
      }
      if (subItem.indexOf('买') !== -1) {
        return 'buy'
      }
      if (subItem.indexOf('跌多') !== -1) {
        return 'buy'
      }
      if (subItem.indexOf('跌少') !== -1) {
        return 'active-2 has-text'
      }
      if (subItem.indexOf('快跌') !== -1) {
        return 'buy'
      }
      if (subItem.indexOf('慢跌') !== -1) {
        return 'active-2 has-text'
      }
      if (subItem.indexOf('卖') !== -1) {
        return 'sell'
      }
    },
    initPage () {
      this.stockIndexAll.forEach((item) => {
        this.averageMap[item.code] = item.year_average
      })
      let list = this.list
      for (let i = 0; i < list.length; i++) {
        this.queryData(list[i])
      }
      this.$http.get('userFund/getUserFunds').then((data) => {
        if (data.success) {
          const list = data.data.list
          for (let i = 0; i < list.length; i++) {
            const item = list[i]
            if (item.theme) {
              // 只计入定投
              if (item.strategy === '2') {
                this.hasInfo[item.theme] = true
                if (this.hasCount[item.theme]) {
                  this.hasCount[item.theme] += parseInt(item.sum)
                } else {
                  this.hasCount[item.theme] = parseInt(item.sum)
                }
              }
            }
          }
        }
      })
    },
    queryData (item) {
      this.$http.get(`stock/${stockApiUtil.getAllUrl()}`, {
        code: item.code,
        days: 16
      }, {interval: 30}).then((data) => {
        if (data.success) {
          const list = data.data.list
          const info = formatData(list)
          const infoUtil = new InfoUtil(item)
          const recentNetValue = info.list
          let infoList = []
          const nowClose = recentNetValue[0]['close']
          let kline = []
          // 近的在前
          for (let i = 0; i < 5; i++) {
            // 截取10个
            const netChangeRatioList = getNetChangeRatioList(recentNetValue, i)
            const nowRecord = recentNetValue[i]
            const oneDayRecord = recentNetValue[i + 1]
            const twoDayRecord = recentNetValue[i + 2]
            let buyFlag = infoUtil[fnMap[item.key + 'Buy']](nowRecord, oneDayRecord, twoDayRecord)
            let sellFlag = infoUtil[fnMap[item.key + 'Sell']](nowRecord, oneDayRecord, twoDayRecord)
            // 根据信号判断
            kline.push(recentNetValue[i])
            if (buyFlag.flag === true) {
              infoList[i] = '买'
            } else if (sellFlag.flag === true && sellFlag.text !== 'xiong') {
              infoList[i] = '卖'
            } else if (sellFlag.flag === true && sellFlag.text === 'xiong') {
              infoList[i] = '卖少'
            } else {
              infoList[i] = ''
            }
            // 不是卖，也没有让买的时候
            if (infoList[i] === '') {
              let threeDay = stockAnalysisUtil.countDown(netChangeRatioList, 3, 3)
              let fourDay = stockAnalysisUtil.countDown(netChangeRatioList, 4, 4)
              let fiveDay = stockAnalysisUtil.countDown(netChangeRatioList, 5, 5)
              // 先判断是不是买少的
              if (fourDay.flag) {
                infoList[i] = '跌少'
              }
              if (threeDay.flag && threeDay.rate < -(3 * item.rate)) {
                infoList[i] = '跌少'
              }
              if (stockAnalysisUtil.countDown(netChangeRatioList, 6, 5).flag) {
                infoList[i] = '跌少'
              }
              // 判断是不是买大的，如果是那就可以覆盖他
              if (threeDay.flag && threeDay.rate < -(4 * item.rate)) {
                infoList[i] = '跌多'
              }
              if (fourDay.flag && fourDay.rate < -(5 * item.rate)) {
                infoList[i] = '跌多'
              }
              if (fiveDay.flag) {
                infoList[i] = '跌多'
              }
              if (stockAnalysisUtil.countDown(netChangeRatioList, 7, 6).flag) {
                infoList[i] = '跌多'
              }
              if (stockAnalysisUtil.countDown(netChangeRatioList, 8, 7).flag) {
                infoList[i] = '跌多'
              }
              if (stockAnalysisUtil.countDown(netChangeRatioList, 8, 6).flag) {
                infoList[i] = '跌多'
              }
              if (stockAnalysisUtil.countDown(netChangeRatioList, 9, 7).flag) {
                infoList[i] = '跌多'
              }
            }
          }
          const diff = this.countDifferenceRate(nowClose, this.averageMap[item.code])
          this.klineMap[item.key] = kline
          this.averageDiff[item.key] = diff
          // 一月一万
          const buyS = (12 * 10000) / 162.5
          const params = this.indexParams[item.code]
          let buyNumber = 0
          if (['baijiu', 'yiliao', 'shengwu', 'shipin'].indexOf(item.key) !== -1) {
            buyNumber = parseInt(getBuyRateH(diff, params.a, params.b, params.c) * buyS / 10) * 10
          } else {
            buyNumber = parseInt(getBuyRate(diff, params.a, params.b, params.c) * buyS / 10) * 10
          }
          this.canBuy[item.key] = buyNumber
          this.canSell[item.key] = parseInt(getSellRate(diff) * buyS / 10) * 10
          this.allInfo[item.key] = infoList
          let buyBaseInfo = 0
          if (['买', '跌少', '跌多'].indexOf(infoList[0]) !== -1) {
            buyBaseInfo = parseInt(buyNumber / 10)
          }
          storageUtil.setData('fixBuyData', item.key, buyBaseInfo)
          this.rateInfo[item.key] = this.keepTwoDecimals(recentNetValue[0].netChangeRatio)
        }
      })
    },
    backHandler () {
      this.$router.history.go(-1)
    },
    okHandler () {
      const fixBuyData = storageUtil.getData('fixBuyData')
      const list = []
      for (let key in fixBuyData) {
        list.push({
          key,
          buy: fixBuyData[key]
        })
      }
      // 开盘的才更新
      if (this.userFundAccountInfo.marketOpen) {
        const date = moment().format('YYYY-MM-DD')
        this.$http.post('http://47.92.210.171:3051/fbsServer/signal/updateSignal', {
          trade_date: date,
          fix_record: JSON.stringify(list)
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
