import moment from 'moment-timezone'
moment.tz.setDefault('Asia/Shanghai')

const fundAccountUtil = {
  // 是否定投
  ifFixedInvestment: function (item) {
    return item.strategy && item.strategy !== '1'
  },
  // 获取锁仓的仓位信息
  getLockInfo (item) {
    let data = {
      costSum: 0,
      shares: 0,
      sum: 0,
      valuationSum: 0
    }
    const list = item['position_record']
    for (let i = 0; i < list.length; i++) {
      const subItem = list[i]
      // 没有解锁
      if (subItem.ifLock) {
        data.shares += subItem.shares
        data.costSum += subItem.costSum
        data.sum += subItem.sum
        data.valuationSum += subItem.valuationSum
      }
    }
    return data
  },
  getUnLockInfo (item) {
    let data = {
      costSum: 0,
      shares: 0,
      sum: 0,
      valuationSum: 0
    }
    const list = item['position_record']
    for (let i = 0; i < list.length; i++) {
      const subItem = list[i]
      // 没有解锁
      if (!subItem.ifLock) {
        data.shares += subItem.shares
        data.costSum += subItem.costSum
        data.sum += subItem.sum
        data.valuationSum += subItem.valuationSum
      }
    }
    return data
  },
  getLastBuy (item) {
    let data = {
      costSum: 0,
      shares: 0,
      sum: 0,
      valuationSum: 0
    }
    const list = item['position_record']
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      // 没有解锁
      if (item.confirm_date === moment().format('YYYY-MM-DD')) {
        data.shares += item.shares
        data.costSum += item.costSum
        data.sum += item.sum
        data.valuationSum += item.valuationSum
      }
    }
    return data
  }
}

export default fundAccountUtil
