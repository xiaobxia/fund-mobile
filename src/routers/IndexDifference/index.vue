<template>
  <div class="operating-info">
    <mt-header title="均线策略" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-cell-swipe v-for="(item) in list" :key="item.code">
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
  name: 'AverageIndex',
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
        fixLine: codeMap[key].fixLine,
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
      this.$http.getWithCache(`stock/getStockPriceAverage`, {
        code: item.code,
        days: 120
      }, {interval: 30}).then((data) => {
        if (data.success) {
          const diff = data.data
          this.diffInfo[item.key] = diff
          storageUtil.setQuarterAverage(item.key, diff)
          if (diff <= item.fixLine) {
            this.onNiuXiongChangeHandler(item.key, '定投')
          }
        }
      })
    },
    backHandler () {
      this.$router.history.go(-1)
    },
    onNiuXiongChangeHandler (key, value) {
      this.$http.post('market/updateIndexNiuXiong', {
        key: key,
        value: value
      }).then((data) => {
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
