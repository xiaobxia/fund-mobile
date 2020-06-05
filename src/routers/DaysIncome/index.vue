<template>
  <div class="today-index">
    <mt-header title="指数近期收益" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-field label="天数" placeholder="请输入天数" v-model="days"></mt-field>
      <mt-cell-swipe v-for="(item, index) in list" :key="item.code" :class="{'has-back': item.mix, my: item.key==='my'}">
        <div slot="title">
          <h3>
            <span class="name">{{item.name}}</span>
            <span class="paiming">{{index + 1}}</span>
            <span style="float: right" :class="stockNumberClass(item.netChangeRatio)">{{item.netChangeRatio}}%</span>
          </h3>
        </div>
      </mt-cell-swipe>
      <mt-button type="primary" @click="appInit" class="main-btn">计算</mt-button>
    </div>
  </div>
</template>

<script>
import indexListAll from '@/common/indexListAll.js'

export default {
  name: 'DaysIncome',
  data () {
    let list = []
    indexListAll.forEach((item) => {
      list.push({
        ...item,
        netChangeRatio: 0,
        rank: 0
      })
    })
    return {
      list,
      myNetChangeRatio: 0,
      days: 2
    }
  },
  beforeDestroy () {
  },
  created () {
    this.appInit()
  },
  methods: {
    appInit () {
      this.initPage().then(() => {
        this.sortChangeHandler()
      })
    },
    initPage () {
      // 最新的
      let queryList = []
      let list = this.list
      for (let i = 0; i < list.length; i++) {
        queryList.push(this.queryData(list[i]))
      }
      return Promise.all(queryList)
    },
    queryData (item) {
      if (!item.code) {
        return true
      }
      return this.$http.get(`stock/getStockPriceNetChangeRatioByDay`, {
        code: item.code,
        days: this.days
      }).then((data) => {
        if (data.success) {
          item.netChangeRatio = parseFloat(data.data.rate)
        }
      })
    },
    backHandler () {
      this.$router.history.go(-1)
    },
    sortChangeHandler () {
      this.list.sort((a, b) => {
        return b.netChangeRatio - a.netChangeRatio
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
