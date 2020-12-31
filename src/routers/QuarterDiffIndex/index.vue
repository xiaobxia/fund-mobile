<template>
  <div class="operating-info">
    <mt-header title="趋势线" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <!--<div class="d-w">-->
        <!--<mt-cell-swipe>-->
          <!--<div slot="title">-->
            <!--<h3>上升时锁仓都买</h3>-->
          <!--</div>-->
          <!--<div class="right-wrap">-->
            <!--<mt-switch v-model="upNoSell" @change="stateChangeHandler"></mt-switch>-->
          <!--</div>-->
        <!--</mt-cell-swipe>-->
      <!--</div>-->
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

export default {
  name: 'QuarterDiffIndex',
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
      this.$http.getWithCache(`stock/getStockPriceQDiffAV`, {
        code: item.code
      }, {interval: 20}).then((data) => {
        if (data.success) {
          item.netChangeRatio = data.data.diffAVRate
          storageUtil.setData('qDiffAvRateIndex', item.key, item.netChangeRatio)
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
