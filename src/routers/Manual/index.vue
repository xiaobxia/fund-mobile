<template>
  <div class="page-manual">
    <mt-header title="手动" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-button type="primary" @click="verifyMarketOpening" class="main-btn">验证股票开盘</mt-button>
      <mt-button type="primary" @click="openWork" class="main-btn">开盘准备</mt-button>
      <mt-button type="primary" @click="updateFundBaseInfo" class="main-btn">更新净值</mt-button>
      <mt-button type="primary" @click="betterValuation" class="main-btn">更新估值源</mt-button>
      <mt-button type="primary" @click="updateValuation" class="main-btn">更新估值</mt-button>
      <mt-button type="primary" @click="updateRate" class="main-btn">更新涨跌幅</mt-button>
      <mt-button type="primary" @click="updateFundBuySellRate" class="main-btn">更新买卖费率</mt-button>
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
  mounted () {
  },
  methods: {
    backHandler () {
      this.$router.history.go(-1)
    },
    verifyMarketOpening () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('schedule/verifyMarketOpening').then(() => {
        Indicator.close()
      })
    },
    openWork () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('schedule/openWork').then(() => {
        Indicator.close()
      })
    },
    updateFundBaseInfo () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('schedule/updateFundBaseInfo').then(() => {
        Indicator.close()
      })
    },
    betterValuation () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('schedule/betterValuation').then(() => {
        Indicator.close()
      })
    },
    updateValuation () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('schedule/updateValuation').then(() => {
        Indicator.close()
      })
    },
    updateRate () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('schedule/updateRate').then(() => {
        Indicator.close()
      })
    },
    updateFundBuySellRate () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('schedule/updateFundBuySellRate').then(() => {
        Indicator.close()
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
