<template>
  <div class="operating-info">
    <mt-header title="半年线策略" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-cell-swipe v-for="(item) in list" :key="item.code">
        <div slot="title">
          <h3>
            {{item.name}}
            <span style="float: right" :class="stockNumberClass(item.netChangeRatio)">{{item.netChangeRatio}}%</span>
          </h3>
        </div>
      </mt-cell-swipe>
    </div>
  </div>
</template>

<script>
import indexList from '@/common/indexList.js'
import storageUtil from '@/util/storageUtil.js'

export default {
  name: 'AverageHalfYearIndex',
  data () {
    let list = []
    indexList.forEach((item) => {
      list.push({
        ...item,
        netChangeRatio: 0
      })
    })
    return {
      list
    }
  },
  computed: {
  },
  created () {
    this.initPage()
  },
  methods: {
    initPage () {
      let list = this.list
      for (let i = 0; i < list.length; i++) {
        this.queryData(list[i])
      }
    },
    queryData (item) {
      this.$http.getWithCache(`stock/getStockPriceAverageByDay`, {
        code: item.code,
        days: 120
      }, {interval: 20}).then((data) => {
        if (data.success) {
          const diff = data.data
          item.netChangeRatio = diff
          storageUtil.setData('averageHalfYearIndex', item.key, diff)
          if (diff <= item.fixLine) {
            this.updateStockIndex(item.key, '定投')
          }
        }
      })
    },
    backHandler () {
      this.$router.history.go(-1)
    },
    updateStockIndex (key, value) {
      const d = this.getDate()
      const hour = d.getHours()
      const minute = d.getMinutes()
      if (hour >= 14 && minute >= 40) {
        this.$http.post('stock/updateStockIndex', {
          key: key,
          flag: value
        }).then((data) => {
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
