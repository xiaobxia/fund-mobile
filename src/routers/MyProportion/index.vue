<template>
  <div class="page-my-proportion">
    <mt-header title="持仓占比" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div class="content info">
        <span class="item">当前资金：{{todayAsset}}</span>
        <span class="item">当前持仓：{{parseInt(totalSum)}}</span>
        <span class="item">波段资金：{{otherTotal}}</span>
        <span class="item"></span>
        <span class="item">总定投：{{fixTotal}}<span :class="numberClass(fixTotal-fixTotalCost)">{{parseInt(fixTotal-fixTotalCost)}}</span></span>
        <span class="item">总成本：{{parseInt(fixTotalCost)}}</span>
        <span class="item">年定投：{{parseInt(yearFix)}}<span :class="numberClass(yearFix-yearFixCost)">{{parseInt(yearFix-yearFixCost)}}</span></span>
        <span class="item">年成本：{{parseInt(yearFixCost)}}</span>
        <span class="item">月定投：{{parseInt(monthFix)}}<span :class="numberClass(monthFix-monthFixCost)">{{parseInt(monthFix-monthFixCost)}}</span></span>
        <span class="item">月成本：{{parseInt(monthFixCost)}}</span>
      </div>
      <div class="content">
        <p>定投资金占比</p>
        <div class="proportion-item">
          <div class="title">定投<span class="rate">{{parseInt((fixTotal/todayAsset) * 100)}}%</span></div>
          <mt-progress :value="parseInt((fixTotal/todayAsset) * 100)" :bar-height="barHeight"></mt-progress>
        </div>
      </div>
      <div class="content">
        <p>波段主题分布</p>
        <div v-for="(item, index) in list" :key="index" class="proportion-item">
          <div class="title">{{item.name}}<span v-if="ifLaji(item.name)" class="tag laji">垃圾</span><span v-if="ifJigou(item.name)" class="tag jigou">机构</span><span class="rate">{{item.proportion}}%</span></div>
          <mt-progress :value="item.proportion" :bar-height="barHeight"></mt-progress>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import indexInfoUtilXiong from '@/util/indexInfoUtilXiong.js'
import storageUtil from '@/util/storageUtil.js'
import operatingTooltip from '@/util/operatingTooltip.js'

const jigouName = operatingTooltip.jigouName
const lajiName = operatingTooltip.lajiName

const codeMap = indexInfoUtilXiong.codeMap

const zoom = window.adaptive.zoom
export default{
  name: 'MyProportion',
  data () {
    const userFundAccountInfo = storageUtil.getUserFundAccountInfo()
    let distribution = {}
    for (let key in codeMap) {
      distribution[codeMap[key].name] = 0
    }
    return {
      distribution,
      totalSum: 0,
      barHeight: 30 * zoom,
      fixTotalCost: 0,
      fixTotal: 0,
      monthFixCost: 0,
      otherTotal: 0,
      monthFix: 0,
      yearFix: 0,
      yearFixCost: 0,
      list: [],
      todayAsset: userFundAccountInfo.today_asset
    }
  },
  computed: {
  },
  mounted () {
    this.queryRecord()
  },
  methods: {
    ifJigou (key) {
      return jigouName.indexOf(key) !== -1
    },
    ifLaji (key) {
      return lajiName.indexOf(key) !== -1
    },
    queryRecord () {
      this.$http.get('userFund/getUserFunds').then((data) => {
        if (data.success) {
          const list = data.data.list
          let totalSum = 0
          let otherTotal = 0
          let monthFix = 0
          let fixTotalCost = 0
          let monthFixCost = 0
          let yearFix = 0
          let yearFixCost = 0
          for (let i = 0; i < list.length; i++) {
            const item = list[i]
            totalSum += item.valuationSum
            if (item.theme) {
              if (item.strategy === '1') {
                if (this.distribution[item.theme]) {
                  this.distribution[item.theme] += parseInt(item.valuationSum)
                } else {
                  this.distribution[item.theme] = parseInt(item.valuationSum)
                }
                otherTotal += parseInt(item.valuationSum)
              } else {
                if (this.distribution['定投']) {
                  this.distribution['定投'] += parseInt(item.valuationSum)
                } else {
                  this.distribution['定投'] = parseInt(item.valuationSum)
                }
                fixTotalCost += item.costSum
                item.position_record.forEach((record) => {
                  if (moment().isSame(record.confirm_date, 'month')) {
                    monthFixCost += record.costSum
                    monthFix += record.valuationSum
                  }
                  if (moment().isSame(record.confirm_date, 'year')) {
                    yearFixCost += record.costSum
                    yearFix += record.valuationSum
                  }
                })
              }
            }
          }
          this.totalSum = totalSum
          this.otherTotal = otherTotal
          let proportionList = []
          for (let key in codeMap) {
            if (this.distribution[codeMap[key].name]) {
              proportionList.push({
                name: codeMap[key].name,
                proportion: this.keepTwoDecimals(100 * this.distribution[codeMap[key].name] / otherTotal)
              })
            } else {
              proportionList.push({
                name: codeMap[key].name,
                proportion: 0
              })
            }
          }
          // proportionList.push({
          //   name: '定投',
          //   proportion: this.keepTwoDecimals(100 * this.distribution['定投'] / totalSum)
          // })
          this.fixTotal = this.distribution['定投']
          proportionList.sort((a, b) => {
            return b.proportion - a.proportion
          })
          this.monthFix = monthFix
          this.fixTotalCost = fixTotalCost
          this.monthFixCost = monthFixCost
          this.monthFix = monthFix
          this.monthFixCost = monthFixCost
          this.list = proportionList
        }
      })
    },
    backHandler () {
      this.$router.history.go(-1)
    }
  }
}
</script>
<style>
</style>
