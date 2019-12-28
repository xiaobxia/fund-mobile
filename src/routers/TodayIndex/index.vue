<template>
  <div class="today-index">
    <mt-header title="今日指数" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div class="income-info">
        <span :class="stockNumberClass(income)">{{income}} --- {{incomeRate}}% --- {{incomeRelativeRate}}%</span>
        <span :class="stockNumberClass(incomeDiff)"> --- {{incomeDiff}}</span>
      </div>
      <mt-cell-swipe v-for="(item) in list" :key="item.code"  :class="item.mix ? 'has-back':''">
        <div slot="title">
          <h3>
            <span class="name">{{item.name}}</span>
            <span class="has-count">{{item.hasCount}}</span>
            <span :class="['income', stockNumberClass(item.netChangeRatio)]">{{parseInt(item.netChangeRatio * item.hasCount / 100)}}</span>
            <span style="float: right" :class="stockNumberClass(item.netChangeRatio)">{{item.netChangeRatio}}%</span>
          </h3>
          <div class="rate-info-icon">
            <i v-if="indexUpDown[item.key] === 'up'" class="fas fa-long-arrow-alt-up up"></i>
            <i v-if="indexUpDown[item.key] === 'down'" class="fas fa-long-arrow-alt-down down"></i>
          </div>
        </div>
      </mt-cell-swipe>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import storageUtil from '@/util/storageUtil.js'
import stockApiUtil from '@/util/stockApiUtil.js'
import indexListAll from '@/common/indexListAll.js'
import { mapGetters } from 'vuex'

export default {
  name: 'TodayIndex',
  data () {
    let list = []
    let indexUpDown = {}
    let hasCountMap = {}
    indexListAll.forEach((item) => {
      list.push({
        ...item,
        rank: 0,
        netChangeRatio: 0,
        hasCount: 0
      })
      indexUpDown[item.key] = 0
      hasCountMap[item.name] = 0
    })
    return {
      list: list,
      timer: null,
      indexUpDown,
      hasCountMap,
      todayAsset: 0,
      preAssetCost: 0,
      assetCost: 0,
      tradeTime: '',
      fundShares: 0,
      lastNetValue: {},
      marketOpen: false
    }
  },
  computed: {
    income () {
      let income = 0
      this.list.forEach((item) => {
        income += item.netChangeRatio * (item.hasCount || 0)
      })
      return parseInt((income / 100) * 0.95)
    },
    incomeRate () {
      let income = 0
      let asset = 0
      this.list.forEach((item) => {
        let hasCount = (item.hasCount || 0)
        income += item.netChangeRatio * (item.hasCount || 0)
        asset += hasCount
      })
      income = parseInt((income / 100) * 0.95)
      return this.countRate(income, asset)
    },
    incomeRelativeRate () {
      const user = this.userFundAccountInfo.user
      let income = 0
      this.list.forEach((item) => {
        income += item.netChangeRatio * (item.hasCount || 0)
      })
      income = parseInt((income / 100) * 0.95)
      return this.countRate(income, user.asset)
    },
    incomeDiff () {
      const user = this.userFundAccountInfo.user
      if (user.asset === 0) {
        return 0
      }
      let income = 0
      let asset = 0
      this.list.forEach((item) => {
        let hasCount = (item.hasCount || 0)
        income += item.netChangeRatio * (item.hasCount || 0)
        asset += hasCount
      })
      income = parseInt((income / 100) * 0.95)
      let rate = this.countRate(income, asset)
      return parseInt((asset - user.asset) * rate / 100)
    },
    ...mapGetters([
      'userFundAccountInfo'
    ])
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  created () {
    this.marketOpen = this.userFundAccountInfo.marketOpen
    this.$http.get('userFund/getUserFunds').then((data) => {
      if (data.success) {
        const list = data.data.list
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          if (item.theme) {
            if (this.hasCountMap[item.theme]) {
              this.hasCountMap[item.theme] += parseInt(item.sum)
            } else {
              this.hasCountMap[item.theme] = parseInt(item.sum)
            }
          }
        }
        this.list.forEach((item) => {
          item.hasCount = this.hasCountMap[item.name]
        })
      }
    })
    this.timer = setInterval(() => {
      this.initPage()
      // 半分钟一刷
    }, 1000 * 30)
    this.initPage()
  },
  methods: {
    initPage () {
      let queryList = []
      let list = this.list
      for (let i = 0; i < list.length; i++) {
        queryList.push(this.queryData(list[i]))
      }
      Promise.all(queryList).then(() => {
        this.sortChangeHandler()
        this.updateMyNetValue()
      })
    },
    queryData (item) {
      return this.$http.getWithCache(`stock/${stockApiUtil.getTodayUrl()}`, {
        code: item.code
      }, {interval: 20}).then((data) => {
        if (data.success) {
          if (this.tradeTime === '') {
            this.tradeTime = data.data.tradeTime
          }
          const netChangeRatio = parseFloat(data.data.netChangeRatio)
          item.netChangeRatio = this.keepTwoDecimals(netChangeRatio)
          // 如果不是交易日那就不执行
          if (this.marketOpen) {
            // 涨跌标志
            let lastRateJson = storageUtil.getData('indexUpDown', item.key)
            let indexUpDown = ''
            if (lastRateJson) {
              let lastRate = JSON.parse(lastRateJson)
              if (moment().isSame(lastRate.date, 'day')) {
                if (netChangeRatio < lastRate.rate) {
                  indexUpDown = 'down'
                }
                if (netChangeRatio > lastRate.rate) {
                  indexUpDown = 'up'
                }
              } else {
                if (netChangeRatio < 0) {
                  indexUpDown = 'down'
                }
                if (netChangeRatio > 0) {
                  indexUpDown = 'up'
                }
              }
            } else {
              if (netChangeRatio < 0) {
                indexUpDown = 'down'
              }
              if (netChangeRatio > 0) {
                indexUpDown = 'up'
              }
            }
            this.indexUpDown[item.key] = indexUpDown
            storageUtil.setData('indexUpDown', item.key, JSON.stringify({
              date: moment().format('YYYY-MM-DD'),
              rate: netChangeRatio
            }))
          }
        }
      })
    },
    backHandler () {
      this.$router.history.go(-1)
    },
    sortChangeHandler () {
      this.list.sort((a, b) => {
        return b.netChangeRatio - a.netChangeRatio
      })
    },
    updateMyNetValue () {
      const user = this.userFundAccountInfo.user
      const userNewestNetValue = this.userFundAccountInfo.userNewestNetValue
      // 如果不是交易日那就不执行
      if (this.marketOpen) {
        const d = this.getDate()
        const hour = d.getHours()
        const minute = d.getMinutes()
        // 10点开始，16点半结束
        if ((hour >= 10 && hour < 16) || (hour === 16 && minute < 30)) {
          // 和交易日是同一天
          if (moment().isSame(this.tradeTime, 'day')) {
            const newestNetValueData = userNewestNetValue.net_value_date
            // 当日收益
            let income = 0
            this.list.forEach((item) => {
              income += item.netChangeRatio * (item.hasCount || 0)
            })
            income = parseInt((income / 100) * 0.95)
            let form = {
              shares: user.shares,
              asset: user.asset + income,
              asset_cost: user.asset_cost,
              net_value_date: moment().format('YYYY-MM-DD'),
              today_income: income,
              income: user.income + income
            }
            let url = moment(newestNetValueData).isSame(this.tradeTime, 'day') ? 'userFund/updateUserNetValue' : 'userFund/addUserNetValue'
            this.$http.post(url, form)
          }
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
