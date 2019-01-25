<template>
  <div>
    <div class="count-wrap">
      <div class="item">
        <span class="label">信号比：</span>
        <span class="red-text">{{buyCount}}</span>
        <span>:</span>
        <span class="green-text">{{sellCount}}</span>
      </div>
      <div class="item">
        <span class="label">涨跌比：</span>
        <span class="red-text">{{countUpNumber}}</span>
        <span>:</span>
        <span class="green-text">{{countDownNumber}}</span>
      </div>
      <div class="item">
        <span class="label">涨概率：</span>
        <span class="red-text">{{upFinalRate}}%</span>
      </div>
      <div class="item">
        <span class="label">跌概率：</span>
        <span class="green-text">{{downFinalRate}}%</span>
      </div>
      <div class="item">
        <span class="label">昨日买信号：</span>
        <span class="red-text">{{lastDayBuy[0]}}/{{lastDayBuy[1]}}</span>
      </div>
      <div class="item">
        <span class="label">昨日卖信号：</span>
        <span class="green-text">{{lastDaySell[0]}}/{{lastDaySell[1]}}</span>
      </div>
      <div class="item">
        <span class="label">买金额：</span>
        <span class="red-text">{{buyOne}}</span>
      </div>
    </div>
    <div class="warn-wrap">
      <p v-if="ifOperatingTime" class="red-text">操作前应该去标记市场状况</p>
      <p v-if="sellCountLastDay >= 10">市场大量卖出却没有跌，可以认为市场强</p>
      <p v-if="buyCountLastDay >= 10">该涨不涨那市场就定为弱，一次可以忍，两次不行</p>
      <p v-if="question1 === '弱'">买入只看熊，熊里的卖出一定卖</p>
      <p v-if="question1 === '强'">市场强没出卖点就加</p>
      <p v-if="nowMonthRate < -2">月线进入-2，减仓到半仓</p>
    </div>
  </div>
</template>

<script>
import storageUtil from '@/util/storageUtil.js'
import operatingTooltip from '@/util/operatingTooltip.js'

export default {
  name: 'OperatingWarn',
  data () {
    const question1 = storageUtil.getMarketStatus('question_1')
    const question2 = storageUtil.getMarketStatus('question_2')
    const question3 = storageUtil.getMarketStatus('question_3')
    const question4 = storageUtil.getMarketStatus('question_4')
    const question5 = storageUtil.getMarketStatus('question_5')
    const question6 = storageUtil.getMarketStatus('question_6')
    const question7 = storageUtil.getMarketStatus('question_7')

    let ifOperatingTime = false
    const hour = new Date().getHours()
    if (hour === 14) {
      const Minute = new Date().getMinutes()
      if (Minute >= 40) {
        ifOperatingTime = true
      }
    }
    return {
      ifOperatingTime,
      question1,
      question2,
      question3,
      question4,
      question5,
      question6,
      question7
    }
  },
  props: {
    buyCount: {
      type: Number,
      default: 0
    },
    sellCount: {
      type: Number,
      default: 0
    },
    countUpNumber: {
      type: Number,
      default: 0
    },
    countDownNumber: {
      type: Number,
      default: 0
    },
    sellCountLastDay: {
      type: Number,
      default: 0
    },
    buyCountLastDay: {
      type: Number,
      default: 0
    },
    nowMonthRate: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: '简'
    },
    lastDaySell: {
      type: Array,
      default: function () {
        return [0, 0]
      }
    },
    lastDayBuy: {
      type: Array,
      default: function () {
        return [0, 0]
      }
    }
  },
  computed: {
    upFinalRate () {
      return operatingTooltip.upDownFinalRate(this.buyCount, this.sellCount).upRate
    },
    downFinalRate () {
      return operatingTooltip.upDownFinalRate(this.buyCount, this.sellCount).downRate
    },
    buyOne () {
      return operatingTooltip.getBuyNumber(this.type, this.upFinalRate)
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
