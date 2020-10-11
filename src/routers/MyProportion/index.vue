<template>
  <div class="page-my-proportion">
    <mt-header title="持仓占比" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div class="detail-info-wrap">
        <span class="item">
          <span class="label">总资金：</span>
          <span class="value">{{$formatMoney(asset)}}</span>
        </span>
        <span class="item">
          <span class="label">总持仓：</span>
          <span class="value">{{$formatMoney(totalSum)}}</span>
        </span>
        <span class="item">
          <span class="label">定投资金：</span>
          <span class="value">{{$formatMoney(fixTotal)}}</span>
        </span>
        <span class="item">
          <span class="label">定投成本：</span>
          <span class="value">{{$formatMoney(fixTotalCost)}}</span>
        </span>
        <span class="item">
          <span class="label">定投收益：</span>
          <span class="value">
            <span :class="stockNumberClass(fixTotal-fixTotalCost)">{{$formatMoney(fixTotal-fixTotalCost)}}</span>
          </span>
        </span>
        <span class="item">
          <span class="label">定投收益率：</span>
          <span class="value">
            <span :class="stockNumberClass(fixTotal-fixTotalCost)">{{countDifferenceRate(fixTotal, fixTotalCost)}}%</span>
          </span>
        </span>
        <span class="item">
          <span class="label">年定投：</span>
          <span class="value">{{$formatMoney(yearFix)}}</span>
        </span>
        <span class="item">
          <span class="label">年成本：</span>
          <span class="value">{{$formatMoney(yearFixCost)}}</span>
        </span>
        <span class="item">
          <span class="label">年定投收益：</span>
          <span class="value">
            <span :class="stockNumberClass(yearFix-yearFixCost)">{{$formatMoney(yearFix-yearFixCost)}}</span>
          </span>
        </span>
        <span class="item">
          <span class="label">年定投收益率：</span>
          <span class="value">
            <span :class="stockNumberClass(yearFix-yearFixCost)">{{countDifferenceRate(yearFix, yearFixCost)}}%</span>
          </span>
        </span>
        <span class="item">
          <span class="label">月定投：</span>
          <span class="value">{{$formatMoney(monthFix)}}</span>
        </span>
        <span class="item">
          <span class="label">月成本：</span>
          <span class="value">{{$formatMoney(monthFixCost)}}</span>
        </span>
        <span class="item">
          <span class="label">月定投收益：</span>
          <span class="value">
            <span :class="stockNumberClass(monthFix-monthFixCost)">{{$formatMoney(monthFix-monthFixCost)}}</span>
          </span>
        </span>
        <span class="item">
          <span class="label">月定投收益率：</span>
          <span class="value">
            <span :class="stockNumberClass(monthFix-monthFixCost)">{{countDifferenceRate(monthFix, monthFixCost)}}%</span>
          </span>
        </span>
      </div>
      <div class="warn-wrap">
        <div class="fm-warn yellow">配比：混合25%，定投25%，波段50%</div>
        <div class="fm-warn blue">黄金再怎么乐观也不要超过2.5%</div>
      </div>
      <div style="position: absolute;width: 100%">
        <div class="content">
          <p>定投
            <span class="rate" style="float: right;text-align: right">
            <span class="m-wi">{{$formatMoney(fixSum)}}</span>
            <span class="r-wi">{{countRate(fixTotal,asset)}}</span>
            <span :class="stockNumberClass(fixTotal-fixSum)">
              <span class="r-wi">{{countDifferenceRate(fixTotal, fixSum)}}</span>
              <span class="r-wi">{{$formatMoney(fixTotal-fixSum)}}</span>
            </span>
          </span>
          </p>
          <div class="proportion-item">
            <div v-for="(item, index) in fixList" :key="index" class="proportion-item">
              <div class="title">
                {{item.name}}
                <span class="rate" style="text-align: right">
                   <span class="m-wi">{{$formatMoney(item.sum)}}</span>
                  <span  class="r-wi">{{item.proportion}}</span>
                  <span :class="stockNumberClass(item.rate)">
                    <span class="r-wi">{{item.rate}}</span>
                    <span class="r-wi">{{$formatMoney(item.diff)}}</span>
                  </span>
                </span>
              </div>
              <mt-progress :value="item.proportion" :bar-height="barHeight"></mt-progress>
            </div>
          </div>
        </div>
        <div class="warn-wrap">
          <div class="fm-warn blue">波段标准{{parseFloat(60/24)}}%</div>
        </div>
        <div class="content">
          <p>波段
            <span class="rate" style="float: right;text-align: right">
              <span class="m-wi">{{$formatMoney(bandSum)}}</span>
              <span class="r-wi">{{countRate(bandTotal,asset)}}</span>
              <span :class="stockNumberClass(bandTotal-bandSum)">
                <span class="r-wi">{{countDifferenceRate(bandTotal, bandSum)}}</span>
                <span class="r-wi">{{$formatMoney(bandTotal-bandSum)}}</span>
              </span>
            </span>
          </p>
          <div v-for="(item, index) in list" :key="index" class="proportion-item">
            <div class="title">
              {{item.name}}
              <span v-if="ifLaji(item.name)" class="fm-tag green">垃圾</span>
              <span v-if="ifJigou(item.name)" class="fm-tag red">机构</span>
              <span class="rate" style="text-align: right">
                <span class="m-wi">{{$formatMoney(item.sum)}}</span>
                <span class="r-wi">{{item.proportion}}</span>
                <span :class="stockNumberClass(item.rate)">
                  <span class="r-wi">{{item.rate}}</span>
                  <span class="r-wi">{{$formatMoney(item.diff)}}</span>
                </span>
              </span>
            </div>
            <mt-progress :value="item.proportion" :bar-height="barHeight"></mt-progress>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import indexList from '@/common/indexList.js'
import indexType from '@/common/indexType.js'
import storageUtil from '@/util/storageUtil.js'

const jigouName = indexType.jigouName
const lajiName = indexType.lajiName

const zoom = window.adaptive.zoom
export default{
  name: 'MyProportion',
  data () {
    let distribution = {}
    let distributionSum = {}
    indexList.forEach((item) => {
      distribution[item.name] = 0
      distributionSum[item.name] = 0
    })
    const fixList = ['创业', '50', '300', '500', '1000', '白酒', '医疗', '生物', '混合']
    let fixDistribution = {}
    let fixDistributionSum = {}
    fixList.forEach((item) => {
      fixDistribution[item] = 0
      fixDistributionSum[item] = 0
    })
    return {
      distribution,
      distributionSum,
      fixDistribution,
      fixDistributionSum,
      totalSum: 0,
      barHeight: 12 * zoom,
      fixTotalCost: 0,
      fixTotal: 0,
      fixSum: 0,
      monthFixCost: 0,
      bandTotal: 0,
      bandSum: 0,
      monthFix: 0,
      yearFix: 0,
      yearFixCost: 0,
      list: [],
      fixList: [],
      asset: 0
    }
  },
  computed: {
  },
  created () {
    const userFundAccountInfo = storageUtil.getData('userAccountInfo')
    this.asset = userFundAccountInfo.asset || 0
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
          let bandTotal = 0
          let bandSum = 0
          let monthFix = 0
          let fixTotal = 0
          let fixSum = 0
          let fixTotalCost = 0
          let monthFixCost = 0
          let yearFix = 0
          let yearFixCost = 0
          for (let i = 0; i < list.length; i++) {
            const item = list[i]
            totalSum += item.valuationSum
            if (item.theme) {
              if (item.strategy === '1') {
                // 波段部分
                if (this.distribution[item.theme]) {
                  this.distribution[item.theme] += parseInt(item.valuationSum)
                } else {
                  this.distribution[item.theme] = parseInt(item.valuationSum)
                }
                if (this.distributionSum[item.theme]) {
                  this.distributionSum[item.theme] += parseInt(item.sum)
                } else {
                  this.distributionSum[item.theme] = parseInt(item.sum)
                }
                bandTotal += parseInt(item.valuationSum)
                bandSum += parseInt(item.sum)
              } else {
                // 定投部分
                fixTotal += item.valuationSum
                fixTotalCost += item.costSum
                fixSum += item.sum
                if (this.fixDistribution[item.theme]) {
                  this.fixDistribution[item.theme] += parseInt(item.valuationSum)
                } else {
                  this.fixDistribution[item.theme] = parseInt(item.valuationSum)
                }
                if (this.fixDistributionSum[item.theme]) {
                  this.fixDistributionSum[item.theme] += parseInt(item.sum)
                } else {
                  this.fixDistributionSum[item.theme] = parseInt(item.sum)
                }
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
            } else {
              // 没有主题就是混合
              // 混合也是定投部分
              fixTotal += item.valuationSum
              fixTotalCost += item.costSum
              fixSum += item.sum
              if (this.fixDistribution['混合']) {
                this.fixDistribution['混合'] += parseInt(item.valuationSum)
              } else {
                this.fixDistribution['混合'] = parseInt(item.valuationSum)
              }
              if (this.fixDistributionSum['混合']) {
                this.fixDistributionSum['混合'] += parseInt(item.sum)
              } else {
                this.fixDistributionSum['混合'] = parseInt(item.sum)
              }
            }
          }
          let proportionList = []
          for (let name in this.distribution) {
            if (this.distribution[name]) {
              proportionList.push({
                name: name,
                proportion: this.countRate(this.distribution[name], this.asset),
                rate: this.countDifferenceRate(this.distribution[name], this.distributionSum[name]),
                diff: parseInt(this.distribution[name] - this.distributionSum[name]),
                sum: parseInt(this.distributionSum[name])
              })
            } else {
              proportionList.push({
                name: name,
                proportion: 0,
                rate: 0,
                diff: 0,
                sum: 0
              })
            }
          }
          proportionList.sort((a, b) => {
            return b.proportion - a.proportion
          })
          let fixProportionList = []
          for (let name in this.fixDistribution) {
            if (this.fixDistribution[name]) {
              fixProportionList.push({
                name: name,
                proportion: this.countRate(this.fixDistribution[name], this.asset),
                rate: this.countDifferenceRate(this.fixDistribution[name], this.fixDistributionSum[name]),
                diff: parseInt(this.fixDistribution[name] - this.fixDistributionSum[name]),
                sum: parseInt(this.fixDistributionSum[name])
              })
            } else {
              fixProportionList.push({
                name: name,
                proportion: 0,
                rate: 0,
                diff: 0,
                sum: 0
              })
            }
          }
          fixProportionList.sort((a, b) => {
            return b.proportion - a.proportion
          })
          this.totalSum = totalSum
          this.bandTotal = bandTotal
          this.bandSum = bandSum
          this.fixTotal = fixTotal
          this.fixSum = fixSum
          this.fixTotalCost = fixTotalCost
          this.monthFix = monthFix
          this.monthFixCost = monthFixCost
          this.yearFix = yearFix
          this.yearFixCost = yearFixCost
          this.list = proportionList
          this.fixList = fixProportionList
        }
      })
    },
    backHandler () {
      this.$router.history.go(-1)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .r-wi {
    display: inline-block;
    width: 4em;
  }
  .m-wi {
    display: inline-block;
    width: 5em;
  }
</style>
