<template>
  <div>
    <mt-header title="比特币" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div>资产占比控制在4%（1/25）</div>
      <div>日线是从8点开始的</div>
      <div class="red-text">买入8点后操作，相当于是今天的均线，今天的开盘价(上了均线一次满上)</div>
      <div class="green-text">卖出8点前操作，相当于是前一天的均线，前一天的收盘价(下了均线分两次卖)</div>
      <div class="r">
        <div>比特币当前价：{{btbClose}}</div>
        <div>5/10偏差：<span :class="stockNumberClass(btbDiff)">{{btbDiff}} ({{btbDiff > 0 ? '买' : '卖'}}，第{{btbday}}天)</span></div>
      </div>
      <div class="r">
        <div>以太坊当前价：{{ethClose}}</div>
        <div>5/10偏差：<span :class="stockNumberClass(ethDiff)">{{ethDiff}} ({{ethDiff > 0 ? '买' : '卖'}}，第{{ethday}}天)</span></div>
      </div>
      <div class="r">
        <div>狗币当前价：{{dogeClose}}</div>
        <div>5/10偏差：<span :class="stockNumberClass(dogeDiff)">{{dogeDiff}} ({{dogeDiff > 0 ? '买' : '卖'}}，第{{dogeday}}天)</span></div>
      </div>
      <div class="r">
        <div>币安币当前价：{{bnbClose}}</div>
        <div>5/10偏差：<span :class="stockNumberClass(bnbDiff)">{{bnbDiff}} ({{bnbDiff > 0 ? '买' : '卖'}}，第{{bnbDay}}天)</span></div>
      </div>
    </div>
  </div>
</template>

<script>
import {Indicator} from 'mint-ui'
import numberUtil from '@/util/numberUtil.js'

function getAverage (netValue, day, index) {
  let start = index - day + 1
  start = start < 0 ? 0 : start
  let count = 0
  for (let i = index; i >= start; i--) {
    count += netValue[i]['close']
  }
  return numberUtil.keepTwoDecimals(count / (index + 1 - start))
}

export default {
  name: 'BtbIndex',
  data () {
    return {
      btbClose: 0,
      ethClose: 0,
      btbDiff: 0,
      ethDiff: 0,
      btbday: 0,
      ethday: 0,
      dogeClose: 0,
      dogeDiff: 0,
      dogeday: 0,
      bnbClose: 0,
      bnbDiff: 0,
      bnbDay: 0
    }
  },
  watch: {
  },
  created () {
    this.queryBtbKlines()
    this.queryETHKlines()
    this.queryDOGEKlines()
    this.queryBNBKlines()
  },
  methods: {
    getAverageList (netValue, day) {
      const list = []
      const newList = []
      netValue.forEach((item) => {
        newList.unshift(item)
      })
      newList.forEach((item, index) => {
        const average = getAverage(newList, day, index)
        list.push(average)
      })
      return list
    },
    queryBtbKlines () {
      return this.$http.get('stock/getBtbKlines').then((res) => {
        const list = res.data || []
        const now = list[list.length - 1]
        this.btbClose = now.close
        // 计算
        const count = this.getCount(list)
        this.btbDiff = count.diff
        this.btbday = count.day
      })
    },
    queryETHKlines () {
      return this.$http.get('stock/getETHKlines').then((res) => {
        const list = res.data || []
        const now = list[list.length - 1]
        this.ethClose = now.close
        // 计算
        const count = this.getCount(list)
        this.ethDiff = count.diff
        this.ethday = count.day
      })
    },
    queryDOGEKlines () {
      return this.$http.get('stock/getDOGEKlines').then((res) => {
        const list = res.data || []
        const now = list[list.length - 1]
        this.dogeClose = now.close
        // 计算
        const count = this.getCount(list)
        this.dogeDiff = count.diff
        this.dogeday = count.day
      })
    },
    queryBNBKlines () {
      return this.$http.get('stock/getBNBKlines').then((res) => {
        const list = res.data || []
        const now = list[list.length - 1]
        this.bnbClose = now.close
        // 计算
        const count = this.getCount(list)
        this.bnbDiff = count.diff
        this.bnbDay = count.day
      })
    },
    getCount (list) {
      // 计算
      const newList = []
      list.forEach((item) => {
        item.netChangeRatio = this.countDifferenceRate(item.close, item.open)
        newList.push(item)
      })
      newList.reverse()
      const list5 = this.getAverageList(newList, 5)
      const list10 = this.getAverageList(newList, 10)
      const lastIndex = list5.length - 1
      const diffC = this.countDifferenceRate(list5[lastIndex], list10[lastIndex])
      list5.reverse()
      list10.reverse()
      let day = 0
      for (let i = 0; i < list5.length; i++) {
        const diff = this.countDifferenceRate(list5[i], list10[i])
        if (diffC > 0) {
          if (diff >= 0) {
            day++
          } else {
            break
          }
        } else if (diffC < 0) {
          if (diff <= 0) {
            day++
          } else {
            break
          }
        }
      }
      return {
        day,
        diff: diffC
      }
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
