<template>
  <div>
    <mt-header title="比特币" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div>小时K线操作，收益率回测出来还没日K的高</div>
      <div>严格执行，不要主观提前操作（已亲身经历）</div>
      <div>资产占比控制在4%（1/25）</div>
      <div>日线是从8点开始的</div>
      <div class="red-text">买入8点后操作，相当于是今天的均线，今天的开盘价(上了均线一次满上)</div>
      <div class="green-text">卖出8点前操作，相当于是前一天的均线，前一天的收盘价(下了均线分两次卖)</div>
      <div v-for="(item, index) in dataList" :key="index" class="r">
        <div>{{item.name}}当前价：{{item.close}}</div>
        <div>5/10偏差：<span :class="biNumberClass(item.diff)">{{item.diff}}</span></div>
        <div>macd：<span :class="stockNumberClass(item.macd)">{{parseFloat(item.macd).toFixed(2)}}</span></div>
        <div>{{getText(item.info)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {Indicator} from 'mint-ui'
import numberUtil from '@/util/numberUtil.js'
import macdUtil from '@/util/macdUtil.js'

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
    name: '莱特币',
    keyName: 'LTC'
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
        macd: 0,
        diff5C20: 0,
        info: {}
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
    getText (info) {
      let f1 = ''
      let f2 = ''
      let f3 = ''
      if (info.ismacdValToUp || info.isDiff5to10ValToUp) {
        f1 = '买入'
        f2 = info.buyTwo ? '开盘价' : '收盘价'
        if (info.close5 > info.close20) {
          f3 = 1
        } else {
          f3 = 2
        }
        // 买入
      }
      if (info.ismacdValToDown || info.isDiff5to10ValToDown) {
        f1 = '卖出'
        f2 = info.sellTwo ? '开盘价' : '收盘价'
        if (info.close5 > info.close20) {
          f3 = 2
        } else {
          f3 = 1
        }
      }
      if (f1) {
        return `${f1}，${f2}(开盘是第二买)，分${f3}天`
      }
      return ''
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
        item.macd = count.macd
        item.diff5C20 = count.diff5C20
        item.info = count
      })
    },
    getCount (list) {
      // 计算
      // 正序
      const newList = []
      list.forEach((item) => {
        item.netChangeRatio = this.countDifferenceRate(item.close, item.open)
        newList.push(item)
      })
      const macdList = macdUtil.macd_data(list)
      // 倒序
      newList.reverse()
      // 正序
      const list5 = this.getAverageList(newList, 5)
      const list10 = this.getAverageList(newList, 10)
      const list20 = this.getAverageList(newList, 20)
      const diff5to10List = []
      list5.forEach((v, i) => {
        diff5to10List.push(v - list10[i])
      })
      const lastIndex = list5.length - 1
      const diffC = this.countDifferenceRate(list5[lastIndex], list10[lastIndex])
      const diff5C20 = this.countDifferenceRate(list5[lastIndex], list20[lastIndex])
      const diff5To10Macd = macdUtil.getDiff5To10Macd(macdList, diff5to10List, lastIndex)
      return {
        diff: diffC,
        diff5C20,
        macd: macdList[macdList.length - 1],
        ...diff5To10Macd,
        close5: list5[lastIndex],
        close10: list10[lastIndex],
        close20: list20[lastIndex]
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
    background-color: #eee;
    padding: 20px;
    div {
      margin-bottom: 10px;
    }
    margin-bottom: 10px;
  }
  .type-card {
    background-color: #eee;
    margin: 20px 0;
  }
</style>
