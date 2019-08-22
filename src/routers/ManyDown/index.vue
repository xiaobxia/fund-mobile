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
            <span style="float: right" :class="numberClass(rateInfo[item.key])">{{rateInfo[item.key]}}%</span>
          </h3>
          <p class="netChange wn">
            <span v-for="(subItem, index) in klineMap[item.key]" :key="index"
                  :class="numberBgClass(subItem.netChangeRatio)">{{subItem.netChangeRatio}}%</span>
          </p>
          <p class="explain">
            <span v-for="(subItem, index) in allInfo[item.key]" :key="subItem + index"
                  :class="subItem?(subItem.indexOf('涨')?'buy':'sell'):''">{{subItem}}</span>
          </p>
        </div>
      </mt-cell-swipe>
    </div>
  </div>
</template>

<script>
import indexInfoUtilXiong from '@/util/indexInfoUtilXiong.js'
import stockDataUtil from '@/util/stockDataUtil.js'

const codeMap = indexInfoUtilXiong.codeMap
const formatData = indexInfoUtilXiong.formatData

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
    let rateInfo = {}
    let klineMap = {}
    for (let key in codeMap) {
      list.push({
        key: key,
        code: codeMap[key].code,
        name: codeMap[key].name,
        mix: codeMap[key].mix,
        threshold: codeMap[key].threshold,
        wave: codeMap[key].wave,
        rate: codeMap[key].rate
      })
      allInfo[key] = []
      rateInfo[key] = 0
      klineMap[key] = [{}]
    }
    return {
      list: list,
      allInfo: allInfo,
      rateInfo: rateInfo,
      klineMap
    }
  },
  computed: {
  },
  mounted () {
    this.initPage()
  },
  methods: {
    initPage () {
      let list = this.list
      for (let i = 0; i < list.length; i++) {
        this.queryData(list[i])
      }
    },
    queryData (item) {
      this.$http.getWithCache(`webData/${stockDataUtil.getAllUrl()}`, {
        code: item.code,
        days: 16
      }, {interval: 30}).then((data) => {
        if (data.success) {
          const list = data.data.list
          const info = formatData(list)
          const recentNetValue = info.list
          let infoList = []
          let kline = []
          // 近的在前
          for (let i = 0; i < 8; i++) {
            if (i < 8) {
              kline.push(recentNetValue[i])
            }
            // 连续跌
            if (ifAllDown(recentNetValue, i, 4).flag) {
              infoList[i] = 4
              if (ifAllDown(recentNetValue, i, 4).rate < -5) {
                infoList[i] = 4
              } else {
                infoList[i] = 4 + '-少'
              }
            }
            if (ifAllDown(recentNetValue, i, 5).flag) {
              infoList[i] = 5
            }
            if (ifAllDown(recentNetValue, i, 6).flag) {
              infoList[i] = 6
            }
            if (ifAllDown(recentNetValue, i, 7).flag) {
              infoList[i] = 7
            }
            if (ifAllDown(recentNetValue, i, 8).flag) {
              infoList[i] = 8
            }
            // 连续涨
            if (ifAllUp(recentNetValue, i, 4).flag) {
              infoList[i] = '涨-4'
            }
          }
          this.klineMap[item.key] = kline
          this.allInfo[item.key] = infoList
          this.rateInfo[item.key] = this.keepTwoDecimals(recentNetValue[0].netChangeRatio)
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
