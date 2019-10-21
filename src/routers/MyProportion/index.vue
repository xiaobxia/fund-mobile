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
        <span class="item">定投资金：{{fixTotal}}</span>
        <span class="item">波段资金：{{otherTotal}}</span>
      </div>
      <div class="content">
        <p>定投资金占比</p>
        <div class="proportion-item">
          <div class="title">定投<span>{{parseInt((fixTotal/todayAsset) * 100)}}%</span></div>
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
      fixTotal: 0,
      otherTotal: 0,
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
          for (let i = 0; i < list.length; i++) {
            const item = list[i]
            totalSum += item.sum
            if (item.theme) {
              if (item.strategy === '1') {
                if (this.distribution[item.theme]) {
                  this.distribution[item.theme] += parseInt(item.sum)
                } else {
                  this.distribution[item.theme] = parseInt(item.sum)
                }
                otherTotal += parseInt(item.sum)
              } else {
                if (this.distribution['定投']) {
                  this.distribution['定投'] += parseInt(item.sum)
                } else {
                  this.distribution['定投'] = parseInt(item.sum)
                }
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
