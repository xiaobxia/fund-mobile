<template>
  <div>
    <div class="detail-info-wrap">
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
        <span class="label">定投：</span>
        <span class="value">{{niuxiong[3]}}</span>
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
        <span class="label">正常：</span>
        <span class="value">{{niuxiong[2]}}</span>
      </div>
    </div>
    <div class="warn-wrap">
      <div class="fm-warn green" v-if="ifCut">仓位配置为{{ifCut}}</div>
      <div class="fm-warn red" v-if="ifFull">仓位配置为{{ifFull}}</div>
      <div class="fm-warn green" v-if="ifNiandi">年底机构结账，保护收益</div>
      <div class="fm-warn green" v-if="nowMonthRate>=1.8">建议开始锁定收益，有一个降到60仓的过程，然后再重新按照信号做</div>
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
    ifFull () {
      const position = storageUtil.getData('userAccountInfo', 'positionConfig') || 100
      // 根据定投判断
      if (this.niuxiong[3] >= 18 && position < 150) {
        return 150
      }
      if (this.niuxiong[3] >= 12 && position < 100) {
        return 100
      }
      if (this.niuxiong[3] >= 6 && position < 50) {
        return 50
      }
      return 0
    },
    ifCut () {
      const question9 = storageUtil.getData('stockMarketQuestion', 'question_9')
      const position = storageUtil.getData('userAccountInfo', 'positionConfig') || 100
      if (question9 === '是' && position > 50) {
        return 50
      }
      return 0
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
