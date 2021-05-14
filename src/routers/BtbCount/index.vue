<template>
  <div>
    <mt-header title="比特币资金比例" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div>炒就炒近期成交量大的币就行了</div>
      <mt-field label="USDT价格" placeholder="请输入" v-model="usdtMoney"></mt-field>
      <div class="r">总计：{{parseFloat(usdtAll).toFixed(2)}}，市值：{{usdtCountMoney(usdtAll)}}</div>
      <div v-for="(item, index) in list" :key="index" class="r">
        <div>
          <span>{{item.code}}，</span>
          <span>占比：{{item.proportion}}，</span>
        </div>
        <div>
          <span>期望总计：{{parseFloat(getCount(item.proportion)).toFixed(2)}}，期望市值：{{usdtCountMoney(getCount(item.proportion))}}</span>
        </div>
        <div>
          <span>实际总计：{{parseFloat(item.count).toFixed(2)}}，实际市值：{{usdtCountMoney(item.count)}}，仓位：{{countRate(item.count, getCount(item.proportion))}}%</span>
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
    name: '莱特币',
    keyName: 'LTC',
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
      usdtMoney: localStorage.getItem('usdtMoney') || 0,
      usdtAll: 0,
      proportionAll: 0
    }
  },
  watch: {
    usdtMoney (val) {
      localStorage.setItem('usdtMoney', val || 0)
    }
  },
  created () {
    this.$http.get('btbIndex/getMyBalanceInfo').then((res) => {
      const data = res.data || {}
      let all = data['ALL'].count
      let proportionAll = 0
      let list = []
      for (let key in data) {
        if (key !== 'ALL') {
          list.push({
            code: key,
            count: data[key].count,
            proportion: data[key].proportion
          })
          proportionAll += data[key].proportion
        }
      }
      this.list = list
      this.proportionAll = proportionAll
      this.usdtAll = all
    })
  },
  methods: {
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
    },
    usdtCountMoney (count) {
      const usdtMoney = parseFloat(this.usdtMoney || 0) || 0
      return parseInt((count) * usdtMoney)
    },
    getCount (proportion) {
      return this.usdtAll * (proportion / this.proportionAll)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .to {
    margin-bottom: 60px;
  }
  .r {
    background-color: #eee;
    padding: 20px;
    margin-bottom: 10px;
    div {
      margin-bottom: 10px;
    }
  }
  .type-card {
    background-color: #eee;
    margin: 20px 0;
  }
</style>
