<template>
  <div class="operating-info">
    <mt-header title="月线策略" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-cell-swipe v-for="(item) in list" :key="item.code" :class="lockInfo[item.key] ? 'duo': (diffInfo[item.key]>0?'leguan':'kong')">
        <div slot="title">
          <h3>
            {{item.name}}
            <span style="float: right" :class="numberClass(diffInfo[item.key])">{{diffInfo[item.key]}}%</span>
          </h3>
        </div>
      </mt-cell-swipe>
    </div>
  </div>
</template>

<script>
import indexInfoUtilXiong from '@/util/indexInfoUtilXiong.js'
import stockDataUtil from '@/util/stockDataUtil.js'
import storageUtil from '@/util/storageUtil.js'
import operatingTooltip from '@/util/operatingTooltip.js'

const codeMap = indexInfoUtilXiong.codeMap

export default {
  name: 'AverageMonthIndex',
  data () {
    let diffInfo = {}
    let lockInfo = {}
    let list = []
    for (let key in codeMap) {
      list.push({
        key: key,
        code: codeMap[key].code,
        name: codeMap[key].name,
        threshold: codeMap[key].threshold,
        wave: codeMap[key].wave,
        rate: codeMap[key].rate,
        average: codeMap[key].average,
        sortRate: 0
      })
      diffInfo[key] = 0
      lockInfo[key] = false
    }
    return {
      list: list,
      diffInfo: diffInfo,
      lockInfo: lockInfo
    }
  },
  computed: {
  },
  mounted () {
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
      this.$http.getWithCache(`webData/${stockDataUtil.getAllUrl()}`, {
        code: item.code,
        days: 30
      }, {interval: 30}).then((data) => {
        if (data.success) {
          const list = data.data.list
          let averageList = []
          // 近的在前
          for (let i = 0; i < 5; i++) {
            averageList.push(this.countDiff(list, i))
          }
          averageList.reverse()
          this.diffInfo[item.key] = averageList[averageList.length - 1]
          let lock = operatingTooltip.ifNoSell(averageList)
          // 移动均线策略
          let now = 0
          let last = 0
          // 近的在前
          for (let i = 0; i < 7; i++) {
            now += parseFloat(list[i].kline.close)
          }
          for (let j = 1; j < 8; j++) {
            last += parseFloat(list[j].kline.close)
          }
          const diff = this.countDifferenceRate(now / 7, last / 7)
          if (diff < 0.2) {
            lock = false
          }
          this.lockInfo[item.key] = lock
          storageUtil.setNoSell(item.key, lock)
          storageUtil.setMonthAverage(item.key, averageList[averageList.length - 1])
        }
      })
    },
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
