<template>
  <div>
    <div class="warn-wrap">
      <div class="fm-warn blue">波段仓砍仓要狠，定投才是大头</div>
      <div class="fm-warn red">波段仓一定要遵守交易纪律</div>
      <div class="fm-warn blue">处在高位危险，信号一会儿让卖一会儿又不让卖的，那就卖掉</div>
      <div class="fm-warn grey">冒着绿光的才卖，不要被迷惑</div>
      <div class="fm-warn blue">处在高位危险区，又走坏了，保住利润是第一位，向上空间很小，向下空间很大</div>
      <div class="fm-warn green" v-if="ifNiandi">年底机构结账，保护收益</div>
    </div>
    <div class="detail-info-wrap" :class="{feng: ifFengNiu}">
      <div class="item">
        <span class="label">信号比：</span>
        <span class="value">
          <span class="red-text">{{buyCount}}</span>
          <span>:</span>
          <span class="green-text">{{sellCount}}</span>
        </span>
      </div>
      <div class="item">
        <span class="label">涨跌比：</span>
        <span class="value">
          <span class="red-text">{{countUpNumber}}</span>
          <span>:</span>
          <span class="green-text">{{countDownNumber}}</span>
        </span>
      </div>
      <div class="item">
        <span class="label">昨日买信号：</span>
        <span class="value">
          <span class="red-text">{{lastDayBuy[0]}}/{{lastDayBuy[1]}}</span>
        </span>
      </div>
      <div class="item">
        <span class="label">昨日卖信号：</span>
        <span class="value">
          <span class="green-text">{{lastDaySell[0]}}/{{lastDaySell[1]}}</span>
        </span>
      </div>
      <div class="item">
        <span class="label">本月收益率：</span>
        <span class="value">
          <span :class="stockNumberClass(nowMonthRate)">{{nowMonthRate}}%</span>
        </span>
      </div>
      <div class="item">
        <span class="label">原锁仓数：</span>
        <span class="value">{{noSellCount}}</span>
      </div>
      <div class="item">
        <span class="label">大反：</span>
        <span class="value">{{niuxiong[0]}}</span>
      </div>
      <div class="item">
        <span class="label">小反：</span>
        <span class="value">{{niuxiong[1]}}</span>
      </div>
      <div class="item">
        <span class="label">定投：</span>
        <span class="value">{{niuxiong[3]}}</span>
      </div>
      <div class="item">
        <span class="label">探底：</span>
        <span class="value">{{niuxiong[2]}}</span>
      </div>
      <div class="item">
        <span class="label">见底：</span>
        <span class="value">{{niuxiong[4]}}</span>
      </div>
      <div class="item">
        <span class="label">顶部：</span>
        <span class="value">{{niuxiong[5]}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import storageUtil from '@/util/storageUtil.js'

export default {
  name: 'OperatingWarn',
  data () {
    return {}
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
    noSellCount: {
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
    nowMonthRate: {
      type: Number,
      default: 0
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
    ifNiandi () {
      const d = this.getDate()
      const month = d.getMonth() + 1
      return month === 12 || month === 11
    },
    ifFengNiu () {
      // 是不是全面疯牛
      const question10 = storageUtil.getData('stockMarketQuestion', 'question_10')
      return question10 === '是'
    }
  },
  created () {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
