<template>
  <div class="operating-info">
    <mt-header title="定投" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div class="warn-wrap">
        <div class="fm-warn yellow">在大级别底部，多买混合</div>
      </div>
      <div v-if="kuanBuy >= 4">
        <span>买入：{{$formatMoney(otherBuyCount(canBuy))}}</span>
        <div
          v-for="(item, index) in hhList"
          :key="index"
        >
          {{item}}
        </div>
      </div>
      <!--<div class="fm-warn blue">不要自作聪明，这里提示卖了才卖</div>-->
      <mt-cell-swipe
        v-for="(item) in list"
        :key="item.code"
        :class="{
          'has': hasInfo[item.name],
          'no-has': !hasInfo[item.name],
          'line-type': true,
          'sell': (item.key === 'baijiu' && baijiuwarn) && rateInfo[item.key] > 0
        }"
      >
        <div slot="title">
          <h3>
            <span class="index-name">{{item.name}}</span>
            <span v-if="item.key === 'baijiu' && baijiuwarn" class="fm-tag s-green">{{baijiuwarn}}</span>
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
              <span class="value">{{$formatMoney(hasCount[item.name])}}</span>
            </span>
            <span class="item">
              <span class="label">年线偏离：</span>
              <span class="value">
                <span :class="stockNumberClass(averageDiff[item.key])">{{averageDiff[item.key]}}</span>
              </span>
            </span>
            <span class="item">
              <span class="label">买入金额：</span>
              <span class="value red-text">{{$formatMoney(canBuy[item.key])}}</span>
            </span>
            <span class="item">
              <span class="label">卖出金额：</span>
              <span class="value green-text">{{$formatMoney(canSell[item.key])}}</span>
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
      return 1.5 - ((rate / a) * 1.14)
    } else {
      return 0.36
    }
  }
  // 年线下
  if (rate < 0) {
    if (rate >= b) {
      return 1.5 + 1.5 * (rate / b)
    } else {
      return 3
    }
  }
  return 1.5
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

const kuanji = ['chuangye', 'wulin', 'sanbai', 'wubai', 'yiqian']

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
        rate: codeMap[key].rate,
        ifBuy: false,
        buyNum: 0
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
      // 混合
      hhList: [
        '001508 富国新动力',
        '260108 景顺长城新兴成长混合',
        '110011 易方达中小盘混合',
        '213001 宝盈鸿利收益',
        '163406 兴全合润分级混合',
        '001714 工银瑞信文体',
        '001224 中邮新思路',
        '570001 诺德价值优势混合'
      ],
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
        'sz399396': 17800,
        // 黄金
        'sh518880': 2,
        'sz399363': 5000,
        'sh000993': 5000,
        'sz399811': 5000
      },
      // 配比根据估值，还有行业中和判断
      // a最高线，b最低线，c中轴线
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
          buy: 1.15,
          sell: 0.85,
          a: 20,
          b: -20,
          c: -10
        },
        // 沪深300
        'sh000300': {
          buy: 1,
          sell: 0.85,
          a: 15,
          b: -15,
          c: -5.5
        },
        // 上证50
        'sh000016': {
          buy: 1.15,
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
          buy: 1.15,
          sell: 1,
          a: 20,
          b: -18,
          c: -9
        },
        // 生物
        'sz399441': {
          buy: 1.15,
          sell: 1,
          a: 20,
          b: -18,
          c: -9
        },
        // 黄金
        'sh518880': {
          buy: 0.5,
          sell: 1.3,
          a: 15,
          b: -10,
          c: 0
        },
        // 这东西很危险压根就不能定投，但是现在属于出清了一次，所以又拿出来投
        // 出清线是年线-20
        // 计算机电子类
        'sz399363': {
          buy: 0.7,
          sell: 1.3,
          a: 25,
          b: -20,
          c: -8.5
        },
        'sh000993': {
          buy: 0.7,
          sell: 1.3,
          a: 25,
          b: -20,
          c: -8.5
        },
        'sz399811': {
          buy: 0.7,
          sell: 1.3,
          a: 25,
          b: -20,
          c: -8.5
        }
      },
      klineMap,
      baijiuwarn: '',
      kuanBuy: 0
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
      if (subItem.indexOf('禁') !== -1) {
        return 'active-2 has-text'
      }
    },
    isInQuarterHotToday (key) {
      const quarterIndex = storageUtil.getData('averageQuarterIndex', key) || 0
      const quarterHot = storageUtil.getData('stockIndexQuarterHot', key) === '开启'
      return quarterHot && quarterIndex > 0
    },
    // 计算混合
    countHH () {
      this.kuanBuy = 0
      this.list.forEach((item, index) => {
        if (item.ifBuy) {
          // 是宽基
          if (kuanji.indexOf(item.key) !== -1) {
            this.kuanBuy++
          } else if (['baijiu', 'shengwu', 'dianzi'].indexOf(item.key) !== -1) {
            this.kuanBuy++
          }
        }
      })
    },
    initPage () {
      this.stockIndexAll.forEach((item) => {
        this.averageMap[item.code] = item.year_average
      })
      let list = this.list
      const opList = []
      for (let i = 0; i < list.length; i++) {
        opList.push(this.queryData(list[i]))
      }
      Promise.all(opList).then(() => {
        this.countHH()
      })
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
    ifFengNiu () {
      // 是不是全面疯牛
      const question10 = storageUtil.getData('stockMarketQuestion', 'question_10')
      return question10 === '是'
    },
    // 月线
    averageMonthIndex (key) {
      return storageUtil.getData('averageMonth', key) || 0
    },
    localConsole (item, value) {
      if (item.key === 'huangjin') {
        console.log(value)
      }
    },
    queryData (item) {
      return this.$http.get(`stock/${stockApiUtil.getAllUrl()}`, {
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
            // let sellFlag = infoUtil[fnMap[item.key + 'Sell']](nowRecord, oneDayRecord, twoDayRecord)
            // 根据信号判断
            kline.push(recentNetValue[i])
            // if (buyFlag.flag === true) {
            //   infoList[i] = '买'
            // } else if (sellFlag.flag === true && sellFlag.text !== 'xiong') {
            //   infoList[i] = '卖'
            // } else if (sellFlag.flag === true && sellFlag.text === 'xiong') {
            //   infoList[i] = '卖少'
            // } else {
            //   infoList[i] = ''
            // }
            if (buyFlag.flag === true) {
              infoList[i] = '买'
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
              if (item.key === 'huangjin') {
                if (threeDay.flag) {
                  infoList[i] = '跌少'
                }
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
          let canFix = storageUtil.getData('stockIndexCanFix', item.key)
          if (canFix !== false && canFix !== true) {
            canFix = true
          }
          if (!canFix) {
            infoList[0] = '禁'
          }
          if (this.ifFengNiu()) {
            if (this.averageMonthIndex(item.key) < -4) {
              infoList[0] = '强卖止盈'
            }
          }
          // if (this.isInQuarterHotToday(item.key)) {
          //   infoList[0] = ''
          //   const netChangeRatioList = getNetChangeRatioList(recentNetValue, 0)
          //   let threeDay = stockAnalysisUtil.countUp(netChangeRatioList, 3, 3)
          //   if (threeDay.flag) {
          //     infoList[0] = '卖1/16'
          //   }
          // }
          const diff = this.countDifferenceRate(nowClose, this.averageMap[item.code])
          if (item.key === 'baijiu') {
            if (diff >= 40) {
              this.baijiuwarn = '白酒热'
            }
          }
          this.klineMap[item.key] = kline
          this.averageDiff[item.key] = diff
          // 和总资金有关，还有数量
          const rC = 1 / (60)
          const buyS = (360000 * rC) / 13
          const params = this.indexParams[item.code]
          let buyNumber = 0
          if (['baijiu', 'yiliao', 'shengwu', 'shipin'].indexOf(item.key) !== -1) {
            buyNumber = parseInt(getBuyRateH(diff, params.a, params.b, params.c) * buyS * params.buy / 10) * 10
          } else {
            buyNumber = parseInt(getBuyRate(diff, params.a, params.b, params.c) * buyS * params.buy / 10) * 10
          }
          this.canBuy[item.key] = buyNumber
          this.canSell[item.key] = parseInt((buyS * (1 - buyS / buyNumber)) / 10) * 10
          this.allInfo[item.key] = infoList
          // 其他
          let buyBaseInfo = 0
          if (['买', '跌少', '跌多'].indexOf(infoList[0]) !== -1) {
            item.ifBuy = true
            buyBaseInfo = parseInt(buyNumber / 10)
            item.buyNum = buyBaseInfo
          }
          storageUtil.setData('fixBuyData', item.key, buyBaseInfo)
          this.rateInfo[item.key] = this.keepTwoDecimals(recentNetValue[0].netChangeRatio)
        }
      })
    },
    backHandler () {
      this.$router.history.go(-1)
    },
    ttBuy (num) {
      // num * 每月金额
      return parseInt((num * 10000) / (360000 / 36))
    },
    okHandler () {
      const hhBuy = this.otherBuyCount(this.canBuy)
      const record = []
      if (this.kuanBuy >= 4) {
        this.hhList.forEach((item) => {
          record.push({
            name: item,
            buyNum: this.ttBuy(hhBuy)
          })
        })
      }
      const fundIndexMap = {
        'chuangye': '001879 长城创业板',
        'wulin': '110003 易方达上证50',
        'sanbai': '004190 招商沪深300',
        'wubai': '004945 长信中证500',
        'yiqian': '004194 招商中证1000',
        'baijiu': '161725 招商中证白酒',
        'shipin': '001631 天弘中证食品饮料',
        'yiliao': '501005 汇添富中证精准医疗',
        'shengwu': '501009 汇添富中证生物',
        'jisuanji': '001629 天弘中证计算机',
        'dianzi': '001617 天弘中证电子',
        'xinxi': '000942 广发中证全指信息'
      }
      this.list.forEach((item) => {
        if (item.ifBuy) {
          record.push({
            name: fundIndexMap[item.key],
            buyNum: this.ttBuy(item.buyNum)
          })
        }
      })
      // 开盘的才更新
      if (this.userFundAccountInfo.marketOpen) {
        const date = moment().format('YYYY-MM-DD')
        this.$http.post('http://47.92.210.171:3051/fbsServer/signal/updateSignal', {
          trade_date: date,
          fix_record: JSON.stringify(record)
        })
      }
    },
    otherBuyCount (map) {
      let sum = 0
      // 一共8个
      for (let key in map) {
        if (kuanji.indexOf(key) !== -1) {
          sum += parseFloat(map[key]) || 0
        } else if (['baijiu', 'shengwu', 'dianzi'].indexOf(key) !== -1) {
          sum += parseFloat(map[key]) || 0
        }
      }
      // 取个平均数
      return parseInt((sum) / 8)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
