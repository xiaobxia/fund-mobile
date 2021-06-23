<template>
  <mt-cell-swipe
    :class="['operating-info-item', ...otherClass() ,...getItemClass()]"
  >
    <div style="display: none" :class="[...getItemClass('fbs')]"></div>
    <div slot="title" style="position: relative">
      <div @click="toPath(toUrl)">
        <h3>
          <span class="index-name">{{indexInfo.name}}</span>
          <span v-if="lock" class="fm-icon lock"></span>
          <div class="tag-w" style="display: inline-block;">
            <span v-if="ifFengNiu && index30Diff < 0" class="fm-tag s-green">疯牛卖</span>
            <span v-if="bigDi()" class="fm-tag s-yellow">中级底</span>
            <span v-if="ifTargetUpCloseLock" class="fm-tag s-red">目标锁</span>
            <span v-if="targetUpDiff()" class="fm-tag s-black">目标:{{targetUpDiff()}}</span>
            <span v-if="targetDownDiff()" class="fm-tag s-black">止盈:{{targetDownDiff()}}</span>
            <span v-if="isInJiandi" class="fm-tag s-red">见底</span>
            <span v-if="isInOneDeep()" class="fm-tag s-red">单底</span>
            <span v-if="ifInZ45StatusNow" class="fm-tag s-black">z45</span>
            <span v-if="isBadDown()" class="fm-tag s-black">年季危</span>
            <span v-if="isBadDown() && !ifLaji" class="fm-tag s-blue">进垃圾</span>
            <span v-if="isInQuarterHotToday" class="fm-tag s-black">危险</span>
            <span v-if="isInDingtouStatus()" class="fm-tag s-red">定投</span>
            <span v-if="qDiffAvRateIndex > 0" class="fm-tag s-red">上升</span>
            <span v-if="qDiffAvRateIndex < 0" class="fm-tag s-green">下降</span>
            <span v-if="ifUnderYear" class="fm-tag s-green">年下</span>
            <span v-if="ifDownTrend" class="fm-tag s-green">下趋</span>
            <span v-if="isInDafanBefore()" class="fm-tag s-red">大反</span>
            <span v-if="isInXiaofanBefore()" class="fm-tag s-red">小反</span>
            <span v-if="ifInNoSellStatus()" class="fm-tag s-red">锁仓</span>
            <span v-if="ifNoSellToCan()" class="fm-tag s-green">转交</span>
            <span v-if="indexDaXiaoStatusOld === '禁买'" class="fm-tag s-black">{{indexDaXiaoStatusOld}}</span>
            <span v-if="averageMonthIndex > 0" class="fm-tag b-red">月上</span>
            <span v-if="averageMonthIndex <= 0" class="fm-tag b-green">月下</span>
            <span v-if="!isToBeDafanToday() && isToBeXiaofanToday()" class="fm-tag s-red">小</span>
            <span v-if="isToBeDafanToday()" class="fm-tag s-red">大</span>
            <!--月线上的大小不添加信号，因为之后要么是锁仓，要么是见顶，总之效果不好-->
            <span v-if="(isToBeXiaofanToday() || isToBeDafanToday()) && averageMonthIndex > 0" class="fm-tag s-blue">月上大小不锁</span>
            <span v-if="ifBianpan()" class="fm-tag s-blue">变盘清1/3</span>
            <span v-if="toNoSellToCan()" class="fm-tag blue">更转交</span>
            <span v-if="ifRelieveFixLine" class="fm-tag s-blue">解定</span>
            <span v-if="ifJieFantanToday()" class="fm-tag s-blue">解反</span>
            <span v-if="ifJieNoSellToCan()" class="fm-tag s-blue">解转交</span>
            <span v-if="ifJieTargetUpCloseLock" class="fm-tag s-blue">解目标</span>
            <span v-if="isJieJiandi" class="fm-tag s-blue">解见底</span>
            <span v-if="isInJiandiWei" class="fm-tag s-yellow">见底危</span>
            <!--<span v-if="ifJieDingbu()" class="fm-tag s-blue">解顶</span>-->
            <span v-if="ifJieQuarterHot" class="fm-tag s-blue">解危</span>
            <span v-if="ifJieZ45" class="fm-tag s-blue">解z45</span>
            <span v-if="isBad()" class="fm-tag s-black">恶化</span>
            <span v-if="isOneDeep" class="fm-tag s-blue">单底</span>
            <span v-if="isJieOneDeep()" class="fm-tag s-blue">解单底</span>
            <span v-if="targetDownDone()" class="fm-tag s-blue">请止损:{{isToBeDafanToday() ? '1/2' : '清仓'}}</span>
            <!--<span v-if="isInQuarterHotToday && !targetDownClose" class="fm-tag s-blue">设置止损</span>-->
            <span v-if="!isInQuarterHotToday && targetDownClose" class="fm-tag s-blue">清空止损</span>
            <span v-if="positionQYHigh" class="fm-tag s-black">危高仓</span>
            <span v-if="positionHighSell" class="fm-tag s-black">高仓卖</span>
            <span v-if="ifBadLow()" class="fm-tag s-black">清2/3</span>
            <!--见顶并不需要幅度判断，虽然偶尔会有错误，但是大概率只要绿了或者红了就行-->
            <span v-if="ifHighDown()" class="fm-tag s-blue">见顶，开限仓，开季危</span>
            <span v-if="ifHighDown()" class="fm-tag s-blue">{{ifInNoSellStatus() ? '清1/3':'清2/3'}}</span>
            <span v-if="ifLowUp()" class="fm-tag s-blue">见顶，开限仓，开季危</span>
            <span v-if="ifLowUp()" class="fm-tag s-blue">{{ifInNoSellStatus() ? '清1/3':'清2/3'}}</span>
            <span v-if="QZMC" class="fm-tag s-blue">强卖1/3</span>
            <span v-if="oneDayHigh" class="fm-tag s-black">单日卖1/2</span>
            <span v-if="monthHighSell" class="fm-tag s-black">月火卖1/4,开季危</span>
            <span v-if="!monthHighSell && monthHighSellBig" class="fm-tag s-black">月火卖1/3,开季危</span>
            <span v-if="stockIndexPSF && averageQuarter < 0 && qDiffAvRateIndex < 0" class="fm-tag s-blue">解控</span>
            <span v-if="lostHighCut" class="fm-tag s-black">砍仓</span>
            <span v-if="lowPBuy" class="fm-tag s-red">强买</span>
            <span v-if="lowPNoSell" class="fm-tag s-red">留底仓</span>
            <span v-if="downLockSell" class="fm-tag s-black">下锁卖2/3</span>
            <!--执行部分-->
            <span
              v-if="ifQuarterHotCut()"
              class="fm-tag s-black"
            >清{{ifThreeUp ? '1/3': '1/6'}}</span>
            <span v-if="ifQuarterHotNow" class="fm-tag s-black">季</span>
            <!--想要卖出-->
            <span
              v-if="ifWantSellFixIndex"
              class="fm-tag s-black"
            >想卖定{{getFixSellRate()}}</span>
            <!--正常逻辑卖出-->
            <span
            v-if="ifFixIndex && ifSellFix()"
            class="fm-tag s-black"
          >卖定{{getFixSellRate()}}</span>
            <span
              v-if="ifFixIndex && monthHighSell"
              class="fm-tag s-black"
            >热卖定{{getFixSellRate()}}</span>
            <span v-if="ifJieTargetUpCloseLock" class="fm-tag s-black">目标1/3</span>
            <!--<span v-if="ifStopKeep()" class="fm-tag s-black">止盈</span>-->
            <!--年下z45是必跌的-->
            <span v-if="ifClearZ45Today" class="fm-tag s-black">清z45</span>
            <!--大牛市暂时注释-->
            <!--<span v-if="ifDoubleHot() && ifFourUp" class="fm-tag s-black">热减</span>-->
            <span v-if="ifUnderYear && ifDownTrend && (indexStage !== '定投' && indexStage !== '探底')" class="fm-tag black">禁买</span>
            <span v-if="indexDaXiaoStatusOld === '禁买' && (!ifUnderYear || !ifDownTrend)" class="fm-tag s-blue">解禁</span>
          </div>
          <span style="float: right" class="rate-t" :class="stockNumberClass(rate)">{{rate}}%</span>
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
              <span class="value red-text">{{$formatMoney(indexBuyNumber())}}</span>
            </span>
          <span class="item">
              <span class="label">原买：</span>
              <span class="value">{{$formatMoney(indexRawBuyNumber())}}</span>
            </span>
          <span class="item">
              <span class="label">标准仓：</span>
              <span class="value">{{$formatMoney(positionStandard)}}</span>
            </span>
          <span class="item">
              <span class="label">高仓线：</span>
              <span class="value">{{$formatMoney(positionHighLine)}}</span>
            </span>
          <span class="item">
              <span class="label">持仓盈亏：</span>
              <span class="value" :class="stockNumberClass(fundNowIncome)">{{fundNowIncome}}%</span>
            </span>
        </div>
      </div>
      <div class="tip-b" @click="tagdTShow"></div>
      <div v-if="dTShow" class="dt-b">
        <div>
          <div class="bb-t" :class="{active: stockIndexBSF === ''}" @click="setBSF('')">置空</div>
          <div class="bb-t" :class="{active: stockIndexBSF === '买'}" @click="setBSF('买')">买</div>
          <div class="bb-t" :class="{active: stockIndexBSF === '卖'}" @click="setBSF('卖')">卖</div>
        </div>
        <div>
          <div class="bb-t" :class="{active: stockIndexPSF === ''}" @click="setPSF('')">置空</div>
          <div class="bb-t" :class="{active: stockIndexPSF === '限仓'}" @click="setPSF('限仓')">限仓</div>
        </div>
      </div>
    </div>
  </mt-cell-swipe>
</template>

<script>
import storageUtil from '@/util/storageUtil.js'
import operatingTooltip from '@/util/operatingTooltip.js'
import stockAnalysisUtil from '@/util/stockAnalysisUtil.js'
import indexType from '@/common/indexType.js'
import setting from '@/setting.js'

const jigou = indexType.jigou
const laji = indexType.laji
const kuanji = indexType.kuanji

const sellFixList = setting.sellFixList
const badIndexList = setting.badIndexList

export default {
  name: 'OperatingInfoItem',
  data () {
    const stockIndexBSF = storageUtil.getData('stockIndexBSF', this.indexInfo.key) || ''
    const stockIndexPSF = storageUtil.getData('stockIndexPSF', this.indexInfo.key) || ''
    return {
      positionQYHigh: false,
      positionHighSell: false,
      dTShow: stockIndexBSF !== '' || stockIndexPSF !== '',
      stockIndexBSF: stockIndexBSF,
      stockIndexPSF: stockIndexPSF,
      lostHighCut: false,
      lowPBuy: false,
      lowPNoSell: false,
      downLockSell: false
    }
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
    kline: {
      type: Object,
      default: function () {
        return {}
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
        return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    },
    closeListLarge: {
      type: Array,
      default: function () {
        return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
    ifWantSellFixIndex () {
      return sellFixList.indexOf(this.indexInfo.key) !== -1
    },
    nowClose () {
      return storageUtil.getData('indexNowClose', this.indexInfo.key) || 0
    },
    targetUpClose () {
      return storageUtil.getData('stockIndexTargetUpClose', this.indexInfo.key) || 0
    },
    targetDownClose () {
      return storageUtil.getData('stockIndexTargetDownClose', this.indexInfo.key) || 0
    },
    yearClose () {
      return storageUtil.getData('yearAverageIndex', this.indexInfo.key) || 1
    },
    halfYearClose () {
      return storageUtil.getData('indexHalfYearClose', this.indexInfo.key) || 1
    },
    quarterClose () {
      return storageUtil.getData('indexQuarterClose', this.indexInfo.key) || 1
    },
    index30Close () {
      return storageUtil.getData('index30Close', this.indexInfo.key) || 1
    },
    index30Diff () {
      return storageUtil.getData('index30Diff', this.indexInfo.key) || 1
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
    // 阶段信息
    indexRecentStatus () {
      return storageUtil.getData('stockIndexRecentStatus', this.indexInfo.key) || '正常'
    },
    // 见底
    isInJiandi () {
      return this.indexRecentStatus === '见底' && this.averageQuarter < 0
    },
    isJieJiandi () {
      return this.indexRecentStatus === '见底' && this.averageQuarter >= 0
    },
    // 见底危险
    isInJiandiWei () {
      return this.indexRecentStatus === '见底' && (this.yearDiff < 0 || this.averageHalfYear < 0)
    },
    // 单日底
    isOneDeep () {
      return this.rate < -(5 * this.indexInfo.rate)
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
    // 指数上升下降
    mqDiffAv () {
      return storageUtil.getData('mqDiffAvIndex', this.indexInfo.key) || 0
    },
    qDiffAvRateIndex () {
      return storageUtil.getData('qDiffAvRateIndex', this.indexInfo.key) || 0
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
    // 卖出金额
    indexSellNumber () {
      // 仓位过低，就控制卖出
      let factor = 1
      // 上升
      if (this.qDiffAvRateIndex > 0.5) {
        if (!this.stockIndexPSF) {
          if (this.hasCount < (this.positionStandard * 0.34)) {
            factor = 0.66
          }
          if (this.hasCount < (this.positionStandard * 0.34 * 0.66)) {
            factor = 0.33
          }
        } else {
          if (this.hasCount < (this.positionStandard * 0.34 * 0.66)) {
            factor = 0.66
          }
          if (this.hasCount < (this.positionStandard * 0.34 * 0.34)) {
            factor = 0.33
          }
        }
      } else {
        // 下降
        // 不要以为跌的多了就不舍得卖，还有可能继续跌10个点
        if (!this.stockIndexPSF) {
          // 没控制
          if (this.hasCount > (this.positionStandard)) {
            factor = 1.33
          }
          if (this.hasCount > (this.positionStandard * 0.66)) {
            factor = 1
          }
        } else {
          // 叠加控制
          if (this.hasCount > (this.positionStandard * 0.66)) {
            factor = 1.33
          }
          if (this.hasCount > (this.positionStandard * 0.34)) {
            factor = 1
          }
        }
        if (this.ifInDafanNow()) {
          if (factor > 1) {
            factor = factor * (1 / 1.33)
          }
        }
      }
      return operatingTooltip.getIndexSellNumber(
        this.type,
        this.indexInfo,
        {
          buyFlagCount: this.buyCount,
          sellFlagCount: this.sellCount,
          noSellCount: this.noSellCount,
          isDownLine: this.qDiffAvRateIndex < 0
        },
        this.hasCount,
        factor
      )
    },
    ifFengNiu () {
      // 是不是全面疯牛
      const question10 = storageUtil.getData('stockMarketQuestion', 'question_10')
      return question10 === '是'
    },
    positionStandard () {
      return operatingTooltip.positionStandard(this.indexInfo)
    },
    positionHighLine () {
      let ps = this.positionStandard * 0.66
      if (this.stockIndexPSF) {
        ps = this.positionStandard * 0.34
      }
      return ps
    },
    positionHigh () {
      let ps = this.positionStandard * 0.66
      if (this.stockIndexPSF) {
        ps = this.positionStandard * 0.34
      }
      return this.hasCount > ps
    },
    CQXS () {
      return storageUtil.getData('upDownConfig', 'CQXS') || false
    },
    QZMC () {
      return storageUtil.getData('upDownConfig', 'QZMC') || false
    },
    // 单日涨幅很大
    oneDayHigh () {
      if (['baoxian', 'yinhang', 'youse', 'dichan', 'gangtie', 'meitan', 'jijian'].indexOf(this.indexInfo.key) !== -1) {
        return this.rate > 6
      }
      return false
    },
    otherMonthHighSell () {
      const m = {
        gangtie: 8,
        meitan: 10,
        baoxian: 10,
        shengwu: 13,
        yiliao: 13,
        dichan: 10,
        youse: 10,
        zhengquan: 10,
        chuanmei: 10,
        qiche: 10,
        huanbao: 10,
        jijian: 10,
        xinxi: 12,
        shipin: 10,
        yinhang: 5,
        jisuanji: 12
      }
      const r = m[this.indexInfo.key]
      if (r) {
        if (this.averageMonthIndex > r) {
          return true
        }
      }
      return false
    },
    // 月涨幅很大
    monthHighSell () {
      if (this.ifFengNiu) {
        return false
      }
      if (this.rate > 0) {
        if (this.otherMonthHighSell) {
          return true
        }
        return this.averageMonthIndex > 15
      }
      return false
    },
    monthHighSellBig () {
      if (this.ifFengNiu) {
        return false
      }
      if (this.rate > 0) {
        if (this.otherMonthHighSell) {
          return true
        }
        return this.averageMonthIndex > 16
      }
      return false
    },
    fundNowIncome () {
      return this.countDifferenceRate(this.hasCount, this.costCount)
    }
  },
  created () {
  },
  methods: {
    // 指数买入金额
    indexBuyNumber () {
      const money = operatingTooltip.getIndexBuyNumber(
        this.type,
        this.indexInfo,
        {
          buyFlagCount: this.buyCount,
          sellFlagCount: this.sellCount,
          netChangeRatio: this.rate,
          netChangeRatioList: this.netChangeRatioList,
          noSellCount: this.noSellCount,
          isBig: this.bigDi(),
          isDownLine: this.qDiffAvRateIndex < 0,
          isKong: (!!this.stockIndexPSF),
          isBadDown: this.isBadDown()
        },
        this.hasCount,
        true
      )
      // 限制买入不超过标准仓的0.33
      const max = this.positionStandard * 0.33
      if (money > max) {
        return max
      }
      return money
    },
    // 没有根据涨跌幅重设的买入金额
    indexRawBuyNumber () {
      const money = operatingTooltip.getIndexBuyNumber(
        this.type,
        this.indexInfo,
        {
          buyFlagCount: this.buyCount,
          sellFlagCount: this.sellCount,
          netChangeRatio: this.rate,
          netChangeRatioList: this.netChangeRatioList,
          noSellCount: this.noSellCount,
          isBig: this.bigDi(),
          isDownLine: this.qDiffAvRateIndex < 0,
          isKong: (!!this.stockIndexPSF),
          isBadDown: this.isBadDown()
        },
        this.hasCount
      )
      // 限制买入不超过标准仓的0.33
      const max = this.positionStandard * 0.33
      if (money > max) {
        return max
      }
      return money
    },
    toPath (path) {
      this.$router.push({
        path: path,
        query: {
          fsr: this.getFixSellRate()
        }
      })
    },
    tagdTShow () {
      this.dTShow = !this.dTShow
    },
    setBSF (value) {
      this.stockIndexBSF = value
      storageUtil.setData('stockIndexBSF', this.indexInfo.key, value)
    },
    setPSF (value) {
      this.stockIndexPSF = value
      storageUtil.setData('stockIndexPSF', this.indexInfo.key, value)
    },
    targetUpDiff () {
      if (this.nowClose && this.targetUpClose) {
        return this.countDifferenceRate(this.nowClose, this.targetUpClose)
      }
      return 0
    },
    targetDownDiff () {
      if (this.nowClose && this.targetDownClose) {
        return this.countDifferenceRate(this.nowClose, this.targetDownClose)
      }
      return 0
    },
    targetDownDone () {
      if (this.nowClose && this.targetDownClose) {
        return this.nowClose <= this.targetDownClose
      }
      return false
    },
    // 走坏了，季度线在年线下面
    isBadDown () {
      const qyChange30h = storageUtil.getData('noBuySellConfig', 'qyChange30h') || false
      if (qyChange30h) {
        const diff = this.countDifferenceRate(this.index30Close, this.halfYearClose)
        if (this.yearDiff > 0) {
          return diff < 0
        } else {
          return diff < 2
        }
      } else {
        const diff = this.countDifferenceRate(this.quarterClose, this.yearClose)
        if (this.yearDiff > 0) {
          return diff < 0
        } else {
          return diff < 2
        }
      }
    },
    // 解单日底
    isJieOneDeep () {
      const oneDeep = storageUtil.getData('stockIndexOneDeep', this.indexInfo.key) || '否'
      return oneDeep === '是' && (this.ifFourUp || this.ifInNoSellStatus())
    },
    isInOneDeep () {
      const oneDeep = storageUtil.getData('stockIndexOneDeep', this.indexInfo.key) || '否'
      return (this.isOneDeep || oneDeep === '是') && !this.isJieOneDeep()
    },
    getFixSellRate () {
      if (this.yearDiff >= 50) {
        // 0.3
        return '1/4'
      } else if (this.yearDiff >= 40) {
        // 0.5
        return '1/6'
      } else if (this.yearDiff >= 30) {
        // 0.67
        return '1/8'
      } else if (this.yearDiff >= 20) {
        return '1/10'
      }
      return '1/12'
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
      if (this.indexNoSellStatusOld === '锁转交' && (this.ifThreeDown || this.isToBeDafanToday())) {
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
    oldJieFanTan () {
      if (this.ifTwoUp) {
        // 两天涨了4个rate也要解反
        const info = stockAnalysisUtil.countUp(this.netChangeRatioListLarge, 2, 2)
        if (info.rate > (this.indexInfo.rate * 4)) {
          if (this.indexDaXiaoStatusOld === '大反' || this.indexDaXiaoStatusOld === '小反') {
            return true
          }
        }
      }
      if (this.indexDaXiaoStatusOld === '大反' || this.indexDaXiaoStatusOld === '小反') {
        const a = stockAnalysisUtil.countRule(this.netChangeRatioListLarge, [true, true, false, true, true])
        if (a.flag && a.rate > (4 * this.indexInfo.rate)) {
          return true
        }
        const aa = stockAnalysisUtil.countUp(this.netChangeRatioListLarge, 4, 3)
        if (this.netChangeRatioListLarge[0] > 0 && this.netChangeRatioListLarge[3] > 0) {
          if (aa.flag && aa.rate > (4 * this.indexInfo.rate)) {
            return true
          }
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
        if (
          (this.indexDaXiaoStatusOld === '大反' || this.indexDaXiaoStatusOld === '小反') &&
            this.ifThreeUp
        ) {
          return true
        }
        if (this.indexDaXiaoStatusOld === '小反' && this.ifTwoUp) {
          return true
        }
      }
    },
    // 是否解反弹
    ifJieFantanToday () {
      // 形式不好的时候
      if (this.indexDaXiaoStatusOld === '大反') {
        // 锁仓就解反
        if (this.ifInNoSellStatus()) {
          return true
        }
        // 情况坏就走老路线
        if (this.isBadDown()) {
          return this.oldJieFanTan()
        }
      }
      if (this.indexDaXiaoStatusOld === '小反') {
        if (this.ifInNoSellStatus()) {
          return true
        }
        return this.oldJieFanTan()
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
    // 中级底
    bigDi () {
      /**
         * 验证过没问题
         * 而且很有可能是一个中级别底部
         */
      if (this.rate < -(this.indexInfo.rate * 5)) {
        return true
      }
      // 两天5rate
      /**
         * 验证过没问题
         * 而且很有可能是一个中级别底部，甚至4个rate都还行
         */
      const twoDownInfo = stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 2, 2)
      if (twoDownInfo.rate < -(this.indexInfo.rate * 5)) {
        return true
      }
      /**
         * 验证过没问题
         * 而且很有可能是一个中级别底部，甚至4个rate都还行
         */
      const threeDownInfo = stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 3, 3)
      if (threeDownInfo.rate < -(this.indexInfo.rate * 5)) {
        return true
      }
      const a1 = stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 9, 8).flag
      const a12 = stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 8, 8).flag
      const a13 = stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 7, 7).flag
      const a14 = stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 6, 6).flag
      const a2 = stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 9, 7)
      const a3 = stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 8, 7)
      const a4 = stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 5, 5)
      const a5 = stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 4, 4)
      return a1 ||
          a12 ||
          a13 ||
          a14 ||
          (a2.flag && (a2.rate < -(5 * this.indexInfo.rate))) ||
          (a3.flag && (a3.rate < -(4 * this.indexInfo.rate))) ||
          (a4.flag && (a4.rate < -(4 * this.indexInfo.rate))) ||
          (a5.flag && (a5.rate < -(5 * this.indexInfo.rate)))
    },
    // 超级底
    tooBigDi () {
      const a1 = stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 9, 8).flag
      const a12 = stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 8, 8).flag
      const a13 = stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 7, 7).flag
      return a1 || a12 || a13
    },
    // 今天达成大反条件
    isToBeDafanToday () {
      // 一天5rate
      if (this.bigDi()) {
        return true
      }
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
      // 回测过可以等两涨，也可以在月上，基本没有在月线下的情况
      return (
        this.isInQuarterHotToday &&
          this.averageMonthIndex > 0 &&
          this.ifTwoUp > 0 &&
          !this.ifInNoSellStatus()
      )
    },
    ifSellFix () {
      return (this.ifQuarterHotCut() && this.ifQuarterHotNow) ||
          (this.isInQuarterHotToday && this.QHS()) ||
          this.YHS()
    },
    QHS () {
      if (!this.ifInNoSellStatus()) {
        if (this.ifThreeUp) {
          return true
        }
        if (this.ifTwoUp) {
          const info = stockAnalysisUtil.countUp(this.netChangeRatioListLarge, 2, 2)
          if (info.rate > (this.indexInfo.rate * 3)) {
            return true
          }
        }
      }
      return false
    },
    YHS () {
      if (!this.ifInNoSellStatus() &&
          this.yearDiff > this.indexInfo.cutDownLine &&
          this.averageQuarter >= 0
      ) {
        if (['yiliao', 'shengwu'].indexOf(this.indexInfo.key) === -1) {
          if (this.ifTwoUp) {
            return true
          }
          if (['chuangye', 'shiping', 'wubai', 'sanbai'].indexOf(this.indexInfo.key) === -1) {
            if (this.rate > this.indexInfo.rate) {
              return true
            }
          }
        }
      }
      return false
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
    ifBadLow () {
      if (this.isBadDown()) {
        if (this.ifTwoLowDown && this.averageMonthIndex > 0 && !this.ifInNoSellStatus()) {
          return true
        }
      }
      return false
    },
    // 大涨以后收跌
    ifHighDown () {
      if (Object.keys(this.kline).length) {
        const info = stockAnalysisUtil.hdown(this.kline, this.indexInfo.rate)
        if (info && this.averageMonthIndex > 0) {
          return true
        }
      }
      return this.ifHighDown2()
    },
    ifHighDown2 () {
      if (['wulin', 'yiqian', 'zhengquan', 'wubai', 'gangtie', 'sanbai'].indexOf(this.indexInfo.key) !== -1) {
        return false
      }
      if (Object.keys(this.kline).length) {
        const info = stockAnalysisUtil.hdown2(this.kline, this.indexInfo.rate)
        if (info && this.averageMonthIndex > 0) {
          return true
        }
      }
      return false
    },
    // 大跌后收涨
    ifLowUp () {
      if (Object.keys(this.kline).length) {
        if (this.ifInNoSellStatus() && this.averageQuarter > 8.5) {
          if (this.indexInfo.key === 'shengwu') {
            const info = stockAnalysisUtil.lowUp2(this.kline, this.indexInfo.rate)
            if (info) {
              return true
            }
          } else {
            const info = stockAnalysisUtil.lowUp(this.kline, this.indexInfo.rate)
            if (info) {
              return true
            }
          }
        }
      }
      return false
    },
    // 是否变盘
    ifBianpan () {
      if (this.ifInNoSellStatus()) {
        const info = stockAnalysisUtil.countUp(this.netChangeRatioListLarge, 3, 3)
        if (info.flag && info.rate < this.indexInfo.rate) {
          return true
        }
      }
      return false
    },
    isInBadDown () {
      if (this.isBadDown()) {
        if (
          // 不是定投
          !this.isInDingtouStatus() &&
          // 不是单日底
          !this.isInOneDeep()
        ) {
          return true
        }
      }
      return false
    },
    getItemClass (fbs) {
      const CHPS = storageUtil.getData('upDownConfig', 'CHPS') || false
      // 关闭高仓没买入
      const HPNS = storageUtil.getData('upDownConfig', 'HPNS') || false
      let positionQYHigh = false
      let positionHighSell = false
      let lostHighCut = false
      let downLockSell = false
      let lowPBuy = false
      let lowPNoSell = false
      if (!fbs) {
        this.setIndexCanFix()
      }
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
      const upMUB = storageUtil.getData('upDownConfig', 'upMUB') || false
      // --------技术性信号部分
      // 技术性买入
      if ((upMUB ? this.averageMonthIndex > 0 : !this.ifNoSellToCanNew()) && this.qDiffAvRateIndex > 0) {
        // 转交阶段，一般就直奔大反了
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
      }
      // 技术性卖出
      if (!this.ifInDafanNow()) {
        if (buySellList[0] === sellClass) {
          classList.push(sellClass)
          // if (this.isInBad()) {
          //   // 基本面恶化那就卖
          //   classList.push(sellClass)
          // } else {
          //   if (this.averageMonthIndex < 0) {
          //     // 在月线以下，就得卖，除了大反
          //     if (!this.ifInDafanNow()) {
          //       classList.push(sellClass)
          //     }
          //   } else {
          //     // 在月线以上，并且不是反弹那就卖出
          //     if (!this.ifInFantanOld()) {
          //       classList.push(sellClass)
          //     }
          //   }
          // }
        }
      }
      // ----------------------应该买的部分
      // 月线下面都会有大小反出现，所以其他买入就没什么必要
      // 或者已经成为了大反
      // TODO cs-完成，没啥问题
      // TODO 两天跌了三个rate提示买
      // 转交阶段，一般就直奔大反了
      if ((upMUB ? this.averageMonthIndex > 0 : !this.ifNoSellToCanNew()) && this.qDiffAvRateIndex > 0) {
        const twoDownInfo = stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 2, 2)
        if (twoDownInfo.rate < -(this.indexInfo.rate * 3)) {
          shouldClass = shouldBuyClass
        }
        const aInfo = stockAnalysisUtil.countDown(this.netChangeRatioListLarge, 4, 3)
        if (aInfo.rate < -(this.indexInfo.rate * 3)) {
          shouldClass = shouldBuyClass
        }
        const bInfo = stockAnalysisUtil.countRule(this.netChangeRatioListLarge, [false, true, false])
        if (bInfo.rate < -(this.indexInfo.rate * 3)) {
          shouldClass = shouldBuyClass
        }
      }
      // TODO cs-完
      // TODO 三跌
      if (this.ifThreeDown) {
        shouldClass = shouldBuyClass
      }
      // TODO cs-完
      // TODO 一天4rate，受季度热影响
      if (this.rate < -(this.indexInfo.rate * 4)) {
        shouldClass = shouldBuyClass
      }
      // TODO cs-完
      // TODO 今天是大反那就买入，受季度热影响
      if (this.isToBeDafanToday()) {
        shouldClass = shouldBuyClass
      }
      // ----------------------应该卖的部分
      // TODO 不用太担心信号少，因为从结果来看，定投会更优秀
      if (!this.ifInDafanNow()) {
        // 不处于大反才执行的卖出，不用担心，里面的条件会导致解反的
        if (this.ifTwoUp) {
          // 两天涨了4个rate也要解反
          const info = stockAnalysisUtil.countUp(this.netChangeRatioListLarge, 2, 2)
          if (info.rate > (this.indexInfo.rate * 4)) {
            shouldClass = shouldSellClass
          }
        }
        const a = stockAnalysisUtil.countRule(this.netChangeRatioListLarge, [true, true, false, true, true])
        if (a.flag && a.rate > (4 * this.indexInfo.rate)) {
          shouldClass = shouldSellClass
        }
        const aa = stockAnalysisUtil.countUp(this.netChangeRatioListLarge, 4, 3)
        if (this.netChangeRatioListLarge[0] > 0 && this.netChangeRatioListLarge[3] > 0) {
          if (aa.flag && aa.rate > (4 * this.indexInfo.rate)) {
            shouldClass = shouldSellClass
          }
        }
        const bb = stockAnalysisUtil.countRule(this.netChangeRatioListLarge, [true, false, true])
        if (bb.flag && bb.rate > (4 * this.indexInfo.rate)) {
          // 暂时不解反
          if (!this.ifInDafanNow()) {
            shouldClass = shouldSellClass
          }
        }
        // TODO cs-完成，还行吧
        // TODO 月线以下涨3天，并且幅度超过2个rate就发出卖出信号
        if (this.averageMonthIndex < 0 && this.ifThreeUp) {
          const info = stockAnalysisUtil.countUp(this.netChangeRatioListLarge, 3, 3)
          if (info.rate > (this.indexInfo.rate * 4)) {
            shouldClass = shouldSellClass
          }
        }
        // TODO cs-完成，没啥问题
        // TODO 涨4天了发出应该卖
        if (this.ifFourUp) {
          if (!this.ifInDafanNow()) {
            shouldClass = shouldSellClass
          }
        }
        // TODO 垃圾指数涨2天就卖
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
        // 高仓
        if (this.positionHigh) {
          // 高仓，不是大反不是锁仓，涨了就卖
          if (this.rate > 0) {
            if (!fbs && !CHPS) {
              positionHighSell = true
              shouldClass = shouldSellClass
            }
          }
          // 高仓不买了
          // if (!fbs && !HPNS) {
          //   if (shouldClass === shouldBuyClass) {
          //     shouldClass = ''
          //   }
          // }
        }
        // 大跌以后收涨给个卖出
        if (Object.keys(this.kline).length) {
          const infoo = stockAnalysisUtil.lowUp(this.kline, this.indexInfo.rate)
          if (infoo && this.averageMonthIndex > 0) {
            shouldClass = shouldSellClass
          }
        }
        if (this.CQXS) {
          if (this.rate > 0) {
            shouldClass = shouldSellClass
          }
        }
      }
      // 下跌趋势，高仓卖
      if (this.qDiffAvRateIndex < 0) {
        if (this.positionHigh) {
          // 高仓，不是大反不是锁仓，涨了就卖
          if (this.rate > 0) {
            if (!fbs && !CHPS) {
              positionHighSell = true
              shouldClass = shouldSellClass
            }
          }
          // 高仓不买了
          if (!fbs && !HPNS) {
            if (shouldClass === shouldBuyClass) {
              shouldClass = ''
            }
          }
        }
      }
      // TODO cs-完成，验证过
      // TODO 锁转交，月线是在上面的，涨两天卖
      if (this.ifNoSellToCanNew()) {
        // 月上不卖的控制
        const upMNS = storageUtil.getData('upDownConfig', 'upMNS') || false
        if (!upMNS) {
          // 锁转交不太可能还处于大反
          if (this.ifTwoUp) {
            shouldClass = shouldSellClass
          }
          if (this.rate > this.indexInfo.rate) {
            shouldClass = shouldSellClass
          }
        } else {
          if (this.ifThreeUp) {
            shouldClass = shouldSellClass
          }
        }
      }
      // 应该的类
      classList.push(shouldClass)
      // 在年下好像还行
      let classListF = this.copyList(classList)
      // TODO 季度线在年线下面没有买入
      if (this.isBadDown()) {
        if (
        // 不是定投
          !this.isInDingtouStatus() &&
            // 不是单日底
            !this.isInOneDeep() &&
            // 不是月上
            this.averageMonthIndex < 0
        ) {
          // 判断超大反，7,8,9这种
          if (!this.tooBigDi()) {
            classListF = this.removeBuy(classListF)
          }
          // 仓位不能太高
          if (this.hasCount > (this.positionStandard * 0.34)) {
            positionQYHigh = true
            // 如果仓位高了，涨了就卖
            // 没必要考虑大反什么的，因为是仓位太高了，才让卖出的
            if (this.rate > 0) {
              if (!fbs) {
                classListF.push(sellClass)
              }
            }
          }
        }
      }
      // TODO cs-完成，季度热以后的转交了卖出，没啥问题
      // TODO 季度线过热，然后转交，那就提示卖出
      // 不管有没有大反什么的，因为一定会跌倒季度线为负数
      const isNoQuarter = storageUtil.getData('noBuySellConfig', 'isNoQuarter') || false
      if (this.ifQuarterHotCut()) {
        if (!isNoQuarter) {
          classListF.push(sellClass)
        }
      }
      // TODO cs-手动类，不用验证
      // TODO 直接闷的涨2天再跑
      const isMeng = storageUtil.getData('noBuySellConfig', 'isMeng') || false
      if (isMeng) {
        // 直接闷的，抗住不卖以后，解反了该卖还是得卖
        if (!this.ifTwoUp) {
          classListF = this.removeSell(classListF)
        }
      }
      const downMBNB = storageUtil.getData('upDownConfig', 'downMBNB') || false
      if (downMBNB) {
        // 控制下降并且月下，没有买入，用来控制风险
        if (this.qDiffAvRateIndex < 0 && this.averageMonthIndex < 0) {
          // 不是单底
          if (!this.isInOneDeep()) {
            classListF = this.removeBuy(classListF)
          }
        }
      }
      // 开启限仓了，并且仓位超出限仓金额，月下就不买了
      if (this.stockIndexPSF) {
        if (this.averageMonthIndex < 0) {
          if (this.positionHigh) {
            // 不是单底
            // if (!this.isInOneDeep()) {
            //
            // }
            if (!fbs) {
              classListF = this.removeBuy(classListF)
            }
          }
        }
      }
      // -----锁仓之后就没有买入逻辑
      let ifNoSellF = false
      // TODO 锁仓的逻辑
      // 锁仓的指数太少也危险，很有可能是假的稳定
      const manyToLess = storageUtil.getData('noBuySellConfig', 'manyToLess') || false
      if (this.ifInNoSellStatus()) {
        // 因为信仰关系
        if (['shipin', 'baijiu'].indexOf(this.indexInfo.key) !== -1) {
          ifNoSellF = true
          // 锁仓了
          // 研究过了，季度线上和季度线下，没什么区别
          if (this.rate < 0) {
            if (this.CQXS || this.stockIndexPSF) {
              if (this.ifTwoDown) {
                classListF.push('should-buy')
                if (this.ifHasBuy(classListF)) {
                  classListF.push('only-up-buy')
                }
              }
            } else {
              classListF.push('should-buy')
              if (this.ifHasBuy(classListF)) {
                classListF.push('only-up-buy')
              }
            }
          }
          // 在趋势中，什么卖出信号都不用管
          if (!this.stockIndexPSF) {
            classListF = this.removeSell(classListF)
          } else {
            if (this.hasCount < this.positionHighLine) {
              if (!fbs) {
                classListF = this.removeSell(classListF)
              }
            }
          }
        } else {
          // 6个一下不考虑
          if (
            this.noSellCount > 12 ||
              (!manyToLess && this.noSellCount > 6)
          ) {
            ifNoSellF = true
            // 锁仓了
            // 研究过了，季度线上和季度线下，没什么区别
            if (this.rate < 0) {
              if (this.CQXS || this.stockIndexPSF) {
                if (this.ifTwoDown) {
                  classListF.push('should-buy')
                  if (this.ifHasBuy(classListF)) {
                    classListF.push('only-up-buy')
                  }
                }
              } else {
                classListF.push('should-buy')
                if (this.ifHasBuy(classListF)) {
                  classListF.push('only-up-buy')
                }
              }
            }
            // 在趋势中，什么卖出信号都不用管
            if (!this.stockIndexPSF) {
              classListF = this.removeSell(classListF)
            } else {
              if (this.hasCount < this.positionHighLine) {
                if (!fbs) {
                  classListF = this.removeSell(classListF)
                }
              }
            }
          } else {
            // 也买吧
            const upNoSell = storageUtil.getData('upDownConfig', 'upNoSell') || false
            if (upNoSell) {
              if (this.rate < 0) {
                classListF.push('should-buy')
                if (this.ifHasBuy(classListF)) {
                  classListF.push('only-up-buy')
                }
              }
            }
            // 不确定趋势，3涨以上还是卖出
            if (!this.ifThreeUp) {
              if (!this.stockIndexPSF) {
                classListF = this.removeSell(classListF)
              } else {
                if (this.hasCount < this.positionHighLine) {
                  if (!fbs) {
                    classListF = this.removeSell(classListF)
                  }
                }
              }
            }
          }
        }
        // 让我锁仓就卖出
        if (this.qDiffAvRateIndex < 0) {
          classListF = this.removeBuy(classListF)
          classListF.push('should-sell')
          downLockSell = true
        }
      }
      // 权重最大的-------------
      // TODO cs-手动类，不用验证
      // TODO 定投阶段没有卖出高亮
      if (this.isInDingtouStatus()) {
        classListF = this.removeSell(classListF)
      }
      // TODO cs-手动类，不用验证
      // TODO 没到目标位不卖
      if (this.ifTargetUpCloseLock) {
        classListF = this.removeSell(classListF)
      }
      // TODO cs-手动类，不用验证
      // TODO 如果见底了那就不卖
      if (
        !(this.isBadDown() &&
          // 不是定投
          !this.isInDingtouStatus() &&
          // 不是单日底
          !this.isInOneDeep()
        )
      ) {
        if (this.isInJiandi) {
          classListF = this.removeSell(classListF)
        }
      }
      // TODO cs-回测了表现还行，季度过热以后要解除了才能买
      // TODO 季线危险阶段，又是月下，没有买入信号，因为很可能是无止境得跌
      if (this.isInQuarterHotToday) {
        if (this.averageMonthIndex < 0) {
          classListF = this.removeBuy(classListF)
          // // 高仓的话还要卖出
          // if (this.positionHigh) {
          //   positionHighSell = true
          //   // 加入卖出
          //   classListF.push(sellClass)
          // }
        }
      }
      // TODO 处于z45不能买
      if (this.ifInZ45StatusNow) {
        classListF = this.removeBuy(classListF)
      }
      // TODO cs-完成，这里只是手动控制，还是应该靠建议仓位来限制买入，以防万一
      // TODO 是否基本面恶化，是的话只有月线在上才能买，不管什么大小反
      if (this.isInBad()) {
        classListF = this.removeBuy(classListF)
      }
      // TODO cs-完成
      // TODO 季度线以上，月线超过0就可以不杀跌
      // if (this.ifMonthUpOk(this.indexInfo.key)) {
      //   if (this.averageMonthIndex > 0) {
      //     // 小于0不卖出
      //     if (this.rate <= 0) {
      //       classListF = this.removeSell(classListF)
      //     }
      //   }
      // }
      // TODO 变盘清1/3
      if (this.ifBianpan()) {
        // 没有任何买入
        classListF = this.removeBuy(classListF)
        // 加入卖出
        classListF.push(sellClass)
      }
      // TODO 本来大涨，结果下跌，一般是见顶了，是在锁仓策略定投策略之上的
      if (this.ifHighDown()) {
        // 没有任何买入
        classListF = this.removeBuy(classListF)
        // 加入卖出
        classListF.push(sellClass)
      }
      // TODO 大跌以后收红
      if (this.ifLowUp()) {
        // 没有任何买入
        classListF = this.removeBuy(classListF)
        // 加入卖出
        classListF.push(sellClass)
      }
      // TODO 空头蓄能
      if (this.ifBadLow()) {
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
      // TODO 到达止损线
      if (this.targetDownDone()) {
        // 没有任何买入
        classListF = this.removeBuy(classListF)
        // 加入卖出
        classListF.push(sellClass)
      }
      // TODO 砍仓线
      if (this.stockIndexPSF && this.qDiffAvRateIndex < 0) {
        if (this.positionHigh) {
          if (this.fundNowIncome < -3) {
            const PQS = storageUtil.getData('upDownConfig', 'PQS') || false
            if (PQS) {
              if (!fbs) {
                lostHighCut = true
                // 没有任何买入
                classListF = this.removeBuy(classListF)
                // 加入卖出
                classListF.push(sellClass)
              }
            }
          }
        }
      }
      // 强买逻辑
      if (this.qDiffAvRateIndex > 0.5 && !this.stockIndexPSF && this.ifInNoSellStatus()) {
        if (this.hasCount < (this.positionStandard * 0.34 * 0.66)) {
          const PQB = storageUtil.getData('upDownConfig', 'PQB') || false
          if (PQB && badIndexList.indexOf(this.indexInfo.key) === -1) {
            if (!fbs) {
              classListF = this.removeSell(classListF)
              classListF.push(buyClass)
              lowPBuy = true
            }
          }
        }
      }
      // 留底仓逻辑
      if (this.qDiffAvRateIndex > 0.5 && !this.stockIndexPSF && this.averageMonthIndex > 0) {
        if (this.hasCount < (this.positionStandard * 0.34)) {
          const PLNS = storageUtil.getData('upDownConfig', 'PLNS') || false
          // 不处于坏情况
          // if (PLNS && !this.isInBadDown()) {
          if (PLNS) {
            if (!fbs) {
              classListF = this.removeSell(classListF)
              lowPNoSell = true
            }
          }
        }
      }
      let hSell = false
      if (this.oneDayHigh) {
        // 没有任何买入
        classListF = this.removeBuy(classListF)
        // 加入卖出
        classListF.push(sellClass)
        hSell = true
      }
      if (this.monthHighSell) {
        // 没有任何买入
        classListF = this.removeBuy(classListF)
        // 加入卖出
        classListF.push(sellClass)
        hSell = true
      }
      if (hSell) {
        this.$store.commit('updateIndexHighSellMap', {
          key: this.indexInfo.key,
          value: true
        })
      }
      // TODO 全面大疯牛市，只有锁仓买
      if (this.ifFengNiu) {
        if (this.index30Diff < 0) {
          if (!this.ifInNoSellStatus()) {
            classListF = this.removeBuy(classListF)
            // 加入卖出
            classListF.push(sellClass)
          }
        } else {
          // 是否开启30日线以上不卖出
          const f30UpNS = storageUtil.getData('upDownConfig', 'f30UpNS') || false
          if (f30UpNS) {
            classListF = this.removeSell(classListF)
          }
        }
      }
      // ----最大最大权限--控制
      const CPQXB = storageUtil.getData('upDownConfig', 'CPQXB') || false
      const noBuy = storageUtil.getData('noBuySellConfig', 'noBuy') || false
      const noSell = storageUtil.getData('noBuySellConfig', 'noSell') || false
      // 减仓位取向
      if (CPQXB) {
        if (this.ifFourUp) {
          classListF = this.removeBuy(classListF)
          classListF.push('sell')
        }
      }
      if (noBuy) {
        classListF = this.removeBuy(classListF)
      }
      if (noSell) {
        classListF = this.removeSell(classListF)
      }
      if (this.stockIndexBSF === '买') {
        classListF = this.removeSell(classListF)
        classListF.push('buy')
      }
      if (this.stockIndexBSF === '卖') {
        classListF = this.removeBuy(classListF)
        classListF.push('sell')
      }
      // 强制卖出
      if (this.QZMC) {
        if (this.rate > 0) {
          classListF = this.removeBuy(classListF)
          classListF.push('sell')
        }
      }
      // 发送到服务端
      if (fbs) {
        this.sendFlagToServer(classListF)
      }
      // ---------关于个人的限制
      // 锁仓的没有卖出高亮
      if (this.lock) {
        if (!this.ifFixIndex) {
          classListF = this.removeSell(classListF)
        }
        // classListF = this.removeSell(classListF)
      }
      // 设置信息
      if (!fbs) {
        this.positionHighSell = positionHighSell
        this.positionQYHigh = positionQYHigh
        this.lostHighCut = lostHighCut
        this.downLockSell = downLockSell
        this.lowPBuy = lowPBuy
        this.lowPNoSell = lowPNoSell
        this.setInfo(classListF)
      }
      return classListF
    },
    setInfo (classListF) {
      // if (this.indexInfo.key === 'wulin') {
      //   console.log(this.ifInDafanNow())
      //   console.log(this.ifInXiaofanNow())
      //   console.log((!this.ifInDafanNow() && this.ifInXiaofanNow()))
      // }
      storageUtil.setData(
        'stockIndexDafan',
        this.indexInfo.key,
        this.ifInDafanNow()
      )
      storageUtil.setData(
        'stockIndexXiaofan',
        this.indexInfo.key,
        (!this.ifInDafanNow() && this.ifInXiaofanNow())
      )
      if (this.ifHasSell(classListF)) {
        this.$store.commit('updateIndexBondSellMap', {
          key: this.indexInfo.key,
          value: this.indexSellNumber
        })
      } else {
        this.$store.commit('updateIndexBondSellMap', {
          key: this.indexInfo.key,
          value: 0
        })
      }
      if (this.ifHasBuy(classListF)) {
        this.$store.commit('updateIndexBondBuyMap', {
          key: this.indexInfo.key,
          value: this.indexBuyNumber()
        })
      } else {
        this.$store.commit('updateIndexBondBuyMap', {
          key: this.indexInfo.key,
          value: 0
        })
      }
      if (this.ifKuanji || ['baijiu', 'shengwu', 'dianzi'].indexOf(this.indexInfo.key) !== -1) {
        if (this.ifSellFix() || this.monthHighSell) {
          this.$store.commit('updateFixSellMap', {
            key: this.indexInfo.key,
            value: this.getFixSellRate()
          })
        } else {
          const CPQXB = storageUtil.getData('upDownConfig', 'CPQXB') || false
          // 减仓位取向
          if (CPQXB) {
            if (this.ifFourUp) {
              this.$store.commit('updateFixSellMap', {
                key: this.indexInfo.key,
                value: this.getFixSellRate()
              })
            }
          }
        }
      }
    },
    sendFlagToServer (classListF) {
      // 发送信号
      let flag = ''
      if (this.ifHasBuy(classListF)) {
        flag = '加仓'
      }
      if (this.ifHasSell(classListF)) {
        flag = '减仓'
      }
      if (this.type === '熊') {
        this.$store.commit('updateBondSignalMap', {
          key: this.indexInfo.key,
          stockIndexPSF: this.stockIndexPSF,
          rate: this.rate,
          flag,
          qdiff: this.qDiffAvRateIndex
        })
      }
    },
    otherClass () {
      let c = []
      if (this.ifFixIndex && this.monthHighSell) {
        c.push('sell-fix')
      }
      if (this.ifFixIndex && this.ifSellFix()) {
        c.push('sell-fix')
      }
      return c
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tag-w {
    display: inline-block;
    width: 500px;
  }
  .index-name, .rate-t {
    vertical-align: top;
  }
  .tip-b {
    position: absolute;
    width: 100px;
    height: 100%;
    right: 0;
    top: 0;
    background-color: rgba(255, 255, 255, 0.3);
    z-index: 100;
  }
  .dt-b {
    padding: 20px;
    width: 100%;
  }
  .bb-t {
    display: inline-block;
    width: 32%;
    text-align: center;
    background-color: #eee;
    line-height: 60px;
    &.active{
      background-color: #bbb;
    }
  }
</style>
