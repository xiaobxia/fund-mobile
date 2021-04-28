<template>
  <div>
    <mt-header title="比特币" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div>日线是从8点开始的</div>
      <div class="r">
        <div>比特币当前价：{{btbClose}}</div>
      </div>
      <div class="r">
        <div>以太坊当前价：{{ethClose}}</div>
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
      btbClose: 0,
      ethClose: 0
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
        this.btbClose = now.close
      })
    },
    queryETHKlines () {
      return this.$http.get('stock/getETHKlines').then((res) => {
        const list = res.data || []
        const now = list[list.length - 1]
        this.ethClose = now.close
      })
    },
    backHandler () {
      this.$router.history.go(-1)
    },
    toEdit (item) {
      this.$router.push({
        path: '/page/myBtbAdd',
        query: {
          type: item.type
        }
      })
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
  .type-card {
    background-color: #eee;
    margin: 20px 0;
  }
</style>
