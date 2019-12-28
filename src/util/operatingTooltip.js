import storageUtil from '@/util/storageUtil.js'
import factorUtil from '@/util/factorUtil.js'

// 定投占比
const fixedInvestmentRatio = 0.4
// 指数数量
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

// 基于市场的购买基准
function getBuyBase (type, marketInfo) {
  const userFundAccountInfo = storageUtil.getUserFundAccountInfo()
  let finalFactor = type === '熊' ? 1 : 0.8
  // 买卖信号因子
  let buySellFactor = 0.34 * ((marketInfo.buyFlagCount - marketInfo.sellFlagCount) / indexNumber)
  finalFactor = finalFactor * (1 + buySellFactor)
  // 锁仓因子
  let noSellCountFactor = 0.34 * (marketInfo.noSellCount / indexNumber)
  finalFactor = finalFactor * (1 + noSellCountFactor)
  // 市场状况
  let marketStateFactor = stockMarketQuestionFactor('buy')
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
  // 锁仓因子
  let noSellCountFactor = 0.34 * (marketInfo.noSellCount / indexNumber)
  finalFactor = finalFactor * (1 - noSellCountFactor)
  // 市场状况
  let marketStateFactor = stockMarketQuestion('sell')
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
function buyNumberRedistribution (indexItem, hasCount, buyNumber) {
  const asset = getUserAsset()
  let mix = indexItem.mix ? 1.25 : 1
  const indexAssetStandard = mix * asset / indexNumber
  const indexRedistributionStandard = indexAssetStandard / 2
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
  let d = 0.5 + 0.5 * (b / (2 * indexRedistributionStandard))
  return d * c
}
// 卖出金额再分配
function sellNumberRedistribution (indexItem, hasCount, sellNumber) {
  const asset = getUserAsset()
  let mix = indexItem.mix ? 1.25 : 1
  const indexAssetStandard = mix * asset / indexNumber
  const indexRedistributionStandard = indexAssetStandard / 2
  return getSellNumber(hasCount, sellNumber, indexRedistributionStandard)
}

const operatingTooltip = {
  getIndexBuyNumber (type, indexItem, marketInfo, hasCount, ifChange) {
    // 标准到百
    let buyBase = getBuyBase(type, marketInfo)
    let indexQuarterAverageFactor = getQuarterAverageFactor(indexItem.key)
    let indexAverageFactor = getIndexAverageFactor(indexItem.key)
    let monthAverageFactor = storageUtil.getMonthFactor(indexItem.key) || 1
    let indexMonthDiffFactor = getIndexMonthDiffFactor(indexItem.key)
    let indexYearDiffFactor = getIndexYearDiffFactor(indexItem.key)
    let indexMarketTimeFactor = getIndexMarketTimeFactor(indexItem.key)
    let indexJigouFactor = getIndexJigouFactor(indexItem.key, 'buy')
    let indexLajiFactor = getIndexLajiFactor(indexItem.key, 'buy')
    let indexHighRateFactor = getIndexHighRateFactor(indexItem.key, 'buy')
    let indexNetChangeRatioRateFactor = 1
    if (ifChange) {
      indexNetChangeRatioRateFactor = getIndexNetChangeRatioRateFactor(indexItem.rate, marketInfo.netChangeRatio, 'buy')
    }
    let indexManyDownFactor = getIndexManyDownFactor(indexItem.rate, marketInfo.netChangeRatioList)
    let buyNumber =
      buyBase *
      indexQuarterAverageFactor *
      indexAverageFactor *
      indexMonthDiffFactor *
      indexYearDiffFactor *
      indexMarketTimeFactor *
      indexJigouFactor *
      indexHighRateFactor *
      indexNetChangeRatioRateFactor *
      indexLajiFactor *
      indexManyDownFactor *
      monthAverageFactor
    let finalBuyNumber = buyNumberRedistribution(indexItem, hasCount, buyNumber)
    return Math.round(finalBuyNumber / 100) * 100
  },
  getIndexSellNumber (type, indexItem, marketInfo, hasCount) {
    // 标准到百
    let sellBase = getSellBase(type, marketInfo)
    let indexQuarterAverageFactor = getQuarterAverageFactor(indexItem.key)
    let indexAverageFactor = getIndexAverageFactor(indexItem.key)
    let monthAverageFactor = storageUtil.getMonthFactor(indexItem.key) || 1
    let indexMonthDiffFactor = getIndexMonthDiffFactor(indexItem.key)
    let indexYearDiffFactor = getIndexYearDiffFactor(indexItem.key)
    let indexMarketTimeFactor = getIndexMarketTimeFactor(indexItem.key)
    let indexJigouFactor = getIndexJigouFactor(indexItem.key, 'sell')
    let indexLajiFactor = getIndexLajiFactor(indexItem.key, 'sell')
    let indexHighRateFactor = getIndexHighRateFactor(indexItem.key, 'sell')
    let indexNetChangeRatioRateFactor = getIndexNetChangeRatioRateFactor(indexItem.rate, marketInfo.netChangeRatio, 'sell')
    let sellNumber =
      sellBase *
      (2 - indexQuarterAverageFactor) *
      (2 - indexAverageFactor) *
      (2 - indexMonthDiffFactor) *
      (2 - indexYearDiffFactor) *
      (2 - indexMarketTimeFactor) *
      (2 - monthAverageFactor) *
      indexJigouFactor *
      indexHighRateFactor *
      indexNetChangeRatioRateFactor *
      indexLajiFactor
    let finalSellNumber = sellNumberRedistribution(indexItem, hasCount, sellNumber)
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
