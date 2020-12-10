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
        :noSellCount="noSellCount"
        :sellCount="sellCount"
        :countUpNumber="countUpNumber"
        :countDownNumber="countDownNumber"
        :lastDayBuy="lastDayBuy"
        :lastDaySell="lastDaySell"
        :nowMonthRate="nowMonthRate"
        :niuxiong="niuxiong"
      />
      <operating-info-item
        v-for="(item) in list"
        :key="item.code"
        :indexInfo="item"
        :toUrl="'/page/indexDetail?'+qsStringify({type, ...item})"
        :hasCount="hasCount[item.name]"
        :costCount="costCount[item.name]"
        :rate="rateMap[item.key]"
        :lock="lockMap[item.name]"
        :totalSum="totalSum"
        :buyCount="buyCount"
        :sellCount="sellCount"
        :nowMonthRate="nowMonthRate"
        :buySellList="buySellMap[item.key]"
        :netChangeRatioList="netChangeRatioMap[item.key]"
        :closeList="closeListMap[item.key]"
        :netChangeRatioListLarge="netChangeRatioLargeMap[item.key]"
        :closeListLarge="closeListLargeMap[item.key]"
        :countUpNumber="countUpNumber"
        :countDownNumber="countDownNumber"
        :type="typeName"
        :noSellCount="noSellCount"
      />
      <mt-button type="primary" @click="okHandler" class="main-btn">发送</mt-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import indexInfoUtilXiong from '@/util/indexInfoUtilXiong.js'
import indexInfoUtilJian from '@/util/indexInfoUtilJian.js'
import qs from 'qs'
import storageUtil from '@/util/storageUtil.js'
import stockApiUtil from '@/util/stockApiUtil.js'
import indexList from '@/common/indexList.js'
import OperatingInfoItem from '@/components/OperatingInfoItem.vue'
import OperatingWarn from '@/components/OperatingWarn.vue'

const codeMap = indexInfoUtilXiong.codeMap
const formatData = indexInfoUtilXiong.formatData

let InfoUtil = indexInfoUtilXiong.Util
let fnMap = indexInfoUtilXiong.fnMap

function getIndexInfo (key) {
  for (let i = 0; i < indexList.length; i++) {
    if (indexList[i].key === key) {
      return indexList[i]
    }
  }
  return {}
}

export default {
  name: 'OperatingInfo',
  data () {
    let buySellMap = {}
    let netChangeRatioMap = {}
    let netChangeRatioLargeMap = {}
    let closeListMap = {}
    let closeListLargeMap = {}
    let list = []
    let firstClass = {}
    let rateMap = {}
    let lockMap = {}
    let hasCount = {}
    let costCount = {}
    for (let key in codeMap) {
      list.push({
        ...getIndexInfo(key),
        ...codeMap[key],
        key: key
      })
      buySellMap[key] = []
      closeListMap[key] = []
      closeListLargeMap[key] = []
      netChangeRatioMap[key] = []
      netChangeRatioLargeMap[key] = []
      firstClass[key] = ''
      rateMap[key] = 0
      lockMap[codeMap[key].name] = true
      hasCount[codeMap[key].name] = 0
      costCount[codeMap[key].name] = 0
    }
    return {
      type: 'jian',
      typeName: '简',
      list: list,
      buySellMap,
      netChangeRatioMap,
      netChangeRatioLargeMap,
      closeListMap,
      closeListLargeMap,
      firstClass,
      rateMap,
      lockMap,
      hasCount,
      costCount,
      // 持有金额，不计入定投
      totalSum: 10000,
      nowMonthRate: 0,
      lastDayBuy: [0, 0],
      lastDaySell: [0, 0],
      niuxiong: [0, 0, 0, 0],
      noSellCount: 0
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
    },
    ...mapGetters([
      'userFundAccountInfo'
    ])
  },
  created () {
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
  mounted () {
    const d = this.getDate()
    const hour = d.getHours()
    const minute = d.getMinutes()
    const td = moment().format('YYYY-MM-DD')
    if (hour === 14 && minute > 50) {
      const str = localStorage.getItem('W-1')
      if (str && str === td) {
        console.log('y')
      } else {
        setTimeout(() => {
          localStorage.setItem('W-1', td)
          alert('处在高位危险，信号一会儿让卖一会儿又不让卖的，那就卖掉')
        }, 1000)
      }
    }
  },
  methods: {
    initPage () {
      let indexList = this.list
      this.$http.get('userFund/getUserNetValueNowMonthNetChangeRatio').then((res) => {
        this.nowMonthRate = res.data.netChangeRatio
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
                    }
                  } else {
                    if (item.canSellSum < 100) {
                    } else {
                      this.lockMap[item.theme] = false
                    }
                  }
                  // 拥有应该是现在的价值之和而不是成本
                  const sum = parseInt(item.sum)
                  if (this.hasCount[item.theme]) {
                    this.hasCount[item.theme] += sum
                  } else {
                    this.hasCount[item.theme] = sum
                  }
                  const costSum = parseInt(item.costSum)
                  if (this.costCount[item.theme]) {
                    this.costCount[item.theme] += costSum
                  } else {
                    this.costCount[item.theme] = costSum
                  }
                }
              }
            }
            this.totalSum = totalSum
          }
        })
      ]).then(() => {
        let opList = []
        let dafan = 0
        let xiaofan = 0
        let dingtou = 0
        let jinmai = 0
        let dingbu = 0
        let tandi = 0
        let jiandi = 0
        let yearOk = 0
        let halfYearOk = 0
        let quarterOk = 0
        let monthOk = 0
        for (let i = 0; i < indexList.length; i++) {
          opList.push(this.queryData(indexList[i]))
          const niuxiong = storageUtil.getData('stockIndexFlag', indexList[i].key)
          const status = storageUtil.getData('stockIndexStatus', indexList[i].key)
          const recentStatus = storageUtil.getData('stockIndexRecentStatus', indexList[i].key)
          const yearDiff = storageUtil.getData('yearAverageIndexDiff', indexList[i].key) || 0
          const halfYearDiff = storageUtil.getData('averageHalfYearIndex', indexList[i].key) || 0
          const quarterDiff = storageUtil.getData('averageQuarterIndex', indexList[i].key) || 0
          const monthDiff = storageUtil.getData('averageMonth', indexList[i].key) || 0
          if (niuxiong === '禁买') {
            jinmai++
          }
          if (status === '定投') {
            dingtou++
          } else if (status === '顶部') {
            dingbu++
          } else if (status === '探底') {
            tandi++
          }
          if (recentStatus === '见底') {
            jiandi++
          }
          if (yearDiff > 0) {
            yearOk++
          }
          if (halfYearDiff > 0) {
            halfYearOk++
          }
          if (quarterDiff > 0) {
            quarterOk++
          }
          if (monthDiff > 0) {
            monthOk++
          }
        }
        Promise.all(opList).then(() => {
          const stockIndexDafan = storageUtil.getData('stockIndexDafan') || {}
          for (let key in stockIndexDafan) {
            if (stockIndexDafan[key]) {
              dafan++
            }
          }
          const stockIndexXiaofan = storageUtil.getData('stockIndexXiaofan') || {}
          for (let key in stockIndexXiaofan) {
            console.log(stockIndexXiaofan[key])
            if (stockIndexXiaofan[key]) {
              xiaofan++
            }
          }
          this.niuxiong = [dafan, xiaofan, tandi, dingtou, jiandi, dingbu]
          this.countPosition({
            yearOk,
            halfYearOk,
            quarterOk,
            dafan,
            xiaofan,
            tandi,
            dingtou,
            jiandi,
            dingbu
          })
        })
      })
    },
    countPosition (data) {
      const indexNum = 24
      // 最低仓位30
      let position = 0
      // 年线
      position += ((data.yearOk + data.dingtou) / indexNum) * 20
      // 半年线
      position += ((data.halfYearOk + data.dingtou) / indexNum) * 30
      // 季度线
      // 季度线没有特别重要
      position += ((data.quarterOk + data.jiandi) / indexNum) * 20
      // 月度线
      position += ((data.dafan + (0.5 * data.xiaofan) + this.noSellCount) / indexNum) * 30
      localStorage.setItem('minPosition', position)
    },
    qsStringify (query) {
      return qs.stringify(query)
    },
    queryData (item) {
      return this.$http.getWithCache(`stock/${stockApiUtil.getAllUrl()}`, {
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
          let netChangeRatioListLarge = []
          let closeListLarge = []
          for (let i = 0; i < 10; i++) {
            const nowRecord = recentNetValue[i]
            const oneDayRecord = recentNetValue[i + 1]
            const twoDayRecord = recentNetValue[i + 2]
            let buyFlag = infoUtil[fnMap[item.key + 'Buy']](nowRecord, oneDayRecord, twoDayRecord)
            let sellFlag = infoUtil[fnMap[item.key + 'Sell']](nowRecord, oneDayRecord, twoDayRecord)
            netChangeRatioListLarge[i] = recentNetValue[i].netChangeRatio
            closeListLarge[i] = recentNetValue[i].close
            if (i < 5) {
              netChangeRatioList[i] = recentNetValue[i].netChangeRatio
              closeList[i] = recentNetValue[i].close
              if ((buyFlag === true) || (buyFlag !== false && buyFlag.flag === true)) {
                if (nowRecord.netChangeRatio <= -(item.rate)) {
                  buySellList[i] = 'buy'
                }
              } else if ((sellFlag === true) || (sellFlag !== false && sellFlag.flag === true)) {
                buySellList[i] = 'sell'
              } else {
                buySellList[i] = ''
              }
              if (buySellList[i] === 'sell') {
                if (netChangeRatioList[i] <= 0) {
                  buySellList[i] = ''
                }
              }
              if (buySellList[i] === 'buy') {
                if (netChangeRatioList[i] >= 0) {
                  buySellList[i] = ''
                }
              }
            }
          }
          /**
           * 生成市场风险提示
           */
          this.buySellMap[item.key] = buySellList
          this.closeListMap[item.key] = closeList
          this.netChangeRatioMap[item.key] = netChangeRatioList
          this.closeListLargeMap[item.key] = closeListLarge
          this.netChangeRatioLargeMap[item.key] = netChangeRatioListLarge
          this.firstClass[item.key] = buySellList[0]
          this.rateMap[item.key] = this.keepTwoDecimals(recentNetValue[0].netChangeRatio)
          if (this.type === 'jian') {
            storageUtil.setData('jianBuySellList', item.key, buySellList)
          } else {
            storageUtil.setData('xiongBuySellList', item.key, buySellList)
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
          if (storageUtil.getData('noSell', item.key)) {
            this.noSellCount = this.noSellCount + 1
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
    },
    okHandler () {
      const bandBuyData = storageUtil.getData('bandBuySellData')
      const list = []
      for (let key in bandBuyData) {
        list.push({
          key,
          flag: bandBuyData[key]
        })
      }
      // 开盘的才更新
      if (this.userFundAccountInfo.marketOpen) {
        const date = moment().format('YYYY-MM-DD')
        this.$http.post('http://47.92.210.171:3051/fbsServer/signal/updateSignal', {
          trade_date: date,
          band_record: JSON.stringify(list)
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
