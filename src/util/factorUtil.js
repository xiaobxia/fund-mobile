import storageUtil from '@/util/storageUtil.js'
import dateUtil from './dateUtil'
import moment from 'moment'
import indexType from '@/common/indexType.js'

const jigou = indexType.jigou
const highRate = indexType.highRate
const laji = indexType.laji
const kuanji = indexType.kuanji

// 11月到12月机构结算
function getJiesuan () {
  const d = dateUtil.getDate()
  const day = d.getDate()
  const month = d.getMonth() + 1
  if (month === 11) {
    // 1到-1
    return (1 - (2 * day / 31))
  }
  if (month === 12) {
    // -1到1
    return (-1 + (1 * day / 31))
  }
  return 1
}

export default {
  // 买卖信号因子
  buySellFactor: function (buyFlagCount, sellFlagCount, indexNumber, buySell) {
    let buySellFactor = 1
    if (buySell === 'buy') {
      buySellFactor = 0.34 * ((buyFlagCount - sellFlagCount) / indexNumber)
    } else {
      buySellFactor = 0.34 * ((sellFlagCount - buyFlagCount) / indexNumber)
    }
    return 1 + buySellFactor
  },
  noSellCountFactor: function (noSellCount, indexNumber, buySell) {
    let noSellCountFactor = 0.34 * (noSellCount / indexNumber) + 1
    if (buySell === 'buy') {
      return noSellCountFactor
    } else {
      return 1 / noSellCountFactor
    }
  },
  // 年线数量因子
  indexYearCountFactor: function (buySell) {
    const indexYear = storageUtil.getData('yearAverageIndexDiff')
    let all = 0
    let has = 0
    for (let key in indexYear) {
      all++
      if (indexYear[key] > 0) {
        has++
      }
    }
    if (all > 0) {
      let factor = 0.66 + ((has / all) * 0.34)
      if (buySell === 'buy') {
        return factor
      } else {
        return 1 / factor
      }
    } else {
      return 1
    }
  },
  // 年线数量因子
  indexHalfYearCountFactor: function (buySell) {
    const indexHalfYear = storageUtil.getData('averageHalfYearIndex')
    let all = 0
    let has = 0
    for (let key in indexHalfYear) {
      all++
      if (indexHalfYear[key] > 0) {
        has++
      }
    }
    if (all > 0) {
      let factor = 0.66 + ((has / all) * 0.34)
      if (buySell === 'buy') {
        return factor
      } else {
        return 1 / factor
      }
    } else {
      return 1
    }
  },
  // 市场情况因子
  stockMarketQuestionFactor: function (buySell) {
    let factor = 1
    // 市场阶段
    const question1 = storageUtil.getData('stockMarketQuestion', 'question_1')
    let question1Factor = 1
    if (question1 === '筑底') {
      question1Factor = 1.1
    }
    if (question1 === '筑顶') {
      question1Factor = 0.9
    }
    if (question1 === '筑顶后大跌') {
      question1Factor = 0.5
    }
    factor = factor * question1Factor
    // 是否需要护盘
    const question2 = storageUtil.getData('stockMarketQuestion', 'question_2')
    let question2Factor = 1
    if (question2 === '是') {
      question2Factor = 1.1
    }
    factor = factor * question2Factor
    // 市场强弱
    const question3 = storageUtil.getData('stockMarketQuestion', 'question_3')
    let question3Factor = 1
    if (question3 === '强') {
      question3Factor = 1.2
    }
    if (question3 === '略强') {
      question3Factor = 1.1
    }
    if (question3 === '略弱') {
      question3Factor = 0.9
    }
    if (question3 === '弱') {
      question3Factor = 0.8
    }
    factor = factor * question3Factor
    // 是否悲观
    const question7 = storageUtil.getData('stockMarketQuestion', 'question_7')
    let question7Factor = 1
    if (question7 === '乐观') {
      question7Factor = 1.1
    }
    if (question7 === '悲观') {
      question7Factor = 0.9
    }
    factor = factor * question7Factor
    // 是否吃力
    const question8 = storageUtil.getData('stockMarketQuestion', 'question_8')
    let question8Factor = 1
    if (question8 === '不吃力') {
      question8Factor = 1.1
    }
    if (question8 === '吃力') {
      question8Factor = 0.9
    }
    factor = factor * question8Factor
    if (buySell === 'buy') {
      return factor
    } else {
      return 1 / factor
    }
  },
  // 仓位因子
  positionFactor: function (buySell, small) {
    let factor = 1
    // 仓位修正
    // 配置
    const position = storageUtil.getData('userAccountInfo', 'positionConfig') || 100
    // 现在
    const nowPosition = storageUtil.getData('appConfig', 'nowPosition') || 100
    let positionFactor = 1
    // 配置-现在
    if (buySell === 'buy') {
      positionFactor = ((position - nowPosition) / 100) + 1
    } else {
      positionFactor = ((nowPosition - position) / 100) + 1
    }
    if (positionFactor < 0) {
      positionFactor = 0
    }
    // 仓位偏差理论上不能很大
    if (small === true) {
      if (positionFactor < 0.7) {
        positionFactor = 0.7
      }
      if (positionFactor > 1.3) {
        positionFactor = 1.3
      }
    }
    return factor * positionFactor
  },
  // 资产择时因子
  assetMarketTimeFactor: function (buySell) {
    const d = dateUtil.getDate()
    const year = d.getFullYear()
    const day = d.getDate()
    const month = d.getMonth()
    let factor = 1
    // 按月分配
    const monthFactorList = [
    // 1月，2月，是反弹的窗口期间
      1.1,
      1.2,
      1,
      1,
      // 5月，6月，年中资金面紧张
      0.9,
      0.8,
      1,
      1.1,
      0.9,
      // 10月也就头几天会好一点，调仓带来的影响还是多
      0.9,
      // 11月，12月，年底资金面紧张，机构结账
      0.8,
      0.8
    ]
    factor = factor * monthFactorList[month]
    // --季度末资金面紧张，不包括国庆前和元旦前
    if (moment().isAfter(`${year}-03-16`) && moment().isBefore(`${year}-03-30`)) {
      factor = factor * 0.9
    }
    if (moment().isAfter(`${year}-06-16`) && moment().isBefore(`${year}-06-30`)) {
      factor = factor * 0.9
    }
    if (moment().isAfter(`${year}-09-16`) && moment().isBefore(`${year}-09-25`)) {
      factor = factor * 0.9
    }
    if (moment().isAfter(`${year}-12-16`) && moment().isBefore(`${year}-12-25`)) {
      factor = factor * 0.9
    }
    // --机构结账月
    if (moment().isAfter(`${year}-11-16`) && moment().isBefore(`${year}-11-30`)) {
      factor = factor * 0.9
    }
    // 国庆前几天和后几天有3%的涨幅可以弄
    if (moment().isAfter(`${year}-09-25`) && moment().isBefore(`${year}-10-01`)) {
      factor = factor * 1.15
    }
    // 元旦前几天和后几天有3%的涨幅可以弄
    if (moment().isAfter(`${year}-12-25`) && moment().isBefore(`${year}-12-31`)) {
      factor = factor * 1.15
    }
    if (buySell === 'buy') {
      return factor
    } else {
      return 1 / factor
    }
  },
  // 机构对指数的影响
  getIndexJigouFactor: function (key, buySell) {
    if (jigou.indexOf(key) !== -1) {
      if (buySell === 'buy') {
        return 1 + (0.1 * getJiesuan())
      } else {
        return 1 - (0.1 * getJiesuan())
      }
    }
    return 1
  },
  // 高费率对指数的影响
  getIndexHighRateFactor: function (key, buySell) {
    if (highRate.indexOf(key) !== -1) {
      if (buySell === 'buy') {
      // 买
        return 0.8
      } else {
      // 卖
        return 1.2
      }
    }
    return 1
  },
  // 垃圾指数的影响
  getIndexLajiFactor: function (key, buySell) {
    if (laji.indexOf(key) !== -1) {
      if (buySell === 'buy') {
      // 买
        return 0.8
      } else {
      // 卖
        return 1.2
      }
    }
    return 1
  },
  // 指数涨跌幅度对买入金额的影响
  getIndexNetChangeRatioRateFactor: function (averageRate, rate, buySell) {
    let rateAbs = Math.abs(rate)
    // 暂时只对买入有影响
    if (buySell === 'buy') {
    // 买
      if (rate <= 0) {
        if (rateAbs < (1.5 * averageRate)) {
          return 0.1 + (rateAbs * 0.9 / (1.5 * averageRate))
        } else if (rateAbs > (3 * averageRate)) {
          return 1
        } else {
          return 1 + ((rateAbs - (1.5 * averageRate)) * 0.5 / (1.5 * averageRate))
        }
      } else {
        return 1
      }
    } else {
    // 卖
      return 1
    }
  },
  // 指数择时因子
  getIndexMarketTimeFactor: function (key, buySell) {
    const d = dateUtil.getDate()
    const month = d.getMonth() + 1
    const day = d.getDate()
    let factor = 1
    // 流感高发季
    if (month >= 1 && month <= 3) {
      if (key === 'shengwu') {
        factor = factor * 1.2
      }
    }
    // 4月炒周期
    if (month === 4 || (month === 3 && day > 26)) {
      if (['meitan', 'gangtie', 'youse'].indexOf(key) !== -1) {
        factor = factor * 1.2
      }
    }
    // 5月6月有色表现还行
    if (month === 5 || month === 6) {
      if (['youse'].indexOf(key) !== -1) {
        factor = factor * 1.2
      }
    }
    // 10月炒小票
    if (month === 9 && day > 26) {
      if (['chuangye', 'chuanmei', 'dianzi', 'jisuanji', 'xinxi'].indexOf(key) !== -1) {
        factor = factor * 1.2
      }
    }
    // 年底炒传媒
    if (month === 12 && day > 26) {
      if (key === 'chuanmei') {
        factor = factor * 1.2
      }
    }
    if (buySell === 'buy') {
      return factor
    } else {
      return 1 / factor
    }
  },
  // 指数平均因子
  getIndexAverageFactor: function (indexKey, buySell) {
    let indexAverage = storageUtil.getData('averageIndex', indexKey) || 0
    let factor = 1
    if (indexAverage > 0) {
    // 越靠近1越大
      factor = 1.2 - (0.2 * Math.abs(1 - indexAverage))
    }
    if (indexAverage < 0) {
    // 越靠近-1越小
      factor = 0.8 + (0.2 * Math.abs(1 + indexAverage))
    }
    if (buySell === 'buy') {
      return factor
    } else {
      return 1 / factor
    }
  },
  // 指数月线平均因子
  getIndexAverageMonthFactor: function (indexKey, reduceLine, buySell) {
    let indexAverage = storageUtil.getData('averageMonth', indexKey) || 0
    let factor = 1
    // 月线过热的话得要减少买入
    if (indexAverage > 0) {
      factor = 1 - (0.5 * (indexAverage / (reduceLine * 2)))
    }
    if (factor < 0.5) {
      factor = 0.5
    }
    if (buySell === 'buy') {
      return factor
    } else {
      return 1 / factor
    }
  },
  // 废弃
  // 指数半年线因子
  getAverageHalfYearFactor: function (indexKey, buySell) {
    return 1
    // let indexAverage = storageUtil.getData('averageHalfYearIndex', indexKey) || 0
    // let factor = 1
    // if (indexAverage < 0 && indexAverage >= -10) {
    // // 越靠近-10越小
    //   factor = 1 + (0.5 * (indexAverage / 10))
    // }
    // if (indexAverage < -10 && indexAverage >= -20) {
    //   factor = 1 - (0.5 * ((indexAverage + 20) / 10))
    // }
    // if (buySell === 'buy') {
    //   return factor
    // } else {
    //   return 1 / factor
    // }
  },
  // 多跌因子
  getIndexManyDownFactor: function (averageRate, netChangeRatioList, buySell) {
    let factor = 1
    if (
      netChangeRatioList[0] < 0 &&
    netChangeRatioList[1] < 0 &&
    netChangeRatioList[2] < 0 &&
    netChangeRatioList[3] < 0 &&
    netChangeRatioList[4] < 0
    ) {
      const rate = netChangeRatioList[0] + netChangeRatioList[1] + netChangeRatioList[2] + netChangeRatioList[3] + netChangeRatioList[4]
      return 1 + (Math.abs(rate) / (6 * averageRate))
    }
    if (
      netChangeRatioList[0] < 0 &&
    netChangeRatioList[1] < 0 &&
    netChangeRatioList[2] < 0 &&
    netChangeRatioList[3] < 0
    ) {
      const rate = netChangeRatioList[0] + netChangeRatioList[1] + netChangeRatioList[2] + netChangeRatioList[3]
      return 1 + ((Math.abs(rate) / (5 * averageRate)) * 0.75)
    }
    if (
      netChangeRatioList[0] < 0 &&
    netChangeRatioList[1] < 0 &&
    netChangeRatioList[2] < 0
    ) {
      const rate = netChangeRatioList[0] + netChangeRatioList[1] + netChangeRatioList[2]
      return 1 + ((Math.abs(rate) / (4 * averageRate)) * 0.5)
    }
    return factor
  },
  // 月收益跟随因子
  getIndexMonthDiffFactor: function (indexKey, buySell) {
    const indexDiff = storageUtil.getData('monthIndexDiff', indexKey) || 0
    let factor = 1 + (indexDiff / 20)
    if (buySell === 'buy') {
      return factor
    } else {
      return 1 / factor
    }
  },
  // 年收益跟随因子
  getIndexYearDiffFactor: function (indexKey, buySell) {
    const indexDiff = storageUtil.getData('yearIndexDiff', indexKey) || 0
    let factor = 1 + ((indexDiff * getJiesuan()) / 100)
    if (buySell === 'buy') {
      return factor
    } else {
      return 1 / factor
    }
  },
  getDaVFactor: function (indexKey, buySell) {
    let factor = 1
    // const d = dateUtil.getDate()
    // const day = d.getDate()
    // const month = d.getMonth() + 1
    // if (month >= 5) {
    //   // 今年估计有结构牛
    //   factor = 1
    // }
    if (buySell === 'buy') {
      return factor
    } else {
      return 1 / factor
    }
  }
}
