<template>
  <div class="operating-info">
    <mt-header title="定投" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-cell-swipe v-for="(item) in list" :key="item.code" :class="[hasInfo[item.name] ? 'has':'no-has']">
        <div slot="title">
          <h3>
            <span class="index-name">{{item.name}}</span>
            <span :class="numberClass(averageDiff[item.key])">{{averageDiff[item.key]}}</span>
            <span>{{canBuy[item.key]}}</span>
            <span class="green-text">{{canSell[item.key]}}</span>
            <span v-if="hasCount[item.name]" class="has-count">{{hasCount[item.name]}}</span>
            <span style="float: right" :class="numberClass(rateInfo[item.key])">{{rateInfo[item.key]}}%</span>
          </h3>
          <p class="netChange wn">
            <span v-for="(subItem, index) in klineMap[item.key]" :key="index"
                  :class="numberBgClass(subItem.netChangeRatio)">{{subItem.netChangeRatio}}%</span>
          </p>
          <p class="explain">
            <span v-for="(subItem, index) in allInfo[item.key]" :key="subItem + index"
                  :class="getClass(subItem)">{{subItem}}</span>
          </p>
        </div>
      </mt-cell-swipe>
    </div>
  </div>
</template>

<script>
import fixedInvestment from '@/util/platformFixedInvestment.js'
import stockDataUtil from '@/util/stockDataUtil.js'

const codeMap = fixedInvestment.codeMap
const InfoUtil = fixedInvestment.Util
const fnMap = fixedInvestment.fnMap
const formatData = fixedInvestment.formatData

function getBuyRate (rate) {
  if (rate >= 4 && rate < 8) {
    return 0.9
  }
  if (rate >= 8 && rate < 12) {
    return 0.8
  }
  if (rate >= 12 && rate < 16) {
    return 0.7
  }
  if (rate >= 16 && rate < 20) {
    return 0.6
  }
  if (rate >= 20) {
    return 0.5
  }
  if (rate <= -4 && rate > -8) {
    return 1.1
  }
  if (rate <= -8 && rate > -12) {
    return 1.2
  }
  if (rate <= -12 && rate > -16) {
    return 1.3
  }
  if (rate <= -16 && rate > -20) {
    return 1.4
  }
  if (rate <= -20) {
    return 1.5
  }
  return 1
}

function ifAllDown (list, start, day) {
  let flag = true
  let rate = 0
  for (let i = 0; i < day; i++) {
    if (list[start + i].netChangeRatio > 0) {
      return {
        flag: false
      }
    } else {
      rate += list[start + i].netChangeRatio
    }
  }
  return {
    flag,
    rate
  }
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
        'sz399997': 5400
      },
      indexParams: {
        'sh000852': 0.7,
        'sh000905': 1,
        'sh000300': 1.15,
        'sh000016': 1.3,
        'sz399006': 0.85,
        'sz399997': 1.3
      },
      indexParamSell: {
        'sh000852': 1.3,
        'sh000905': 1,
        'sh000300': 0.85,
        'sh000016': 0.7,
        'sz399006': 1.15,
        'sz399997': 0.7
      },
      klineMap
    }
  },
  computed: {
  },
  mounted () {
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
      this.$http.get('stock/getFixYearAverage').then((res) => {
        const list = res.data
        for (let i = 0; i < list.length; i++) {
          this.averageMap[list[i].describe] = parseInt(list[i].value)
        }
      }).then(() => {
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
      })
    },
    queryData (item) {
      this.$http.getWithCache(`webData/${stockDataUtil.getAllUrl()}`, {
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
          for (let i = 0; i < 8; i++) {
            const nowRecord = recentNetValue[i]
            const oneDayRecord = recentNetValue[i + 1]
            const twoDayRecord = recentNetValue[i + 2]
            let buyFlag = infoUtil[fnMap[item.key + 'Buy']](nowRecord, oneDayRecord, twoDayRecord)
            let sellFlag = infoUtil[fnMap[item.key + 'Sell']](nowRecord, oneDayRecord, twoDayRecord)
            if (i < 5) {
              kline.push(recentNetValue[i])
              if (buyFlag.flag === true && buyFlag.text !== 'niu') {
                infoList[i] = '买'
              } else if (buyFlag.flag === true && buyFlag.text === 'niu' && oneDayRecord['netChangeRatio'] < 0) {
                infoList[i] = '买少'
              } else if (sellFlag.flag === true && sellFlag.text !== 'xiong') {
                infoList[i] = '卖'
              } else if (sellFlag.flag === true && sellFlag.text === 'xiong') {
                infoList[i] = '卖少'
              } else {
                infoList[i] = ''
              }
            }
            if (infoList[i] === '') {
              if (ifAllDown(recentNetValue, i, 4).flag) {
                if (ifAllDown(recentNetValue, i, 4).rate < -5) {
                  infoList[i] = '跌多'
                } else {
                  infoList[i] = '跌少'
                }
              }
              if (ifAllDown(recentNetValue, i, 5).flag) {
                infoList[i] = '跌多'
              }
            }
            if (infoList[i] === '') {
              if (ifAllDown(recentNetValue, i, 3).flag) {
                if (ifAllDown(recentNetValue, i, 3).rate < -3.6) {
                  infoList[i] = '快跌'
                } else {
                  infoList[i] = '慢跌'
                }
              }
            }
          }
          this.klineMap[item.key] = kline
          this.averageDiff[item.key] = this.countDifferenceRate(nowClose, this.averageMap[item.code])
          this.canBuy[item.key] = parseInt(getBuyRate(this.countDifferenceRate(nowClose, this.averageMap[item.code])) * (120000 / 162.5) * this.indexParams[item.code] / 10) * 10
          this.canSell[item.key] = parseInt(getBuyRate(-this.countDifferenceRate(nowClose, this.averageMap[item.code])) * (120000 / 162.5) * this.indexParamSell[item.code] / 10) * 10
          this.allInfo[item.key] = infoList
          this.rateInfo[item.key] = this.keepTwoDecimals(recentNetValue[0].netChangeRatio)
        }
      })
    },
    backHandler () {
      this.$router.history.go(-1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
