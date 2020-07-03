import storageUtil from '@/util/storageUtil.js'
import factorUtil from '@/util/factorUtil.js'
import indexType from '@/common/indexType.js'

const highRate = indexType.highRate
const laji = indexType.laji
const kuanji = indexType.kuanji

// 定投占比
// 得真实得定，因为这也会影响波段指数的标准仓
const fixedInvestmentRatio = 0.45
// 指数数量
// 机构垃圾指数会根据分类提升占比
const indexNumber = 24

// 获取当天账户资产
function getUserAsset () {
  const userFundAccountInfo = storageUtil.getData('userAccountInfo')
  return userFundAccountInfo.asset || 0
}

// 操作的标准
function operateStandard () {
  const asset = getUserAsset()
  // 波段仓占比
  return asset * (1 - fixedInvestmentRatio) / (indexNumber * 5)
}

// 单个指数的仓位标准
function positionStandard (indexItem) {
  const asset = getUserAsset()
  const positionAsset = asset * (1 - fixedInvestmentRatio)
  let mix = indexItem.mix ? 1.25 : 1
  return mix * positionAsset / indexNumber
}

// 基于市场的购买基准
function getBuyBase (type, marketInfo) {
  let finalFactor = type === '熊' ? 1 : 0.8
  // 买卖信号因子
  finalFactor = finalFactor * factorUtil.buySellFactor(
    marketInfo.buyFlagCount,
    marketInfo.sellFlagCount,
    indexNumber,
    'buy'
  )
  // 锁仓因子
  finalFactor = finalFactor * factorUtil.noSellCountFactor(marketInfo.noSellCount, indexNumber, 'buy')
  // 市场状况
  finalFactor = finalFactor * factorUtil.stockMarketQuestionFactor('buy')
  // 市场择时
  finalFactor = finalFactor * factorUtil.assetMarketTimeFactor('buy')
  // 仓位修正
  finalFactor = finalFactor * factorUtil.positionFactor('buy')
  // 结果
  return finalFactor * operateStandard()
}

// 基于市场的卖出基准
function getSellBase (type, marketInfo) {
  let finalFactor = type === '熊' ? 1 : 0.8
  // 买卖信号因子
  finalFactor = finalFactor * factorUtil.buySellFactor(
    marketInfo.buyFlagCount,
    marketInfo.sellFlagCount,
    indexNumber,
    'sell'
  )
  // 锁仓因子
  finalFactor = finalFactor * factorUtil.noSellCountFactor(marketInfo.noSellCount, indexNumber, 'sell')
  // 市场状况
  finalFactor = finalFactor * factorUtil.stockMarketQuestionFactor('sell')
  // 市场择时
  finalFactor = finalFactor * factorUtil.assetMarketTimeFactor('sell')
  // 仓位修正
  finalFactor = finalFactor * factorUtil.positionFactor('sell')
  // 结果
  // 卖的标准大一点
  return finalFactor * operateStandard() * 3 / 2
}

function getBuyNumber (hasCount, rowBuy, indexRedistributionStandard) {
  const full = 2 * indexRedistributionStandard
  const splitLine = 0.66 * full
  const restLine = 0.34 * full
  function getY (x) {
    if (x <= splitLine) {
      return 0.5 + 0.5 * (x / splitLine)
    } else {
      return 1 - 0.5 * ((x - splitLine) / restLine)
    }
  }
  let rest = 0
  let a = hasCount + rowBuy
  if (a > full) {
    rest = a - full
    a = full
  }
  let fBuy = 0
  let c = a - hasCount
  let d = 1
  if (hasCount <= splitLine) {
    if (a <= splitLine) {
      d = (getY(hasCount) + getY(a)) / 2
      fBuy = d * c
    } else {
      d = (getY(hasCount) + 1) / 2
      fBuy += d * (splitLine - hasCount)
      d = (getY(a) + 1) / 2
      fBuy += d * (a - splitLine)
    }
  } else {
    d = (getY(hasCount) + getY(a)) / 2
    fBuy = d * c
  }
  // if (fBuy + hasCount > 2 * indexRedistributionStandard) {
  //   fBuy = 2 * indexRedistributionStandard - hasCount
  // }
  return fBuy + (0.33 * rest)
}

// 买入金额再分配
function buyNumberRedistribution (indexItem, hasCount, buyNumber, marketInfo) {
  const indexRedistributionStandard = positionStandard(indexItem)
  // 年排行在前面的，给更高仓位配比
  let indexYearDiffFactor = factorUtil.getIndexYearDiffFactor(indexItem.key, 'buy')
  // 指数处于的阶段
  const indexStatus = storageUtil.getData('stockIndexStatus', indexItem.key)
  // 定投的可以多买点
  if (indexStatus === '定投') {
    if (indexYearDiffFactor < 1) {
      indexYearDiffFactor = 1
    }
  }
  let finalFactor = 1
  // 买卖信号因子
  finalFactor = finalFactor * factorUtil.buySellFactor(
    marketInfo.buyFlagCount,
    marketInfo.sellFlagCount,
    indexNumber,
    'buy'
  )
  // 锁仓因子
  finalFactor = finalFactor * factorUtil.noSellCountFactor(marketInfo.noSellCount, indexNumber, 'buy')
  // 市场状况
  finalFactor = finalFactor * factorUtil.stockMarketQuestionFactor('buy')
  // 市场择时
  finalFactor = finalFactor * factorUtil.assetMarketTimeFactor('buy')
  // 仓位修正
  finalFactor = finalFactor * factorUtil.positionFactor('buy')
  return getBuyNumber(hasCount, buyNumber, indexRedistributionStandard * indexYearDiffFactor * finalFactor)
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
  let d = 0.5 + 0.5 * (b / (2 * indexRedistributionStandard))
  return d * c
}
// 卖出金额再分配
function sellNumberRedistribution (indexItem, hasCount, sellNumber, marketInfo) {
  const indexRedistributionStandard = positionStandard(indexItem)
  // 年排行在前面的，给更高仓位配比，卖出也用buy的
  let indexYearDiffFactor = factorUtil.getIndexYearDiffFactor(indexItem.key, 'buy')
  let finalFactor = type === 1
  // 买卖信号因子
  finalFactor = finalFactor * factorUtil.buySellFactor(
    marketInfo.buyFlagCount,
    marketInfo.sellFlagCount,
    indexNumber,
    'sell'
  )
  // 锁仓因子
  finalFactor = finalFactor * factorUtil.noSellCountFactor(marketInfo.noSellCount, indexNumber, 'sell')
  // 市场状况
  finalFactor = finalFactor * factorUtil.stockMarketQuestionFactor('sell')
  // 市场择时
  finalFactor = finalFactor * factorUtil.assetMarketTimeFactor('sell')
  // 仓位修正
  finalFactor = finalFactor * factorUtil.positionFactor('sell')
  return getSellNumber(hasCount, sellNumber, indexRedistributionStandard * indexYearDiffFactor * finalFactor)
}

const operatingTooltip = {
  getIndexBuyNumber (type, indexItem, marketInfo, hasCount, ifChange) {
    // 标准到百
    let buyBase = getBuyBase(type, marketInfo)
    let indexAverageHalfYearFactor = factorUtil.getAverageHalfYearFactor(indexItem.key, 'buy')
    let indexAverageFactor = factorUtil.getIndexAverageFactor(indexItem.key, 'buy')
    let monthAverageFactor = factorUtil.getIndexAverageMonthFactor(indexItem.key, indexItem.reduceLine, 'buy') || 1
    let indexMonthDiffFactor = factorUtil.getIndexMonthDiffFactor(indexItem.key, 'buy')
    let indexYearDiffFactor = factorUtil.getIndexYearDiffFactor(indexItem.key, 'buy')
    let indexMarketTimeFactor = factorUtil.getIndexMarketTimeFactor(indexItem.key, 'buy')
    let indexJigouFactor = factorUtil.getIndexJigouFactor(indexItem.key, 'buy')
    let indexLajiFactor = factorUtil.getIndexLajiFactor(indexItem.key, 'buy')
    let indexHighRateFactor = factorUtil.getIndexHighRateFactor(indexItem.key, 'buy')
    let indexDaVFactor = factorUtil.getDaVFactor(indexItem.key, 'buy')
    let indexNetChangeRatioRateFactor = 1
    if (ifChange) {
      indexNetChangeRatioRateFactor = factorUtil.getIndexNetChangeRatioRateFactor(indexItem.rate, marketInfo.netChangeRatio, 'buy')
    }
    let indexManyDownFactor = factorUtil.getIndexManyDownFactor(indexItem.rate, marketInfo.netChangeRatioList, 'buy')
    // 指数处于的阶段
    const indexStatus = storageUtil.getData('stockIndexStatus', indexItem.key)
    // 定投的可以多买点
    if (indexStatus === '定投') {
      if (indexMonthDiffFactor < 1) {
        indexMonthDiffFactor = 1
      }
      if (indexYearDiffFactor < 1) {
        indexYearDiffFactor = 1
      }
    }
    let buyNumber =
      buyBase *
      indexAverageHalfYearFactor *
      indexAverageFactor *
      indexMonthDiffFactor *
      indexYearDiffFactor *
      indexMarketTimeFactor *
      indexJigouFactor *
      indexHighRateFactor *
      indexNetChangeRatioRateFactor *
      indexLajiFactor *
      indexManyDownFactor *
      monthAverageFactor *
      indexDaVFactor
    let finalBuyNumber = buyNumberRedistribution(indexItem, hasCount, buyNumber, marketInfo)
    return Math.round(finalBuyNumber / 100) * 100
  },
  getIndexSellNumber (type, indexItem, marketInfo, hasCount) {
    // 标准到百
    let sellBase = getSellBase(type, marketInfo)
    let indexAverageHalfYearFactor = factorUtil.getAverageHalfYearFactor(indexItem.key, 'sell')
    let indexAverageFactor = factorUtil.getIndexAverageFactor(indexItem.key, 'sell')
    let monthAverageFactor = factorUtil.getIndexAverageMonthFactor(indexItem.key, indexItem.reduceLine, 'sell') || 1
    let indexMonthDiffFactor = factorUtil.getIndexMonthDiffFactor(indexItem.key, 'sell')
    let indexYearDiffFactor = factorUtil.getIndexYearDiffFactor(indexItem.key, 'sell')
    let indexMarketTimeFactor = factorUtil.getIndexMarketTimeFactor(indexItem.key, 'sell')
    let indexJigouFactor = factorUtil.getIndexJigouFactor(indexItem.key, 'sell')
    let indexLajiFactor = factorUtil.getIndexLajiFactor(indexItem.key, 'sell')
    let indexHighRateFactor = factorUtil.getIndexHighRateFactor(indexItem.key, 'sell')
    let indexNetChangeRatioRateFactor = factorUtil.getIndexNetChangeRatioRateFactor(indexItem.rate, marketInfo.netChangeRatio, 'sell')
    let indexDaVFactor = factorUtil.getDaVFactor(indexItem.key, 'sell')
    let sellNumber =
      sellBase *
      indexAverageHalfYearFactor *
      indexAverageFactor *
      indexMonthDiffFactor *
      indexYearDiffFactor *
      indexMarketTimeFactor *
       monthAverageFactor *
      indexJigouFactor *
      indexHighRateFactor *
      indexNetChangeRatioRateFactor *
      indexLajiFactor *
      indexDaVFactor
    let finalSellNumber = sellNumberRedistribution(indexItem, hasCount, sellNumber, marketInfo)
    return Math.round(finalSellNumber / 100) * 100
  },
  // 仓位提示的警戒线
  getPositionWarnNumber (item) {
    const asset = getUserAsset()
    let mix = 1
    // 高费率和垃圾指数，限仓第一点，宽基的高一点
    if (highRate.indexOf(item.key) !== -1 || laji.indexOf(item.key) !== -1) {
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
  }
}
export default operatingTooltip
