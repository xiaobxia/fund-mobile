<template>
  <mt-cell-swipe :to="toUrl"
                 :class="['operating-info-item',buySellList[0], hasCount > 0 ? 'has':'no-has', 'should-' + shouldDo, lock ?'lock':'no-lock']">
    <div slot="title">
      <h3>
        <span class="index-name">{{indexInfo.name}}</span>
        <!--<i v-if="ifBuyFlagInvalid" class="good-bad-tag fas fa-ban"></i>-->
        <!--<i v-if="ifThreeSell" class="good-bad-tag fab fa-sellcast"></i>-->
        <!--<i v-if="ifWeak" class="good-bad-tag fa fa-battery-quarter"></i>-->
        <!--<i v-if="ifSpeedUpDown" class="good-bad-tag fas fa-rocket"></i>-->
        <!--<i v-if="ifOverheated" class="good-bad-tag fab fa-hotjar"></i>-->
        <!--<i v-if="ifDownSpeedDown" class="good-bad-tag fas fa-hands"></i>-->
        <!--<i v-if="ifSingleUp" class="good-bad-tag fas fa-street-view"></i>-->
        <!--<i v-if="ifSingleDown" class="good-bad-tag fas fa-street-view"></i>-->
        <!--<i v-if="ifUpSpeedDown" class="good-bad-tag fas fa-exclamation-triangle"></i>-->
        <span v-if="hasCount" class="has-count">{{hasCount}}</span>
        <!--<span v-if="getLossWarn" class="danger-tag operate-tag">巨亏</span>-->
        <span v-if="positionWarn === 'danger'" class="danger-tag operate-tag">危仓</span>
        <span v-if="positionWarn === 'warn'" class="warn-tag operate-tag">高仓</span>
        <span class="buy-info">买:{{indexBuyNumber}}</span>
        <span class="buy-info">卖:{{indexSellNumber}}</span>
        <span v-if="indexNiuXiong === '牛'" class="buy has-tag">{{indexNiuXiong}}</span>
        <span v-if="indexNiuXiong === '小牛'" class="buy has-tag">{{indexNiuXiong}}</span>
        <span v-if="indexNiuXiong === '熊'" class="sell has-tag">{{indexNiuXiong}}</span>
        <span v-if="averageMonthIndex > 0.5" class="buy has-tag">多</span>
        <span v-if="averageMonthIndex > 0 && averageMonthIndex <= 0.5" class="buy has-tag">乐观</span>
        <span v-if="averageMonthIndex <= 0 && averageMonthIndex >= -0.5" class="sell has-tag">谨慎</span>
        <span v-if="averageMonthIndex < -0.5" class="sell has-tag">空</span>
        <span v-if="ifThreeDown" class="buy-s has-tag">1/3</span>
        <span v-if="ifFiveFour" class="buy-s has-tag">买</span>
        <span v-if="ifSixFive" class="buy-s has-tag">走牛</span>
        <span v-if="ifThreeSell" class="sell-s has-tag">3卖</span>
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
        <p class="purple-text" v-if="positionWarn === 'danger'">又是危仓又是卖出信号，那必须的卖</p>
        <p class="purple-text" v-if="ifJigou">机构的票，卖出不要看简</p>
        <p v-if="rate <= -3">是否有利空？是就先不接，标记利空，不是也不要接太多</p>
        <p v-if="ifWeak">进入弱势期,卖出信号不多那就应该减仓</p>
        <p v-if="ifSpeedUpDown">下跌在加速</p>
        <p v-if="ifBuyFlagInvalid">买入信号开始坑人</p>
        <p v-if="ifOverheated">过热危险，需要减仓</p>
        <p v-if="ifUpSpeedDown">卖出信号后转弱，需要减仓</p>
        <p v-if="ifDownSpeedDown">跌势减弱，可以等等</p>
        <p v-if="ifSingleUp">下跌中一支独秀，需要减仓，特别是还出了卖出信号</p>
        <p v-if="ifSingleDown">上涨中一支独秀，需要减仓</p>
        <p v-if="ifThreeSell">连续卖出信号</p>
      </div>
      <div class="left-tag">
        <span v-if="buySellFlagTrue === 'sell' && hasCount > 0" class="low-sell top"><i class="fas fa-long-arrow-alt-down"></i></span>
        <span v-if="buySellFlagTrue === 'buy' && hasCount > 0" class="up-buy top"><i class="fas fa-long-arrow-alt-up"></i></span>
        <span v-if="ifStepUp" class="up-tag red-text mid"><i class="fas fa-level-up-alt"></i></span>
        <span v-if="ifStepDown" class="down-tag green-text mid"><i class="fas fa-level-down-alt"></i></span>
        <span v-if="changeMarket" class="change-tag bottom"><i class="fas fa-exchange-alt"></i></span>
      </div>
      <div class="right-tag">
        <span v-if="lock" class="lock-tag top"></span>
        <span v-if="indexAverage > 0" class="up-tag red-text mid"><i class="fas fa-angle-double-up"></i></span>
        <span v-if="indexAverage < 0" class="down-tag green-text mid"><i class="fas fa-angle-double-down"></i></span>
      </div>
    </div>
  </mt-cell-swipe>
</template>

<script>
import storageUtil from '@/util/storageUtil.js'
import operatingTooltip from '@/util/operatingTooltip.js'

const jigou = operatingTooltip.jigou

export default {
  name: 'OperatingInfoItem',
  data () {
    return {
    }
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
    ifJigou () {
      return jigou.indexOf(this.indexInfo.key) !== -1
    },
    shouldDo () {
      return operatingTooltip.getShouldDo(this.netChangeRatioList, this.buySellList, this.closeList)
    },
    positionWarn () {
      return operatingTooltip.getPositionWarn(this.indexInfo, this.hasCount)
    },
    getLossWarn () {
      return operatingTooltip.getLossWarn(this.hasCount, this.costCount)
    },
    changeMarket () {
      return storageUtil.getChangeMarket(this.indexInfo.key) || false
    },
    otherBuySellList () {
      if (this.type === '简') {
        return storageUtil.getXiongBuySellList(this.indexInfo.key)
      } else {
        return storageUtil.getJianBuySellList(this.indexInfo.key)
      }
    },
    ifStepUp () {
      return operatingTooltip.ifStepUp(this.netChangeRatioList, this.closeList)
    },
    ifStepDown () {
      return operatingTooltip.ifStepDown(this.netChangeRatioList, this.closeList)
    },
    indexAverage () {
      return storageUtil.getAverage(this.indexInfo.key) || 0
    },
    indexNiuXiong () {
      const niuXiong = storageUtil.getIndexNiuXiong(this.indexInfo.key)
      return niuXiong === '正常' ? '' : niuXiong
    },
    buySellFlagTrue () {
      return operatingTooltip.ifBuySellFlagTrue(this.buySellList, this.closeList)
    },
    indexBuyNumber () {
      return operatingTooltip.getIndexBuyNumber(
        this.type,
        this.indexInfo,
        {
          buyFlagCount: this.buyCount,
          sellFlagCount: this.sellCount
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
    // 买入信号失效，连续两个买入信号以后还在跌
    ifBuyFlagInvalid () {
      return operatingTooltip.ifBuyFlagInvalid(this.netChangeRatioList, this.buySellList)
    },
    // 是否进入弱势期
    ifWeak () {
      // 联合两边的
      let buySell = []
      for (let i = 0; i < 5; i++) {
        if (this.buySellList[i] !== '') {
          buySell.push(this.buySellList[i])
        } else {
          buySell.push(this.otherBuySellList[i])
        }
      }
      return operatingTooltip.ifWeak(this.netChangeRatioList, buySell, this.closeList)
    },
    // 是否加速下跌
    ifSpeedUpDown () {
      return operatingTooltip.ifSpeedUpDown(this.netChangeRatioList)
    },
    // 是否过热
    ifOverheated () {
      return operatingTooltip.ifOverheated(this.positionWarn, this.buySellList)
    },
    ifUpSpeedDown () {
      return operatingTooltip.ifUpSpeedDown(this.netChangeRatioList, this.buySellList)
    },
    ifDownSpeedDown () {
      return operatingTooltip.ifDownSpeedDown(this.netChangeRatioList, this.buySellList)
    },
    ifSingleUp () {
      return this.countUpNumber < 6 && this.rate > 0
    },
    ifSingleDown () {
      return this.countDownNumber < 6 && this.rate < 0
    },
    ifThreeSell () {
      return this.buySellList[0] === 'sell' && this.buySellList[1] === 'sell' && this.buySellList[2] === 'sell'
    },
    ifThreeDown () {
      return this.netChangeRatioList[0] < 0 && this.netChangeRatioList[1] < 0 && this.netChangeRatioList[2] < 0
    },
    ifFiveFour () {
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
        if (this.netChangeRatioListLarge[6] > 0) {
          count++
        }
        if (count < 2) {
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
  }
}
</script>
