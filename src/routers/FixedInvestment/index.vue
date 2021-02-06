<template>
  <div class="operating-info">
    <mt-header title="定投" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-button type="primary" @click="okHandler" class="main-btn">发送</mt-button>
      <div class="warn-wrap">
        <div class="fm-warn yellow">在大级别底部，多买混合</div>
        <div class="fm-warn grey">你现在需要做的很简单，保持耐心，我们一起等未来出现一个三年级别的大顶部，早晚会有降仓的动作，但不是现在。——毕竟A股历史上，没有一次顶部不是以泡沫化收场的。</div>
      </div>
      <div>总买入金额：{{getAllBuySum()}}</div>
      <div>
        <span :class="kuanBuy >= 4 ? 'red-text': ''">
          <span v-if="kuanBuy >= 4">可以</span>买入：{{$formatMoney(otherBuyCount(canBuy))}}
        </span>
        <div>
          <span v-if="kuanBuy >= 4" class="red-text">本金追加{{getAppMoney()}}</span>
        </div>
        <div class="small-10">
          <mt-cell-swipe v-for="(item) in hhList" :key="item.code">
            <div slot="title">
              <h3>
                <span class="index-name">{{item.code}} {{item.name}}</span>
                <span style="float: right" :class="stockNumberClass(item.change_ratio)">{{item.change_ratio}}</span>
              </h3>
              <p class="netChange wn">
            <span v-for="(subItem, index) in item.list" :key="index"
                  :class="numberBgClass(subItem.valuation_rate)">{{subItem.valuation_rate}}%</span>
              </p>
            </div>
          </mt-cell-swipe>
        </div>
        <div>港股</div>
        <div class="small-10">
          <mt-cell-swipe v-for="(item) in ggList" :key="item.code">
            <div slot="title">
              <h3>
                <span class="index-name">{{item.code}} {{item.name}}</span>
                <span style="float: right" :class="stockNumberClass(getRateByCode(item.code))">{{getRateByCode(item.code)}}</span>
              </h3>
              <p class="netChange wn">
            <span v-for="(subItem, index) in item.list" :key="index"
                  :class="numberBgClass(subItem.valuation_rate)">{{subItem.valuation_rate}}%</span>
              </p>
              <div>定：20，手：<span class="red-text">{{getGGBUy(item)}}</span></div>
            </div>
          </mt-cell-swipe>
        </div>
        <!--<div>债券</div>-->
        <!--<div class="small-10">-->
          <!--<mt-cell-swipe v-for="(item) in zqList" :key="item.code">-->
            <!--<div slot="title">-->
              <!--<h3>-->
                <!--<span class="index-name">{{item.code}} {{item.name}}</span>-->
                <!--<span style="float: right" :class="stockNumberClass(getRateByCode(item.code))">{{getRateByCode(item.code)}}</span>-->
              <!--</h3>-->
              <!--<p class="netChange wn">-->
            <!--<span v-for="(subItem, index) in item.list" :key="index"-->
                  <!--:class="numberBgClass(subItem.valuation_rate)">{{subItem.valuation_rate}}%</span>-->
              <!--</p>-->
              <!--<div>定：20，手：<span class="red-text">{{getGGBUy(item)}}</span></div>-->
            <!--</div>-->
          <!--</mt-cell-swipe>-->
        <!--</div>-->
      </div>
      <!--<div class="fm-warn blue">不要自作聪明，这里提示卖了才卖</div>-->
      <mt-cell-swipe
        v-for="(item) in list"
        :key="item.code"
        :class="{
          'has': hasInfo[item.name],
          'no-has': !hasInfo[item.name],
          'line-type': true,
          'sell': ifSellShow(item.key),
          'lock': isBadDown(item.key) || ifRemoveFix(item.key)
        }"
      >
        <div slot="title">
          <h3>
            <span class="index-name">{{item.name}}</span>
            <span v-if="getLockInfo(item.key)" class="fm-tag s-red">锁仓</span>
            <span v-if="isInDingtouStatus(item.key)" class="fm-tag s-red">定投</span>
            <span v-if="isBadDown(item.key)" class="fm-tag s-black">年季危</span>
            <span v-if="ifRemoveFix(item.key)" class="fm-tag s-black">不再定投</span>
            <span v-if="item.key === 'baijiu' && baijiuwarn" class="fm-tag s-green">{{baijiuwarn}}</span>
            <span style="float: right" :class="stockNumberClass(rateInfo[item.key])">{{rateInfo[item.key]}}%</span>
          </h3>
          <p class="netChange wn">
            <span v-for="(subItem, index) in klineMap[item.key]" :key="index"
                  :class="numberBgClass(subItem.netChangeRatio)">{{subItem.netChangeRatio}}%</span>
          </p>
          <p class="explain">
            <span v-for="(subItem, index) in allInfo[item.key]" :key="subItem + index"
                  :class="getClass(subItem)">{{subItem}}</span>
          </p>
          <div class="other-text">
             <span class="item">
              <span class="label">持有金额：</span>
              <span class="value">{{$formatMoney(hasCount[item.name])}}</span>
            </span>
            <span class="item">
              <span class="label">年线偏离：</span>
              <span class="value">
                <span :class="stockNumberClass(averageDiff[item.key])">{{averageDiff[item.key]}}</span>
              </span>
            </span>
            <span class="item">
              <span class="label">买入金额：</span>
              <span class="value red-text">{{$formatMoney(canBuy[item.key])}}</span>
            </span>
            <span class="item">
              <span class="label">卖出金额：</span>
              <span class="value green-text">{{$formatMoney(canSell[item.key])}}</span>
            </span>
          </div>
        </div>
      </mt-cell-swipe>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone'
import storageUtil from '@/util/storageUtil.js'
import fixedInvestment from '@/util/platformFixedInvestment.js'
import indexList from '@/common/indexList'
import stockApiUtil from '@/util/stockApiUtil.js'
import stockAnalysisUtil from '@/util/stockAnalysisUtil.js'
import { mapGetters } from 'vuex'
import setting from '@/setting.js'
moment.tz.setDefault('Asia/Shanghai')
const sellFixList = setting.sellFixList

const codeMap = fixedInvestment.codeMap
const InfoUtil = fixedInvestment.Util
const fnMap = fixedInvestment.fnMap
const formatData = fixedInvestment.formatData

// 适用于宽基
// 和年线分析有关
function getBuyRate (rate, a, b, c) {
  // c是0轴线
  // a是高估线只能0.25得买
  // b是低估线
  rate = rate - c
  a = a - c
  if (rate >= 0) {
    if (rate <= a) {
      return 1 - ((rate / a) * 0.75)
    } else {
      return 0.25
    }
  }
  // 年线下
  if (rate < 0) {
    if (rate >= b) {
      return 1 + (rate / b)
    } else {
      return 2
    }
  }
  return 1
}

// 适用于优质行业
// 和年线分析有关
function getBuyRateH (rate, a, b, c) {
  // c是0轴线
  // a是高估线只能0.25得买
  // b是低估线
  rate = rate - c
  a = a - c
  if (rate >= 0) {
    if (rate <= a) {
      return 1.5 - ((rate / a) * 1.14)
    } else {
      return 0.36
    }
  }
  // 年线下
  if (rate < 0) {
    if (rate >= b) {
      return 1.5 + 1.5 * (rate / b)
    } else {
      return 3
    }
  }
  return 1.5
}

// 为以后做准备，偏离度60以上的时候
function getSellRate (rate) {
  // 年线下
  return 0
}

function getNetChangeRatioList (list, index) {
  const newList = []
  for (let i = 0; i < 10; i++) {
    newList.push(list[index + i].netChangeRatio)
  }
  return newList
}

const kuanji = ['chuangye', 'wulin', 'sanbai', 'wubai', 'yiqian']
const kuanjiBuy = ['chuangye', 'wulin', 'sanbai', 'wubai']

export default {
  name: 'FixedInvestment',
  data () {
    let allInfo = {}
    let list = []
    let rateInfo = {}
    let hasInfo = {}
    let hasCount = {}
    let canBuy = {}
    let canSell = {}
    let averageDiff = {}
    let klineMap = {}
    let fbsBuyMap = {}
    for (let key in codeMap) {
      list.push({
        key: key,
        code: codeMap[key].code,
        name: codeMap[key].name,
        mix: codeMap[key].mix,
        threshold: codeMap[key].threshold,
        wave: codeMap[key].wave,
        rate: codeMap[key].rate,
        ifBuy: false,
        buyNum: 0,
        canBuyNumber: 0
      })
      allInfo[key] = []
      rateInfo[key] = 0
      hasInfo[codeMap[key].name] = false
      hasCount[codeMap[key].name] = 0
      canBuy[key] = 0
      canSell[key] = 0
      averageDiff[key] = 0
      klineMap[key] = [{}]
      fbsBuyMap[key] = 0
    }
    return {
      ggList: [
        {
          code: '006595',
          name: '广发港股通优质',
          list: []
        },
        {
          code: '006614',
          name: '嘉实恒生新经济',
          list: []
        },
        {
          code: '005583',
          name: '易方达港股通',
          list: []
        }
      ],
      zqList: [
        {
          code: '002920',
          name: '中欧短债A',
          list: []
        },
        {
          code: '519667',
          name: '银河银信债A',
          list: []
        },
        {
          code: '161216',
          name: '国投瑞银债A',
          list: []
        }
      ],
      // 混合
      hhList: [
        {
          code: '001508',
          name: '富国新动力',
          list: []
        },
        {
          code: '260108',
          name: '景顺长城新兴成长混合',
          list: []
        },
        {
          code: '110011',
          name: '易方达中小盘混合',
          list: []
        },
        {
          code: '213001',
          name: '宝盈鸿利收益',
          list: []
        },
        {
          code: '163406',
          name: '兴全合润分级混合',
          list: []
        },
        {
          code: '001714',
          name: '工银瑞信文体',
          list: []
        },
        {
          code: '001224',
          name: '中邮新思路',
          list: []
        },
        {
          code: '001694',
          name: '华安沪港深外延',
          list: []
        },
        {
          code: '570001',
          name: '诺德价值优势混合',
          list: []
        },
        {
          code: '005827',
          name: '易方达蓝筹精选',
          list: []
        },
        {
          code: '001102',
          name: '前海开源国家',
          list: []
        },
        {
          code: '004997',
          name: '广发高端制造',
          list: []
        }
      ],
      list: list,
      allInfo: allInfo,
      rateInfo: rateInfo,
      hasInfo,
      hasCount,
      canBuy,
      canSell,
      averageDiff,
      averageMap: {
        'sh000852': 5169.89,
        'sh000905': 4855.45,
        'sh000300': 3447.624,
        'sh000016': 2569.2,
        'sz399006': 1462.85,
        'sz399997': 5400,
        'sz399989': 7464,
        'sz399441': 2537,
        'sz399396': 17800,
        // 黄金
        'sh518880': 2,
        'sz399363': 5000,
        'sh000993': 5000,
        'sz399811': 5000,
        'sz399673': 5000
      },
      // 配比根据估值，还有行业中和判断
      // a最高线，b最低线，c中轴线
      indexParams: {
        // 中证1000
        // 这东西很危险压根就不能定投，但是现在属于出清了一次，所以又拿出来投
        // 出清线是年线-25
        'sh000852': {
          buy: 0.55,
          sell: 1.3,
          a: 20,
          b: -20,
          c: -8.5
        },
        // 沪深500
        // 这东西很危险压根就不能定投，但是现在属于出清了一次，所以又拿出来投
        // 出清线是年线-20
        'sh000905': {
          buy: 1,
          sell: 0.85,
          a: 20,
          b: -20,
          c: -10
        },
        // 沪深300
        'sh000300': {
          buy: 1,
          sell: 0.85,
          a: 15,
          b: -15,
          c: -5.5
        },
        // 上证50
        'sh000016': {
          buy: 1.15,
          sell: 0.7,
          a: 20,
          b: -10,
          c: -3
        },
        // 创业板
        // 这东西很危险压根就不能定投，但是现在属于出清了一次，所以又拿出来投
        // 出清线是年线-20
        'sz399006': {
          buy: 0.85,
          sell: 1.15,
          a: 25,
          b: -20,
          c: -8.5
        },
        // 创50
        'sz399673': {
          buy: 0.85,
          sell: 1.15,
          a: 25,
          b: -20,
          c: -8.5
        },
        // 白酒
        'sz399997': {
          buy: 1.15,
          sell: 1,
          a: 40,
          b: -20,
          c: -8
        },
        // 食品
        'sz399396': {
          buy: 1.15,
          sell: 1,
          a: 30,
          b: -20,
          c: -5
        },
        // 本质就是成长，2020年是因为叠加疫情因素才特别出色
        // 医疗
        'sz399989': {
          buy: 0.7,
          sell: 1,
          a: 20,
          b: -18,
          c: -9
        },
        // 生物
        'sz399441': {
          buy: 0.7,
          sell: 1,
          a: 20,
          b: -18,
          c: -9
        },
        // 黄金
        'sh518880': {
          buy: 0.33,
          sell: 1.3,
          a: 15,
          b: -10,
          c: 0
        },
        // 这东西很危险压根就不能定投，但是现在属于出清了一次，所以又拿出来投
        // 出清线是年线-20
        // 计算机电子类
        // 计算机
        'sz399363': {
          buy: 0.4,
          sell: 1.3,
          a: 25,
          b: -20,
          c: -8.5
        },
        // 信息
        'sh000993': {
          buy: 0.4,
          sell: 1.3,
          a: 25,
          b: -20,
          c: -8.5
        },
        // 电子
        'sz399811': {
          buy: 0.55,
          sell: 1.3,
          a: 25,
          b: -20,
          c: -8.5
        }
      },
      klineMap,
      baijiuwarn: '',
      kuanBuy: 0,
      myFundList: [],
      fbsBuyMap: fbsBuyMap
    }
  },
  computed: {
    ...mapGetters([
      'stockIndexAll',
      'userFundAccountInfo'
    ])
  },
  created () {
    this.initPage()
    this.hhList.forEach((item) => {
      this.queryFundR(item)
    })
    this.ggList.forEach((item) => {
      this.queryFundR(item)
    })
    // this.zqList.forEach((item) => {
    //   this.queryFundR(item)
    // })
  },
  methods: {
    ifRemoveFix (key) {
      if (['jisuanji', 'xinxi', 'yiqian', 'huangjin'].indexOf(key) !== -1) {
        return true
      }
      return false
    },
    ifSellShow (key) {
      const list = this.klineMap[key]
      const netChangeRatioListLarge = list.map((subItem) => {
        return subItem.netChangeRatio
      })
      const flag = stockAnalysisUtil.countUp(netChangeRatioListLarge, 4, 4).flag
      if (key === 'baijiu' && this.baijiuwarn) {
        // 如果不是锁仓，白酒也有锁仓
        if (!this.getLockInfo(key)) {
          // if (this.averageMonthIndex(key) > 0) {
          //   const flag3 = stockAnalysisUtil.countUp(netChangeRatioListLarge, 3, 3).flag
          //   if (flag3) {
          //     return true
          //   }
          // } else {
          //   if (this.rateInfo[key] > 0) {
          //     return true
          //   }
          // }
          // 太牛了，不要轻易卖了
          const flag3 = stockAnalysisUtil.countUp(netChangeRatioListLarge, 3, 3).flag
          if (flag3) {
            return true
          }
        }
        // 锁仓的话4卖
        if (flag) {
          return true
        }
      }
      if (sellFixList.indexOf(key) !== -1) {
        let threeDay = stockAnalysisUtil.countUp(netChangeRatioListLarge, 3, 3)
        if (threeDay.flag) {
          return true
        }
      }
      return false
    },
    getLockInfo (key) {
      return storageUtil.getData('noSell', key) || false
    },
    queryFundR (item) {
      this.$http.get('fund/getFundRecentNetValue', {
        code: item.code,
        days: 10
      }).then((res) => {
        item.list = res.data || []
      })
    },
    getClass (subItem) {
      if (subItem.indexOf('买少') !== -1) {
        return 'active-2 has-text'
      }
      if (subItem.indexOf('买') !== -1) {
        return 'buy'
      }
      if (subItem.indexOf('跌多') !== -1) {
        return 'buy'
      }
      if (subItem.indexOf('跌少') !== -1) {
        return 'active-2 has-text'
      }
      if (subItem.indexOf('快跌') !== -1) {
        return 'buy'
      }
      if (subItem.indexOf('慢跌') !== -1) {
        return 'active-2 has-text'
      }
      if (subItem.indexOf('卖') !== -1) {
        return 'sell'
      }
      if (subItem.indexOf('禁') !== -1) {
        return 'active-2 has-text'
      }
    },
    isInQuarterHotToday (key) {
      const quarterIndex = storageUtil.getData('averageQuarterIndex', key) || 0
      const quarterHot = storageUtil.getData('stockIndexQuarterHot', key) === '开启'
      return quarterHot && quarterIndex > 0
    },
    // 计算混合
    countHH () {
      this.kuanBuy = 0
      this.list.forEach((item, index) => {
        if (item.ifBuy) {
          // 是宽基
          if (kuanji.indexOf(item.key) !== -1) {
            this.kuanBuy++
          } else if (['baijiu', 'shengwu', 'dianzi'].indexOf(item.key) !== -1) {
            this.kuanBuy++
          }
        }
      })
    },
    getRateByCode (code) {
      for (let i = 0; i < this.myFundList.length; i++) {
        if (code === this.myFundList[i].code) {
          return this.myFundList[i].change_ratio
        }
      }
      return 0
    },
    initChangeRatio () {
      this.hhList.forEach((item) => {
        item.change_ratio = this.getRateByCode(item.code)
      })
      this.hhList.sort((a, b) => {
        return b.change_ratio - a.change_ratio
      })
    },
    initPage () {
      this.stockIndexAll.forEach((item) => {
        this.averageMap[item.code] = item.year_average
      })
      let list = this.list
      const opList = []
      for (let i = 0; i < list.length; i++) {
        opList.push(this.queryData(list[i]))
      }
      this.$http.get('userFund/getUserFunds').then((data) => {
        if (data.success) {
          const list = data.data.list
          this.myFundList = list
          for (let i = 0; i < list.length; i++) {
            const item = list[i]
            if (item.theme) {
              // 只计入定投
              if (item.strategy === '2') {
                this.hasInfo[item.theme] = true
                if (this.hasCount[item.theme]) {
                  this.hasCount[item.theme] += parseInt(item.sum)
                } else {
                  this.hasCount[item.theme] = parseInt(item.sum)
                }
              }
            }
          }
          this.initChangeRatio()
        }
      })
      Promise.all(opList).then(() => {
        this.countHH()
        const d = this.getDate()
        const hour = d.getHours()
        if (hour < 17) {
          this.okHandler()
        }
      })
    },
    ifFengNiu () {
      // 是不是全面疯牛
      const question10 = storageUtil.getData('stockMarketQuestion', 'question_10')
      return question10 === '是'
    },
    // 月线
    averageMonthIndex (key) {
      return storageUtil.getData('averageMonth', key) || 0
    },
    averageQuarter (key) {
      return storageUtil.getData('averageQuarterIndex', key) || 0
    },
    // 半年线
    averageHalfYear (key) {
      return storageUtil.getData('averageHalfYearIndex', key) || 0
    },
    // 年偏离
    yearDiff (key) {
      return storageUtil.getData('yearAverageIndexDiff', key) || 0
    },
    yearClose (key) {
      return storageUtil.getData('yearAverageIndex', key) || 1
    },
    halfYearClose (key) {
      return storageUtil.getData('indexHalfYearClose', key) || 1
    },
    quarterClose (key) {
      return storageUtil.getData('indexQuarterClose', key) || 1
    },
    index30Close (key) {
      return storageUtil.getData('index30Close', key) || 1
    },
    // 指数所处阶段
    indexStage (key) {
      const status = storageUtil.getData('stockIndexStatus', key)
      return status || ''
    },
    // 是否解除定投
    ifRelieveFixLine (key) {
      return this.indexStage(key) === '定投' && this.averageHalfYear(key) >= this.getIndex(key).relieveFixLine
    },
    localConsole (item, value) {
      if (item.key === 'huangjin') {
        console.log(value)
      }
    },
    // 是否处于定投
    isInDingtouStatus (key) {
      return this.indexStage(key) === '定投' && !this.ifRelieveFixLine(key)
    },
    // 走坏了，季度线在年线下面
    isBadDown (key) {
      if (key === 'baijiu' || key === 'huangjin') {
        return false
      }
      const qyChange30h = storageUtil.getData('noBuySellConfig', 'qyChange30h') || false
      if (qyChange30h) {
        const diff = this.countDifferenceRate(this.index30Close(key), this.halfYearClose(key))
        if (this.yearDiff(key) > 0) {
          return diff < 0
        } else {
          return diff < 2
        }
      } else {
        const diff = this.countDifferenceRate(this.quarterClose(key), this.yearClose(key))
        if (this.yearDiff(key) > 0) {
          return diff < 0
        } else {
          return diff < 2
        }
      }
    },
    getIndex (key) {
      for (let i = 0; i < indexList.length; i++) {
        const item = indexList[i]
        if (item.key === key) {
          return item
        }
      }
      return {}
    },
    // // 是否恶化
    // isBad (key) {
    //   // 基本面恶化就只有锁仓买了
    //   // 年线和半年线都得在下面，年线上和半年线下涨的概率该是很大的，我研究过了
    //   if (!this.getIndex(key).relieveFixLine) {
    //     return false
    //   }
    //   if (
    //     this.averageQuarter(key) < 0 &&
    //     this.averageHalfYear(key) < 0 &&
    //     this.yearDiff(key) < 0
    //   ) {
    //     // 同时也不是定投阶段
    //     if (!this.isInDingtouStatus(key)) {
    //       // 月线在下面
    //       if (this.averageMonthIndex(key) < 0) {
    //         return true
    //       }
    //     }
    //   }
    //   return false
    // },
    // 是否处于恶化
    // isInBad (key) {
    //   // 是否基本面恶化，是的话只有月线在上才能买，不管什么大小反
    //   const question9 = storageUtil.getData('stockMarketQuestion', 'question_9') || '否'
    //   if (question9 === '是') {
    //     return this.isBad(key)
    //   }
    //   return false
    // },
    // 中级底
    bigDi (netChangeRatioListLarge, rate) {
      /**
       * 验证过没问题
       * 而且很有可能是一个中级别底部
       */
      if (netChangeRatioListLarge[0] < -(rate * 5)) {
        return true
      }
      // 两天5rate
      /**
       * 验证过没问题
       * 而且很有可能是一个中级别底部，甚至4个rate都还行
       */
      const twoDownInfo = stockAnalysisUtil.countDown(netChangeRatioListLarge, 2, 2)
      if (twoDownInfo.rate < -(rate * 5)) {
        return true
      }
      /**
       * 验证过没问题
       * 而且很有可能是一个中级别底部，甚至4个rate都还行
       */
      const threeDownInfo = stockAnalysisUtil.countDown(netChangeRatioListLarge, 3, 3)
      if (threeDownInfo.rate < -(rate * 5)) {
        return true
      }
      const a1 = stockAnalysisUtil.countDown(netChangeRatioListLarge, 9, 8).flag
      const a12 = stockAnalysisUtil.countDown(netChangeRatioListLarge, 8, 8).flag
      const a13 = stockAnalysisUtil.countDown(netChangeRatioListLarge, 7, 7).flag
      const a14 = stockAnalysisUtil.countDown(netChangeRatioListLarge, 6, 6).flag
      const a2 = stockAnalysisUtil.countDown(netChangeRatioListLarge, 9, 7)
      const a3 = stockAnalysisUtil.countDown(netChangeRatioListLarge, 8, 7)
      const a4 = stockAnalysisUtil.countDown(netChangeRatioListLarge, 5, 5)
      const a5 = stockAnalysisUtil.countDown(netChangeRatioListLarge, 4, 4)
      // 会比波段严格一点
      return a1 ||
        a12 ||
        a13 ||
        a14 ||
        (a2.flag && (a2.rate < -(5 * rate))) ||
        (a3.flag && (a3.rate < -(5 * rate))) ||
        (a4.flag && (a4.rate < -(5 * rate))) ||
        (a5.flag && (a5.rate < -(6 * rate)))
    },
    queryData (item) {
      return this.$http.get(`stock/${stockApiUtil.getAllUrl()}`, {
        code: item.code,
        days: 16
      }, {interval: 30}).then((data) => {
        if (data.success) {
          const list = data.data.list
          const info = formatData(list)
          const infoUtil = new InfoUtil(item)
          const recentNetValue = info.list
          let infoList = []
          const nowClose = recentNetValue[0]['close']
          let kline = []
          // 近的在前
          let isBig = false
          for (let i = 0; i < 5; i++) {
            // 截取10个
            const netChangeRatioList = getNetChangeRatioList(recentNetValue, i)
            const nowRecord = recentNetValue[i]
            const oneDayRecord = recentNetValue[i + 1]
            const twoDayRecord = recentNetValue[i + 2]
            let buyFlag = infoUtil[fnMap[item.key + 'Buy']](nowRecord, oneDayRecord, twoDayRecord)
            // let sellFlag = infoUtil[fnMap[item.key + 'Sell']](nowRecord, oneDayRecord, twoDayRecord)
            // 根据信号判断
            kline.push(recentNetValue[i])
            // if (buyFlag.flag === true) {
            //   infoList[i] = '买'
            // } else if (sellFlag.flag === true && sellFlag.text !== 'xiong') {
            //   infoList[i] = '卖'
            // } else if (sellFlag.flag === true && sellFlag.text === 'xiong') {
            //   infoList[i] = '卖少'
            // } else {
            //   infoList[i] = ''
            // }
            if (buyFlag.flag === true) {
              infoList[i] = '买'
            } else {
              infoList[i] = ''
            }
            let threeDay = stockAnalysisUtil.countDown(netChangeRatioList, 3, 3)
            let fourDay = stockAnalysisUtil.countDown(netChangeRatioList, 4, 4)
            let fiveDay = stockAnalysisUtil.countDown(netChangeRatioList, 5, 5)
            // 先判断是不是买少的
            // 单日
            if (netChangeRatioList[0] < -(3 * item.rate)) {
              infoList[i] = '跌少'
            }
            if (fourDay.flag) {
              infoList[i] = '跌少'
            }
            if (item.key === 'huangjin') {
              if (threeDay.flag) {
                infoList[i] = '跌少'
              }
            }
            if (threeDay.flag && threeDay.rate < -(3 * item.rate)) {
              infoList[i] = '跌少'
            }
            if (stockAnalysisUtil.countDown(netChangeRatioList, 6, 5).flag) {
              infoList[i] = '跌少'
            }
            // 判断是不是买大的，如果是那就可以覆盖他
            if (threeDay.flag && threeDay.rate < -(4 * item.rate)) {
              infoList[i] = '跌多'
            }
            if (fourDay.flag && fourDay.rate < -(5 * item.rate)) {
              infoList[i] = '跌多'
            }
            if (fiveDay.flag) {
              infoList[i] = '跌多'
            }
            if (stockAnalysisUtil.countDown(netChangeRatioList, 7, 6).flag) {
              infoList[i] = '跌多'
            }
            if (stockAnalysisUtil.countDown(netChangeRatioList, 8, 7).flag) {
              infoList[i] = '跌多'
            }
            if (stockAnalysisUtil.countDown(netChangeRatioList, 8, 6).flag) {
              infoList[i] = '跌多'
            }
            if (stockAnalysisUtil.countDown(netChangeRatioList, 9, 7).flag) {
              infoList[i] = '跌多'
            }
            if (this.bigDi(netChangeRatioList, item.rate)) {
              infoList[i] = '跌多'
              if (i === 0) {
                isBig = true
              }
            }
          }
          // let canFix = storageUtil.getData('stockIndexCanFix', item.key)
          // if (canFix !== false && canFix !== true) {
          //   canFix = true
          // }
          // if (!canFix) {
          //   infoList[0] = '禁'
          // }
          if (this.ifFengNiu()) {
            if (this.averageMonthIndex(item.key) < -4) {
              infoList[0] = '强卖止盈'
            }
          }
          // if (this.isInQuarterHotToday(item.key)) {
          //   infoList[0] = ''
          //   const netChangeRatioList = getNetChangeRatioList(recentNetValue, 0)
          //   let threeDay = stockAnalysisUtil.countUp(netChangeRatioList, 3, 3)
          //   if (threeDay.flag) {
          //     infoList[0] = '卖1/16'
          //   }
          // }
          const diff = this.countDifferenceRate(nowClose, this.averageMap[item.code])
          if (item.key === 'baijiu') {
            if (diff >= 40) {
              this.baijiuwarn = '白酒热'
            }
          }
          this.klineMap[item.key] = kline
          this.averageDiff[item.key] = diff
          // 和总资金有关，还有数量
          const rC = 1 / (60)
          const user = this.userFundAccountInfo.user
          const myAsset = user.asset
          let buyS = (myAsset * rC) / 13
          // 中级底放大
          if (isBig) {
            buyS = buyS * 2
          }
          const params = this.indexParams[item.code]
          let buyNumber = 0
          if (['baijiu', 'yiliao', 'shengwu', 'shipin'].indexOf(item.key) !== -1) {
            buyNumber = parseInt(getBuyRateH(diff, params.a, params.b, params.c) * buyS * params.buy / 10) * 10
          } else {
            buyNumber = parseInt(getBuyRate(diff, params.a, params.b, params.c) * buyS * params.buy / 10) * 10
          }
          this.canBuy[item.key] = buyNumber
          this.canSell[item.key] = parseInt((buyS * (1 - buyS / buyNumber)) / 10) * 10
          this.allInfo[item.key] = infoList
          // 其他
          let buyBaseInfo = 0
          if (['买', '跌少', '跌多'].indexOf(infoList[0]) !== -1) {
            if (!this.isBadDown(item.key)) {
              item.ifBuy = true
              buyBaseInfo = parseInt(buyNumber / 10)
              item.buyNum = buyBaseInfo
              item.canBuyNumber = buyNumber
              // this.fbsBuyMap[item.key] = buyBaseInfo
            }
          }
          storageUtil.setData('fixBuyData', item.key, buyBaseInfo)
          this.rateInfo[item.key] = this.keepTwoDecimals(recentNetValue[0].netChangeRatio)
        }
      })
    },
    backHandler () {
      this.$router.history.go(-1)
    },
    ttBuy (num) {
      const user = this.userFundAccountInfo.user
      const myAsset = user.asset
      // num * 每月金额
      const tt = 300000
      const my = myAsset
      return parseInt((num * (tt / my)))
    },
    okHandler () {
      // 开盘的才更新
      if (this.userFundAccountInfo.marketOpen) {
        const record = []
        this.list.forEach((item) => {
          if (kuanjiBuy.indexOf(item.key) !== -1 || ['baijiu', 'shengwu', 'dianzi'].indexOf(item.key) !== -1) {
            if (item.ifBuy) {
              record.push({
                key: item.key,
                buyNum: this.ttBuy(item.buyNum),
                rate: this.rateInfo[item.key]
              })
            }
          }
        })
        const date = moment().format('YYYY-MM-DD')
        this.$http.post(`${this.$fbsUrl}/bsSignal/updateSignal`, {
          trade_date: date,
          fix_record: JSON.stringify(record)
        })
      }
    },
    otherBuyCount (map) {
      let sum = 0
      // 一共8个
      for (let key in map) {
        if (kuanji.indexOf(key) !== -1) {
          sum += parseFloat(map[key]) || 0
        } else if (['baijiu', 'shengwu', 'dianzi'].indexOf(key) !== -1) {
          sum += parseFloat(map[key]) || 0
        }
      }
      // 平均
      const average = sum / 8
      // 混合30，定投20
      return parseInt(average * 1.2)
    },
    getAllBuySum () {
      let sum = 0
      if (this.kuanBuy >= 4) {
        const hb = this.otherBuyCount(this.canBuy)
        sum += hb * this.hhList.length
      }
      this.list.forEach((v) => {
        sum += v.canBuyNumber
      })
      return sum
    },
    getAppMoney () {
      const hb = this.otherBuyCount(this.canBuy)
      const sum = hb * 10
      return sum * 2
    },
    getGGBUy (item) {
      let f = 0
      const rate = this.getRateByCode(item.code)
      if (rate < 0) {
        f++
        if (item.list[0] < 0) {
          f++
        }
        if (item.list[1] < 0) {
          f++
        }
        if (item.list[2] < 0) {
          f++
        }
      }
      return 20 * f
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
