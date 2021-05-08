<template>
  <div>
    <mt-header title="比特币" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div>严格执行，不要主观提前操作（已亲身经历）</div>
      <div>资产占比控制在4%（1/25）</div>
      <div>日线是从8点开始的</div>
      <div class="red-text">买入8点后操作，相当于是今天的均线，今天的开盘价(上了均线一次满上)</div>
      <div class="green-text">卖出8点前操作，相当于是前一天的均线，前一天的收盘价(下了均线分两次卖)</div>
      <div v-for="(item, index) in dataList" :key="index" class="r">
        <div>{{item.name}}当前价：{{item.close}}</div>
        <div>5/10偏差：<span :class="biNumberClass(item.diff)">{{item.diff}} ({{countText(item.diff,item.diff5C20 )}}，分{{countDay(item.diff,item.diff5C20 )}}天，第{{item.day}}天)</span></div>
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

const biList = [
  {
    name: '比特币',
    keyName: 'BTC'
  },
  {
    name: '以太坊',
    keyName: 'ETH'
  },
  {
    name: '币安币',
    keyName: 'BNB'
  },
  {
    name: '狗狗币',
    keyName: 'DOGE'
  },
  {
    name: 'ETC',
    keyName: 'ETC'
  },
  {
    name: 'EOS',
    keyName: 'EOS'
  }
]

export default {
  name: 'BtbIndex',
  data () {
    const dataList = []
    biList.forEach((v) => {
      dataList.push({
        ...v,
        close: 0,
        diff: 0,
        day: 0,
        diff5C20: 0
      })
    })
    return {
      dataList
    }
  },
  watch: {
  },
  created () {
    this.dataList.forEach((v) => {
      this.queryBIKlines(v)
    })
  },
  methods: {
    countDay (diff, c520) {
      if (diff > 0) {
        if (c520 > 0) {
          return 1
        } else {
          return 2
        }
      } else {
        if (c520 > 0) {
          return 2
        } else {
          return 1
        }
      }
    },
    countText (diff, c520) {
      if (diff > 0) {
        if (c520 > 0) {
          return '买开盘价'
        } else {
          return '买收盘价'
        }
      } else {
        if (c520 > 0) {
          return '卖收盘价'
        } else {
          return '卖开盘价'
        }
      }
    },
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
    queryBIKlines (item) {
      return this.$http.get('stock/getBIKlines', {
        name: item.keyName
      }).then((res) => {
        const list = res.data || []
        const now = list[list.length - 1]
        item.close = now.close
        // 计算
        const count = this.getCount(list)
        item.diff = count.diff
        item.day = count.day
        item.diff5C20 = count.diff5C20
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
      const list20 = this.getAverageList(newList, 20)
      const lastIndex = list5.length - 1
      const diffC = this.countDifferenceRate(list5[lastIndex], list10[lastIndex])
      const diff5C20 = this.countDifferenceRate(list5[lastIndex], list20[lastIndex])
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
        diff: diffC,
        diff5C20
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
