<template>
  <div class="operating-info">
    <mt-header title="均线排序" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
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
  name: 'AverageIndexSort',
  data () {
    let list = []
    indexList.forEach((item) => {
      list.push({
        ...item,
        netChangeRatio: 0,
        averageList: []
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
      const yearClose = storageUtil.getData('yearAverageIndex', item.key) || 1
      const halfYearClose = storageUtil.getData('indexHalfYearClose', item.key) || 1
      const quarterClose = storageUtil.getData('indexQuarterClose', item.key) || 1
      const close30 = storageUtil.getData('index30Close', item.key) || 1
      item.averageList = [
        {name: '年', close:yearClose },
        {name: '半年', close:halfYearClose },
        {name: '季度', close:quarterClose },
        {name: '30', close:close30 }
      ]
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
