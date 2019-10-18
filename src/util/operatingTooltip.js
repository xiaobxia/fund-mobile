import storageUtil from '@/util/storageUtil.js'
import numberUtil from './numberUtil'
import moment from 'moment'

const jigou = [
  'shengwu',
  'yiliao',
  'baijiu',
  'yiyao',
  'xiaofei'
]

const highRate = [
  'chuanmei',
  'youse',
  'dichan',
  'gangtie',
  'meitan',
  'baoxian'
]

const laji = [
  'gangtie',
  'huanbao',
  'meitan',
  'jijian',
  'qiche',
  'youse'
]

// 机构对指数的影响
function getIndexJigouFactor (key, buySell) {
  if (jigou.indexOf(key) !== -1) {
    if (buySell === 'buy') {
      return 1
    } else {
      return 0.75
    }
  }
  return 1
}

function getIndexHighRateFactor (key, buySell) {
  if (highRate.indexOf(key) !== -1) {
    if (buySell === 'buy') {
      // 买
      return 0.8
    } else {
      // 卖
      return 1
    }
  }
  return 1
}

function getIndexLajiFactor (key, buySell) {
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
}

// 指数涨跌幅度对买入金额的影响
function getIndexNetChangeRatioRateFactor (averageRate, rate, buySell) {
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
}

// 指数数量
const indexNumber = 24

// 获取当天账户资产
function getUserAsset () {
  const userFundAccountInfo = storageUtil.getUserFundAccountInfo()
  return userFundAccountInfo.today_asset
}

function assetMarketStateFactor () {
  // 市场强弱情况
  const question1 = storageUtil.getMarketStatus('question_1')
  // 消息面情况
  const question2 = storageUtil.getMarketStatus('question_2')
  // 是否要护盘
  const question3 = storageUtil.getMarketStatus('question_3')
  // 明天是否是特殊的时间点
  const question4 = storageUtil.getMarketStatus('question_4')
  // 是否有上涨的意愿
  const question5 = storageUtil.getMarketStatus('question_5')
  // 是否悲观
  const question6 = storageUtil.getMarketStatus('question_6')
  let factor = 1
  let question1Factor = 1
  if (question1 === '强') {
    question1Factor = 1.1
  }
  if (question1 === '略强') {
    question1Factor = 1.05
  }
  if (question1 === '略弱') {
    question1Factor = 0.95
  }
  if (question1 === '弱') {
    question1Factor = 0.9
  }
  factor = factor * question1Factor

  let question2Factor = 1
  if (question2 === '利好') {
    question2Factor = 1.1
  }
  if (question2 === '利空') {
    question2Factor = 0.9
  }
  factor = factor * question2Factor

  let question3Factor = 1
  if (question3 === '是') {
    question3Factor = 1.1
  }
  factor = factor * question3Factor

  let question4Factor = 1
  if (question4 === '是') {
    question4Factor = 1.1
  }
  factor = factor * question4Factor

  let question6Factor = 1
  if (question6 === '乐观') {
    question6Factor = 1.1
  }
  if (question6 === '悲观') {
    question6Factor = 0.9
  }
  factor = factor * question6Factor
  return factor
}

// 资产择时因子
function assetMarketTimeFactor () {
  const d = new Date()
  const year = d.getFullYear()
  const day = d.getDate()
  const month = d.getMonth()
  let factor = 1
  // 按月分配
  const monthFactorList = [1.1, 1.2, 1, 1, 0.9, 0.8, 1, 1.1, 1, 1.1, 0.9, 0.8]
  factor = factor * monthFactorList[month]
  // 季度末资金面紧张
  if (moment().isAfter(`${year}-03-16`) && moment().isBefore(`${year}-03-30`)) {
    factor = factor * 0.9
  }
  if (moment().isAfter(`${year}-06-16`) && moment().isBefore(`${year}-06-30`)) {
    factor = factor * 0.9
  }
  if (moment().isAfter(`${year}-09-16`) && moment().isBefore(`${year}-09-30`)) {
    factor = factor * 0.9
  }
  if (moment().isAfter(`${year}-12-16`) && moment().isBefore(`${year}-12-30`)) {
    factor = factor * 0.9
  }
  // 每个月的22日以后都是要谨慎的
  const quarterList = [3, 6, 9, 12]
  // 不能和季末叠加
  if (quarterList.indexOf(month + 1) === -1) {
    if (day >= 22 && day < 30) {
      factor = factor * 0.9
    }
  }
  return factor
}

// 操作的标准
function operateStandard () {
  const asset = getUserAsset()
  // 波段仓理论上占30%
  return asset * 0.7 / (indexNumber * 5)
}

// 指数择时因子
function getIndexMarketTimeFactor (key) {
  const d = new Date()
  const month = d.getMonth() + 1
  const day = d.getDate()
  let factor = 1
  // 4月炒周期
  if (month === 4 || (month === 3 && day > 26)) {
    if (['meitan', 'gangtie', 'youse'].indexOf(key) !== -1) {
      factor = factor * 1.1
    }
  }
  // 10月炒小票
  if (month === 9 && day > 26) {
    if (['chuangye', 'chuanmei', 'dianzi', 'jisuanji', 'xinxi'].indexOf(key) !== -1) {
      factor = factor * 1.1
    }
  }
  return factor
}

// 基于市场的购买基准
function getBuyBase (type, marketInfo) {
  const userFundAccountInfo = storageUtil.getUserFundAccountInfo()
  let finalFactor = type === '熊' ? 1 : 0.8
  // 买卖信号因子
  let buySellFactor = 0.34 * ((marketInfo.buyFlagCount - marketInfo.sellFlagCount) / indexNumber)
  finalFactor = finalFactor * (1 + buySellFactor)
  // 市场状况
  let marketStateFactor = assetMarketStateFactor()
  finalFactor = finalFactor * marketStateFactor
  // 市场择时
  let marketTimeFactor = assetMarketTimeFactor()
  finalFactor = finalFactor * marketTimeFactor
  // 仓位修正
  const position = userFundAccountInfo.position_config || 100
  const nowPosition = storageUtil.getAppConfig('nowPosition') || 100
  let positionFactor = ((position - nowPosition) / 100) + 1
  finalFactor = finalFactor * positionFactor
  // 结果
  return finalFactor * operateStandard()
}

// 基于市场的卖出基准
function getSellBase (type, marketInfo) {
  const userFundAccountInfo = storageUtil.getUserFundAccountInfo()
  let finalFactor = type === '熊' ? 1 : 0.8
  // 买卖信号因子
  let buySellFactor = 0.34 * ((marketInfo.sellFlagCount - marketInfo.buyFlagCount) / indexNumber)
  finalFactor = finalFactor * (1 + buySellFactor)
  // 市场状况
  let marketStateFactor = assetMarketStateFactor()
  finalFactor = finalFactor * (2 - marketStateFactor)
  // 市场择时
  let marketTimeFactor = assetMarketTimeFactor()
  finalFactor = finalFactor * (2 - marketTimeFactor)
  // 仓位修正
  const position = userFundAccountInfo.position_config || 100
  const nowPosition = storageUtil.getAppConfig('nowPosition') || 100
  let positionFactor = ((nowPosition - position) / 100) + 1
  finalFactor = finalFactor * positionFactor
  // 结果
  // 卖的标准大一点
  return finalFactor * operateStandard() * 3 / 2
}

// 指数态度因子
function getIndexPositionFactor (indexKey) {
  let indexPosition = storageUtil.getIndexPosition(indexKey) || 100
  return indexPosition / 100
}

// 指数平均因子
function getIndexAverageFactor (indexKey) {
  let indexAverage = storageUtil.getAverage(indexKey) || 0
  let factor = 1
  if (indexAverage > 0) {
    // 越靠近1越大
    factor = 1.2 - (0.2 * Math.abs(1 - indexAverage))
  }
  if (indexAverage < 0) {
    // 越靠近-1越小
    factor = 0.8 + (0.2 * Math.abs(1 + indexAverage))
  }
  return factor
}

// 月收益跟随因子
function getIndexMonthDiffFactor (indexKey) {
  const indexDiff = storageUtil.getIndexDiff(indexKey) || 0
  let factor = 1
  // 理论上当月最高和最低的票差不会超多30
  if (indexDiff > 0) {
    // 越靠近7.5越大
    factor = 1.2 - (0.2 * (Math.abs(7.5 - indexDiff) / 7.5))
  }
  if (indexDiff < 0) {
    // 越靠近-7.5越小
    factor = 0.8 + (0.2 * (Math.abs(7.5 + indexDiff) / 7.5))
  }
  return factor
}

// 年收益跟随因子
function getIndexYearDiffFactor (indexKey) {
  const indexDiff = storageUtil.getIndexYearDiff(indexKey) || 0
  let factor = 1
  // 理论上当年最高和最低的票差不会超多50
  if (indexDiff > 0) {
    // 越靠近12.5越大
    factor = 1.2 - (0.2 * (Math.abs(12.5 - indexDiff) / 12.5))
  }
  if (indexDiff < 0) {
    // 越靠近-12.5越小
    factor = 0.8 + (0.2 * (Math.abs(12.5 + indexDiff) / 12.5))
  }
  return factor
}

function getBuyNumber (hasCount, rowBuy, indexRedistributionStandard) {
  function getY (x) {
    if (x <= indexRedistributionStandard) {
      return 0.4 + 0.4 * (x / indexRedistributionStandard)
    } else {
      return 0.8 - 0.4 * ((x - indexRedistributionStandard) / indexRedistributionStandard)
    }
  }
  let a = hasCount + rowBuy
  if (a > 2 * indexRedistributionStandard) {
    a = 2 * indexRedistributionStandard
  }
  let fBuy = 0
  let c = a - hasCount
  let d = 1
  if (hasCount <= indexRedistributionStandard) {
    if (a <= indexRedistributionStandard) {
      d = (getY(hasCount) + getY(a)) / 2
      fBuy = d * c
    } else {
      d = (getY(hasCount) + 1) / 2
      fBuy += d * (indexRedistributionStandard - hasCount)
      d = (getY(a) + 1) / 2
      fBuy += d * (a - indexRedistributionStandard)
    }
  } else {
    d = (getY(hasCount) + getY(a)) / 2
    fBuy = d * c
  }
  if (fBuy + hasCount > 2 * indexRedistributionStandard) {
    fBuy = 2 * indexRedistributionStandard - hasCount
  }
  return fBuy
}

// 买入金额再分配
function buyNumberRedistribution (indexItem, hasCount, buyNumber) {
  const asset = getUserAsset()
  const mix = indexItem.mix ? 1.25 : 1
  const indexAssetStandard = mix * asset / indexNumber
  const indexRedistributionStandard = indexAssetStandard / 2
  // return buyNumber
  return getBuyNumber(hasCount, buyNumber, indexRedistributionStandard)
}

function getSellNumber (hasCount, rowSell, indexRedistributionStandard) {
  let a = hasCount - rowSell
  if (a < 0) {
    a = 0
  }
  // 要减的金额
  let c = hasCount - a
  // 中间位
  let b = hasCount - (c / 2)
  let d = 0.4 + 0.6 * (b / (2 * indexRedistributionStandard))
  return d * c
}
// 卖出金额再分配
function sellNumberRedistribution (indexItem, hasCount, sellNumber) {
  const asset = getUserAsset()
  const mix = indexItem.mix ? 1.25 : 1
  const indexAssetStandard = mix * asset / indexNumber
  const indexRedistributionStandard = indexAssetStandard / 2
  // return sellNumber
  return getSellNumber(hasCount, sellNumber, indexRedistributionStandard)
}

const operatingTooltip = {
  getIndexBuyNumber (type, indexItem, marketInfo, hasCount) {
    // 标准到百
    let buyBase = getBuyBase(type, marketInfo)
    let indexPositionFactor = getIndexPositionFactor(indexItem.key, indexItem.attach)
    let indexAverageFactor = getIndexAverageFactor(indexItem.key)
    let indexMonthDiffFactor = getIndexMonthDiffFactor(indexItem.key)
    let indexYearDiffFactor = getIndexYearDiffFactor(indexItem.key)
    let indexMarketTimeFactor = getIndexMarketTimeFactor(indexItem.key)
    let indexJigouFactor = getIndexJigouFactor(indexItem.key, 'buy')
    let indexLajiFactor = getIndexLajiFactor(indexItem.key, 'buy')
    let indexHighRateFactor = getIndexHighRateFactor(indexItem.key, 'buy')
    let indexNetChangeRatioRateFactor = getIndexNetChangeRatioRateFactor(indexItem.rate, marketInfo.netChangeRatio, 'buy')
    let buyNumber = buyBase * indexPositionFactor * indexAverageFactor * indexMonthDiffFactor * indexYearDiffFactor * indexMarketTimeFactor * indexJigouFactor * indexHighRateFactor * indexNetChangeRatioRateFactor * indexLajiFactor
    let finalBuyNumber = buyNumberRedistribution(indexItem, hasCount, buyNumber)
    return Math.round(finalBuyNumber / 100) * 100
  },
  getIndexSellNumber (type, indexItem, marketInfo, hasCount) {
    // 标准到百
    let sellBase = getSellBase(type, marketInfo)
    let indexPositionFactor = getIndexPositionFactor(indexItem.key, indexItem.attach)
    let indexAverageFactor = getIndexAverageFactor(indexItem.key)
    let indexMonthDiffFactor = getIndexMonthDiffFactor(indexItem.key)
    let indexYearDiffFactor = getIndexYearDiffFactor(indexItem.key)
    let indexMarketTimeFactor = getIndexMarketTimeFactor(indexItem.key)
    let indexJigouFactor = getIndexJigouFactor(indexItem.key, 'sell')
    let indexLajiFactor = getIndexLajiFactor(indexItem.key, 'sell')
    let indexHighRateFactor = getIndexHighRateFactor(indexItem.key, 'sell')
    let indexNetChangeRatioRateFactor = getIndexNetChangeRatioRateFactor(indexItem.rate, marketInfo.netChangeRatio, 'sell')
    let sellNumber = sellBase * (2 - indexPositionFactor) * (2 - indexAverageFactor) * (2 - indexMonthDiffFactor) * (2 - indexYearDiffFactor) * (2 - indexMarketTimeFactor) * indexJigouFactor * indexHighRateFactor * indexNetChangeRatioRateFactor * indexLajiFactor
    let finalSellNumber = sellNumberRedistribution(indexItem, hasCount, sellNumber)
    return Math.round(finalSellNumber / 100) * 100
  },
  // 根据市场强弱提示那些本该买卖，而没有进行的
  getShouldDo (netChangeRatioList, buySellList, closeList) {
    let ifBuy = false
    let ifSell = false
    let firstFlag = ''
    let firstFlagIndex = 0
    // 首先今天是没有出信号的
    if (buySellList[0] !== '') {
      return ''
    }
    // 获取之后的第一个信号
    for (let i = 1; i < buySellList.length; i++) {
      if (buySellList[i] !== '') {
        firstFlagIndex = i
        firstFlag = buySellList[i]
        break
      }
    }
    // 今天没信号，之前有卖出，并且连续跌2天及以上，那就提示卖出
    if (firstFlag === 'sell') {
      if (firstFlagIndex >= 2) {
        let allDown = true
        for (let i = 0; i < firstFlagIndex; i++) {
          if (netChangeRatioList[i] > 0) {
            allDown = false
            break
          }
        }
        if (allDown) {
          ifSell = true
        }
      }
    }
    // 今天没信号，之前有买入，并且连续涨2天及以上，那就提示买入
    if (firstFlag === 'buy') {
      if (firstFlagIndex >= 1) {
        let allUp = true
        for (let i = 0; i < firstFlagIndex; i++) {
          if (netChangeRatioList[i] < 0) {
            allUp = false
            break
          }
        }
        if (allUp) {
          ifBuy = true
        }
      }
    }
    // 今天没信号，之前有卖出，卖出信号第二天涨了，但是涨得少，之后都跌了也应该卖出
    if (firstFlag === 'sell') {
      if (firstFlagIndex >= 2) {
        const changeRatio = netChangeRatioList[firstFlagIndex - 1]
        // 卖出信号第二天涨了，但是涨得少
        if (changeRatio > 0 && changeRatio < 0.5) {
          let allDown = true
          for (let i = 0; i < (firstFlagIndex - 1); i++) {
            if (netChangeRatioList[i] > 0) {
              allDown = false
              break
            }
          }
          if (allDown) {
            ifSell = true
          }
        }
      }
    }
    // 今天没信号，之前有卖出，之后只有一天涨了（但不是今天）而且涨的很少也应该卖出
    if (firstFlag === 'sell') {
      if (firstFlagIndex >= 3) {
        // 今天是跌的
        if (netChangeRatioList[0] < 0) {
          let upCount = 0
          let upIndex = 0
          for (let i = 0; i < firstFlagIndex; i++) {
            if (netChangeRatioList[i] > 0) {
              upCount++
              upIndex = i
            }
          }
          // 只有一天是上涨的
          if (upCount === 1) {
            const changeRatio = netChangeRatioList[upIndex]
            // 但是涨得少
            if (changeRatio > 0 && changeRatio < 0.5) {
              ifSell = true
            }
          }
        }
      }
    }
    if (ifSell) {
      return 'sell'
    }
    if (ifBuy) {
      return 'buy'
    }
    return ''
  },
  // 仓位提示的警戒线
  getPositionWarnNumber (item) {
    const asset = getUserAsset()
    let mix = 1
    if (highRate.indexOf(item.key) !== -1) {
      mix = 0.75
    }
    // 取不是定投的那部分
    const indexAssetStandard = mix * (asset * 0.67) / indexNumber
    const indexRedistributionStandard = indexAssetStandard / 2
    return {
      // 危险
      positionDangerLine: indexRedistributionStandard * 1.67,
      // 提示
      positionWarnLine: indexAssetStandard
    }
  },
  // 根据仓位提示，仓位是否合适
  getPositionWarn (item, hasCount) {
    const positionWarnNumber = this.getPositionWarnNumber(item)
    let positionDangerLine = positionWarnNumber.positionDangerLine
    if (hasCount >= positionDangerLine) {
      return 'danger'
    }
    // let positionWarnLine = positionWarnNumber.positionWarnLine
    // if (hasCount >= positionWarnLine) {
    //   return 'warn'
    // }
    return ''
  },
  // 损失提示，防止单一品种损失过多
  getLossWarn (hasCount, costCount) {
    const asset = getUserAsset()
    const loss = (asset / indexNumber) * 0.04
    const diff = hasCount - costCount
    return diff < -loss
  },
  // 是否低于卖出信号时的点位,高于买入时的点位
  ifBuySellFlagTrue (buySellList, closeList) {
    let firstFlag = ''
    let flagIndex = 0
    if (buySellList[0] !== '') {
      return ''
    }
    for (let i = 1; i < buySellList.length; i++) {
      if (buySellList[i] !== '') {
        firstFlag = buySellList[i]
        flagIndex = i
        break
      }
    }
    if (firstFlag === 'sell') {
      if (closeList[flagIndex] > closeList[0]) {
        return 'sell'
      }
    }
    if (firstFlag === 'buy') {
      if (closeList[flagIndex] < closeList[0]) {
        return 'buy'
      }
    }
    return ''
  },
  // 震荡着上升
  ifStepUp (netChangeRatioList, closeList) {
    if (netChangeRatioList[0] < 0 && netChangeRatioList[1] > 0 && netChangeRatioList[2] < 0 && netChangeRatioList[3] > 0) {
      if (closeList[0] > closeList[2] && closeList[1] > closeList[3]) {
        return true
      }
    }
    return false
  },
  // 震荡着下降
  ifStepDown (netChangeRatioList, closeList) {
    if (netChangeRatioList[0] > 0 && netChangeRatioList[1] < 0 && netChangeRatioList[2] > 0 && netChangeRatioList[3] < 0) {
      if (closeList[0] < closeList[2] && closeList[1] < closeList[3]) {
        return true
      }
    }
    return false
  },
  // 买入信号失效
  ifBuyFlagInvalid (netChangeRatioList, buySellList) {
    // 连续出两个买入信号，结果还是跌的，警示
    let firstFlag = ''
    let firstFlagIndex = 0
    // 今天之后的第一个信号
    for (let i = 1; i < buySellList.length; i++) {
      if (buySellList[i] !== '') {
        firstFlagIndex = i
        firstFlag = buySellList[i]
        break
      }
    }
    // 连续出两个买入信号
    if (firstFlag === 'buy' && buySellList[firstFlagIndex + 1] === 'buy') {
      let allDown = true
      for (let i = 0; i < (firstFlagIndex + 1); i++) {
        if (netChangeRatioList[i] > 0) {
          allDown = false
          break
        }
      }
      if (allDown) {
        return true
      }
    }
    return false
  },
  // 是否进入弱势期
  ifWeak (netChangeRatioList, buySellList, closeList) {
    // 首先今天是卖出信号
    if (buySellList[0] === 'sell') {
      let firstFlag = ''
      let firstFlagIndex = 0
      for (let i = 1; i < buySellList.length; i++) {
        if (buySellList[i] !== '') {
          firstFlagIndex = i
          firstFlag = buySellList[i]
          break
        }
      }
      // 上一个信号也是卖出
      if (firstFlag === 'sell') {
        const diff = closeList[0] - closeList[firstFlagIndex]
        // 现在这个点比上一个低
        if (diff < 0) {
          return true
        } else {
          // 中间一定间隔2天
          if (firstFlagIndex < 3) {
            return false
          }
          const rate = numberUtil.countDifferenceRate(closeList[0], closeList[firstFlagIndex])
          // 没怎么涨
          if (rate < 1) {
            for (let i = 0; i < firstFlagIndex; i++) {
              // 不能有大幅度的涨幅
              if (netChangeRatioList[i] > 0.8) {
                return false
              }
            }
            return true
          }
        }
      }
    }
    return false
  },
  // 是否加速下跌
  ifSpeedUpDown (netChangeRatioList) {
    const a = netChangeRatioList[0]
    const b = netChangeRatioList[1]
    if (a < 0 && b < 0) {
      if (a < b) {
        return true
      }
    }
    return false
  },
  // 是否过热
  ifOverheated (positionWarn, buySellList) {
    let flag = false
    if (positionWarn) {
      if (buySellList[0] === 'sell' && buySellList[1] === 'sell') {
        flag = true
      }
    }
    return flag
  },
  // 是否后劲不足，卖出信号后一天涨幅低于0.5
  ifUpSpeedDown (netChangeRatioList, buySellList) {
    // 首先今天不是买入信号
    if (buySellList[0] !== 'buy') {
      // 昨天是卖出信号
      if (buySellList[1] === 'sell') {
        // 今天涨幅低于0.5
        if (netChangeRatioList[0] < 0.5) {
          return true
        }
      }
    }
    return false
  },
  // 下跌缓住，买入信号后一天跌幅低于0.5
  ifDownSpeedDown (netChangeRatioList, buySellList) {
    // 首先今天不是卖出信号
    if (buySellList[0] !== 'sell') {
      // 昨天是买入信号
      if (buySellList[1] === 'buy') {
        // 今天跌幅低于0.5
        if (netChangeRatioList[0] > -0.5) {
          return true
        }
      }
    }
    return false
  },
  laji,
  jigou
}
export default operatingTooltip
