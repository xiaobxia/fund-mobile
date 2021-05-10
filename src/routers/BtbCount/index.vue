<template>
  <div>
    <mt-header title="比特币资金比例" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div>炒就炒近期成交量大的币就行了</div>
      <mt-field label="资金" placeholder="请输入" v-model="money"></mt-field>
      <div>总计：{{allCount}}</div>
      <div v-for="(item, index) in dataList" :key="index" class="r">
        <div>
          <span>{{item.name}}，</span>
          <span>占比：{{item.count}}，</span>
          <span>资金：{{countMoney(item.count)}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Indicator} from 'mint-ui'

const biList = [
  {
    name: '比特币',
    keyName: 'BTC',
    count: 2
  },
  {
    name: '以太坊',
    keyName: 'ETH',
    count: 2
  },
  {
    name: '币安币',
    keyName: 'BNB',
    count: 1
  },
  {
    name: '狗狗币',
    keyName: 'DOGE',
    count: 1
  },
  {
    name: 'ETC',
    keyName: 'ETC',
    count: 1
  },
  {
    name: 'EOS',
    keyName: 'EOS',
    count: 1
  }
]

export default {
  name: 'BtbIndex',
  data () {
    let allCount = 0
    const dataList = []
    biList.forEach((v) => {
      allCount += v.count
      dataList.push({
        ...v
      })
    })
    return {
      dataList,
      allCount,
      money: localStorage.getItem('btbMoney') || 0
    }
  },
  watch: {
    money (val) {
      localStorage.setItem('btbMoney', val || 0)
    }
  },
  created () {
  },
  methods: {
    countMoney (count) {
      return parseInt((count / this.allCount) * this.money)
    },
    backHandler () {
      this.$router.history.go(-1)
    },
    toEdit (item) {
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
