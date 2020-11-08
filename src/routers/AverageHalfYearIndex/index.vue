<template>
  <div class="operating-info">
    <mt-header title="半年线策略" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div class="warn-wrap">
        <div class="fm-warn blue">年线半年线本来还不错突然跌下来，那基本是买点，如果一波行情下来年线半年线基本就没超过7%过，而且时间也不长，那就危险了</div>
      </div>
      <mt-cell-swipe v-for="(item) in list" :key="item.code" :class="item.netChangeRatio < 0 ? 'kong':''">
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
          const diff = data.data.rate
          const close = data.data.close
          item.netChangeRatio = diff
          storageUtil.setData('averageHalfYearIndex', item.key, diff)
          storageUtil.setData('averageHalfYearIndexClose', item.key, close)
          const indexYearDiff = storageUtil.getData('yearAverageIndexDiff', item.key) || 0
          // 年线也必须是线下
          if (diff <= item.fixLine) {
            if (indexYearDiff < 0) {
              this.updateStockIndex(item.key, '定投')
            }
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
        status: value
      }).then((data) => {
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
