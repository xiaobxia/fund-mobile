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
        <span class="label">昨日买信号：</span>
        <span class="red-text">{{lastDayBuy[0]}}/{{lastDayBuy[1]}}</span>
      </div>
      <div class="item">
        <span class="label">昨日卖信号：</span>
        <span class="green-text">{{lastDaySell[0]}}/{{lastDaySell[1]}}</span>
      </div>
    </div>
    <div class="warn-wrap">
      <p v-if="sellCount > 12" class="black-text">想要追也别在大涨的日子追，没有多少底仓的时候也不能追</p>
      <p v-if="question9 === '是'" class="purple-text">今天的盘面很危险，大跌的概率超高！！</p>
      <p v-if="question8 === '吃力'" class="purple-text">挣钱变吃力，出现卖出信号一定得卖</p>
      <p v-if="ifLiuyi" class="purple-text">小心六一</p>
      <p v-if="isChunJie" class="purple-text">春节前后配置创业板和传媒电子计算机</p>
      <p v-if="ifOperatingTime" class="red-text">操作前应该去标记市场状况</p>
      <p v-if="question1 === '强'" class="red-text">市场特别强势的时候，阴线策略应该看3天，一般强势看2天</p>
      <p v-if="question1 === '弱'" class="red-text">市场弱势的时候，阴线策略看1天</p>
      <p class="red-text">出做空信号，感觉盘面也不强，那就要缩仓</p>
      <p v-if="sellCountLastDay >= 10">市场大量卖出却没有跌，可以认为市场强</p>
      <p v-if="buyCountLastDay >= 10">该涨不涨那市场就定为弱，一次可以忍，两次不行</p>
      <p v-if="question1 === '弱'">买入只看熊，熊里的卖出一定卖</p>
      <p v-if="question1 === '强'">市场强没出卖点就加</p>
      <p v-if="nowMonthRate < -2" class="purple-text">月线进入-2，减仓到半仓</p>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import storageUtil from '@/util/storageUtil.js'

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
    const question8 = storageUtil.getMarketStatus('question_8')
    const question9 = storageUtil.getMarketStatus('question_9')

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
      question7,
      question8,
      question9
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
    isChunJie () {
      // 是否是春节前后
      // 2020-01-19 2020-02-07
      return moment().isAfter('2020-01-19') && moment().isBefore('2020-02-07')
    },
    isGuoqing () {
      return moment().isAfter('2019-09-23') && moment().isBefore('2019-10-11')
    },
    ifLiuyi () {
      const d = new Date()
      const day = d.getDate()
      const month = d.getMonth() + 1
      return month === 5 && day > 22
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
