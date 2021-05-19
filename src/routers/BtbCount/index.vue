<template>
  <div>
    <mt-header title="监控" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div v-for="(item, index) in list" :key="index" class="r">
        <div>
          <van-row>
            <van-col span="12">
              <span>{{item.code}}</span>
            </van-col>
            <van-col span="12">
              <span>成交：{{item.sort_val || 0}}</span>
            </van-col>
          </van-row>
        </div>
        <div  :class="stockNumberClass(item.diff5To10_val)">
          <van-row>
            <van-col span="12">
              <span>diff5to10: {{getCount(item.diff5To10_val)}}</span>
            </van-col>
            <van-col span="12">
              <span>天数: {{item.diff5To10_days}}</span>
            </van-col>
          </van-row>
        </div>
        <div  :class="stockNumberClass(item.macd_val)">
          <van-row>
            <van-col span="12">
              <span>macd: {{getCount(item.macd_val)}}</span>
            </van-col>
            <van-col span="12">
              <span>天数: {{item.macd_days}}</span>
            </van-col>
          </van-row>
        </div>
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
      list: [],
      usdtAll: 0,
      proportionAll: 0
    }
  },
  watch: {
  },
  created () {
    this.$http.get('btbIndex/getBtbMonitor').then((res) => {
      const list = res.data || []
      list.forEach((v) => {
        let val = 0
        if (v.diff5To10_val > 0) {
          val = val + 1000
        }
        if (v.macd_val > 0) {
          val = val + 1000
        }
        v.val = val
      })
      list.sort((a, b) => {
        return b.val - a.val
      })
      this.list = list
    })
  },
  methods: {
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
    },
    usdtCountMoney (count) {
      const usdtMoney = parseFloat(this.usdtMoney || 0) || 0
      return parseInt((count) * usdtMoney)
    },
    getCount (val) {
      return val > 0 ? '正' : '负'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .to {
    margin-bottom: 60px;
  }
  .r {
    background-color: #eee;
    padding: 20px;
    margin-bottom: 10px;
    div {
      margin-bottom: 10px;
    }
  }
  .type-card {
    background-color: #eee;
    margin: 20px 0;
  }
</style>
