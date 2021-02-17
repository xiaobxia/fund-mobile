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
        <div v-if="getSellHH()" class="img-icon-item">
          <div>卖混合{{getSellHH()}}</div>
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
      <div class="item">
        <span class="label">热卖：</span>
        <span class="value" style="color: green">{{getHighSellSum()}}</span>
      </div>
    </div>
    <div class="warn-wrap">
      <div class="fm-warn grey dd" @click="tgConfigShow">
        <div>
          <span>趋势控制</span>
          <span class="ci">
          <span class="red-circle" :class="{active: upNoSell}"></span>
          <span class="red-circle" :class="{active: upMUB}"></span>
          <span class="red-circle" :class="{active: upMNS}"></span>
          <span class="red-circle" :class="{active: f30UpNS}"></span>
          <span class="red-circle" :class="{active: PQB}"></span>
          <span class="red-circle" :class="{active: PLNS}"></span>
          <span class="green-circle" :class="{active: downMBNB}"></span>
          <span class="green-circle" :class="{active: CQXS}"></span>
          <span class="green-circle" :class="{active: QZMC}"></span>
          <span class="green-circle" :class="{active: PQS}"></span>
          <span class="green-circle" :class="{active: HPNS}"></span>
        </span>
          <span style="float: right">{{qdaPC}}</span>
        </div>
        <div class="detail-infoo-wrap" style="padding: 0">
          <div class="item">
            <span class="label">最低仓：</span>
            <span class="value">{{minPosition}}</span>
          </div>
          <div class="item">
            <span class="label">我的仓位：</span>
            <span class="value">{{nowPosition}}</span>
          </div>
        </div>
        <div v-if="nowPosition - minPosition >= 10" class="green-text">
          策略倾向卖出
        </div>
        <div v-if="nowPosition - minPosition <= -10" class="red-text">
          策略倾向买入
        </div>
      </div>
    </div>
    <div v-if="configShow" class="config-wrap">
      <div class="d-w">
        <div class="red-text">都说风险了，那就倾向卖出，锁仓第一跌不买，建议仓位在5以下</div>
        <div class="red-text b-t">多</div>
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
        <mt-cell-swipe>
          <div slot="title">
            <h3>疯牛30线上不会有卖出</h3>
          </div>
          <div class="right-wrap">
            <mt-switch v-model="f30UpNS" @change="stateChangeHandler"></mt-switch>
          </div>
        </mt-cell-swipe>
        <mt-cell-swipe>
          <div slot="title">
            <h3>开启偏多仓位跟随</h3>
          </div>
          <div class="right-wrap">
            <mt-switch v-model="PQB" @change="stateChangeHandler"></mt-switch>
          </div>
        </mt-cell-swipe>
        <mt-cell-swipe>
          <div slot="title">
            <h3>开启上升低仓不卖</h3>
          </div>
          <div class="right-wrap">
            <mt-switch v-model="PLNS" @change="stateChangeHandler"></mt-switch>
          </div>
        </mt-cell-swipe>
        <div class="green-text b-t">空</div>
        <mt-cell-swipe>
          <div slot="title">
            <h3>下降并且月下不买入（用于控制风险）</h3>
          </div>
          <div class="right-wrap">
            <mt-switch v-model="downMBNB" @change="stateChangeHandler"></mt-switch>
          </div>
        </mt-cell-swipe>
        <mt-cell-swipe>
          <div slot="title">
            <h3>策略取向偏卖出</h3>
          </div>
          <div class="right-wrap">
            <mt-switch v-model="CQXS" @change="stateChangeHandler"></mt-switch>
          </div>
        </mt-cell-swipe>
        <mt-cell-swipe>
          <div slot="title">
            <h3>强制卖出</h3>
          </div>
          <div class="right-wrap">
            <mt-switch v-model="QZMC" @change="stateChangeHandler"></mt-switch>
          </div>
        </mt-cell-swipe>
        <mt-cell-swipe>
          <div slot="title">
            <h3>开启砍仓卖出</h3>
          </div>
          <div class="right-wrap">
            <mt-switch v-model="PQS" @change="stateChangeHandler"></mt-switch>
          </div>
        </mt-cell-swipe>
        <mt-cell-swipe>
          <div slot="title">
            <h3>转弱时，高仓没买入</h3>
          </div>
          <div class="right-wrap">
            <mt-switch v-model="HPNS" @change="stateChangeHandler"></mt-switch>
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
      minPosition: localStorage.getItem('minPosition') || 0,
      nowPosition: storageUtil.getData('appConfig', 'nowPosition') || 100,
      question_10: storageUtil.getData('stockMarketQuestion', 'question_10'),
      configShow: false,
      upNoSell: storageUtil.getData('upDownConfig', 'upNoSell') || false,
      upMUB: storageUtil.getData('upDownConfig', 'upMUB') || false,
      upMNS: storageUtil.getData('upDownConfig', 'upMNS') || false,
      qdaPC: localStorage.getItem('qdaPC') || '',
      downMBNB: storageUtil.getData('upDownConfig', 'downMBNB') || false,
      f30UpNS: storageUtil.getData('upDownConfig', 'f30UpNS') || false,
      CQXS: storageUtil.getData('upDownConfig', 'CQXS') || false,
      QZMC: storageUtil.getData('upDownConfig', 'QZMC') || false,
      PQB: storageUtil.getData('upDownConfig', 'PQB') || false,
      PLNS: storageUtil.getData('upDownConfig', 'PLNS') || false,
      PQS: storageUtil.getData('upDownConfig', 'PQS') || false,
      HPNS: storageUtil.getData('upDownConfig', 'HPNS') || false
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
      'indexBondSellMap',
      'indexHighSellMap',
      'fixSellMap'
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
    getHighSellSum () {
      let sum = 0
      for (let key in this.indexHighSellMap) {
        if (this.indexHighSellMap[key]) {
          sum++
        }
      }
      return sum
    },
    getSellHH () {
      let list = []
      for (let key in this.fixSellMap) {
        const value = this.fixSellMap[key]
        if (value) {
          list.push(value)
        }
      }
      list.sort((a, b) => {
        return a - b
      })
      if (list.length > 0) {
        return list[Math.ceil(list.length / 2)]
      }
      return 0
    },
    tgConfigShow () {
      this.configShow = !this.configShow
    },
    stateChangeHandler () {
      let f30UpNS = this.f30UpNS
      let upMUB = this.upMUB
      let upMNS = this.upMNS
      let upNoSell = this.upNoSell
      if (this.CQXS) {
        // f30UpNS = false
        // upMUB = false
        // upMNS = false
        // upNoSell = false
      }
      storageUtil.setData('upDownConfig', 'CQXS', this.CQXS)
      storageUtil.setData('upDownConfig', 'upNoSell', upNoSell)
      storageUtil.setData('upDownConfig', 'upMUB', upMUB)
      storageUtil.setData('upDownConfig', 'upMNS', upMNS)
      storageUtil.setData('upDownConfig', 'downMBNB', this.downMBNB)
      storageUtil.setData('upDownConfig', 'f30UpNS', f30UpNS)
      storageUtil.setData('upDownConfig', 'QZMC', this.QZMC)
      storageUtil.setData('upDownConfig', 'PQB', this.PQB)
      storageUtil.setData('upDownConfig', 'PLNS', this.PLNS)
      storageUtil.setData('upDownConfig', 'PQS', this.PQS)
      storageUtil.setData('upDownConfig', 'HPNS', this.HPNS)
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
  .red-circle {
    display: inline-block;
    height: 22px;
    width: 22px;
    border-radius: 100%;
    margin-right: 6px;
    border: 2px solid rgb(246, 67, 70);
    &.active {
      background-color: rgb(246, 67, 70);
    }
  }
  .green-circle {
    display: inline-block;
    height: 22px;
    width: 22px;
    border-radius: 100%;
    margin-right: 6px;
    border: 2px solid rgb(21, 187, 113);
    &.active {
      background-color: rgb(21, 187, 113);
    }
  }
  .red-circle {

  }
  .ci {
    position: relative;
    top: 6px;
    margin-left: 60px;
  }
  .img-icon-item {
    background-color: #ccc;
  }
  .detail-infoo-wrap {
    .item {
      display: inline-block;
      width: 49%;
    }
    .value {
      float: right;
    }
  }
  .b-t{
    text-align: center;
    margin-bottom: 10px;
  }
</style>
