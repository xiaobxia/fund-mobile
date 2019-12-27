<template>
  <div class="today-index">
    <mt-header title="指数月收益" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-cell-swipe v-for="(item, index) in list" :key="item.code" :class="{'has-back': item.mix, my: item.key==='my'}">
        <div slot="title">
          <h3>
            <span class="name">{{item.name}}</span>
            <span class="paiming">{{index + 1}}</span>
            <span style="float: right" :class="stockNumberClass(item.netChangeRatio)">{{item.netChangeRatio}}%</span>
          </h3>
        </div>
      </mt-cell-swipe>
    </div>
  </div>
</template>

<script>
import indexListAll from '@/common/indexListAll.js'
import storageUtil from '@/util/storageUtil.js'

export default {
  name: 'MonthIncome',
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
      myNetChangeRatio: 0
    }
  },
  beforeDestroy () {
  },
  created () {
    this.initPage()
    this.$http.get('userFund/getUserNetValueNowMonthNetChangeRatio').then((res) => {
      this.myNetChangeRatio = res.data.netChangeRatio
      return this.initPage()
    }).then(() => {
      this.list.push({
        key: 'my',
        name: '我的',
        netChangeRatio: this.myNetChangeRatio,
        rank: 0
      })
      this.sortChangeHandler()
    })
  },
  methods: {
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
      return this.$http.getWithCache(`stock/getStockPriceNowMonthNetChangeRatio`, {
        code: item.code
      }, {interval: 20}).then((data) => {
        if (data.success) {
          const netChangeRatio = parseFloat(data.data.netChangeRatio)
          item.netChangeRatio = netChangeRatio
          // 指数大我多少
          const diff = netChangeRatio - this.myNetChangeRatio
          storageUtil.setData('monthIndexDiff', item.key, diff)
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
