<template>
  <div class="operating-info">
    <mt-header title="月季度差值均线" :fixed="true">
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
import numberUtil from '@/util/numberUtil.js'

function getAverageDiff (netValue, day, index) {
  let end = index + day
  let count = 0
  for (let i = index; i < end; i++) {
    count += netValue[i]
  }
  return numberUtil.keepTwoDecimals(count / day)
}

export default {
  name: 'MonthQuarterDiffIndex',
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
      this.$http.getWithCache(`stock/getStockPriceMQDiffList`, {
        code: item.code,
        days: 20
      }, {interval: 20}).then((data) => {
        if (data.success) {
          let list = data.data.diffList
          let newList = []
          list.forEach((v) => {
            newList.push(v + 15)
          })
          const aver = getAverageDiff(newList, 10, 0)
          item.netChangeRatio = this.countDifferenceRateHigh(newList[0], aver)
          storageUtil.setData('mqDiffAvIndex', item.key, item.netChangeRatio)
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
