<template>
  <div>
    <mt-header title="比特币" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div>日线是从8点开始的</div>
      <div class="r">
        <div>比特币当前价：{{btbClose}}</div>
        <div>5/10偏差：<span :class="stockNumberClass(btbDiff)">{{btbDiff}} ({{btbDiff > 0 ? '买' : '卖'}}，第{{btbday}}天)</span></div>
      </div>
      <div class="r">
        <div>以太坊当前价：{{ethClose}}</div>
        <div>5/10偏差：<span :class="stockNumberClass(ethDiff)">{{ethDiff}} ({{ethDiff > 0 ? '买' : '卖'}}，第{{ethday}}天)</span></div>
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
      ethday: 0
    }
  },
  watch: {
  },
  created () {
    this.queryBtbKlines()
    this.queryETHKlines()
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
        const newList = []
        list.forEach((item) => {
          item.netChangeRatio = this.countDifferenceRate(item.close, item.open)
          newList.push(item)
        })
        newList.reverse()
        const list5 = this.getAverageList(newList, 5)
        const list10 = this.getAverageList(newList, 10)
        const lastIndex = list5.length - 1
        this.btbDiff = this.countDifferenceRate(list5[lastIndex], list10[lastIndex])
        list5.reverse()
        list10.reverse()
        let day = 0
        for (let i = 0; i < list5.length; i++) {
          const diff = this.countDifferenceRate(list5[i], list10[i])
          if (this.btbDiff > 0) {
            if (diff >= 0) {
              day++
            } else {
              break
            }
          } else if (this.btbDiff < 0) {
            if (diff <= 0) {
              day++
            } else {
              break
            }
          }
        }
        this.btbday = day
      })
    },
    queryETHKlines () {
      return this.$http.get('stock/getETHKlines').then((res) => {
        const list = res.data || []
        const now = list[list.length - 1]
        this.ethClose = now.close
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
        this.ethDiff = this.countDifferenceRate(list5[lastIndex], list10[lastIndex])
        list5.reverse()
        list10.reverse()
        let day = 0
        for (let i = 0; i < list5.length; i++) {
          const diff = this.countDifferenceRate(list5[i], list10[i])
          if (this.ethDiff > 0) {
            if (diff >= 0) {
              day++
            } else {
              break
            }
          } else if (this.ethDiff < 0) {
            if (diff <= 0) {
              day++
            } else {
              break
            }
          }
        }
        this.ethday = day
      })
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
