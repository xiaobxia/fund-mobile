<template>
  <div class="operating-info">
    <mt-header title="年线" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div class="warn-wrap">
        <div class="img-icon-list">
          <div v-if="ifFengNiu" class="img-icon-item">
            <img src="../../assets/牛市.png" alt="">
          </div>
        </div>
        <div class="fm-warn blue">年线半年线本来还不错突然跌下来，那基本是买点，如果一波行情下来年线半年线基本就没超过7%过，而且时间也不长，那就危险了</div>
      </div>
      <mt-cell-swipe v-for="(item) in list" :key="item.code" :class="item.diff < 0 ? 'kong':''">
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
    ifFengNiu () {
      // 是不是全面疯牛
      const question10 = storageUtil.getData('stockMarketQuestion', 'question_10')
      return question10 === '是'
    }
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
          const rawStatus = storageUtil.getData('stockIndexStatus', item.key)
          if ((rawStatus === '探底' || rawStatus === '定投') && diff >= 0) {
            updateData.status = '正常'
          }
          if (updateData.status) {
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
<style rel="stylesheet/scss" lang="scss" scoped>
  .img-icon-item {
    width: 100px;
    height: 100px;
  img {
    width: 100%;
    height: 100%;
  }
  }
</style>
