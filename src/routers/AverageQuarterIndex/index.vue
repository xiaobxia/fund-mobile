<template>
  <div class="operating-info">
    <mt-header title="季度线策略" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div class="warn-wrap">
        <div class="fm-warn blue">年线在上，季度线跌太多(-7% ~ -10%)就可以不卖了</div>
        <div class="fm-warn grey">进入没卖阶段，建议仓位保持60%以上</div>
      </div>
      <mt-cell-swipe v-for="(item) in list" :key="item.code" :class="item.netChangeRatio < -7 ? 'duo':''">
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
  name: 'AverageQuarterIndex',
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
        days: 60
      }, {interval: 20}).then((data) => {
        if (data.success) {
          const diff = data.data.rate
          storageUtil.setData('indexQuarterClose', item.key, data.data.close)
          storageUtil.setData('averageQuarterIndex', item.key, diff)
          item.netChangeRatio = diff
          const halfYearDiff = storageUtil.getData('averageHalfYearIndex', item.key) || 0
          const yearDiff = storageUtil.getData('yearAverageIndexDiff', item.key) || 0
          const updateData = {}
          if (yearDiff > 0 && halfYearDiff > 0) {
            if (diff <= -5) {
              // 季度见底还是维持原来的逻辑，因为用季年线来判断的话，其实大反就会一直锁仓了，效果差不多
              if (['jijian', 'dichan', 'meitan'].indexOf(item.key) === -1) {
                updateData.recent_status = '见底'
              }
            }
          }
          if (item.quarterHotLine) {
            if (diff >= item.quarterHotLine) {
              updateData.danger = '开启'
            }
          }
          if (updateData.danger || updateData.recent_status) {
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
