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
        <mt-cell-swipe v-for="(item) in list" :key="item._id" :to="'/page/myNetValueAdd?type=edit&net_value_date='+item.net_value_date">
          <div slot="title">
            <h3>
              {{item.net_value_date}}
              <span style="float: right" :class="stockNumberClass(item.net_value - item.pre_net_value)">{{countDifferenceRate(item.net_value, item.pre_net_value)}}%</span>
            </h3>
            <p class="explain">
              <span class="item">成本：<span>{{item.asset_cost}}</span></span>
              <span class="item">份额：<span>{{item.shares}}</span></span>
              <span class="item">净值：<span>{{item.net_value}}</span></span>
            </p>
          </div>
        </mt-cell-swipe>
      </ul>
    </div>
  </div>
</template>
<script>

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
      this.$http.get('userFund/getUserNetValuesByPage', this.queryData).then((data) => {
        if (data.data.list.length < this.size) {
          this.loading = true
        } else {
          this.loading = false
        }
        this.list = this.list.concat(data.data.list)
      })
    },
    loadMore () {
      this.queryData.current++
      this.queryRecord()
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
