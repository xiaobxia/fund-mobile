import storageUtil from '@/util/storageUtil.js'

// 操作的标准
function getStandard () {
  const userFundAccountInfo = storageUtil.getUserFundAccountInfo()
  const asset = userFundAccountInfo.last_asset
  return asset / 160
}

const operatingTooltip = {
  // 建议购买金额
  getBuyNumber (type, upFinalRate) {
    const flag = type === '熊' ? 1 : 0.7
    const base = flag * getStandard()
    let b = 1
    if (upFinalRate >= 60) {
      b = 1.2
    }
    if (upFinalRate >= 70) {
      b = 1.4
    }
    if (upFinalRate >= 80) {
      b = 1.6
    }
    if (upFinalRate >= 90) {
      b = 1.8
    }
    if (upFinalRate >= 100) {
      b = 2
    }
    // 标准到百
    return Math.round(base * b / 100) * 100
  },
  // 根据市场强弱提示那些本该买卖，而没有进行的
  getMarketWarn (netChangeRatio, buySellList) {
    let marketWarn = ''
    if (buySellList[0] === '') {
      let marketStatus = storageUtil.getMarketStatus('question_1') || '强'
      for (let i = 1; i < buySellList.length; i++) {
        if (buySellList[i] === 'buy') {
          if (marketStatus === '略强' && netChangeRatio > 0) {
            marketWarn = 'buy'
          }
          if (marketStatus === '强' && netChangeRatio > 0) {
            marketWarn = 'buy'
          }
          break
        }
        if (buySellList[i] === 'sell') {
          if (['略弱', '弱'].indexOf(marketStatus) !== -1 && netChangeRatio < 0) {
            marketWarn = 'sell'
          }
          break
        }
      }
    }
    return marketWarn
  },
  // 根据仓位提示，仓位是否合适
  getPositionWarn (item, totalSum, hasCount) {
    const userFundAccountInfo = storageUtil.getUserFundAccountInfo()
    const asset = userFundAccountInfo.last_asset
    // 如果是混合指数宽限1.5倍
    let mix = (item.mix ? 1.5 : 1) * 0.9
    let assetLevelOne = (asset / 15) * mix
    let totalLevelOne = (totalSum / 6) * mix
    // 如果大于总资产的1/15，大于持仓的1/6，那就是危险
    if ((hasCount >= assetLevelOne) || (hasCount >= totalLevelOne)) {
      return 'danger'
    }
    let assetLevelTwo = (asset / 25) * mix
    let totalLevelTwo = (totalSum / 10) * mix
    // 如果大于总资产的1/25，大于持仓的1/10，那就需要警示
    if ((hasCount >= assetLevelTwo) || (hasCount >= totalLevelTwo)) {
      return 'warn'
    }
    return ''
  },
  // 是否低于卖出信号时的点位,高于买入时的点位
  ifFlagTrue (buySellList, closeList) {
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
  ifStepUp (netChangeRatioList, closeList) {
    if (netChangeRatioList[0] < 0 && netChangeRatioList[1] > 0 && netChangeRatioList[2] < 0 && netChangeRatioList[3] > 0) {
      if (closeList[0] > closeList[2] && closeList[1] > closeList[3]) {
        return true
      }
    }
    return false
  },
  ifStepDown (netChangeRatioList, closeList) {
    if (netChangeRatioList[0] > 0 && netChangeRatioList[1] < 0 && netChangeRatioList[2] > 0 && netChangeRatioList[3] < 0) {
      if (closeList[0] < closeList[2] && closeList[1] < closeList[3]) {
        return true
      }
    }
    return false
  }
}
export default operatingTooltip
