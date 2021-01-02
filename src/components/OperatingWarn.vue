<template>
  <div>
    <div class="warn-wrap">
      <div class="img-icon-list">
        <div v-if="changeStyle" class="img-icon-item">
          <img src="../assets/warn-icon/反转色.png" alt="">
        </div>
        <div v-if="question_10 === '是'" class="img-icon-item">
          <img src="../assets/牛市.png" alt="">
        </div>
      </div>
      <!--<div class="fm-warn blue">波段仓砍仓要狠，定投才是大头</div>-->
      <!--<div class="fm-warn red">波段仓一定要遵守交易纪律</div>-->
      <div class="fm-warn green">处在高位危险，信号一会儿让卖一会儿又不让卖的，那就卖掉</div>
      <!--<div class="fm-warn grey">冒着绿光的才卖，不要被迷惑</div>-->
      <div class="fm-warn green">处在高位危险区，又走坏了，保住利润是第一位，向上空间很小，向下空间很大</div>
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
      <div class="item">
        <span class="label">买：</span>
        <span class="value" style="color: red">{{$formatMoney(getBuySum())}}</span>
      </div>
      <div class="item">
        <span class="label">卖：</span>
        <span class="value" style="color: green">{{$formatMoney(getSellSum())}}</span>
      </div>
    </div>
    <div class="warn-wrap">
      <div class="fm-warn blue dd" @click="tgConfigShow">
        <span>趋势控制</span>
        <span style="float: right">{{qdaPC}}</span>
      </div>
    </div>
    <div v-if="configShow" class="config-wrap">
      <div class="d-w">
      <mt-cell-swipe>
        <div slot="title">
          <h3>上升时锁仓都买</h3>
        </div>
        <div class="right-wrap">
          <mt-switch v-model="upNoSell" @change="stateChangeHandler"></mt-switch>
        </div>
      </mt-cell-swipe>
        <mt-cell-swipe>
          <div slot="title">
            <h3>上升时不锁仓月上也有买（但也不是随便买）</h3>
          </div>
          <div class="right-wrap">
            <mt-switch v-model="upMUB" @change="stateChangeHandler"></mt-switch>
          </div>
        </mt-cell-swipe>
        <mt-cell-swipe>
          <div slot="title">
            <h3>上升时月上不随便卖（并不是都不卖）</h3>
          </div>
          <div class="right-wrap">
            <mt-switch v-model="upMNS" @change="stateChangeHandler"></mt-switch>
          </div>
        </mt-cell-swipe>
      </div>
    </div>
  </div>
</template>

<script>
import storageUtil from '@/util/storageUtil.js'
import { mapGetters } from 'vuex'
export default {
  name: 'OperatingWarn',
  data () {
    return {
      question_10: storageUtil.getData('stockMarketQuestion', 'question_10'),
      configShow: false,
      upNoSell: storageUtil.getData('upDownConfig', 'upNoSell') || false,
      upMUB: storageUtil.getData('upDownConfig', 'upMUB') || false,
      upMNS: storageUtil.getData('upDownConfig', 'upMNS') || false,
      qdaPC: localStorage.getItem('qdaPC') || ''
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
    },
    changeStyle () {
      return storageUtil.getData('noBuySellConfig', 'changeStyle') || false
    },
    ...mapGetters([
      'indexBondBuyMap',
      'indexBondSellMap'
    ])
  },
  created () {
  },
  methods: {
    getBuySum () {
      let sum = 0
      for (let key in this.indexBondBuyMap) {
        sum += parseFloat(this.indexBondBuyMap[key] || 0) || 0
      }
      return sum
    },
    getSellSum () {
      let sum = 0
      for (let key in this.indexBondSellMap) {
        sum += parseFloat(this.indexBondSellMap[key] || 0) || 0
      }
      return sum
    },
    tgConfigShow () {
      this.configShow = !this.configShow
    },
    stateChangeHandler () {
      storageUtil.setData('upDownConfig', 'upNoSell', this.upNoSell)
      storageUtil.setData('upDownConfig', 'upMUB', this.upMUB)
      storageUtil.setData('upDownConfig', 'upMNS', this.upMNS)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>
  .img-icon-item {
    width: 100px;
    height: 100px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .dd {
    line-height: 60px;
  }
  .config-wrap {
    background-color: #eee;
    padding: 20px 0;
  }
</style>
