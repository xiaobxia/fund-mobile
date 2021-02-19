<template>
  <div>
    <mt-header title="比特币" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div class="r">
        <div>当前价：{{close}}</div>
      </div>
      <div>
        <div v-for="(item, index) in list" :key="index" class="type-card" @click="toEdit(item)">
          <h4>{{item.type}}</h4>
          <div>份额：{{item.shares}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Indicator} from 'mint-ui'

export default {
  name: 'BtbIndex',
  data () {
    return {
      close: 0
    }
  },
  watch: {
  },
  created () {
    this.queryBtbKlines()
    this.queryList()
  },
  methods: {
    queryBtbKlines () {
      return this.$http.get('stock/getBtbKlines').then((res) => {
        const list = res.data || []
        const now = list[list.length - 1]
        this.close = now.close
      })
    },
    queryList() {
      return this.$http.get('btb/getUserBtbs').then((res) => {
        const list = res.data.list || []
        list.forEach((v)=>{
          let shares = 0
          v.position_record = v.position_record || []
          v.position_record.forEach((p)=>{
            shares += p.shares || 0
          })
          v.shares = shares
        })
        this.list = list
      })
    },
    backHandler () {
      this.$router.history.go(-1)
    },
    toEdit(item) {
      this.$router.push({
        path: '/page/myBtbAdd',
        query: {
          type: item.type
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .to {
    margin-bottom: 60px;
  }
  .r {
    padding: 20px;
    div {
      margin-bottom: 10px;
    }
  }
  .type-card {
    background-color: #eee;
    margin: 20px 0;
  }
</style>
