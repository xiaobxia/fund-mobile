<template>
  <div class="operating-info">
    <mt-header title="年线" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-cell-swipe v-for="(item) in list" :key="item.code">
        <div slot="title">
          <h3>
            {{item.name}}
            <span v-if="item.jinmai" class="fm-tag s-black">禁</span>
            <span style="float: right" :class="stockNumberClass(item.diff)">{{item.diff}}%</span>
          </h3>
        </div>
      </mt-cell-swipe>
    </div>
  </div>
</template>

<script>
import storageUtil from '@/util/storageUtil.js'
import stockApiUtil from '@/util/stockApiUtil.js'
import indexList from '@/common/indexList.js'

export default {
  name: 'AverageYearIndex',
  data () {
    let list = []
    indexList.forEach((item) => {
      list.push({
        ...item,
        diff: 0,
        jinmai: false
      })
    })
    return {
      list: list
    }
  },
  computed: {
  },
  beforeDestroy () {
  },
  created () {
    this.initPage()
  },
  methods: {
    initPage () {
      let queryList = []
      let list = this.list
      for (let i = 0; i < list.length; i++) {
        queryList.push(this.queryData(list[i]))
      }
      Promise.all(queryList)
    },
    queryData (item) {
      return this.$http.getWithCache(`stock/${stockApiUtil.getTodayUrl()}`, {
        code: item.code
      }, {interval: 20}).then((data) => {
        if (data.success) {
          if (this.tradeTime === '') {
            this.tradeTime = data.data.tradeTime
          }
          storageUtil.setData('indexNowClose', item.key, data.data.close)
          const averageYear = storageUtil.getData('yearAverageIndex', item.key)
          const diff = this.countDifferenceRate(data.data.close, averageYear)
          item.diff = diff
          const niuxiong = storageUtil.getData('stockIndexFlag', item.key)
          if (niuxiong === '禁买') {
            item.jinmai = true
          }
          const updateData = {}
          storageUtil.setData('yearAverageIndexDiff', item.key, diff)
          if (diff >= item.topLine) {
            storageUtil.setData('stockIndexIsTop', item.key, true)
            updateData.status = '顶部'
          } else {
            storageUtil.setData('stockIndexIsTop', item.key, false)
          }
          const rawStatus = storageUtil.getData('stockIndexStatus', item.key)
          if ((rawStatus === '探底' || rawStatus === '定投') && diff >= 0) {
            updateData.status = '正常'
          }
          if (diff >= item.cutDownLine) {
            storageUtil.setData('stockIndexTopClose', item.key, 0)
            updateData.cut_down = '开启'
            updateData.top_close = 0
          }
          if (updateData.status || updateData.cut_down) {
            this.updateStockIndex(item.key, updateData)
          }
        }
      })
    },
    backHandler () {
      this.$router.history.go(-1)
    },
    updateStockIndex (key, value) {
      this.$http.post('stock/updateStockIndex', {
        key: key,
        ...value
      }).then((data) => {
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
