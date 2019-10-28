<template>
  <mt-cell-swipe :to="toUrl"
                 :class="['operating-info-item', ...getItemClass()]">
    <div slot="title">
      <h3 class="op">
        <span class="index-name">{{indexInfo.name}}</span>
        <span v-if="ifHas" class="has-count">{{hasCount}}</span>
        <span v-if="positionWarn === 'danger'" class="danger-tag-s operate-tag">危</span>
        <span v-if="positionWarn === 'warn'" class="warn-tag-s operate-tag">高</span>
        <span v-if="ifLaji" class="warn-tag-s operate-tag">垃圾</span>
        <span class="buy-info">{{indexBuyNumber}}</span>
        <span class="buy-info">{{indexSellNumber}}</span>
        <span v-if="indexNiuXiong === '牛'" class="buy-s has-tag">{{indexNiuXiong}}</span>
        <span v-if="indexNiuXiong === '小牛'" class="buy has-tag">{{indexNiuXiong}}</span>
        <span v-if="indexNiuXiong === '大反'" class="buy-s has-tag">{{indexNiuXiong}}</span>
        <span v-if="indexNiuXiong === '小反'" class="buy has-tag">{{indexNiuXiong}}</span>
        <span v-if="indexNiuXiong === '熊'" class="sell-s has-tag">{{indexNiuXiong}}</span>
        <span v-if="averageMonthIndex > 1" class="buy-s has-tag">多</span>
        <span v-if="averageMonthIndex > 0 && averageMonthIndex <= 1" class="buy has-tag">乐观</span>
        <span v-if="averageMonthIndex <= 0 && averageMonthIndex >= -0.5" class="sell has-tag">谨慎</span>
        <span v-if="averageMonthIndex < -0.5" class="sell-s has-tag">空</span>
        <span v-if="ifThreeDown && !ifLaji" class="buy-s has-tag">1/3</span>
        <span v-if="ifSixFive && !ifSevenSix" class="buy-s has-tag">小</span>
        <span v-if="ifSevenFive && !ifEightSix" class="buy-s has-tag">小</span>
        <span v-if="ifEightSix" class="buy-s has-tag">大</span>
        <span v-if="ifSevenSix" class="buy-s has-tag">走牛</span>
        <span v-if="ifFiveUp" class="warn-s has-tag">涨5</span>
        <span v-if="ifJieFantan()" class="info-s has-tag">解</span>
        <span v-if="ifThreeUp && ifLaji" class="sell-s must-tag">卖</span>
        <span v-if="ifFourUp && ifLaji" class="sell-s must-tag">卖1/3</span>
        <span v-if="ifFiveUp && ifLaji" class="sell-s must-tag">卖1/2</span>
        <span style="float: right" :class="numberClass(rate)">{{rate}}%</span>
      </h3>
      <p class="explain">
            <span v-for="(subItem, index) in buySellList" :key="subItem + index"
                  :class="subItem">{{subItem === 'buy'?'买':subItem === 'sell'?'卖':''}}</span>
      </p>
      <p class="netChange wn">
            <span v-for="(subItem, index) in netChangeRatioList" :key="index"
                  :class="numberBgClass(subItem)">{{subItem}}%</span>
      </p>
      <p class="otherBuySellList">
            <span v-for="(subItem, index) in otherBuySellList" :key="index"
                  :class="subItem">{{subItem}}</span>
      </p>
      <div class="other-text">
        <p class="purple-text" v-if="ifFiveUp">当天可以卖，第二天可以接回来</p>
        <p v-if="rate <= -3">是否有利空？是就先不接，标记利空，不是也不要接太多</p>
      </div>
      <div class="left-tag"></div>
      <div class="right-tag">
        <span v-if="lock" class="lock-tag top"></span>
      </div>
    </div>
  </mt-cell-swipe>
</template>

<script>
import storageUtil from '@/util/storageUtil.js'
import operatingTooltip from '@/util/operatingTooltip.js'

const jigou = operatingTooltip.jigou
const laji = operatingTooltip.laji

export default {
  name: 'OperatingInfoItem',
  data () {
    return {}
  },
  props: {
    indexInfo: {
      type: Object,
      default: function () {
        return {
        }
      }
    },
    toUrl: String,
    buyCount: {
      type: Number,
      default: 0
    },
    sellCount: {
      type: Number,
      default: 0
    },
    hasCount: {
      type: Number,
      default: 0
    },
    costCount: {
      type: Number,
      default: 0
    },
    totalSum: {
      type: Number,
      default: 0
    },
    rate: {
      type: Number,
      default: 0
    },
    buySellList: {
      type: Array,
      default: function () {
        return ['', '', '', '', '']
      }
    },
    netChangeRatioList: {
      type: Array,
      default: function () {
        return [0, 0, 0, 0, 0]
      }
    },
    closeList: {
      type: Array,
      default: function () {
        return [0, 0, 0, 0, 0]
      }
    },
    buySellListLarge: {
      type: Array,
      default: function () {
        return ['', '', '', '', '', '', '', '']
      }
    },
    netChangeRatioListLarge: {
      type: Array,
      default: function () {
        return [0, 0, 0, 0, 0, 0, 0, 0]
      }
    },
    closeListLarge: {
      type: Array,
      default: function () {
        return [0, 0, 0, 0, 0, 0, 0, 0]
      }
    },
    lock: {
      type: Boolean,
      default: false
    },
    countUpNumber: {
      type: Number,
      default: 0
    },
    countDownNumber: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: '简'
    }
  },
  computed: {
    ifHas () {
      return this.hasCount > 0
    },
    ifJigou () {
      return jigou.indexOf(this.indexInfo.key) !== -1
    },
    ifLaji () {
      return laji.indexOf(this.indexInfo.key) !== -1
    },
    // 是否处于反弹
    ifInFantan () {
      return this.indexNiuXiong === '大反' || this.indexNiuXiong === '小反'
    },
    ifInLeguan () {
      return this.indexNiuXiong === '牛' || this.indexNiuXiong === '小牛' || this.averageMonthIndex > 0
    },
    positionWarn () {
      return operatingTooltip.getPositionWarn(this.indexInfo, this.hasCount)
    },
    otherBuySellList () {
      if (this.type === '简') {
        return storageUtil.getXiongBuySellList(this.indexInfo.key)
      } else {
        return storageUtil.getJianBuySellList(this.indexInfo.key)
      }
    },
    indexAverage () {
      return storageUtil.getAverage(this.indexInfo.key) || 0
    },
    indexNiuXiong () {
      const niuXiong = storageUtil.getIndexNiuXiong(this.indexInfo.key)
      return niuXiong === '正常' ? '' : niuXiong
    },
    indexBuyNumber () {
      return operatingTooltip.getIndexBuyNumber(
        this.type,
        this.indexInfo,
        {
          buyFlagCount: this.buyCount,
          sellFlagCount: this.sellCount,
          netChangeRatio: this.rate
        },
        this.hasCount
      )
    },
    indexSellNumber () {
      return operatingTooltip.getIndexSellNumber(
        this.type,
        this.indexInfo,
        {
          buyFlagCount: this.buyCount,
          sellFlagCount: this.sellCount
        },
        this.hasCount
      )
    },
    ifThreeSell () {
      return this.buySellList[0] === 'sell' && this.buySellList[1] === 'sell' && this.buySellList[2] === 'sell'
    },
    ifThreeDown () {
      return (
        this.netChangeRatioList[0] < 0 &&
        this.netChangeRatioList[1] < 0 &&
        this.netChangeRatioList[2] < 0
      )
    },
    ifFourDown () {
      return (
        this.netChangeRatioList[0] < 0 &&
        this.netChangeRatioList[1] < 0 &&
        this.netChangeRatioList[2] < 0 &&
        this.netChangeRatioList[3] < 0
      )
    },
    ifFiveDown () {
      return (
        this.netChangeRatioList[0] < 0 &&
        this.netChangeRatioList[1] < 0 &&
        this.netChangeRatioList[2] < 0 &&
        this.netChangeRatioList[3] < 0 &&
        this.netChangeRatioList[4] < 0
      )
    },
    ifThreeUp () {
      return (
        this.netChangeRatioListLarge[0] > 0 &&
        this.netChangeRatioListLarge[1] > 0 &&
        this.netChangeRatioListLarge[2] > 0 &&
        this.netChangeRatioListLarge[3] <= 0
      )
    },
    ifFourUp () {
      return (
        this.netChangeRatioListLarge[0] > 0 &&
        this.netChangeRatioListLarge[1] > 0 &&
        this.netChangeRatioListLarge[2] > 0 &&
        this.netChangeRatioListLarge[3] > 0 &&
        this.netChangeRatioListLarge[4] <= 0
      )
    },
    ifFiveUp () {
      return (
        this.netChangeRatioListLarge[0] > 0 &&
        this.netChangeRatioListLarge[1] > 0 &&
        this.netChangeRatioListLarge[2] > 0 &&
        this.netChangeRatioListLarge[3] > 0 &&
        this.netChangeRatioListLarge[4] > 0
      )
    },
    ifSixFive () {
      if (this.netChangeRatioListLarge[0] < 0) {
        let count = 0
        if (this.netChangeRatioListLarge[1] > 0) {
          count++
        }
        if (this.netChangeRatioListLarge[2] > 0) {
          count++
        }
        if (this.netChangeRatioListLarge[3] > 0) {
          count++
        }
        if (this.netChangeRatioListLarge[4] > 0) {
          count++
        }
        if (this.netChangeRatioListLarge[5] > 0) {
          count++
        }
        if (count < 2) {
          return true
        }
      }
      return false
    },
    ifSevenSix () {
      if (this.netChangeRatioListLarge[0] < 0) {
        let count = 0
        if (this.netChangeRatioListLarge[1] > 0) {
          count++
        }
        if (this.netChangeRatioListLarge[2] > 0) {
          count++
        }
        if (this.netChangeRatioListLarge[3] > 0) {
          count++
        }
        if (this.netChangeRatioListLarge[4] > 0) {
          count++
        }
        if (this.netChangeRatioListLarge[5] > 0) {
          count++
        }
        if (this.netChangeRatioListLarge[6] > 0) {
          count++
        }
        if (count < 2) {
          return true
        }
      }
      return false
    },
    ifSevenFive () {
      if (this.netChangeRatioListLarge[0] < 0 && this.netChangeRatioListLarge[6] < 0) {
        let count = 0
        if (this.netChangeRatioListLarge[1] > 0) {
          count++
        }
        if (this.netChangeRatioListLarge[2] > 0) {
          count++
        }
        if (this.netChangeRatioListLarge[3] > 0) {
          count++
        }
        if (this.netChangeRatioListLarge[4] > 0) {
          count++
        }
        if (this.netChangeRatioListLarge[5] > 0) {
          count++
        }
        if (count < 3) {
          return true
        }
      }
      return false
    },
    ifEightSix () {
      if (this.netChangeRatioListLarge[0] < 0 && this.netChangeRatioListLarge[7] < 0) {
        let count = 0
        if (this.netChangeRatioListLarge[1] > 0) {
          count++
        }
        if (this.netChangeRatioListLarge[2] > 0) {
          count++
        }
        if (this.netChangeRatioListLarge[3] > 0) {
          count++
        }
        if (this.netChangeRatioListLarge[4] > 0) {
          count++
        }
        if (this.netChangeRatioListLarge[5] > 0) {
          count++
        }
        if (this.netChangeRatioListLarge[6] > 0) {
          count++
        }
        if (count < 3) {
          return true
        }
      }
      return false
    },
    averageMonthIndex () {
      return storageUtil.getMonthAverage(this.indexInfo.key) || 0
    }
  },
  mounted () {
  },
  methods: {
    ifJieFantan () {
      // 垃圾指数
      if (this.ifLaji && this.indexNiuXiong === '小反' && this.ifThreeUp) {
        return true
      }
      return (
        (this.indexNiuXiong === '小反' && (this.ifFourUp || this.ifFiveUp)) ||
        (this.indexNiuXiong === '大反' && (this.ifFourUp || this.ifFiveUp))
      )
    },
    // 获取今天前面的第一个买卖信号
    getBeforeFlagBoth () {
      for (let i = 1; i < this.buySellList.length; i++) {
        if (this.buySellList[i]) {
          return this.buySellList[i]
        } else if (this.otherBuySellList[i]) {
          return this.otherBuySellList[i]
        }
      }
      return ''
    },
    getItemClass () {
      // 市场阶段
      const question9 = storageUtil.getMarketStatus('question_9')
      const buyClass = 'buy'
      const sellClass = 'sell'
      const classList = []
      let shouldClass = ''
      const buySellList = this.buySellList
      classList.push(this.ifHas ? 'has' : 'no-has')
      classList.push(this.lock ? 'lock' : 'no-lock')
      // 涨5天了必须开始卖
      if (this.ifFiveUp) {
        classList.push(sellClass)
      }
      // 垃圾指数
      if (this.ifLaji) {
        if (this.ifThreeUp || this.ifFourUp || this.ifFiveUp) {
          classList.push(sellClass)
        }
      }
      if (buySellList[0] === buyClass) {
        // 如果是买入信号，那就直接红色，返回
        classList.push(buyClass)
      } else if (buySellList[0] === sellClass) {
        if (question9 === '筑顶') {
          // 如果是在筑顶那就都卖
          classList.push(sellClass)
        } else {
          // 如果是卖出信号，那就判断是不是出于大反或者小反
          if (!this.ifInFantan) {
            // 不处于反弹期才可以卖
            classList.push(sellClass)
          } else if (this.ifJieFantan()) {
            // 或者解除反弹了
            classList.push(sellClass)
          }
        }
      } else {
        // ----------------------应该买的部分
        // 没有其他信号
        if (question9 !== '筑顶') {
          // 不是筑顶阶段才行
          // 连续跌三天，并且不是垃圾指数，并且处于乐观状态
          if (this.ifThreeDown && !this.ifLaji && this.ifInLeguan) {
            shouldClass = 'should-buy'
          }
          // 跌很多天
          if (this.ifSixFive || this.ifSevenSix || this.ifSevenFive || this.ifEightSix) {
            shouldClass = 'should-buy'
          }
          // 连跌
          if (this.ifFourDown || this.ifFiveDown) {
            shouldClass = 'should-buy'
          }
        }
        // ----------------------应该卖的部分
        if (this.otherBuySellList[0] !== 'buy' && shouldClass === '' && this.rate < 0) {
          if (this.averageMonthIndex < 0 && !this.ifInFantan && !this.ifInLeguan) {
            shouldClass = 'should-sell'
          }
        }
      }
      classList.push(shouldClass)
      return classList
    }
  }
}
</script>
