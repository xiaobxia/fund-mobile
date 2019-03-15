<template>
  <mt-cell-swipe :to="toUrl"
                 :class="['operating-info-item',buySellList[0], hasCount > 0 ? 'has':'no-has', 'should-' + shouldDo, lock ?'lock':'no-lock']">
    <div slot="title">
      <h3>
        {{indexInfo.name}}
        <i v-if="indexInfo.goodBad === '利空' || ifBad" class="good-bad-tag fas fa-ban"></i>
        <i v-if="ifForceSell" class="good-bad-tag fa fa-battery-quarter"></i>
        <i v-if="shouldDo === 'sell' && ifSlowDecline" class="good-bad-tag fas fa-feather"></i>
        <span v-if="hasCount > 0" :class="['has-icon', buySellList[0]]"><i class="fas fa-hand-holding-usd"></i></span>
        <span v-if="hasCount" class="has-count">{{hasCount}}</span>
        <span v-if="getLossWarn" class="danger-tag">巨亏</span>
        <span v-if="positionWarn === 'danger'" class="danger-tag">危仓</span>
        <span v-if="positionWarn === 'warn'" class="warn-tag">高仓</span>
        <span class="buy-info">买金额:{{buyItem}}</span>
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
      </div>
      <div class="left-tag">
        <span v-if="flagTrue === 'sell' && hasCount > 0" class="low-sell top"><i class="fas fa-long-arrow-alt-down"></i></span>
        <span v-if="flagTrue === 'buy' && hasCount > 0" class="up-buy top"><i class="fas fa-long-arrow-alt-up"></i></span>
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
    flagTrue () {
      return operatingTooltip.ifFlagTrue(this.buySellList, this.closeList)
    },
    buyItem () {
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
    // 连续两个买入信号以后还在跌
    ifBad () {
      return operatingTooltip.ifBad(this.netChangeRatioList, this.buySellList, this.closeList)
    },
    ifForceSell () {
      // 联合两边的
      let buySell = []
      for (let i = 0; i < 5; i++) {
        if (this.buySellList[i] !== '') {
          buySell.push(this.buySellList[i])
        } else {
          buySell.push(this.otherBuySellList[i])
        }
      }
      return operatingTooltip.ifForceSell(this.netChangeRatioList, buySell, this.closeList)
    },
    ifSlowDecline () {
      const a = this.netChangeRatioList[0]
      const b = this.netChangeRatioList[1]
      const c = -0.5
      if (a < 0 && b < 0) {
        if (a > c && b > c) {
          return true
        }
      }
      return false
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
