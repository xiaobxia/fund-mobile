<template>
  <div class="my-fund">
    <mt-header :title="'我的持仓 - ' + fundNumber" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div class="info-wrap">
        <span class="item">持仓金额：{{parseInt(info.totalSum)}}</span>
        <span class="item">持仓成本：{{parseInt(info.costTotalSum)}}</span>
        <span class="item">仓位信息：{{myPosition}}%</span>
        <span class="item">估算金额：{{parseInt(info.valuationTotalSum)}}</span>
        <span class="item">锁仓金额：{{parseInt(lockCostSum)}}</span>
        <span class="item">锁仓收益：<span :class="numberClass(lockIncomeRatio)">{{lockIncomeRatio}}%</span></span>
        <span class="item">估算收益：<span :class="numberClass(valuationInfo)">{{parseInt(valuationInfo)}}</span></span>
        <span class="item">估算比率：<span :class="numberClass(todayIncomeRatio)">{{todayIncomeRatio}}%</span></span>
        <span class="item">相对波动：<span :class="numberClass(relativeRate)">{{relativeRate}}%</span></span>
        <span class="item">最新购买：{{parseInt(lastBuy)}}</span>
        <span class="item">沪深300：<span :class="numberClass(hushenChangeRatio)">{{hushenChangeRatio}}%</span></span>
        <span class="item">创业板：<span :class="numberClass(chuangyeChangeRatio)">{{chuangyeChangeRatio}}%</span></span>
        <span class="item">上证50：<span :class="numberClass(wulinChangeRatio)">{{wulinChangeRatio}}%</span></span>
      </div>
      <div class="lastUpdateValuationTime">更新于：{{lastUpdateValuationTime}}</div>
      <my-fund-card  v-for="(item) in cardInfo" :key="item.name"  :listData="item.list" :title="item.name"/>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import MyFundCard from '@/components/MyFundCard.vue'
import fundAccountUtil from '@/util/fundAccountUtil.js'
import indexInfoUtil from '@/util/indexInfoUtilXiong.js'
import stockDataUtil from '@/util/stockDataUtil.js'
import storageUtil from '@/util/storageUtil.js'

const codeMap = indexInfoUtil.codeMap
export default {
  name: 'MyFund',
  data () {
    const userFundAccountInfo = storageUtil.getUserFundAccountInfo()
    let cardInfo = []
    for (let key in codeMap) {
      cardInfo.push({
        name: codeMap[key].name,
        list: []
      })
    }
    cardInfo.push({
      name: '其他',
      list: []
    })
    cardInfo.push({
      name: '定投',
      list: []
    })
    return {
      info: {
        valuationTotalSum: 0,
        totalSum: 0,
        costTotalSum: 0
      },
      list: [],
      timer: null,
      todayIncomeRatio: 0,
      lockIncomeRatio: 0,
      myAsset: userFundAccountInfo.pre_asset,
      cardInfo,
      hushenChangeRatio: 0,
      wulinChangeRatio: 0,
      chuangyeChangeRatio: 0,
      lastUpdateValuationTime: '',
      fundNumber: 0,
      lockCostSum: 0,
      lastTradingDay: userFundAccountInfo.pre_net_value_date,
      lastBuy: 0
    }
  },
  components: {MyFundCard},
  computed: {
    // 持仓当日收益率
    valuationInfo () {
      if (this.info.valuationTotalSum && this.info.totalSum) {
        return this.keepTwoDecimals(this.info.valuationTotalSum - this.info.totalSum)
      } else {
        return 0
      }
    },
    // 仓位信息
    myPosition () {
      if (this.info.totalSum) {
        return this.countRate(this.info.totalSum, this.myAsset)
      } else {
        return 0
      }
    },
    // 相对收益
    relativeRate () {
      if (this.info.valuationTotalSum && this.info.totalSum) {
        const income = this.keepTwoDecimals(this.info.valuationTotalSum - this.info.totalSum)
        return this.countRate(income, this.myAsset)
      } else {
        return 0
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  mounted () {
    this.timer = setInterval(() => {
      this.initPage()
    }, 1000 * 60)
    this.initPage()
  },
  methods: {
    initPage () {
      let dataMap = {}
      for (let key in codeMap) {
        dataMap[codeMap[key].name] = []
      }
      dataMap['其他'] = []
      dataMap['定投'] = []
      this.$http.get('userFund/getUserFunds').then((res) => {
        const list = res.data.list
        let lockCostSum = 0
        let lockValuationSum = 0
        let costTotalSum = 0
        let lastBuy = 0
        let valuationTotalSum = 0
        let totalSum = 0
        list.forEach((item) => {
          valuationTotalSum += item.valuationSum
          totalSum += item.sum
          costTotalSum += item.costSum
          // 处于锁仓
          lastBuy += fundAccountUtil.getLastBuy(item).costSum
          const lockInfo = fundAccountUtil.getLockInfo(item)
          lockCostSum += lockInfo.costSum
          lockValuationSum += lockInfo.valuationSum
          // 防止基金有主题，但是主题已经被删除的情况
          if (item.strategy !== '1') {
            dataMap['定投'].push(item)
          } else {
            if (item.theme && dataMap[item.theme]) {
              dataMap[item.theme].push(item)
            } else {
              dataMap['其他'].push(item)
            }
          }
        })
        for (let i = 0; i < this.cardInfo.length; i++) {
          this.cardInfo[i].list = dataMap[this.cardInfo[i].name]
        }
        this.info = {
          valuationTotalSum,
          totalSum,
          costTotalSum
        }
        this.lastUpdateValuationTime = moment(list[0].valuation_date).format('YYYY-MM-DD HH:mm:ss')
        this.lastBuy = lastBuy
        this.fundNumber = list.length
        this.lockCostSum = lockCostSum
        this.lockIncomeRatio = this.countDifferenceRate(lockValuationSum, lockCostSum)
        this.todayIncomeRatio = this.countDifferenceRate(valuationTotalSum, totalSum)
      })
      this.queryStockData()
    },
    queryStockData () {
      // 沪深300
      this.$http.getWithCache(`webData/${stockDataUtil.getTodayUrl()}`, {
        code: 'sh000300'
      }, {interval: 60}).then((data) => {
        if (data.success) {
          this.hushenChangeRatio = data.data.netChangeRatio
        }
      })
      // 创业板
      this.$http.getWithCache(`webData/${stockDataUtil.getTodayUrl()}`, {
        code: 'sz399006'
      }, {interval: 60}).then((data) => {
        if (data.success) {
          this.chuangyeChangeRatio = data.data.netChangeRatio
        }
      })
      // 上证50
      this.$http.getWithCache(`webData/${stockDataUtil.getTodayUrl()}`, {
        code: 'sh000016'
      }, {interval: 60}).then((data) => {
        if (data.success) {
          this.wulinChangeRatio = data.data.netChangeRatio
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
