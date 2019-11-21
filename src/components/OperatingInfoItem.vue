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
        <span v-if="indexNiuXiong === '大反'" class="buy-s has-tag">{{indexNiuXiong}}</span>
        <span v-if="indexNiuXiong === '小反'" class="buy has-tag">{{indexNiuXiong}}</span>
        <span v-if="noSellIndex" class="buy-s has-tag">锁仓</span>
        <span v-if="averageMonthIndex > 0" class="buy has-tag">乐观</span>
        <span v-if="averageMonthIndex <= 0" class="sell-s has-tag">空</span>
        <span v-if="!ifDafan() && ifxiaofan()" class="buy-s has-tag">小</span>
        <span v-if="ifDafan()" class="buy-s has-tag">大</span>
        <span v-if="ifFiveUp" class="warn-s has-tag">涨5</span>
        <span v-if="ifJieFantan()" class="info-s has-tag">解反</span>
        <span v-if="ifUpQuick()" class="sell-s must-tag">涨快</span>
        <span v-if="ifThreeUp && ifLaji" class="sell-s must-tag">卖</span>
        <span v-if="ifFourUp && ifLaji" class="sell-s must-tag">卖1/3</span>
        <span v-if="ifFiveUp && ifLaji" class="sell-s must-tag">卖1/2</span>
        <span v-if="jukui" class="danger-tag-s operate-tag">巨亏</span>
        <span v-if="ifFakeAsset" class="info-s has-tag">假</span>
        <span v-if="ifDownQuick()" class="buy-s has-tag">跌快</span>
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
        <p>原买：{{indexRawBuyNumber}}</p>
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
const kuanji = operatingTooltip.kuanji

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
    jukui () {
      const incomeRate = this.countDifferenceRate((this.hasCount * (100 + this.rate) / 100), this.costCount)
      return incomeRate < -2 && this.positionWarn === 'danger'
    },
    ifHas () {
      return this.hasCount > 0
    },
    ifJigou () {
      return jigou.indexOf(this.indexInfo.key) !== -1
    },
    ifLaji () {
      return laji.indexOf(this.indexInfo.key) !== -1
    },
    ifKuanji () {
      return kuanji.indexOf(this.indexInfo.key) !== -1
    },
    // 是否处于反弹
    ifInFantan () {
      return this.indexNiuXiong === '大反' || this.indexNiuXiong === '小反'
    },
    ifInDafan () {
      return this.indexNiuXiong === '大反'
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
        this.hasCount,
        true
      )
    },
    indexRawBuyNumber () {
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
    },
    noSellIndex () {
      return storageUtil.getNoSell(this.indexInfo.key) || false
    },
    ifFakeAsset () {
      const fake = storageUtil.getAppConfig('fake') || '真'
      return fake === '假'
    }
  },
  mounted () {
  },
  methods: {
    // 是否涨得太快
    ifUpQuick () {
      // 两天涨得多
      if (this.netChangeRatioListLarge[0] > 0 && this.netChangeRatioListLarge[1] > 0) {
        if ((this.netChangeRatioListLarge[0] + this.netChangeRatioListLarge[1]) > this.indexInfo.rate * 4) {
          return true
        }
      }
      if (this.netChangeRatioListLarge[0] > 0 && this.netChangeRatioListLarge[1] > 0 && this.netChangeRatioListLarge[2] > 0) {
        if ((this.netChangeRatioListLarge[0] + this.netChangeRatioListLarge[1] + this.netChangeRatioListLarge[2]) > this.indexInfo.rate * 6) {
          return true
        }
      }
      return false
    },
    // 是否跌得太快
    ifDownQuick () {
      if (this.netChangeRatioListLarge[0] < 0 && this.netChangeRatioListLarge[1] < 0 && this.netChangeRatioListLarge[2] < 0) {
        if ((this.netChangeRatioListLarge[0] + this.netChangeRatioListLarge[1] + this.netChangeRatioListLarge[2]) < -(this.indexInfo.rate * 4)) {
          return true
        }
      }
      return false
    },
    ifJieFantan () {
      return (
        (this.indexNiuXiong === '大反' || this.indexNiuXiong === '小反') &&
        (this.ifThreeUp || this.ifFourUp || this.ifFiveUp)
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
    noSell (list) {
      let newList = []
      for (let i = 0; i < list.length; i++) {
        if (list[i] !== 'sell') {
          newList.push(list[i])
        }
      }
      return newList
    },
    ifxiaofan () {
      return this.ifSixFive || (this.averageMonthIndex > 0 && this.ifThreeDown)
    },
    ifDafan () {
      if (this.ifFourDown || this.ifFiveDown || this.ifSevenSix) {
        return true
      } else if (this.indexInfo.key === 'baoxian' && this.ifSixFive) {
        return true
      }
      return false
    },
    getItemClass () {
      // 市场阶段
      const question9 = storageUtil.getMarketStatus('question_9')
      const myMonthRate = storageUtil.getAppConfig('myMonthRate')
      const buyClass = 'buy'
      const sellClass = 'sell'
      const classList = []
      let shouldClass = ''
      const buySellList = this.buySellList
      classList.push(this.ifHas ? 'has' : 'no-has')
      classList.push(this.lock ? 'lock' : 'no-lock')
      // 涨4,5天了必须开始卖
      if (this.ifFiveUp || this.ifFourUp) {
        classList.push(sellClass)
      }
      // 涨快了
      // if (this.ifUpQuick()) {
      //   classList.push(sellClass)
      // }
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
        if (question9 !== '筑顶后大跌') {
          if (this.jukui) {
            // 巨亏的那就得卖
            classList.push(sellClass)
          } else if (this.averageMonthIndex < 0) {
            // 在月线以下，就得卖，除了大反
            if (!this.ifInDafan) {
              classList.push(sellClass)
            }
          } else {
            // 如果是卖出信号，那就判断是不是出于大反或者小反
            if (this.ifInFantan) {
              // 处于反弹期的指数，不属于筑顶的，要解反了才能卖
              if (this.ifJieFantan()) {
                // 或者解除反弹了
                classList.push(sellClass)
              }
            } else {
              // 不处于反弹期才可以卖
              classList.push(sellClass)
            }
          }
        } else {
          classList.push(sellClass)
        }
      } else {
        // ----------------------应该买的部分
        // 没有其他信号
        // 不是筑顶阶段才行
        // 连续跌三天
        if (this.ifThreeDown) {
          if (this.ifKuanji) {
            // 宽基指数可以买
            shouldClass = 'should-buy'
          } else {
            // 其他指数得要线上才能买
            if (this.averageMonthIndex > 0) {
              shouldClass = 'should-buy'
            }
            if (this.ifDownQuick()) {
              shouldClass = 'should-buy'
            }
          }
        }
        // 连跌4天或者5天，都能买
        if (this.ifFourDown || this.ifFiveDown) {
          shouldClass = 'should-buy'
        }
        // 跌很多天
        if (this.ifSixFive || this.ifSevenSix) {
          shouldClass = 'should-buy'
        }
        // ----------------------应该卖的部分
        if (this.otherBuySellList[0] !== 'buy' && shouldClass === '' && this.rate < 0) {
          // 研究过了，线上确实可以不杀跌
          if (this.averageMonthIndex < 0 && !this.ifInFantan && !this.ifThreeDown) {
            if (question9 === '筑底') {
              if (this.positionWarn === 'danger') {
                shouldClass = 'should-sell'
              }
            } else {
              shouldClass = 'should-sell'
            }
          }
        }
      }
      classList.push(shouldClass)
      let classListF = classList
      if (this.noSellIndex) {
        if (this.rate < 0) {
          // 锁仓阶段可以跌了就买
          classList.push('should-buy')
        }
        // 在趋势中，什么卖出信号都不用管
        classListF = this.noSell(classList)
      }
      return classListF
    }
  }
}
</script>
