<template>
  <mt-cell-swipe :to="toUrl"
                 :class="['operating-info-item',buySellList[0], hasCount > 0 ? 'has':'no-has', 'should-' + shouldDo, lock ?'lock':'no-lock']">
    <div slot="title">
      <h3>
        <span class="index-name">{{indexInfo.name}}</span>
        <i v-if="indexInfo.goodBad === '利空' || ifBuyFlagInvalid" class="good-bad-tag fas fa-ban"></i>
        <i v-if="ifWeak" class="good-bad-tag fa fa-battery-quarter"></i>
        <i v-if="ifSpeedUpDown" class="good-bad-tag fas fa-rocket"></i>
        <i v-if="ifOverheated" class="good-bad-tag fab fa-hotjar"></i>
        <i v-if="ifUpSpeedDown" class="good-bad-tag fas fa-exclamation-triangle"></i>
        <span v-if="hasCount" class="has-count">{{hasCount}}</span>
        <span v-if="getLossWarn" class="danger-tag">巨亏</span>
        <span v-if="positionWarn === 'danger'" class="danger-tag">危仓</span>
        <span v-if="positionWarn === 'warn'" class="warn-tag">高仓</span>
        <span class="buy-info">买金额:{{indexBuyNumber}}</span>
        <span class="buy-info">卖金额:{{indexSellNumber}}</span>
        <span style="float: right" :class="numberClass(rate)">{{rate}}%</span>
      </h3>
      <p class="explain">
            <span v-for="(subItem, index) in buySellList" :key="subItem + index"
                  :class="subItem">{{subItem === 'buy'?'买':subItem === 'sell'?'卖':''}}</span>
      </p>
      <p class="netChange">
            <span v-for="(subItem, index) in netChangeRatioList" :key="index"
                  :class="numberClass(subItem)"></span>
      </p>
      <p class="otherBuySellList">
            <span v-for="(subItem, index) in otherBuySellList" :key="index"
                  :class="subItem">{{subItem}}</span>
      </p>
      <div class="other-text">
        <p v-if="rate <= -3">是否有利空？是就先不接，标记利空，不是也不要接太多</p>
        <p v-if="ifWeak">进入弱势期,卖出信号不多那就应该减仓</p>
        <p v-if="ifSpeedUpDown">下跌在加速</p>
        <p v-if="ifBuyFlagInvalid">买入信号开始坑人</p>
        <p v-if="ifOverheated">过热危险，需要减仓</p>
        <p v-if="ifUpSpeedDown">卖出信号后转弱，需要减仓</p>
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
    type: {
      type: String,
      default: '简'
    }
  },
  computed: {
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
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
