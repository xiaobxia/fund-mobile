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
            <span style="float: right" :class="stockNumberClass(item.diff)">{{item.diff}}%</span>
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

export default {
  name: 'AverageIndex',
  data () {
    let list = []
    indexList.forEach((item) => {
      list.push({
        ...item,
        diff: 0
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
      this.$http.get(`stock/${stockApiUtil.getAllUrl()}`, {
        code: item.code,
        days: 12
      }, {interval: 20}).then((data) => {
        if (data.success) {
          const list = data.data.list
          let now = 0
          let last = 0
          // 近的在前
          for (let i = 0; i < 8; i++) {
            now += parseFloat(list[i].kline.close)
          }
          for (let j = 1; j < 9; j++) {
            last += parseFloat(list[j].kline.close)
          }
          const diff = this.countDifferenceRate(now / 8, last / 8)
          item.diff = diff
          storageUtil.setData('averageIndex', item.key, diff)
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
