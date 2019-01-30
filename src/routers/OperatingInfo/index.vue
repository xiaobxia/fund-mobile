<template>
  <div class="operating-info">
    <mt-header :title="'操作分析-'+typeName" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <operating-warn
        :buyCount="buyCount"
        :sellCount="sellCount"
        :countUpNumber="countUpNumber"
        :countDownNumber="countDownNumber"
        :sellCountLastDay="sellCountLastDay"
        :buyCountLastDay="buyCountLastDay"
        :lastDayBuy="lastDayBuy"
        :lastDaySell="lastDaySell"
        :nowMonthRate="nowMonthRate"
        :type="typeName"
      />
      <operating-info-item
        v-for="(item) in list"
        :key="item.code"
        :indexInfo="item"
        :toUrl="'/page/indexDetail?'+qsStringify({type, ...item})"
        :hasCount="hasCount[item.name]"
        :rate="rateMap[item.key]"
        :lock="lockMap[item.name]"
        :totalSum="totalSum"
        :buyCount="buyCount"
        :sellCount="sellCount"
        :buySellList="buySellMap[item.key]"
        :netChangeRatioList="netChangeRatioMap[item.key]"
        :closeList="closeListMap[item.key]"
        :buySellListLarge="buySellLargeMap[item.key]"
        :netChangeRatioListLarge="netChangeRatioLargeMap[item.key]"
        :closeListLarge="closeListLargeMap[item.key]"
        :type="typeName"
      />
    </div>
  </div>
</template>

<script>
import indexInfoUtilXiong from '@/util/indexInfoUtilXiong.js'
import indexInfoUtilJian from '@/util/indexInfoUtilJian.js'
import qs from 'qs'
import storageUtil from '@/util/storageUtil.js'
import stockDataUtil from '@/util/stockDataUtil.js'
import OperatingInfoItem from '@/components/OperatingInfoItem.vue'
import OperatingWarn from '@/components/OperatingWarn.vue'

const codeMap = indexInfoUtilXiong.codeMap
const formatData = indexInfoUtilXiong.formatData

let InfoUtil = indexInfoUtilXiong.Util
let fnMap = indexInfoUtilXiong.fnMap

export default {
  name: 'OperatingInfo',
  data () {
    let buySellMap = {}
    let buySellLargeMap = {}
    let netChangeRatioMap = {}
    let netChangeRatioLargeMap = {}
    let closeListMap = {}
    let closeListLargeMap = {}
    let list = []
    let firstClass = {}
    let rateMap = {}
    let lockMap = {}
    let hasCount = {}
    for (let key in codeMap) {
      list.push({
        ...codeMap[key],
        key: key,
        goodBad: storageUtil.getGoodBad(codeMap[key].name) || '无'
      })
      buySellMap[key] = []
      buySellLargeMap[key] = []
      closeListMap[key] = []
      closeListLargeMap[key] = []
      netChangeRatioMap[key] = []
      netChangeRatioLargeMap[key] = []
      firstClass[key] = ''
      rateMap[key] = 0
      lockMap[codeMap[key].name] = false
      hasCount[codeMap[key].name] = 0
    }
    return {
      type: 'jian',
      typeName: '简',
      list: list,
      buySellMap,
      buySellLargeMap,
      netChangeRatioMap,
      netChangeRatioLargeMap,
      closeListMap,
      closeListLargeMap,
      firstClass,
      rateMap,
      lockMap,
      hasCount,
      // 持有金额，不计入定投
      totalSum: 10000,
      nowMonthRate: 0,
      lastDayBuy: [0, 0],
      lastDaySell: [0, 0]
    }
  },
  components: {OperatingInfoItem, OperatingWarn},
  computed: {
    buyCount () {
      return this.countFlag(this.buySellMap, 0, 'buy')
    },
    sellCount () {
      return this.countFlag(this.buySellMap, 0, 'sell')
    },
    buyCountLastDay () {
      return this.countFlag(this.buySellMap, 1, 'buy')
    },
    sellCountLastDay () {
      return this.countFlag(this.buySellMap, 1, 'sell')
    },
    countUpNumber () {
      let count = 0
      for (let key in this.rateMap) {
        if (this.rateMap[key] > 0) {
          count++
        }
      }
      return count
    },
    countDownNumber () {
      let count = 0
      for (let key in this.rateMap) {
        if (this.rateMap[key] < 0) {
          count++
        }
      }
      return count
    }
  },
  mounted () {
    const query = this.$router.history.current.query
    this.type = query.type
    this.typeName = query.type === 'jian' ? '简' : '熊'
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
    initPage () {
      let indexList = this.list
      this.$http.get('userFund/getUserNetValueNowMonthRate').then((res) => {
        this.nowMonthRate = res.data.rate
      })
      Promise.all([
        this.$http.get('userFund/getUserFunds').then((data) => {
          if (data.success) {
            const list = data.data.list
            let totalSum = 0
            for (let i = 0; i < list.length; i++) {
              const item = list[i]
              if (item.theme) {
                // 定投不计入
                if (item.strategy === '1') {
                  totalSum += item.sum
                  if (item.ifAllLock) {
                    if (this.lockMap[item.theme] !== '') {
                      this.lockMap[item.theme] = true
                    }
                  } else {
                    this.lockMap[item.theme] = false
                  }
                  // 拥有应该是现在的价值之和而不是成本
                  const sum = parseInt(item.sum)
                  if (this.hasCount[item.theme]) {
                    this.hasCount[item.theme] += sum
                  } else {
                    this.hasCount[item.theme] = sum
                  }
                }
              }
            }
            this.totalSum = totalSum
          }
        })
      ]).then(() => {
        for (let i = 0; i < indexList.length; i++) {
          this.queryData(indexList[i])
        }
      })
    },
    qsStringify (query) {
      return qs.stringify(query)
    },
    queryData (item) {
      this.$http.getWithCache(`webData/${stockDataUtil.getAllUrl()}`, {
        code: item.code,
        days: 12
      }, {interval: 30}).then((data) => {
        if (data.success) {
          const list = data.data.list
          const recentNetValue = formatData(list).list
          const infoUtil = new InfoUtil(item)
          /**
           * 生成近几日的买卖信号
           * 近的在前
           */
          let buySellList = []
          let netChangeRatioList = []
          let closeList = []
          let buySellListLarge = []
          let netChangeRatioListLarge = []
          let closeListLarge = []
          for (let i = 0; i < 10; i++) {
            const nowRecord = recentNetValue[i]
            const oneDayRecord = recentNetValue[i + 1]
            const twoDayRecord = recentNetValue[i + 2]
            let buyFlag = infoUtil[fnMap[item.key + 'Buy']](nowRecord, oneDayRecord, twoDayRecord)
            let sellFlag = infoUtil[fnMap[item.key + 'Sell']](nowRecord, oneDayRecord, twoDayRecord)
            if (i <= 7) {
              netChangeRatioListLarge[i] = recentNetValue[i].netChangeRatio
              closeListLarge[i] = recentNetValue[i].close
              if ((buyFlag === true) || (buyFlag !== false && buyFlag.flag === true)) {
                buySellListLarge[i] = 'buy'
              } else if ((sellFlag === true) || (sellFlag !== false && sellFlag.flag === true)) {
                buySellListLarge[i] = 'sell'
              } else {
                buySellListLarge[i] = ''
              }
            }
            if (i < 5) {
              netChangeRatioList[i] = recentNetValue[i].netChangeRatio
              closeList[i] = recentNetValue[i].close
              if ((buyFlag === true) || (buyFlag !== false && buyFlag.flag === true)) {
                buySellList[i] = 'buy'
              } else if ((sellFlag === true) || (sellFlag !== false && sellFlag.flag === true)) {
                buySellList[i] = 'sell'
              } else {
                buySellList[i] = ''
              }
            }
          }
          /**
           * 生成市场风险提示
           */
          this.buySellMap[item.key] = buySellList
          this.closeListMap[item.key] = closeList
          this.netChangeRatioMap[item.key] = netChangeRatioList
          this.buySellLargeMap[item.key] = buySellListLarge
          this.closeListLargeMap[item.key] = closeListLarge
          this.netChangeRatioLargeMap[item.key] = netChangeRatioListLarge
          this.firstClass[item.key] = buySellList[0]
          this.rateMap[item.key] = this.keepTwoDecimals(recentNetValue[0].netChangeRatio)
          if (this.type === 'jian') {
            storageUtil.setJianBuySellList(item.key, buySellList)
            storageUtil.setJianBuySellListLarge(item.key, buySellListLarge)
          } else {
            storageUtil.setXiongBuySellList(item.key, buySellList)
            storageUtil.setXiongBuySellListLarge(item.key, buySellListLarge)
          }
          if (buySellList[1] === 'buy') {
            this.lastDayBuy[1]++
            if (closeList[0] > closeList[1]) {
              this.lastDayBuy[0]++
            }
          }
          if (buySellList[1] === 'sell') {
            this.lastDaySell[1]++
            if (closeList[0] < closeList[1]) {
              this.lastDaySell[0]++
            }
          }
        }
      })
    },
    backHandler () {
      this.$router.history.go(-1)
    },
    countFlag (buySellListMap, index, type) {
      let count = 0
      for (let key in buySellListMap) {
        if (buySellListMap[key][index] === type) {
          count++
        }
      }
      return count
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
