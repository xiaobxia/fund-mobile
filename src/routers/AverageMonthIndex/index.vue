<template>
  <div class="operating-info">
    <mt-header title="月线策略" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-cell-swipe v-for="(item) in list" :key="item.code" :class="diffInfo[item.key] >= item.average ? 'duo': (diffInfo[item.key]>0?'leguan':'kong')">
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

const codeMap = indexInfoUtilXiong.codeMap

export default {
  name: 'AverageMonthIndex',
  data () {
    let diffInfo = {}
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
    }
    return {
      list: list,
      diffInfo: diffInfo
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
        days: 21
      }, {interval: 30}).then((data) => {
        if (data.success) {
          const list = data.data.list
          let now = 0
          // 近的在前
          for (let i = 0; i < 20; i++) {
            now += parseFloat(list[i].kline.close)
          }
          const diff = this.countDifferenceRate(parseFloat(list[0].kline.close), now / 20)
          this.diffInfo[item.key] = diff
          storageUtil.setMonthAverage(item.key, diff)
        }
      })
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
