<template>
  <div class="my-net-value-record">
    <mt-header title="净值记录" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
      <mt-button slot="right">
        <i class="fas fa-plus" @click="addHandler"></i>
      </mt-button>
    </mt-header>
    <div class="yellow-warn">如果出金了盈亏就不等于APP内的累计收益</div>
    <div class="main-body">
      <ul
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="size">
        <mt-cell-swipe v-for="(item) in list" :key="item._id" :to="'/page/myNetValueAdd?'+qsStringify(item)">
          <div slot="title">
            <h3>
              {{item.net_value_date}}
              <span style="float: right" :class="stockNumberClass(item.rate)">{{item.rate}}%</span>
            </h3>
            <p class="explain">
              <span class="item">成本：<span>{{item.asset_cost}}</span></span>
              <span class="item">份额：<span>{{item.shares}}</span></span>
              <span class="item">净值：<span>{{item.net_value}}</span></span>
              <span class="item">盈亏：<span :class="stockNumberClass(item.asset - item.asset_cost)">{{item.asset - item.asset_cost}}</span></span>
            </p>
          </div>
        </mt-cell-swipe>
      </ul>
    </div>
  </div>
</template>
<script>
import Http from '@/util/httpUtil.js'
import qs from 'qs'
import numberUtil from '@/util/numberUtil.js'

export default{
  name: 'MyNetValueRecord',
  data () {
    return {
      queryData: {
        current: 1,
        pageSize: 50
      },
      size: 50,
      list: [],
      loading: true
    }
  },
  computed: {
  },
  created () {
    this.queryRecord()
  },
  methods: {
    queryRecord () {
      Http.get('userFund/getUserNetValuesByPage', this.queryData).then((data) => {
        if (data.data.list.length < this.size) {
          this.loading = true
        } else {
          this.loading = false
        }
        let list = [...this.list, ...data.data.list]
        let listTemp = []
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          let itemLast = list[i + 1] || {net_value: 1}
          item.rate = numberUtil.countDifferenceRate(item.net_value, itemLast.net_value)
          listTemp.push(item)
        }
        this.list = [...this.list, ...data.data.list]
      })
    },
    loadMore () {
      this.queryData.current++
      this.queryRecord()
    },
    qsStringify (query) {
      query.type = 'edit'
      return qs.stringify(query)
    },
    backHandler () {
      this.$router.history.go(-1)
    },
    addHandler () {
      this.$router.push({path: '/page/myNetValueAdd', query: {type: 'add'}})
    }
  }
}
</script>
<style>
</style>
