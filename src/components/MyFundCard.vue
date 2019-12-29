<template>
  <div class="card">
    <h3 class="title">{{title}} <span :class="stockNumberClass(totalChangeRatio)">{{totalChangeRatio}}%</span><span style="float: right">{{totalCount}}</span></h3>
    <mt-cell-swipe v-for="(item) in listData" :key="item.code" :to="'/page/fundDetail?type=edit&code='+item.code"
                   >
      <div slot="title">
        <h3>
          {{item.code}}
          {{formatFundName(item.name, 11)}}
          <i class="fm-icon lock" v-if="item.ifAllLock"></i>
          <span style="float: right" :class="stockNumberClass(countDifferenceRate(item.valuationSum, item.sum))">{{countDifferenceRate(item.valuationSum, item.sum)}}%</span>
        </h3>
        <p class="explain">
          <span class="item">
            <span class="label">持仓成本：</span>
            <span class="value">{{parseInt(item.costSum)}}</span>
          </span>
          <span class="item">
            <span class="label">持仓金额：</span>
            <span class="value">{{item.sum}}</span>
          </span>
          <span class="item">
            <span class="label">估算收益：</span>
            <span class="value">
              <span :class="stockNumberClass(keepTwoDecimals(item.valuationSum-item.sum))">{{keepTwoDecimals(item.valuationSum-item.sum)}}</span>
            </span>
          </span>
          <span class="item">
            <span class="label">估算金额：</span>
            <span class="value">{{item.valuationSum}}</span>
          </span>
          <span class="item">
            <span class="label">总收益：</span>
            <span class="value">
              <span :class="stockNumberClass(keepTwoDecimals(item.valuationSum-item.costSum))">{{keepTwoDecimals(item.valuationSum-item.costSum)}}</span>
            </span>
          </span>
          <span class="item">
            <span class="label">总收益率：</span>
            <span class="value">
              <span :class="stockNumberClass(countDifferenceRate(item.valuationSum, item.costSum))">{{countDifferenceRate(item.valuationSum, item.costSum)}}%</span>
            </span>
          </span>
        </p>
      </div>
      <div class="right-wrap">
      </div>
    </mt-cell-swipe>
  </div>
</template>
<script>

export default{
  name: 'MyFundCard',
  data () {
    return {}
  },
  computed: {
    // 模块持有金额
    totalCount () {
      let count = 0
      const listData = this.listData
      for (let i = 0; i < listData.length; i++) {
        count += listData[i].sum
      }
      return Math.round(count)
    },
    // 模块的总波动
    totalChangeRatio () {
      let valuation = 0
      let sum = 0
      for (let i = 0; i < this.listData.length; i++) {
        valuation += this.listData[i].valuationSum
        sum += this.listData[i].sum
      }
      return this.countDifferenceRate(valuation, sum)
    }
  },
  props: {
    listData: Array,
    title: String
  },
  created () {
  },
  methods: {
  }
}
</script>
<style>
</style>
