<template>
  <div>
    <mt-header title="大V观点" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div class="r">
        <div>今年整体会有结构牛，因子1.2</div>
      </div>
    </div>
  </div>
</template>

<script>
import {Indicator} from 'mint-ui'

export default {
  name: 'DaV',
  data () {
    return {
    }
  },
  watch: {
  },
  created () {
  },
  methods: {
    backHandler () {
      this.$router.history.go(-1)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .to {
    margin-bottom: 60px;
  }
  .r {
    padding: 20px;
    div {
      margin-bottom: 10px;
    }
  }
</style>
