import storageUtil from '@/util/storageUtil.js'
const allDataList = {
  '东方': 'getStockAllDongfang',
  '腾讯': 'getStockAllTenxun'
}
const todayDataList = {
  '东方': 'getStockTodayDongfang',
  '腾讯': 'getStockTodayTenxun'
}

function getWay () {
  return storageUtil.getAppConfig('dataWay') || '东方'
}

const stockDataUtil = {
  getAllUrl: function () {
    const dataWay = getWay()
    return allDataList[dataWay]
  },
  getTodayUrl: function () {
    const dataWay = getWay()
    return todayDataList[dataWay]
  }
}
export default stockDataUtil
