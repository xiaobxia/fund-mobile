<template>
  <mt-cell-swipe :to="toUrl"
                 :class="['operating-info-item', ...getItemClass()]">
    <div slot="title">
      <h3>
        <span class="index-name">{{indexInfo.name}}</span>
        <span v-if="lock" class="fm-icon lock"></span>
        <span v-if="ifDownTrend" class="fm-tag s-green">下</span>
        <span v-if="ifHot" class="fm-tag s-green">热</span>
        <span v-if="positionWarn === 'danger'" class="fm-tag s-yellow">危</span>
        <span v-if="positionWarn === 'warn'" class="fm-tag s-green">高</span>
        <span v-if="indexNiuXiong === '定投'" class="fm-tag s-red">{{indexNiuXiong}}</span>
        <span v-if="indexNiuXiong === '大反'" class="fm-tag s-red">{{indexNiuXiong}}</span>
        <span v-if="indexNiuXiong === '小反'" class="fm-tag s-red">{{indexNiuXiong}}</span>
        <span v-if="noSellIndex || noSellCount >= 18" class="fm-tag s-red">锁仓</span>
        <span v-if="averageMonthIndex > 0" class="fm-tag b-red">乐观</span>
        <span v-if="averageMonthIndex <= 0" class="fm-tag s-green">空</span>
        <span v-if="!ifDafan() && ifxiaofan()" class="fm-tag s-red">小</span>
        <span v-if="ifDafan()" class="fm-tag s-red">大</span>
        <span v-if="ifDafan() || ifxiaofan()" class="fm-tag s-yellow">买原</span>
        <span v-if="ifFiveUp" class="fm-tag s-yellow">涨5</span>
        <span v-if="indexNiuXiong === '定投' && averageHalfYear >= 0" class="fm-tag s-blue">解定</span>
        <span v-if="ifJieFantan()" class="fm-tag s-blue">解反</span>
        <span v-if="ifUpQuick()" class="fm-tag b-green">涨快</span>
        <!--<span v-if="ifThreeUp && ifLaji" class="fm-tag s-green">卖</span>-->
        <!--<span v-if="ifFourUp && ifLaji" class="fm-tag s-green">卖1/3</span>-->
        <!--<span v-if="ifFiveUp && ifLaji" class="fm-tag s-green">卖1/2</span>-->
        <span v-if="jukui" class="fm-tag s-yellow">巨亏</span>
        <span v-if="ifDownQuick()" class="fm-tag s-red">跌快</span>
        <span style="float: right" :class="stockNumberClass(rate)">{{rate}}%</span>
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
          <span class="item">
              <span class="label">持有金额：</span>
              <span class="value">{{hasCount}}</span>
            </span>
        <span class="item">
              <span class="label">卖出金额：</span>
              <span class="value green-text">{{indexSellNumber}}</span>
            </span>
        <span class="item">
              <span class="label">买入金额：</span>
              <span class="value red-text">{{indexBuyNumber}}</span>
            </span>
            <span class="item">
              <span class="label">原买：</span>
              <span class="value">{{indexRawBuyNumber}}</span>
            </span>
      </div>
    </div>
  </mt-cell-swipe>
</template>

<script>
import storageUtil from '@/util/storageUtil.js'
import operatingTooltip from '@/util/operatingTooltip.js'
import indexType from '@/common/indexType.js'

const jigou = indexType.jigou
const laji = indexType.laji
const kuanji = indexType.kuanji

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
    noSellCount: {
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
    },
    nowMonthRate: {
      type: Number,
      default: 0
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
        return storageUtil.getData('xiongBuySellList', this.indexInfo.key) || []
      } else {
        return storageUtil.getData('jianBuySellList', this.indexInfo.key) || []
      }
    },
    allBuySellList () {
      const xiong = storageUtil.getData('xiongBuySellList', this.indexInfo.key) || []
      const jian = storageUtil.getData('jianBuySellList', this.indexInfo.key) || []
      const newList = []
      xiong.forEach((item, index) => {
        if (item) {
          newList[index] = item
        } else {
          if (jian[index]) {
            newList[index] = jian[index]
          } else {
            newList[index] = ''
          }
        }
      })
      return newList
    },
    indexNiuXiong () {
      const niuXiong = storageUtil.getData('stockIndexFlag', this.indexInfo.key)
      return niuXiong === '正常' ? '' : niuXiong
    },
    indexBuyNumber () {
      return operatingTooltip.getIndexBuyNumber(
        this.type,
        this.indexInfo,
        {
          buyFlagCount: this.buyCount,
          sellFlagCount: this.sellCount,
          netChangeRatio: this.rate,
          netChangeRatioList: this.netChangeRatioList,
          noSellCount: this.noSellCount
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
          netChangeRatio: this.rate,
          netChangeRatioList: this.netChangeRatioList,
          noSellCount: this.noSellCount
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
          sellFlagCount: this.sellCount,
          noSellCount: this.noSellCount
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
    ifTwoUp () {
      return (
        this.netChangeRatioListLarge[0] > 0 &&
        this.netChangeRatioListLarge[1] > 0 &&
        this.netChangeRatioListLarge[2] <= 0
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
      return storageUtil.getData('averageMonth', this.indexInfo.key) || 0
    },
    averageHalfYear () {
      return storageUtil.getData('averageHalfYearIndex', this.indexInfo.key) || 0
    },
    // 是否出于下降趋势
    ifDownTrend () {
      const averageMonthClose = storageUtil.getData('averageMonthClose', this.indexInfo.key) || 0
      const averageHalfYearIndexClose = storageUtil.getData('averageHalfYearIndexClose', this.indexInfo.key) || 0
      // 进入定投区域了那就不是下降趋势
      return averageMonthClose < averageHalfYearIndexClose && this.indexNiuXiong !== '定投'
    },
    noSellIndex () {
      return storageUtil.getData('noSell', this.indexInfo.key) || false
    },
    ifHot () {
      const averageMonth = storageUtil.getData('averageMonth', this.indexInfo.key) || 0
      return averageMonth >= this.indexInfo.reduceLine
    }
  },
  created () {
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
      // 下降趋势两天就解反
      if (this.ifDownTrend) {
        return (
          (this.indexNiuXiong === '大反' || this.indexNiuXiong === '小反') &&
          (this.ifTwoUp || this.ifThreeUp || this.ifFourUp || this.ifFiveUp)
        )
      } else {
        return (
          ((this.indexNiuXiong === '大反' || this.indexNiuXiong === '小反') &&
          (this.ifThreeUp || this.ifFourUp || this.ifFiveUp)) ||
          (this.indexNiuXiong === '小反' && this.ifTwoUp)
        )
      }
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
        if (list[i] !== 'sell' && list[i] !== 'should-sell') {
          newList.push(list[i])
        }
      }
      return newList
    },
    noBuy (list) {
      let newList = []
      for (let i = 0; i < list.length; i++) {
        if (list[i] !== 'buy' && list[i] !== 'should-buy') {
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
      const question10 = storageUtil.getData('stockMarketQuestion', 'question_10')
      // 持续恐慌
      const question9 = storageUtil.getData('stockMarketQuestion', 'question_9')
      // 市场阶段
      const question1 = storageUtil.getData('stockMarketQuestion', 'question_1')
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
        if (this.ifTwoUp || this.ifThreeUp || this.ifFourUp || this.ifFiveUp) {
          classList.push(sellClass)
        }
      }
      // 下降趋势不要技术分析的买入信号
      if (buySellList[0] === buyClass && !this.ifLaji && !this.ifDownTrend) {
        // 如果是买入信号，那就直接红色，返回
        // 垃圾指数的买入信号，不会提示买入
        classList.push(buyClass)
      } else if (buySellList[0] === sellClass) {
        if (question1 !== '筑顶后大跌' && question9 !== '是') {
          if (this.jukui && this.averageHalfYear < 0) {
            // 巨亏的那就得卖
            classList.push(sellClass)
          } else if (this.averageMonthIndex < 0) {
            // 在月线以下，就得卖，除了大反
            if (!this.ifInDafan) {
              classList.push(sellClass)
            } else {
              if (this.ifJieFantan()) {
                // 或者解除反弹了
                classList.push(sellClass)
              }
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
        // 下降趋势不要小反
        if (this.ifThreeDown && !this.ifDownTrend) {
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
        if (this.allBuySellList[0] !== 'buy' && shouldClass === '' && this.rate < 0) {
          // 研究过了，线上确实可以不杀跌
          if (this.averageMonthIndex < 0 && !this.ifInFantan && !this.ifThreeDown) {
            shouldClass = 'should-sell'
          }
        }
      }
      classList.push(shouldClass)
      // 转弱了，加一个卖出信号
      // 写在这没问题，因为筑顶的时候的大反，基本都是失效的
      if (question10 === '是' && this.rate > 0) {
        classList.push(sellClass)
      }
      let classListF = classList
      // 锁仓的没有卖出高亮
      if (this.lock) {
        classListF = this.noSell(classList)
      }
      // 定投阶段没有卖出高亮
      if (this.indexNiuXiong === '定投') {
        classListF = this.noSell(classList)
      }
      // 持续恐慌事件那就不要买了
      if (question9 === '是') {
        classListF = this.noBuy(classList)
        return classListF
      }
      if (this.noSellIndex || this.noSellCount >= 18) {
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
