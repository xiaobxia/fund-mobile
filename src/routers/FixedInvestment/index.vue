<template>
  <div class="operating-info">
    <mt-header title="定投" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-cell-swipe v-for="(item) in list" :key="item.code" :class="[firstClass[item.key], hasInfo[item.name] ? 'has':'no-has']">
        <div slot="title">
          <h3>
            <span class="index-name">{{item.name}}</span>
            <span v-if="hasCount[item.name]" class="has-count">{{hasCount[item.name]}}</span>
            <span style="float: right" :class="numberClass(rateInfo[item.key])">{{rateInfo[item.key]}}%</span>
          </h3>
          <p class="explain">
            <span v-for="(subItem, index) in allInfo[item.key]" :key="subItem + index"
                  :class="subItem === '买'?'buy':subItem === '卖'?'sell':''">{{subItem}}</span>
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

export default {
  name: 'FixedInvestment',
  data () {
    let allInfo = {}
    let list = []
    let firstClass = {}
    let rateInfo = {}
    let hasInfo = {}
    let hasCount = {}
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
      firstClass[key] = ''
      rateInfo[key] = 0
      hasInfo[codeMap[key].name] = false
      hasCount[codeMap[key].name] = 0
    }
    return {
      list: list,
      allInfo: allInfo,
      firstClass,
      rateInfo: rateInfo,
      hasInfo,
      hasCount
    }
  },
  computed: {
  },
  mounted () {
    this.initPage()
  },
  methods: {
    initPage () {
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
      this.$http.getWithCache(`webData/${stockDataUtil.getAllUrl()}`, {
        code: item.code,
        days: 12
      }, {interval: 30}).then((data) => {
        if (data.success) {
          const list = data.data.list
          const info = formatData(list)
          const infoUtil = new InfoUtil(item)
          const recentNetValue = info.list
          let infoList = []
          let classInfo = ''
          // 近的在前
          for (let i = 0; i < 8; i++) {
            const nowRecord = recentNetValue[i]
            const oneDayRecord = recentNetValue[i + 1]
            const twoDayRecord = recentNetValue[i + 2]
            let buyFlag = infoUtil[fnMap[item.key + 'Buy']](nowRecord, oneDayRecord, twoDayRecord)
            if (i < 5) {
              if ((buyFlag === true) || (buyFlag !== false && buyFlag.flag === true)) {
                infoList[i] = '买'
                if (classInfo === '') {
                  classInfo = 'buy'
                }
              } else {
                infoList[i] = ''
              }
            } else {
              if ((buyFlag === true) || (buyFlag !== false && buyFlag.flag === true)) {
                if (classInfo === '') {
                  classInfo = 'buy'
                }
              }
            }
          }
          this.allInfo[item.key] = infoList
          let firstClass = ''
          if (infoList[0] === '买') {
            firstClass = 'buy'
          }
          this.firstClass[item.key] = firstClass
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
