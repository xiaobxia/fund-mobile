import storageUtil from '@/util/storageUtil.js'

// 操作的标准
function getStandard () {
  const userFundAccountInfo = storageUtil.getUserFundAccountInfo()
  const asset = userFundAccountInfo.last_asset
  return asset / (24 * 5)
}

function getBuyBase (type, upFinalRate) {
  const flag = type === '熊' ? 1 : 0.8
  const base = flag * getStandard()
  let b = 1
  if (upFinalRate <= 40) {
    b = 0.9
  }
  if (upFinalRate <= 30) {
    b = 0.8
  }
  if (upFinalRate <= 20) {
    b = 0.7
  }
  // 增
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
  return base * b
}

const operatingTooltip = {
  // 建议购买金额
  getBuyNumber (type, upFinalRate) {
    // 标准到百
    return Math.round(getBuyBase(type, upFinalRate) / 100) * 100
  },
  getBuyItem (type, upFinalRate, averageIndex, indexAttitude, indexDiff) {
    let b = 1
    if (indexAttitude === '强多') {
      b = 1.2
    }
    if (indexAttitude === '偏多') {
      b = 1.1
    }
    if (indexAttitude === '偏空') {
      b = 0.9
    }
    if (indexAttitude === '强空') {
      b = 0.8
    }
    let a = 1
    // 现阶段不适合
    // if (averageIndex > 1) {
    //   a = 1.2
    // }
    if (averageIndex > 1) {
      a = 0.8
    }
    if (averageIndex < -1) {
      a = 0.8
    }
    // 标准到百
    return Math.round(getBuyBase(type, upFinalRate) * a * b * (indexDiff || 1) / 100) * 100
  },
  getSellItem (type, downFinalRate, averageIndex, indexAttitude, indexDiff) {
    let base = 0
    if (indexAttitude === '强多') {
      base -= 20
    }
    if (indexAttitude === '偏多') {
      base -= 10
    }
    if (indexAttitude === '偏空') {
      base += 10
    }
    if (indexAttitude === '强空') {
      base += 20
    }
    if (averageIndex > 1) {
      base += 20
    }
    if (averageIndex < -1) {
      base += 20
    }
    if (downFinalRate <= 40) {
      base -= 10
    }
    if (downFinalRate <= 30) {
      base -= 20
    }
    if (downFinalRate <= 20) {
      base -= 30
    }
    // 增
    if (downFinalRate >= 60) {
      base += 10
    }
    if (downFinalRate >= 70) {
      base += 20
    }
    if (downFinalRate >= 80) {
      base += 30
    }
    if (downFinalRate >= 90) {
      base += 40
    }
    if (downFinalRate >= 100) {
      base += 50
    }
    indexDiff = indexDiff || 1
    base += (100 - (indexDiff * 100))
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
    // 今天没信号，之前有卖出，卖出信号第二天涨了，但是涨得少，之后都跌了也应该卖出
    if (firstFlag === 'sell') {
      if (firstFlagIndex >= 3) {
        const changeRatio = netChangeRatioList[firstFlagIndex - 1]
        // 卖出信号第二天涨了，但是涨得少
        if (changeRatio > 0 && changeRatio < 0.7) {
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
  // 上涨，下跌分数
  upDownFinalRate (buyCount, sellCount) {
    const question1 = storageUtil.getMarketStatus('question_1')
    const question2 = storageUtil.getMarketStatus('question_2')
    const question3 = storageUtil.getMarketStatus('question_3')
    const question4 = storageUtil.getMarketStatus('question_4')
    const question5 = storageUtil.getMarketStatus('question_5')
    const question6 = storageUtil.getMarketStatus('question_6')
    const question7 = storageUtil.getMarketStatus('question_7')
    let upRate = 50
    let downRate = 50
    // 是否要护盘
    if (question3 === '是') {
      upRate += 10
      downRate -= 10
    }
    // 市场强弱
    if (question1 === '强') {
      upRate += 10
      downRate -= 10
    }
    if (question1 === '弱') {
      upRate -= 10
      downRate += 10
    }
    // 市场是否有利好
    if (question2 === '利好') {
      upRate += 10
      downRate -= 10
    }
    if (question2 === '利空') {
      upRate -= 10
      downRate += 10
    }
    // 是否有上涨意愿
    if (question5 === '是') {
      upRate += 10
      downRate -= 10
    }
    if (question5 === '否') {
      upRate -= 10
      downRate += 10
    }
    // 乐观悲观，特殊情况再加10
    if (question6 === '乐观') {
      upRate += 10
      if (question4 === '是') {
        upRate += 10
      }
    }
    if (question6 === '悲观') {
      downRate += 10
      if (question4 === '否') {
        downRate += 10
      }
    }
    // 缩量，特殊情况再加10
    if (question7 === '是') {
      if (question4 === '是') {
        upRate += 10
      }
    }
    if (question7 === '是') {
      if (question4 === '否') {
        downRate += 10
      }
    }
    // 信号分
    let one = 6
    let two = 12
    let tree = 18
    if (question7 === '否') {
      if (buyCount > tree) {
        upRate += 30
        downRate -= 30
      } else if (buyCount > two) {
        upRate += 20
        downRate -= 20
      } else if (buyCount > one) {
        upRate += 10
        downRate -= 10
      }
      if (sellCount > tree) {
        downRate += 30
        upRate -= 30
      } else if (sellCount > two) {
        downRate += 20
        upRate -= 20
      } else if (sellCount > one) {
        downRate += 10
        upRate -= 10
      }
    }
    return {
      upRate,
      downRate
    }
  },
  // 是否有利空
  ifBad (netChangeRatioList, buySellList, closeList) {
    // 连续出两个买入信号，结果还是跌的，警示，置位有利空，之后可以通过观察，自己解除利空
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
  }
}
export default operatingTooltip
