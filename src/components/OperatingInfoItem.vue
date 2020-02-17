<template>
  <mt-cell-swipe
    :to="toUrl"
    :class="['operating-info-item', ...getItemClass()]"
  >
    <div slot="title">
      <h3>
        <span class="index-name">{{indexInfo.name}}</span>
        <span v-if="lock" class="fm-icon lock"></span>
        <span v-if="indexStatus === '顶部'" class="fm-tag s-yellow">阶段顶部</span>
        <span v-if="isDingtou()" class="fm-tag s-red">定投</span>
        <span v-if="ifUnderYear" class="fm-tag s-green">年下</span>
        <span v-if="ifDownTrend" class="fm-tag s-green">下趋</span>
        <span v-if="isDafan()" class="fm-tag s-red">大反</span>
        <span v-if="isXiaofan()" class="fm-tag s-red">小反</span>
        <span v-if="ifNoSell()" class="fm-tag s-red">锁仓</span>
        <span v-if="ifNoSellToCan()" class="fm-tag s-green">锁转交</span>
        <span v-if="ifCutDown" class="fm-tag s-yellow">开止盈</span>
        <span v-if="indexNiuXiong === '禁买'" class="fm-tag s-black">{{indexNiuXiong}}</span>
        <span v-if="averageMonthIndex > 0" class="fm-tag b-red">月上</span>
        <span v-if="averageMonthIndex <= 0" class="fm-tag b-green">月下</span>
        <span v-if="!ifDafan() && ifXiaofan()" class="fm-tag s-red">小</span>
        <span v-if="ifDafan()" class="fm-tag s-red">大</span>
        <span v-if="toNoSellToCan()" class="fm-tag blue">更为锁转交</span>
        <span v-if="indexStatus === '定投' && averageHalfYear >= 0" class="fm-tag s-blue">解定</span>
        <span v-if="ifJieFantan()" class="fm-tag s-blue">解反</span>
        <span v-if="ifJieNoSellToCan()" class="fm-tag s-blue">解锁转交</span>
        <span v-if="ifJieDingbu()" class="fm-tag s-blue">解顶部</span>
        <span v-if="ifClearAll()" class="fm-tag s-black">清空</span>
        <span v-if="isCutDown()" class="fm-tag s-black">请止盈</span>
        <span v-if="ifUnderYear && ifDownTrend && (indexStatus !== '定投' && indexStatus !== '探底')" class="fm-tag black">禁买</span>
        <span v-if="indexNiuXiong === '禁买' && (!ifUnderYear || !ifDownTrend)" class="fm-tag s-blue">解禁</span>
        <span style="float: right" :class="stockNumberClass(rate)">{{rate}}%</span>
      </h3>
      <p class="explain">
            <span v-for="(subItem, index) in buySellList" :key="subItem + index"
                  :class="subItem">{{subItem === 'buy'?'买':subItem === 'sell'?'卖':''}}</span>
      </p>
      <p class="netChange wn">
            <span v-for="(subItem, index) in netChangeRatioList" :key="index"
                  :class="numberBgClass(subItem)">{{subItem}}%</span>
      </p>
      <p class="otherBuySellList">
            <span v-for="(subItem, index) in otherBuySellList" :key="index"
                  :class="subItem">{{subItem}}</span>
      </p>
      <div class="other-text">
          <span class="item">
              <span class="label">持有金额：</span>
              <span class="value">{{hasCount}}</span>
            </span>
        <span class="item">
              <span class="label">卖出金额：</span>
              <span class="value green-text">{{indexSellNumber}}</span>
            </span>
        <span class="item">
              <span class="label">买入金额：</span>
              <span class="value red-text">{{indexBuyNumber}}</span>
            </span>
            <span class="item">
              <span class="label">原买：</span>
              <span class="value">{{indexRawBuyNumber}}</span>
            </span>
      </div>
    </div>
  </mt-cell-swipe>
</template>

<script>
import storageUtil from '@/util/storageUtil.js'
import operatingTooltip from '@/util/operatingTooltip.js'
import stockAnalysisUtil from '@/util/stockAnalysisUtil.js'
import indexType from '@/common/indexType.js'

const jigou = indexType.jigou
const laji = indexType.laji
const kuanji = indexType.kuanji

export default {
  name: 'OperatingInfoItem',
  data () {
    return {}
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
    noSellCount: {
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
    countUpNumber: {
      type: Number,
      default: 0
    },
    countDownNumber: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: '简'
    },
    nowMonthRate: {
      type: Number,
      default: 0
    }
  },
  computed: {
    jukui () {
      const incomeRate = this.countDifferenceRate((this.hasCount * (100 + this.rate) / 100), this.costCount)
      return incomeRate < -2 && this.positionWarn === 'danger'
    },
    ifHas () {
      return this.hasCount > 0
    },
    ifJigou () {
      return jigou.indexOf(this.indexInfo.key) !== -1
    },
    ifLaji () {
      return laji.indexOf(this.indexInfo.key) !== -1
    },
    ifKuanji () {
      return kuanji.indexOf(this.indexInfo.key) !== -1
    },
    ifInDafan () {
      return this.indexNiuXiong === '大反'
    },
    positionWarn () {
      return operatingTooltip.getPositionWarn(this.indexInfo, this.hasCount)
    },
    otherBuySellList () {
      if (this.type === '简') {
        return storageUtil.getData('xiongBuySellList', this.indexInfo.key) || []
      } else {
        return storageUtil.getData('jianBuySellList', this.indexInfo.key) || []
      }
    },
    allBuySellList () {
      const xiong = storageUtil.getData('xiongBuySellList', this.indexInfo.key) || []
      const jian = storageUtil.getData('jianBuySellList', this.indexInfo.key) || []
      const newList = []
      xiong.forEach((item, index) => {
        if (item) {
          newList[index] = item
        } else {
          if (jian[index]) {
            newList[index] = jian[index]
          } else {
            newList[index] = ''
          }
        }
      })
      return newList
    },
    indexNiuXiong () {
      const niuXiong = storageUtil.getData('stockIndexFlag', this.indexInfo.key)
      return niuXiong === '正常' ? '' : niuXiong
    },
    indexStatus () {
      const status = storageUtil.getData('stockIndexStatus', this.indexInfo.key)
      return status || ''
    },
    indexNoSellStatus () {
      const status = storageUtil.getData('stockIndexNoSellStatus', this.indexInfo.key)
      return status || ''
    },
    indexBuyNumber () {
      return operatingTooltip.getIndexBuyNumber(
        this.type,
        this.indexInfo,
        {
          buyFlagCount: this.buyCount,
          sellFlagCount: this.sellCount,
          netChangeRatio: this.rate,
          netChangeRatioList: this.netChangeRatioList,
          noSellCount: this.noSellCount
        },
        this.hasCount,
        true
      )
    },
    indexRawBuyNumber () {
      return operatingTooltip.getIndexBuyNumber(
        this.type,
        this.indexInfo,
        {
          buyFlagCount: this.buyCount,
          sellFlagCount: this.sellCount,
          netChangeRatio: this.rate,
          netChangeRatioList: this.netChangeRatioList,
          noSellCount: this.noSellCount
        },
        this.hasCount
      )
    },
    indexSellNumber () {
      return operatingTooltip.getIndexSellNumber(
        this.type,
        this.indexInfo,
        {
          buyFlagCount: this.buyCount,
          sellFlagCount: this.sellCount,
          noSellCount: this.noSellCount
        },
        this.hasCount
      )
    },
    ifThreeSell () {
      return this.buySellList[0] === 'sell' && this.buySellList[1] === 'sell' && this.buySellList[2] === 'sell'
    },
    ifThreeDown () {
      return stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 3, 3).flag
    },
    ifFourDown () {
      return stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 4, 4).flag
    },
    ifFiveDown () {
      return stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 5, 5).flag
    },
    ifTwoUp () {
      return stockAnalysisUtil.countUp(this.netChangeRatioListLarge, 2, 2).flag
    },
    ifThreeUp () {
      return stockAnalysisUtil.countUp(this.netChangeRatioListLarge, 3, 3).flag
    },
    ifFourUp () {
      return stockAnalysisUtil.countUp(this.netChangeRatioListLarge, 4, 4).flag
    },
    ifFiveUp () {
      return stockAnalysisUtil.countUp(this.netChangeRatioListLarge, 5, 5).flag
    },
    ifSixFive () {
      return stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 6, 5).flag
    },
    ifSevenSix () {
      return stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 7, 6).flag
    },
    ifEightSeven () {
      return stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 8, 7).flag
    },
    ifEightSix () {
      return stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 8, 6).flag
    },
    ifNineSeven () {
      return stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 9, 7).flag
    },
    averageMonthIndex () {
      return storageUtil.getData('averageMonth', this.indexInfo.key) || 0
    },
    averageHalfYear () {
      return storageUtil.getData('averageHalfYearIndex', this.indexInfo.key) || 0
    },
    // 是否出于下降趋势
    ifDownTrend () {
      const indexNowClose = storageUtil.getData('indexNowClose', this.indexInfo.key) || 0
      const averageHalfYearIndexClose = storageUtil.getData('averageHalfYearIndexClose', this.indexInfo.key) || 0
      // 进入定投区域了那就不是下降趋势
      if (this.indexStatus === '定投') {
        return false
      }
      if (indexNowClose < averageHalfYearIndexClose) {
        if (this.countDifferenceRate(indexNowClose, averageHalfYearIndexClose) <= this.indexInfo.downTrendLine) {
          return true
        }
      }
      return false
    },
    noSellIndex () {
      return storageUtil.getData('noSell', this.indexInfo.key) || false
    },
    ifTopNow () {
      return storageUtil.getData('stockIndexIsTop', this.indexInfo.key) || false
    },
    ifCutDown () {
      return storageUtil.getData('stockIndexCutDown', this.indexInfo.key) === '开启'
    },
    ifHot () {
      const averageMonth = storageUtil.getData('averageMonth', this.indexInfo.key) || 0
      return averageMonth >= this.indexInfo.reduceLine
    },
    ifUnderYear () {
      const diff = storageUtil.getData('yearAverageIndexDiff', this.indexInfo.key) || 0
      return diff < 0
    }
  },
  created () {
  },
  methods: {
    // 满足止盈条件
    isCutDown () {
      const nowClose = storageUtil.getData('indexNowClose', this.indexInfo.key) || 0
      const topClose = storageUtil.getData('stockIndexTopClose', this.indexInfo.key) || 0
      if (this.ifCutDown) {
        // 最高处回落5%
        if (this.countDifferenceRate(nowClose, topClose) < -6) {
          return true
        }
      }
      return false
    },
    // 是否处于反弹
    ifInFantan () {
      return this.isXiaofan() || this.isDafan()
    },
    ifNoSell () {
      if (this.indexNoSellStatus === '锁仓' && (!this.noSellIndex)) {
        return false
      }
      if (this.indexNoSellStatus === '锁仓') {
        return true
      }
      if (this.noSellIndex || this.noSellCount >= 18) {
        return true
      }
      return false
    },
    // 锁转交
    ifNoSellToCan () {
      // 到线下就解除
      if (this.averageMonthIndex <= 0) {
        return false
      }
      if (this.ifJieNoSellToCan()) {
        return false
      }
      if (this.indexNoSellStatus === '锁转交') {
        return true
      }
      if (this.indexNoSellStatus === '锁仓' && !this.ifNoSell()) {
        return true
      }
      return false
    },
    ifJieNoSellToCan () {
      if (this.indexNoSellStatus === '锁转交' && this.ifThreeDown) {
        return true
      }
      if (this.indexNoSellStatus === '锁转交' && this.ifNoSell()) {
        return true
      }
      return false
    },
    toNoSellToCan () {
      if (this.indexNoSellStatus === '锁仓' && !this.ifNoSell()) {
        return true
      }
      return false
    },
    // 是否清仓
    ifClearAll () {
      // 锁仓转不锁
      const question10 = storageUtil.getData('stockMarketQuestion', 'question_10')
      return this.ifDingbu() && (question10 === '是' || this.ifNoSellToCan())
    },
    // 是否涨得太快
    ifUpQuick () {
      // 两天涨得多
      const two = stockAnalysisUtil.countUp(this.netChangeRatioListLarge, 2, 2)
      if (two.flag) {
        if (two.rate > this.indexInfo.rate * 4) {
          return true
        }
      }
      const three = stockAnalysisUtil.countUp(this.netChangeRatioListLarge, 3, 3)
      if (three.flag) {
        if (three.rate > this.indexInfo.rate * 6) {
          return true
        }
      }
      return false
    },
    // 是否跌得太快
    ifDownQuick () {
      const three = stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 3, 3)
      if (three.flag) {
        if (three.rate < -(this.indexInfo.rate * 4)) {
          return true
        }
      }
      const two = stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 2, 2)
      if (two.flag) {
        if (two.rate < -(this.indexInfo.rate * 3)) {
          return true
        }
      }
      return false
    },
    ifJieFantan () {
      // if (this.indexNiuXiong === '小反' && this.averageMonthIndex < 0) {
      //   return true
      // }
      // 下降趋势两天就解反
      if (this.ifDownTrend) {
        return (
          (this.indexNiuXiong === '大反' || this.indexNiuXiong === '小反') &&
          (this.ifTwoUp)
        )
      } else {
        return (
          ((this.indexNiuXiong === '大反' || this.indexNiuXiong === '小反') &&
          this.ifThreeUp) ||
          (this.indexNiuXiong === '小反' && this.ifTwoUp)
        )
      }
    },
    // 获取今天前面的第一个买卖信号
    getBeforeFlagBoth () {
      for (let i = 1; i < this.buySellList.length; i++) {
        if (this.buySellList[i]) {
          return this.buySellList[i]
        } else if (this.otherBuySellList[i]) {
          return this.otherBuySellList[i]
        }
      }
      return ''
    },
    copyList (list) {
      let newList = []
      for (let i = 0; i < list.length; i++) {
        newList.push(list[i])
      }
      return newList
    },
    noSell (list) {
      let newList = []
      for (let i = 0; i < list.length; i++) {
        if (list[i] !== 'sell' && list[i] !== 'should-sell') {
          newList.push(list[i])
        }
      }
      return newList
    },
    noNormalSell (list) {
      let newList = []
      for (let i = 0; i < list.length; i++) {
        if (list[i] !== 'sell') {
          newList.push(list[i])
        }
      }
      return newList
    },
    ifHasSell (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i] === 'sell' || list[i] === 'should-sell') {
          return true
        }
      }
      return false
    },
    noBuy (list) {
      let newList = []
      for (let i = 0; i < list.length; i++) {
        if (list[i] !== 'buy' && list[i] !== 'should-buy') {
          newList.push(list[i])
        }
      }
      return newList
    },
    noNormalBuy (list) {
      let newList = []
      for (let i = 0; i < list.length; i++) {
        if (list[i] !== 'buy') {
          newList.push(list[i])
        }
      }
      return newList
    },
    ifHasBuy (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i] === 'buy' || list[i] === 'should-buy') {
          return true
        }
      }
      return false
    },
    ifXiaofan () {
      return this.ifSixFive || (this.averageMonthIndex > 0 && this.ifThreeDown)
    },
    isXiaofan () {
      return this.indexNiuXiong === '小反' && !this.ifJieFantan()
    },
    ifDafan () {
      if (this.ifFourDown || this.ifFiveDown || this.ifSevenSix || this.ifEightSeven || this.ifEightSix || this.ifNineSeven) {
        return true
      } else if (this.indexInfo.key === 'baoxian' && this.ifSixFive) {
        return true
      }
      return false
    },
    isDafan () {
      return this.indexNiuXiong === '大反' && !this.ifJieFantan()
    },
    isJinMai () {
      if (this.ifUnderYear && this.ifDownTrend && (this.indexStatus !== '定投' && this.indexStatus !== '探底')) {
        return true
      }
      return this.indexNiuXiong === '禁买' && this.ifUnderYear && this.ifDownTrend
    },
    isDingtou () {
      return this.indexStatus === '定投' && this.averageHalfYear < 0
    },
    ifDingbu () {
      return this.indexStatus === '顶部' && !this.ifJieDingbu() && !this.ifNoSell()
    },
    ifJieDingbu () {
      // 变成大小反，那阶段顶就解除
      if (this.indexStatus === '顶部' && (this.ifDafan() || this.ifXiaofan())) {
        return true
      }
      return this.indexStatus === '顶部' && !this.ifTopNow && this.ifNoSell()
    },
    localConsole (text) {
      if (this.indexInfo.key === 'chuangye') {
        console.log(text)
      }
    },
    getItemClass () {
      // 锁仓转不锁
      const question10 = storageUtil.getData('stockMarketQuestion', 'question_10')
      // 持续恐慌
      const question9 = storageUtil.getData('stockMarketQuestion', 'question_9')
      // 市场阶段
      const question1 = storageUtil.getData('stockMarketQuestion', 'question_1')
      const buyClass = 'buy'
      const sellClass = 'sell'
      const classList = []
      let shouldClass = ''
      const buySellList = this.buySellList
      classList.push(this.ifHas ? 'has' : 'no-has')
      classList.push(this.lock ? 'lock' : 'no-lock')
      // 涨4天了必须开始卖
      if (this.ifFourUp) {
        classList.push(sellClass)
      }
      // 垃圾指数
      if (this.ifLaji) {
        if (this.ifTwoUp) {
          classList.push(sellClass)
        }
      }
      // 下降趋势不要技术分析的买入信号
      if (buySellList[0] === buyClass && !this.ifLaji && !this.ifDownTrend) {
        // 如果是买入信号，那就直接红色，返回
        // 垃圾指数的买入信号，不会提示买入
        classList.push(buyClass)
      }
      if (buySellList[0] === sellClass) {
        if (question1 !== '筑顶后大跌' && question9 !== '是') {
          if (this.averageMonthIndex < 0) {
            // 在月线以下，就得卖，除了大反
            if (!this.isDafan()) {
              classList.push(sellClass)
            }
          } else {
            // 如果是卖出信号，那就判断是不是出于大反或者小反
            if (!this.ifInFantan()) {
              // 不处于反弹期才可以卖
              classList.push(sellClass)
            }
          }
        } else {
          // 是筑顶后大跌，是持续恐慌那就卖
          classList.push(sellClass)
        }
      }
      // ----------------------应该买的部分
      // 没有其他信号
      // 不是筑顶阶段才行
      // 连续跌三天
      // 下降趋势不要小反
      if (this.ifThreeDown && !this.ifDownTrend) {
        if (this.ifKuanji) {
          // 宽基指数可以买
          shouldClass = 'should-buy'
        } else {
          // 其他指数得要线上才能买
          if (this.averageMonthIndex > 0) {
            shouldClass = 'should-buy'
          }
          if (this.ifDownQuick()) {
            shouldClass = 'should-buy'
          }
        }
      }
      // 连跌4天或者5天，都能买
      if (this.ifFourDown || this.ifFiveDown) {
        shouldClass = 'should-buy'
      }
      // 跌很多天
      if (this.ifSixFive || this.ifSevenSix || this.ifEightSeven) {
        shouldClass = 'should-buy'
      }
      if (this.ifEightSix || this.ifNineSeven) {
        shouldClass = 'should-buy'
      }
      // ----------------------应该卖的部分
      if (this.allBuySellList[0] !== 'buy' && shouldClass === '' && this.rate < 0) {
        // 研究过了，线上确实可以不杀跌
        if (this.averageMonthIndex < 0 && !this.ifInFantan() && !this.ifThreeDown) {
          shouldClass = 'should-sell'
        }
      }
      // 应该的类
      classList.push(shouldClass)
      // 锁转交
      if (this.ifNoSellToCan() && (this.rate > (-this.indexInfo.rate))) {
        // 普通买入信号在小于rate的时候是不会出现的
        // 如果是大小反，那么锁转交的信号就会解除
        // 所以这个逻辑没有问题
        classList.push(sellClass)
      }
      // 清仓信号
      if (this.ifClearAll() && this.rate > (-this.indexInfo.rate)) {
        // 普通买入信号在小于rate的时候是不会出现的
        // 如果是大小反，那么清仓的信号就会解除
        // 所以这个逻辑没有问题
        classList.push(sellClass)
      }
      let classListF = this.copyList(classList)
      // 整体转弱了
      if (question10 === '是') {
        // 纯买信号没有了
        classListF = this.noNormalBuy(classListF)
        // 不是大小反，那就加个卖出信号
        if (classListF.indexOf('should-buy') === -1) {
          classListF.push(sellClass)
        }
      }
      // 持续恐慌事件那就不要买了
      if (question9 === '是') {
        classListF = this.noBuy(classListF)
      }
      // 禁买成立
      if (this.isJinMai()) {
        // 没有任何买入
        classListF = this.noBuy(classListF)
        // 涨了就卖
        if (this.rate > 0) {
          classListF.push(sellClass)
        }
        // 叠加持续恐慌的话直接卖
        if (question9 === '是') {
          classListF.push(sellClass)
        }
      }
      // 指数处于阶段顶部区间
      if (this.ifDingbu()) {
        // 纯买信号没有了
        classListF = this.noNormalBuy(classListF)
      }
      // 止盈
      if (this.isCutDown()) {
        // 没有买入信号
        // 加入卖出信号
        classListF = this.noBuy(classListF)
        classListF.push(sellClass)
      }
      // 权重最大的-------------
      // 锁仓的没有卖出高亮
      if (this.lock) {
        classListF = this.noSell(classListF)
      }
      // 定投阶段没有卖出高亮
      if (this.isDingtou()) {
        classListF = this.noSell(classListF)
      }
      // 锁仓的逻辑
      if (this.ifNoSell()) {
        if (this.rate < 0) {
          // 锁仓阶段可以跌了就买
          classListF.push('should-buy')
        }
        // 在趋势中，什么卖出信号都不用管
        classListF = this.noSell(classListF)
      }
      return classListF
    }
  }
}
</script>
