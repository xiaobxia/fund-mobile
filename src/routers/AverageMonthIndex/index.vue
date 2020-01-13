<template>
  <div class="operating-info">
    <mt-header title="月线策略" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-cell-swipe v-for="(item) in list" :key="item.code" :class="item.lock ? 'duo': (item.averageDiff>0?'leguan':'kong')">
        <div slot="title">
          <h3>
            {{item.name}}
            <span style="float: right" :class="stockNumberClass(item.averageDiff)">{{item.averageDiff}}%</span>
          </h3>
        </div>
      </mt-cell-swipe>
    </div>
  </div>
</template>

<script>
import indexList from '@/common/indexList.js'
import storageUtil from '@/util/storageUtil.js'
import stockApiUtil from '@/util/stockApiUtil.js'
import stockAnalysisUtil from '@/util/stockAnalysisUtil.js'

export default {
  name: 'AverageMonthIndex',
  data () {
    let list = []
    indexList.forEach((item) => {
      list.push({
        ...item,
        averageDiff: 0,
        lock: false
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
      this.$http.getWithCache(`stock/${stockApiUtil.getAllUrl()}`, {
        code: item.code,
        days: 30
      }, {interval: 20}).then((data) => {
        if (data.success) {
          const list = data.data.list
          let averageList = []
          // 近的在前
          for (let i = 0; i < 6; i++) {
            averageList.push(this.countDiff(list, i))
          }
          averageList.reverse()
          // 20线偏离度
          const averageDiff = averageList[averageList.length - 1]
          item.averageDiff = averageDiff
          let lock = stockAnalysisUtil.ifNoSell(averageList)
          // // 移动均线策略
          // let now = 0
          // let last = 0
          // // 近的在前
          // for (let i = 0; i < 7; i++) {
          //   now += parseFloat(list[i].kline.close)
          // }
          // for (let j = 1; j < 8; j++) {
          //   last += parseFloat(list[j].kline.close)
          // }
          // const diff = this.countDifferenceRate(now / 7, last / 7)
          // if (diff < 0.2) {
          //   lock = false
          // }
          item.lock = lock
          // 保存锁仓信息
          storageUtil.setData('noSell', item.key, lock)
          storageUtil.setData('averageMonth', item.key, averageDiff)
        }
      })
    },
    // 20线偏离度计算
    countDiff (list, index) {
      let now = 0
      // 近的在前
      for (let i = index; i < (20 + index); i++) {
        now += parseFloat(list[i].kline.close)
      }
      return this.countDifferenceRate(parseFloat(list[index].kline.close), now / 20)
    },
    backHandler () {
      this.$router.history.go(-1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
