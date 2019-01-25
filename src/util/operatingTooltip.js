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
      if (firstFlagIndex >= 2) {
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
    if (ifSell) {
      return 'sell'
    }
    if (ifBuy) {
      return 'buy'
    }
    return ''
  },
  // 根据仓位提示，仓位是否合适
  getPositionWarn (item, hasCount) {
    const userFundAccountInfo = storageUtil.getUserFundAccountInfo()
    const asset = userFundAccountInfo.last_asset
    // 如果是混合指数宽限1.5倍
    let mix = (item.mix ? 1.5 : 1) * 0.9
    let assetLevelOne = (asset / 15) * mix
    // 如果大于总资产的1/15，大于持仓的1/6，那就是危险
    if (hasCount >= assetLevelOne) {
      return 'danger'
    }
    let assetLevelTwo = (asset / 25) * mix
    // 如果大于总资产的1/25，大于持仓的1/10，那就需要警示
    if (hasCount >= assetLevelTwo) {
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
  },
  // 上涨分数
  upFinalRate () {

  },
  downFinalRate () {

  }
}
export default operatingTooltip
