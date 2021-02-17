<template>
  <div>
    <mt-header title="比特币" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div class="r">
        <div>当前价：{{close}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {Indicator} from 'mint-ui'

export default {
  name: 'BtbIndex',
  data () {
    return {
      close: 0
    }
  },
  watch: {
  },
  created () {
    this.queryBtbKlines()
  },
  methods: {
    queryBtbKlines () {
      return this.$http.get('stock/getBtbKlines').then((res) => {
        const list = res.data || []
        const now = list[list.length - 1]
        this.close = now.close
      })
    },
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
