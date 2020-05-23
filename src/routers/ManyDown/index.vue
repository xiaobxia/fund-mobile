<template>
  <div class="operating-info">
    <mt-header title="多阴线策略" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body small">
      <mt-cell-swipe v-for="(item) in list" :key="item.code">
        <div slot="title">
          <h3>
            <span class="index-name">{{item.name}}</span>
            <span style="float: right" :class="stockNumberClass(item.netChangeRatio)">{{item.netChangeRatio}}%</span>
          </h3>
          <p class="netChange wn">
            <span v-for="(subItem, index) in klineMap[item.key]" :key="index"
                  :class="numberBgClass(subItem.netChangeRatio)">{{subItem.netChangeRatio}}%</span>
          </p>
          <p class="explain">
            <span v-for="(subItem, index) in allInfo[item.key]" :key="subItem + index"
                  :class="getClass(subItem)">{{subItem}}</span>
          </p>
        </div>
      </mt-cell-swipe>
    </div>
  </div>
</template>

<script>
import indexList from '@/common/indexList.js'
import stockApiUtil from '@/util/stockApiUtil.js'

function ifAllDown (list, start, day) {
  let flag = true
  let rate = 0
  for (let i = 0; i < day; i++) {
    if (list[start + i].netChangeRatio > 0) {
      return {
        flag: false
      }
    } else {
      rate += list[start + i].netChangeRatio
    }
  }
  return {
    flag,
    rate
  }
}

function ifAllUp (list, start, day) {
  let flag = true
  let rate = 0
  for (let i = 0; i < day; i++) {
    if (list[start + i].netChangeRatio < 0) {
      return {
        flag: false
      }
    } else {
      rate += list[start + i].netChangeRatio
    }
  }
  return {
    flag,
    rate
  }
}

export default {
  name: 'ManyDown',
  data () {
    let allInfo = {}
    let list = []
    let klineMap = {}
    indexList.forEach((item) => {
      list.push({
        ...item,
        netChangeRatio: 0
      })
      allInfo[item.key] = []
      klineMap[item.key] = [{}]
    })
    return {
      list: list,
      allInfo: allInfo,
      klineMap
    }
  },
  computed: {
  },
  created () {
    this.initPage()
  },
  methods: {
    getClass (subItem) {
      if (subItem) {
        if (subItem.indexOf('涨') !== -1) {
          return 'sell'
        } else if (subItem.indexOf('牛') !== -1) {
          return 'niu'
        } else {
          return 'buy'
        }
      } else {
        return ''
      }
    },
    initPage () {
      let list = this.list
      for (let i = 0; i < list.length; i++) {
        this.queryData(list[i])
      }
    },
    queryData (item) {
      this.$http.get(`stock/${stockApiUtil.getAllUrl()}`, {
        code: item.code,
        days: 22
      }, {interval: 30}).then((data) => {
        if (data.success) {
          const recentNetValue = []
          data.data.list.forEach((item) => {
            recentNetValue.push({
              ...item.kline
            })
          })
          let infoList = []
          let kline = []
          // 近的在前
          for (let i = 0; i < 12; i++) {
            if (i < 12) {
              kline.push(recentNetValue[i])
            }
            // 连续跌
            if (ifAllDown(recentNetValue, i, 4).flag) {
              infoList[i] = '4'
              if (ifAllDown(recentNetValue, i, 4).rate < -5) {
                infoList[i] = '4'
              } else {
                infoList[i] = '4' + '少'
              }
            }
            if (ifAllDown(recentNetValue, i, 5).flag) {
              infoList[i] = '5'
            }
            if (ifAllDown(recentNetValue, i, 6).flag) {
              infoList[i] = '6'
            }
            if (ifAllDown(recentNetValue, i, 7).flag) {
              infoList[i] = '7'
            }
            if (ifAllDown(recentNetValue, i, 8).flag) {
              infoList[i] = '8'
            }
            // 连续涨
            if (ifAllUp(recentNetValue, i, 4).flag) {
              infoList[i] = '涨4'
            }
            if (ifAllUp(recentNetValue, i, 5).flag) {
              infoList[i] = '牛5'
            }
            if (!infoList[i]) {
              infoList[i] = ''
            }
          }
          this.klineMap[item.key] = kline
          this.allInfo[item.key] = infoList
          item.netChangeRatio = this.keepTwoDecimals(recentNetValue[0].netChangeRatio)
        }
      })
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
