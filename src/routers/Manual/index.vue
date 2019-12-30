<template>
  <div class="page-manual">
    <mt-header title="手动" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-button type="primary" @click="updateUserAsset" class="main-btn">更新用户资产</mt-button>
      <mt-button type="primary" @click="reInitPreNetValue" class="main-btn">重新初始化pre_net_value</mt-button>
      <mt-button type="primary" @click="verifyMarketOpening" class="main-btn">验证股票开盘</mt-button>
      <mt-button type="primary" @click="openWork" class="main-btn">开盘工作</mt-button>
      <mt-button type="primary" @click="updateFundBaseInfo" class="main-btn">更新基金净值</mt-button>
      <mt-button type="primary" @click="updateValuation" class="main-btn">更新基金估值</mt-button>
      <mt-button type="primary" @click="updateFixYearAverage" class="main-btn">更新定投年线</mt-button>
      <mt-button type="primary" @click="closeWork" class="main-btn">闭市工作</mt-button>
      <mt-button type="primary" @click="addStockPrice" class="main-btn">添加最新股票数据</mt-button>
    </div>
  </div>
</template>

<script>
import {Indicator} from 'mint-ui'

export default {
  name: 'Manual',
  data () {
    return {
    }
  },
  computed: {},
  watch: {
  },
  created () {
  },
  methods: {
    backHandler () {
      this.$router.history.go(-1)
    },
    verifyMarketOpening () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('stock/verifyStockMarketOpen').then(() => {
        Indicator.close()
      })
    },
    openWork () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('sys/stockOpenWork').then(() => {
        Indicator.close()
      })
    },
    updateFundBaseInfo () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('fund/updateAllFundBaseInfo').then(() => {
        Indicator.close()
      })
    },
    updateValuation () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('fund/updateValuation').then(() => {
        Indicator.close()
      })
    },
    updateFixYearAverage () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('stock/updateStockIndexYearAverage').then(() => {
        Indicator.close()
      })
    },
    closeWork () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('sys/stockCloseWork').then(() => {
        Indicator.close()
      })
    },
    reInitPreNetValue () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('sys/reInitPreNetValue').then(() => {
        Indicator.close()
      })
    },
    updateUserAsset () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('sys/updateUserAsset').then(() => {
        Indicator.close()
      })
    },
    addStockPrice () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('stock/addStockPrice').then(() => {
        Indicator.close()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .main-body {
    padding: 50px 20px 0 20px;
  }
</style>
