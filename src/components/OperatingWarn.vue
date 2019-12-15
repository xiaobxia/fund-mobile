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
      <p>本月收益率：{{myMonthRate}}%</p>
      <p  v-if="ifNiandi">年底机构结账，保护收益</p>
      <p v-if="myMonthRate>=1.8" class="black-text">建议开始锁定收益，有一个降到60仓的过程，然后再重新按照信号做</p>
      <p class="purple-text bold-text">{{question9}}阶段</p>
      <p>买比{{buy}} 卖比{{sell}}</p>
      <p>大反:{{niuxiong[0]}} 定投:{{niuxiong[3]}} 小反:{{niuxiong[1]}} 正常:{{niuxiong[2]}}</p>
      <!--<p v-if="monthAverage[0]>=16" class="purple-text">可以不卖，高仓的还是要卖</p>-->
      <!--<p v-if="(monthAverage[0]+monthAverage[1])<16" class="purple-text">出卖信号就得卖</p>-->
      <!--<p v-if="(monthAverage[2]+monthAverage[3])>=16" class="purple-text">可以杀跌</p>-->
      <p class="black-text">不要追，不管什么情况</p>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import storageUtil from '@/util/storageUtil.js'
import dateUtil from '@/util/dateUtil.js'

export default {
  name: 'OperatingWarn',
  data () {
    const buy = storageUtil.getAppConfig('buy')
    const sell = storageUtil.getAppConfig('sell')
    const myMonthRate = storageUtil.getAppConfig('myMonthRate')
    const question1 = storageUtil.getMarketStatus('question_1')
    const question2 = storageUtil.getMarketStatus('question_2')
    const question3 = storageUtil.getMarketStatus('question_3')
    const question4 = storageUtil.getMarketStatus('question_4')
    const question5 = storageUtil.getMarketStatus('question_5')
    const question6 = storageUtil.getMarketStatus('question_6')
    const question8 = storageUtil.getMarketStatus('question_8')
    const question9 = storageUtil.getMarketStatus('question_9')

    let ifOperatingTime = false
    const hour = dateUtil.getDate().getHours()
    if (hour === 14) {
      const Minute = dateUtil.getDate().getMinutes()
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
      question8,
      question9,
      buy: buy || 1,
      sell: sell || 1,
      myMonthRate: myMonthRate || 0
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
    },
    niuxiong: {
      type: Array,
      default: function () {
        return [0, 0, 0, 0, 0, 0]
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
      return moment().isAfter('2020-09-23') && moment().isBefore('2020-10-11')
    },
    ifLiuyi () {
      const d = this.getDate()
      const day = d.getDate()
      const month = d.getMonth() + 1
      return month === 5 && day > 22
    },
    ifNiandi () {
      const d = this.getDate()
      const month = d.getMonth()
      return month === 10 || month === 11
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
