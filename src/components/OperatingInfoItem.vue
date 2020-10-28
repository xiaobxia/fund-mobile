<template>
  <mt-cell-swipe
    :to="toUrl"
    :class="['operating-info-item', ...getItemClass()]"
  >
    <div slot="title">
      <h3>
        <span class="index-name">{{indexInfo.name}}</span>
        <span v-if="lock" class="fm-icon lock"></span>
        <span v-if="ifTargetUpCloseLock" class="fm-tag s-red">目标锁</span>
        <span v-if="ifInZ45StatusNow" class="fm-tag s-black">z45</span>
        <span v-if="isInQuarterHotToday" class="fm-tag s-black">危险</span>
        <!--<span v-if="indexStage === '顶部'" class="fm-tag s-yellow">阶顶</span>-->
        <span v-if="isInDingtouStatus()" class="fm-tag s-red">定投</span>
        <span v-if="ifUnderYear" class="fm-tag s-green">年下</span>
        <span v-if="ifDownTrend" class="fm-tag s-green">下趋</span>
        <span v-if="isInDafanBefore()" class="fm-tag s-red">大反</span>
        <span v-if="isInXiaofanBefore()" class="fm-tag s-red">小反</span>
        <span v-if="ifInNoSellStatus()" class="fm-tag s-red">锁仓</span>
        <span v-if="ifNoSellToCan()" class="fm-tag s-green">转交</span>
        <!--<span v-if="ifOpenCutDown" class="fm-tag s-yellow">开止盈</span>-->
        <span v-if="indexDaXiaoStatusOld === '禁买'" class="fm-tag s-black">{{indexDaXiaoStatusOld}}</span>
        <span v-if="averageMonthIndex > 0" class="fm-tag b-red">月上</span>
        <span v-if="averageMonthIndex <= 0" class="fm-tag b-green">月下</span>
        <span v-if="!isToBeDafanToday() && isToBeXiaofanToday()" class="fm-tag s-red">小</span>
        <span v-if="isToBeDafanToday()" class="fm-tag s-red">大</span>
        <span v-if="toNoSellToCan()" class="fm-tag blue">更转交</span>
        <span v-if="ifRelieveFixLine" class="fm-tag s-blue">解定</span>
        <span v-if="ifJieFantanToday()" class="fm-tag s-blue">解反</span>
        <span v-if="ifJieNoSellToCan()" class="fm-tag s-blue">解转交</span>
        <span v-if="ifJieTargetUpCloseLock" class="fm-tag s-blue">解目标</span>
        <!--<span v-if="ifJieDingbu()" class="fm-tag s-blue">解顶</span>-->
        <span v-if="ifJieQuarterHot" class="fm-tag s-blue">解危</span>
        <span v-if="ifJieZ45" class="fm-tag s-blue">解z45</span>
        <span v-if="isBad()" class="fm-tag s-black">恶化</span>
        <!--执行部分-->
        <span
          v-if="ifQuarterHotCut()"
          class="fm-tag s-black"
        >清{{ifThreeUp ? '0.3': '1/6'}}</span>
        <span v-if="ifQuarterHotNow" class="fm-tag s-black">季</span>
        <span
          v-if="ifFixIndex && ifQuarterHotCutNow()"
          class="fm-tag s-black"
        >卖定{{getFixSellRate()}}</span>
        <span v-if="ifJieTargetUpCloseLock" class="fm-tag s-black">目标0.3</span>
        <!--<span v-if="ifStopKeep()" class="fm-tag s-black">止盈</span>-->
        <!--年下z45是必跌的-->
        <span v-if="ifClearZ45Today" class="fm-tag s-black">清z45</span>
        <span v-if="sellLowDownSmall()" class="fm-tag s-black">危险1/3</span>
        <span v-if="sellLowDownBig()" class="fm-tag s-black">危险2/3</span>
        <!--大牛市暂时注释-->
        <!--<span v-if="ifDoubleHot() && ifFourUp" class="fm-tag s-black">热减</span>-->
        <span v-if="ifUnderYear && ifDownTrend && (indexStage !== '定投' && indexStage !== '探底')" class="fm-tag black">禁买</span>
        <span v-if="indexDaXiaoStatusOld === '禁买' && (!ifUnderYear || !ifDownTrend)" class="fm-tag s-blue">解禁</span>
        <span style="float: right" :class="stockNumberClass(rate)">{{rate}}%</span>
      </h3>
      <p class="explain">
            <span v-for="(subItem, index) in buySellList" :key="index"
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
              <span class="value">{{$formatMoney(hasCount)}}</span>
            </span>
        <span class="item">
              <span class="label">卖出金额：</span>
              <span class="value green-text">{{$formatMoney(indexSellNumber)}}</span>
            </span>
        <span class="item">
              <span class="label">买入金额：</span>
              <span class="value red-text">{{$formatMoney(indexBuyNumber)}}</span>
            </span>
            <span class="item">
              <span class="label">原买：</span>
              <span class="value">{{$formatMoney(indexRawBuyNumber)}}</span>
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
    // 是否持有
    ifHas () {
      return this.hasCount > 0
    },
    // 是否机构指数
    ifJigou () {
      return jigou.indexOf(this.indexInfo.key) !== -1
    },
    // 垃圾指数
    ifLaji () {
      return laji.indexOf(this.indexInfo.key) !== -1
    },
    // 是不是宽基
    ifKuanji () {
      return kuanji.indexOf(this.indexInfo.key) !== -1
    },
    ifFixIndex () {
      return [
        'chuangye', 'wulin', 'sanbai', 'wubai', 'yiqian',
        'baijiu', 'shipin',
        'yiliao', 'shengwu',
        'jisuanji', 'dianzi', 'xinxi'
      ].indexOf(this.indexInfo.key) !== -1
    },
    // 月线
    averageMonthIndex () {
      return storageUtil.getData('averageMonth', this.indexInfo.key) || 0
    },
    // 半年线
    averageHalfYear () {
      return storageUtil.getData('averageHalfYearIndex', this.indexInfo.key) || 0
    },
    averageQuarter () {
      return storageUtil.getData('averageQuarterIndex', this.indexInfo.key) || 0
    },
    // 指数月线偏离过大
    ifMonthHot () {
      const averageMonth = storageUtil.getData('averageMonth', this.indexInfo.key) || 0
      return averageMonth >= this.indexInfo.reduceLine
    },
    // 指数在年线一下
    ifUnderYear () {
      const diff = storageUtil.getData('yearAverageIndexDiff', this.indexInfo.key) || 0
      return diff < 0
    },
    // 年偏离
    yearDiff () {
      return storageUtil.getData('yearAverageIndexDiff', this.indexInfo.key) || 0
    },
    // 获取另一种模式的技术性信号
    otherBuySellList () {
      if (this.type === '简') {
        return storageUtil.getData('xiongBuySellList', this.indexInfo.key) || []
      } else {
        return storageUtil.getData('jianBuySellList', this.indexInfo.key) || []
      }
    },
    // 两种模式合并后信号
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
    // ---------------指数的状态
    // 指数原本的大小反状态
    indexDaXiaoStatusOld () {
      const niuXiong = storageUtil.getData('stockIndexFlag', this.indexInfo.key)
      return niuXiong === '正常' ? '' : niuXiong
    },
    // 指数所处阶段
    indexStage () {
      const status = storageUtil.getData('stockIndexStatus', this.indexInfo.key)
      return status || ''
    },
    // 原本的锁仓状态
    indexNoSellStatusOld () {
      const status = storageUtil.getData('stockIndexNoSellStatus', this.indexInfo.key)
      return status || ''
    },
    // 指数目前的锁仓状态
    indexNoSellStatusToday () {
      return storageUtil.getData('noSell', this.indexInfo.key) || false
    },
    // 指数目前是不是顶部
    ifIndexTopToday () {
      return storageUtil.getData('stockIndexIsTop', this.indexInfo.key) || false
    },
    // 指数是否开启止盈
    ifOpenCutDown () {
      return storageUtil.getData('stockIndexCutDown', this.indexInfo.key) === '开启'
    },
    // 指数是否危险
    ifOpenQuarterHot () {
      return storageUtil.getData('stockIndexQuarterHot', this.indexInfo.key) === '开启'
    },
    isInQuarterHotToday () {
      return this.ifOpenQuarterHot && this.averageQuarter >= 0
    },
    // 当前差值还是很大
    ifQuarterHotNow () {
      const quDiff = storageUtil.getData('averageQuarterIndex', this.indexInfo.key) || 0
      return quDiff >= this.indexInfo.quarterHotLine
    },
    ifJieQuarterHot () {
      return this.ifOpenQuarterHot && this.averageQuarter < 0
    },
    // 今天触发z45
    ifOpenZ45Today () {
      return storageUtil.getData('z45Now', this.indexInfo.key) === '开启'
    },
    // 触发z45并且年下立马卖出
    ifClearZ45Today () {
      return this.ifOpenZ45Today && this.ifUnderYear
    },
    // 之前处于z45
    ifZ45Status () {
      return storageUtil.getData('stockIndexZ45', this.indexInfo.key) === '开启'
    },
    // 解z45
    ifJieZ45 () {
      return this.ifZ45Status && this.averageMonthIndex <= this.indexInfo.relieveZ45Line
    },
    ifInZ45StatusNow () {
      if (this.ifOpenZ45Today) {
        return true
      }
      if (this.ifZ45Status) {
        return !this.ifJieZ45
      }
      return false
    },
    // 是否解除定投
    ifRelieveFixLine () {
      return this.indexStage === '定投' && this.averageHalfYear >= this.indexInfo.relieveFixLine
    },
    // 是否到达目标点位
    ifTargetUpCloseLock () {
      const targetUpClose = storageUtil.getData('stockIndexTargetUpClose', this.indexInfo.key) || 0
      if (targetUpClose) {
        const indexNowClose = storageUtil.getData('indexNowClose', this.indexInfo.key) || 0
        if (indexNowClose < targetUpClose) {
          return true
        }
      }
      return false
    },
    // 是否到达目标点位
    ifJieTargetUpCloseLock () {
      const targetUpClose = storageUtil.getData('stockIndexTargetUpClose', this.indexInfo.key) || 0
      if (targetUpClose) {
        const indexNowClose = storageUtil.getData('indexNowClose', this.indexInfo.key) || 0
        if (indexNowClose >= targetUpClose) {
          return true
        }
      }
      return false
    },
    // ------------连涨连跌信号
    ifTwoDown () {
      return stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 2, 2).flag
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
    // 连续两个-0.2的下跌
    ifTwoLowDown () {
      return stockAnalysisUtil.countLowDown(this.netChangeRatioListLarge).flag
    },
    // 是否出于下降趋势
    ifDownTrend () {
      const indexNowClose = storageUtil.getData('indexNowClose', this.indexInfo.key) || 0
      const averageHalfYearIndexClose = storageUtil.getData('averageHalfYearIndexClose', this.indexInfo.key) || 0
      // 进入定投区域了那就不是下降趋势
      if (this.indexStage === '定投') {
        return false
      }
      if (indexNowClose < averageHalfYearIndexClose) {
        if (this.countDifferenceRate(indexNowClose, averageHalfYearIndexClose) <= this.indexInfo.downTrendLine) {
          return true
        }
      }
      return false
    },
    // ----------买卖金额的方法
    // 指数买入金额
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
    // 没有根据涨跌幅重设的买入金额
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
    // 卖出金额
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
    ifFengNiu () {
      // 是不是全面疯牛
      const question10 = storageUtil.getData('stockMarketQuestion', 'question_10')
      return question10 === '是'
    }
  },
  created () {
  },
  methods: {
    getFixSellRate () {
      if (this.yearDiff >= 50) {
        return '1/8'
      } else if (this.yearDiff >= 40) {
        return '1/10'
      } else if (this.yearDiff >= 30) {
        return '1/12'
      } else if (this.yearDiff >= 20) {
        return '1/15'
      }
      return '1/18'
    },
    // 复制买卖信号
    copyList (list) {
      let newList = []
      for (let i = 0; i < list.length; i++) {
        newList.push(list[i])
      }
      return newList
    },
    // 打印特定指数
    localConsole (key, text) {
      if (this.indexInfo.key === key) {
        console.log(text)
      }
    },
    // ----------判断买卖信号
    // 删除卖出信号
    removeSell (list) {
      let newList = []
      for (let i = 0; i < list.length; i++) {
        if (list[i] !== 'sell' && list[i] !== 'should-sell') {
          newList.push(list[i])
        }
      }
      return newList
    },
    // 删除技术性卖出信号
    removeNormalSell (list) {
      let newList = []
      for (let i = 0; i < list.length; i++) {
        if (list[i] !== 'sell') {
          newList.push(list[i])
        }
      }
      return newList
    },
    // 是否有买入信号
    ifHasSell (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i] === 'sell' || list[i] === 'should-sell') {
          return true
        }
      }
      return false
    },
    // 删除所有买入信号
    removeBuy (list) {
      let newList = []
      for (let i = 0; i < list.length; i++) {
        if (list[i] !== 'buy' && list[i] !== 'should-buy') {
          newList.push(list[i])
        }
      }
      return newList
    },
    // 删除技术性买入信号
    removeNormalBuy (list) {
      let newList = []
      for (let i = 0; i < list.length; i++) {
        if (list[i] !== 'buy') {
          newList.push(list[i])
        }
      }
      return newList
    },
    // 是否有买入信号
    ifHasBuy (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i] === 'buy' || list[i] === 'should-buy') {
          return true
        }
      }
      return false
    },
    // ----------提示信号
    // 高月外加季度线
    ifDoubleHot () {
      // 月线危险区，外加季度线危险区，需要提示减仓
      return this.ifMonthHot && this.isInQuarterHotToday && this.rate > 0
    },
    // 满足止盈条件
    // ifStopKeep () {
    //   const nowClose = storageUtil.getData('indexNowClose', this.indexInfo.key) || 0
    //   const topClose = storageUtil.getData('stockIndexTopClose', this.indexInfo.key) || 0
    //   if (this.ifOpenCutDown) {
    //     // 最高处回落6%
    //     if (this.countDifferenceRate(nowClose, topClose) < -6) {
    //       return true
    //     }
    //   }
    //   return false
    // },
    // 是否处于反弹
    ifInFantanOld () {
      return this.isInXiaofanBefore() || this.isInDafanBefore()
    },
    // 触发锁仓条件
    ifInNoSellStatus () {
      if (this.indexNoSellStatusOld === '锁仓' && (!this.indexNoSellStatusToday)) {
        return false
      }
      if (this.indexNoSellStatusOld === '锁仓') {
        return true
      }
      if (this.indexNoSellStatusToday) {
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
      // 解锁
      if (this.ifJieNoSellToCan()) {
        return false
      }
      // 状态就是锁转交
      if (this.indexNoSellStatusOld === '锁转交') {
        return true
      }
      if (this.indexNoSellStatusOld === '锁仓' && !this.ifInNoSellStatus()) {
        return true
      }
      return false
    },
    // 锁转交，并且又刚3跌就不算
    ifNoSellToCanNew () {
      if (this.ifNoSellToCan() && !this.ifThreeDown) {
        return true
      }
      return false
    },
    // 解锁转交
    ifJieNoSellToCan () {
      // 锁转交状态时，触发大小反
      if (this.indexNoSellStatusOld === '锁转交' && this.ifThreeDown) {
        return true
      }
      // 锁转交的时候又锁上了
      if (this.indexNoSellStatusOld === '锁转交' && this.ifInNoSellStatus()) {
        return true
      }
      return false
    },
    // 把锁仓转成不锁的操做信号
    toNoSellToCan () {
      if (this.indexNoSellStatusOld === '锁仓' && !this.ifInNoSellStatus()) {
        return true
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
    // 是否解反弹
    ifJieFantanToday () {
      if (this.ifTwoUp) {
        // 两天涨了4个rate也要解反
        const info = stockAnalysisUtil.countUp(this.netChangeRatioListLarge, 2, 2)
        if (info.rate > (this.indexInfo.rate * 4)) {
          return true
        }
      }
      // 如果两个0.2下跌，必须得解反
      if (this.ifTwoLowDown) {
        if (this.indexDaXiaoStatusOld === '大反' || this.indexDaXiaoStatusOld === '小反') {
          return true
        }
      }
      // 下降趋势两天就解反
      if (this.ifDownTrend) {
        return (
          (this.indexDaXiaoStatusOld === '大反' || this.indexDaXiaoStatusOld === '小反') &&
          (this.ifTwoUp)
        )
      } else {
        return (
          ((this.indexDaXiaoStatusOld === '大反' || this.indexDaXiaoStatusOld === '小反') &&
          this.ifThreeUp) ||
          (this.indexDaXiaoStatusOld === '小反' && this.ifTwoUp)
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
    // 今天达成小反条件
    isToBeXiaofanToday () {
      return this.ifSixFive || (this.averageMonthIndex > 0 && this.ifThreeDown)
    },
    // 之前是不是小反
    isInXiaofanBefore () {
      return this.indexDaXiaoStatusOld === '小反' && !this.ifJieFantanToday()
    },
    // 处于大反的状态
    ifInXiaofanNow () {
      return this.isToBeXiaofanToday() || this.isInXiaofanBefore()
    },
    // 今天达成大反条件
    isToBeDafanToday () {
      if (this.ifFourDown || this.ifFiveDown || this.ifSevenSix || this.ifEightSeven || this.ifEightSix || this.ifNineSeven) {
        return true
      } else if (this.indexInfo.key === 'baoxian' && this.ifSixFive) {
        return true
      }
      return false
    },
    // 之前是否处于大反
    isInDafanBefore () {
      return this.indexDaXiaoStatusOld === '大反' && !this.ifJieFantanToday()
    },
    // 处于大反的状态
    ifInDafanNow () {
      return this.isToBeDafanToday() || this.isInDafanBefore()
    },
    // 是否发出禁买
    isJinMai () {
      // 在线下，那肯定不会是解定状态
      if (this.ifUnderYear && this.ifDownTrend && (this.indexStage !== '定投' && this.indexStage !== '探底')) {
        return true
      }
      return this.indexDaXiaoStatusOld === '禁买' && this.ifUnderYear && this.ifDownTrend
    },
    // 是否处于定投
    isInDingtouStatus () {
      return this.indexStage === '定投' && !this.ifRelieveFixLine
    },
    // 是不是顶部条件
    // ifInDingbuStatus () {
    //   // 锁仓的话顶部条件就不触发
    //   return this.indexStage === '顶部' && !this.ifJieDingbu() && !this.ifInNoSellStatus()
    // },
    // 是否解顶部的影响
    // ifJieDingbu () {
    //   // 变成大小反，那阶段顶就解除
    //   if (this.indexStage === '顶部' && (this.isToBeDafanToday() || this.isToBeXiaofanToday())) {
    //     return true
    //   }
    //   // 不是顶部了，然后又变成的锁仓状态
    //   return this.indexStage === '顶部' && !this.ifIndexTopToday && this.ifInNoSellStatus()
    // },
    // 两个小幅0.2下跌很危险
    sellLowDownSmall () {
      // 达成条件，但是满足其他，所以少卖点
      if (this.ifTwoLowDown) {
        if (this.isToBeDafanToday() || this.ifInNoSellStatus() || this.isInDingtouStatus()) {
          return true
        }
      }
      return false
    },
    // 两个小幅0.2下跌很危险
    sellLowDownBig () {
      return this.ifTwoLowDown && !this.sellLowDownSmall()
    },
    // 季度线影响
    ifMonthUpOk (key) {
      // const ifQuarterHot = storageUtil.getData('stockIndexQuarterHot', key) === '开启'
      const averageQuarter = storageUtil.getData('averageQuarterIndex', key) || 0
      if (averageQuarter > 0) {
        // if (ifQuarterHot) {
        //   return false
        // }
        return true
      } else {
        return false
      }
    },
    // 季度线火热，然后又很危险
    ifQuarterHotCut () {
      return this.isInQuarterHotToday && this.averageMonthIndex > 0 && this.rate > 0 && !this.ifInNoSellStatus()
    },
    ifQuarterHotCutNow () {
      return this.ifQuarterHotCut() && this.ifQuarterHotNow
    },
    setIndexCanFix () {
      let fag = true
      // 定投区肯定可以定投
      if (this.isInDingtouStatus()) {
        fag = true
      } else {
        if (this.ifDownTrend) {
          if (this.ifUnderYear) {
            // 如果年下和半年下太多，那就变为定投状态了
            fag = false
          } else {
            // 年上
            fag = true
          }
        } else {
          // 不是下降趋势
          fag = true
        }
      }
      storageUtil.setData('stockIndexCanFix', this.indexInfo.key, fag)
    },
    // 是否恶化
    isBad () {
      // 基本面恶化就只有锁仓买了
      // 年线和半年线都得在下面，年线上和半年线下涨的概率该是很大的，我研究过了
      if (
        this.averageQuarter < 0 &&
        this.averageHalfYear < 0 &&
        this.yearDiff < 0
      ) {
        // 同时也不是定投阶段
        if (!this.isInDingtouStatus()) {
          // 月线在下面
          if (this.averageMonthIndex < 0) {
            return true
          }
        }
      }
      return false
    },
    // 是否处于恶化
    isInBad () {
      // 是否基本面恶化，是的话只有月线在上才能买，不管什么大小反
      const question9 = storageUtil.getData('stockMarketQuestion', 'question_9') || '否'
      if (question9 === '是') {
        return this.isBad()
      }
      return false
    },
    getItemClass () {
      this.setIndexCanFix()
      const buyClass = 'buy'
      const sellClass = 'sell'
      const shouldBuyClass = 'should-buy'
      const shouldSellClass = 'should-sell'
      const classList = []
      let shouldClass = ''
      const buySellList = this.buySellList
      // 有没有
      classList.push(this.ifHas ? 'has' : 'no-has')
      classList.push(this.lock ? 'lock' : 'no-lock')
      // --------技术性信号部分
      // 技术性买入
      if (buySellList[0] === buyClass) {
        // 只有月线并且季度线上能买
        if (this.averageMonthIndex > 0 && this.averageQuarter > 0) {
          // 不是垃圾指数
          if (!this.ifLaji) {
            // 不是下降趋势
            if (!this.ifDownTrend) {
              classList.push(buyClass)
            }
          }
        }
      }
      // 技术性卖出
      if (buySellList[0] === sellClass) {
        if (this.isInBad()) {
          // 基本面恶化那就卖
          classList.push(sellClass)
        } else {
          if (this.averageMonthIndex < 0) {
            // 在月线以下，就得卖，除了大反
            if (!this.ifInDafanNow()) {
              classList.push(sellClass)
            }
          } else {
            // 在月线以上，并且不是反弹那就卖出
            if (!this.ifInFantanOld()) {
              classList.push(sellClass)
            }
          }
        }
      }
      // ----------------------应该买的部分
      // 连续跌三天，并且不是下降趋势
      if (this.ifThreeDown && !this.ifDownTrend) {
        // 季度线以上
        if (this.averageQuarter > 0) {
          if (this.ifKuanji) {
            // 宽基指数可以买
            shouldClass = shouldBuyClass
          } else {
            // 其他指数得要线上才能买
            if (this.averageMonthIndex > 0) {
              shouldClass = shouldBuyClass
            }
            // 跌得太快也可以买
            if (this.ifDownQuick()) {
              shouldClass = shouldBuyClass
            }
          }
        }
      }
      let isBig = false
      // 连跌4天或者5天，都能买
      if (this.ifFourDown || this.ifFiveDown) {
        shouldClass = shouldBuyClass
        isBig = true
      }
      // 跌很多天
      if (this.ifSixFive || this.ifSevenSix || this.ifEightSeven) {
        shouldClass = shouldBuyClass
        isBig = true
      }
      if (this.ifEightSix || this.ifNineSeven) {
        shouldClass = shouldBuyClass
        isBig = true
      }
      // ----------------------应该卖的部分
      // TODO 涨4天了发出应该卖
      if (this.ifFourUp) {
        shouldClass = shouldSellClass
      }
      // TODO 垃圾指数涨2天就卖
      if (this.ifLaji) {
        if (this.ifTwoUp) {
          // 不处于大反，小反的可以卖
          if (this.isInBad()) {
            // 恶化的就得卖
            shouldClass = shouldSellClass
          } else {
            if (!this.ifInDafanNow()) {
              shouldClass = shouldSellClass
            }
          }
        }
      }
      // TODO 没有买入信号，也没有应该买
      if (this.allBuySellList[0] !== 'buy' && shouldClass === '' && this.rate < 0) {
        // 研究过了，线上确实可以不杀跌
        if (this.isInBad()) {
          // 恶化了就卖
          shouldClass = shouldSellClass
        } else {
          if (this.averageMonthIndex < 0 && !this.ifInFantanOld() && !this.ifThreeDown) {
            shouldClass = shouldSellClass
          }
        }
      }
      // 应该的类
      classList.push(shouldClass)
      // TODO 锁转交，月线是在上面的
      if (this.ifNoSellToCanNew() && (this.rate > (-1 * this.indexInfo.rate))) {
        // 普通买入信号在小于rate的时候是不会出现的
        // 如果是大小反，那么锁转交的信号就会解除
        // 所以这个逻辑没有问题
        if (this.isInBad()) {
          // 恶化就得卖
          classList.push(sellClass)
        } else {
          if (!this.ifInDafanNow()) {
            classList.push(sellClass)
          }
        }
      }
      let classListF = this.copyList(classList)
      // TODO 禁买成立
      if (this.isJinMai()) {
        // 没有任何买入
        classListF = this.removeBuy(classListF)
        // 涨了就卖
        if (this.rate > 0) {
          // 无视大小反的
          classListF.push(sellClass)
        }
      }
      // TODO 季度线过热，然后转交，那就提示卖出
      // 不管有没有大反什么的，因为一定会跌倒季度线为负数
      const isNoQuarter = storageUtil.getData('noBuySellConfig', 'isNoQuarter') || false
      if (this.ifQuarterHotCut()) {
        if (!isNoQuarter) {
          classListF.push(sellClass)
        }
      }
      const isMeng = storageUtil.getData('noBuySellConfig', 'isMeng') || false
      // TODO 直接闷的涨3天就跑
      if (isMeng) {
        // 直接闷的，抗住不卖以后，解反了该卖还是得卖
        if (!this.ifTwoUp) {
          classListF = this.removeSell(classListF)
        }
      }
      // 权重最大的-------------
      // TODO 定投阶段没有卖出高亮
      if (this.isInDingtouStatus()) {
        classListF = this.removeSell(classListF)
      }
      // TODO 没到目标位不卖
      if (this.ifTargetUpCloseLock) {
        classListF = this.removeSell(classListF)
      }
      // TODO 季线危险阶段，没有买入信号，因为很可能是无止境得跌
      if (this.isInQuarterHotToday) {
        // 没有季度影响并且是大反才可以例外
        // if (!(isNoQuarter && isBig)) {
        //   classListF = this.removeBuy(classListF)
        // }
        classListF = this.removeBuy(classListF)
      }
      // TODO 处于z45不能买
      if (this.ifInZ45StatusNow) {
        classListF = this.removeBuy(classListF)
      }
      // TODO 全面大疯牛市，只有锁仓买
      if (this.ifFengNiu) {
        classListF = this.removeBuy(classListF)
      }
      // TODO 是否基本面恶化，是的话只有月线在上才能买，不管什么大小反
      if (this.isInBad()) {
        classListF = this.removeBuy(classListF)
      }
      // -----锁仓之后就没有买入逻辑
      let ifNoSellF = false
      // TODO 锁仓的逻辑
      // 锁仓的指数太少也危险，很有可能是假的稳定
      const manyToLess = storageUtil.getData('noBuySellConfig', 'manyToLess') || false
      if (this.ifInNoSellStatus() && this.noSellCount > 6) {
        // 6个一下不考虑
        if (
          this.noSellCount > 12 ||
          (!manyToLess && this.noSellCount > 6)
        ) {
          ifNoSellF = true
          // 锁仓了
          if (this.averageQuarter >= 0) {
            // 季度线以上跌了就买
            if (this.rate < 0) {
              classListF.push('should-buy')
              if (this.ifHasBuy(classListF)) {
                classListF.push('only-up-buy')
              }
            }
          } else {
            // 季度线以下两跌再买
            if (this.ifTwoDown) {
              classListF.push('should-buy')
              if (this.ifHasBuy(classListF)) {
                classListF.push('only-up-buy')
              }
            }
          }
          // 在趋势中，什么卖出信号都不用管
          classListF = this.removeSell(classListF)
        }
      }
      // TODO 季度线以上，月线超过0就可以不杀跌
      if (this.ifMonthUpOk(this.indexInfo.key)) {
        if (this.averageMonthIndex > 0) {
          // 小于0不卖出
          if (this.rate <= 0) {
            classListF = this.removeSell(classListF)
          }
        }
      }
      // TODO 双过热并且连涨4天需要提示减仓
      // 大牛市暂时注释掉
      // if (this.ifDoubleHot() && this.ifFourUp) {
      //   classListF.push('should-sell')
      // }
      // TODO 两个小幅0.2，即使锁仓也没有用，锁仓只卖1/3
      if (this.sellLowDownSmall() || this.sellLowDownBig()) {
        // 没有任何买入
        classListF = this.removeBuy(classListF)
        // 加入卖出
        classListF.push(sellClass)
      }
      // TODO 年下当天触发z45那就立马卖出，权重最大不管任何情况
      if (this.ifClearZ45Today) {
        // 没有任何买入
        classListF = this.removeBuy(classListF)
        // 加入卖出
        classListF.push(sellClass)
      }
      // TODO 到达目标减半一次
      if (this.ifJieTargetUpCloseLock) {
        // 没有任何买入
        classListF = this.removeBuy(classListF)
        // 加入卖出
        classListF.push(sellClass)
      }
      // ----最大最大权限--控制
      const noBuy = storageUtil.getData('noBuySellConfig', 'noBuy') || false
      const noSell = storageUtil.getData('noBuySellConfig', 'noSell') || false
      if (noBuy) {
        classListF = this.removeBuy(classListF)
      }
      if (noSell) {
        classListF = this.removeSell(classListF)
      }
      // 发送到服务端
      this.sendFlagToServer(classListF)
      // ---------关于个人的限制
      // 锁仓的没有卖出高亮
      if (this.lock) {
        classListF = this.removeSell(classListF)
      }
      return classListF
    },
    sendFlagToServer (classListF) {
      // 发送信号
      if (this.type === '熊') {
        let flag = ''
        if (this.ifHasBuy(classListF)) {
          if (classListF.indexOf('only-up-buy') !== -1) {
            flag = '小幅加仓'
          } else {
            flag = '加仓'
          }
        }
        if (this.ifHasSell(classListF)) {
          flag = '减仓'
        }
        storageUtil.setData('bandBuySellData', this.indexInfo.key, flag)
      }
    }
  }
}
</script>
