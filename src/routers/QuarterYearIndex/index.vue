<template>
  <div class="operating-info">
    <mt-header title="季年线策略" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div class="warn-wrap">
        <div class="fm-warn blue">很多指数在季度年下，确实危险，可以转30日半年线</div>
      </div>
      <mt-cell-swipe v-for="(item) in list" :key="item.code" :class="item.kong ? 'kong':''">
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
  name: 'QuarterYearIndex',
  data () {
    let list = []
    indexList.forEach((item) => {
      list.push({
        ...item,
        netChangeRatio: 0,
        kong: false
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
      const yearDiff = storageUtil.getData('yearAverageIndexDiff', item.key) || 0
      const quarterClose = storageUtil.getData('indexQuarterClose', item.key) || 1
      const yearClose = storageUtil.getData('yearAverageIndex', item.key) || 1
      const diff = this.countDifferenceRate(quarterClose, yearClose)
      item.netChangeRatio = diff
      if (yearDiff > 0) {
        item.kong = diff < 0
      } else {
        item.kong = diff < 2
      }
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
