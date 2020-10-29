<template>
  <div class="page-manual">
    <mt-header title="助理" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-button type="primary" @click="xiaban" class="main-btn">下班</mt-button>
    </div>
  </div>
</template>

<script>
import {Indicator} from 'mint-ui'

export default {
  name: 'Ast',
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
    xiaban () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('http://47.98.140.76:3031/daka/xiaban').then(() => {
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
