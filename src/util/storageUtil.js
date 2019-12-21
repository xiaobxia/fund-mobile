/**
 * Created by xiaobxia on 2018/5/3.
 */
function formatKey (key) {
  return `fundMobile-${key}`
}
function localStorageGetItem (key) {
  return localStorage.getItem(formatKey(key))
}
function localStorageSetItem (key, data) {
  return localStorage.setItem(formatKey(key), data)
}
function localStorageRemoveItem (key) {
  return localStorage.removeItem(formatKey(key))
}
const storageUtil = {
  getData: function (name, key) {
    let value = {}
    if (window[`_${name}`]) {
      value = window[`_${name}`]
    } else {
      const valueString = localStorageGetItem(name)
      if (valueString) {
        value = JSON.parse(valueString)
      }
      window[`_${name}`] = value
    }
    if (key) {
      return value[key]
    }
    return value
  },
  setData: function (name, key, value) {
    let data = this.getData(name)
    if (typeof key === 'object') {
      value = key
      data = value
    } else {
      data[key] = value
    }
    window[`_${name}`] = data
    localStorageSetItem(name, JSON.stringify(data))
    return data
  },
  clearAll: function () {
    window.localStorage.clear()
  },
  getAppConfig: function (key) {
    let config = {}
    if (window._appConfig) {
      config = window._appConfig
    } else {
      const appConfigString = localStorageGetItem('appConfig')
      if (appConfigString) {
        config = JSON.parse(appConfigString)
      }
      window._appConfig = config
    }
    if (key) {
      return config[key]
    }
    return config
  },
  setAppConfig: function (key, value) {
    let config = this.getAppConfig()
    config[key] = value
    window._appConfig = config
    localStorageSetItem('appConfig', JSON.stringify(config))
    return config
  },
  getUserInfo: function (key) {
    let userInfo = {}
    if (window._userInfo) {
      userInfo = window._userInfo
    } else {
      const userInfoString = localStorageGetItem('userInfo')
      if (userInfoString) {
        userInfo = JSON.parse(userInfoString)
      }
      window._userInfo = userInfo
    }
    if (key) {
      return userInfo[key]
    }
    return userInfo
  },
  setUserInfo: function (key, value) {
    let userInfo = this.getUserInfo()
    userInfo[key] = value
    window._userInfo = userInfo
    localStorageSetItem('userInfo', JSON.stringify(userInfo))
    return userInfo
  },
  initUserInfo: function (info) {
    window._userInfo = info
    localStorageSetItem('userInfo', JSON.stringify(info))
    return info
  },
  removeUserInfo: function () {
    window._userInfo = null
    localStorageRemoveItem('userInfo')
  },
  getUserFundAccountInfo: function () {
    if (window._userFundAccountInfo) {
      return window._userFundAccountInfo
    } else {
      let info = localStorageGetItem('userFundAccountInfo')
      if (info) {
        return JSON.parse(info)
      } else {
        return {}
      }
    }
  },
  setUserFundAccountInfo: function (key, value) {
    let config = this.getUserFundAccountInfo()
    config[key] = value
    window._userFundAccountInfo = config
    localStorage.setItem('userFundAccountInfo', JSON.stringify(config))
    return config
  },
  initUserFundAccountInfo: function (info) {
    window._userFundAccountInfo = info
    localStorageSetItem('userFundAccountInfo', JSON.stringify(info))
    return info
  },
  getSearchHistory: function (key) {
    let searchHistory = {}
    if (window._searchHistory) {
      searchHistory = window._searchHistory
    } else {
      const searchHistoryString = localStorageGetItem('searchHistory')
      if (searchHistoryString) {
        searchHistory = JSON.parse(searchHistoryString)
      }
      window._searchHistory = searchHistory
    }
    if (key) {
      return searchHistory[key]
    }
    return searchHistory
  },
  setSearchHistory: function (key, value) {
    let searchHistory = this.getSearchHistory()
    searchHistory[key] = value
    window._searchHistory = searchHistory
    localStorageSetItem('searchHistory', JSON.stringify(searchHistory))
    return searchHistory
  },
  setQueryCache: function (key, value) {
    return localStorageSetItem('cache-' + key, value)
  },
  getQueryCache: function (key) {
    return localStorageGetItem('cache-' + key)
  },
  clearQueryCache: function (key) {
    if (key) {
      return localStorageRemoveItem('cache-' + key)
    } else {
      for (let itemKey in localStorage) {
        if (itemKey.startsWith(formatKey('cache-'))) {
          localStorage.removeItem(itemKey)
        }
      }
      return true
    }
  },
  getMarketStatus: function (key) {
    let config = {}
    if (window._marketStatus) {
      config = window._marketStatus
    } else {
      const marketStatusString = localStorage.getItem('marketStatus')
      if (marketStatusString) {
        config = JSON.parse(marketStatusString)
      }
      window._marketStatus = config
    }
    if (key) {
      return config[key]
    }
    return config
  },
  setMarketStatus: function (key, value) {
    let config = this.getMarketStatus()
    config[key] = value
    window._marketStatus = config
    localStorage.setItem('marketStatus', JSON.stringify(config))
    return config
  },
  getChangeMarket: function (key) {
    let config = {}
    if (window._changeMarket) {
      config = window._changeMarket
    } else {
      const changeMarketString = localStorage.getItem('changeMarket')
      if (changeMarketString) {
        config = JSON.parse(changeMarketString)
      }
      window._changeMarket = config
    }
    if (key) {
      return config[key]
    }
    return config
  },
  setChangeMarket: function (key, value) {
    let config = this.getChangeMarket()
    config[key] = value
    window._changeMarket = config
    localStorage.setItem('changeMarket', JSON.stringify(config))
    return config
  },
  getAverage: function (key) {
    let config = {}
    if (window._average) {
      config = window._average
    } else {
      const averageString = localStorage.getItem('average')
      if (averageString) {
        config = JSON.parse(averageString)
      }
      window._average = config
    }
    if (key) {
      return config[key]
    }
    return config
  },
  setAverage: function (key, value) {
    let config = this.getAverage()
    config[key] = value
    window._average = config
    localStorage.setItem('average', JSON.stringify(config))
    return config
  },
  getMonthAverage: function (key) {
    let config = {}
    if (window._monthAverage) {
      config = window._monthAverage
    } else {
      const monthAverageString = localStorage.getItem('monthAverage')
      if (monthAverageString) {
        config = JSON.parse(monthAverageString)
      }
      window._monthAverage = config
    }
    if (key) {
      return config[key]
    }
    return config
  },
  setMonthAverage: function (key, value) {
    let config = this.getMonthAverage()
    config[key] = value
    window._monthAverage = config
    localStorage.setItem('monthAverage', JSON.stringify(config))
    return config
  },
  getQuarterAverage: function (key) {
    let config = {}
    if (window._quarterAverage) {
      config = window._quarterAverage
    } else {
      const quarterAverageString = localStorage.getItem('quarterAverage')
      if (quarterAverageString) {
        config = JSON.parse(quarterAverageString)
      }
      window._quarterAverage = config
    }
    if (key) {
      return config[key]
    }
    return config
  },
  setQuarterAverage: function (key, value) {
    let config = this.getQuarterAverage()
    config[key] = value
    window._quarterAverage = config
    localStorage.setItem('quarterAverage', JSON.stringify(config))
    return config
  },
  getNoSell: function (key) {
    let config = {}
    if (window._noSell) {
      config = window._noSell
    } else {
      const noSellString = localStorage.getItem('noSell')
      if (noSellString) {
        config = JSON.parse(noSellString)
      }
      window._noSell = config
    }
    if (key) {
      return config[key]
    }
    return config
  },
  setNoSell: function (key, value) {
    let config = this.getNoSell()
    config[key] = value
    window._noSell = config
    localStorage.setItem('noSell', JSON.stringify(config))
    return config
  },
  getIndexRate: function (key) {
    let config = {}
    if (window._indexRate) {
      config = window._indexRate
    } else {
      const indexRateString = localStorage.getItem('indexRate')
      if (indexRateString) {
        config = JSON.parse(indexRateString)
      }
      window._indexRate = config
    }
    if (key) {
      return config[key]
    }
    return config
  },
  setIndexRate: function (key, value) {
    let config = this.getIndexRate()
    config[key] = value
    window._indexRate = config
    localStorage.setItem('indexRate', JSON.stringify(config))
    return config
  },
  getJianBuySellList: function (key) {
    let config = {}
    if (window._jianBuySellList) {
      config = window._jianBuySellList
    } else {
      const jianBuySellListString = localStorage.getItem('jianBuySellList')
      if (jianBuySellListString) {
        config = JSON.parse(jianBuySellListString)
      }
      window._jianBuySellList = config
    }
    if (key) {
      return JSON.parse(config[key] || '["","","","",""]')
    }
    return config
  },
  setJianBuySellList: function (key, value) {
    let config = this.getJianBuySellList()
    config[key] = JSON.stringify(value)
    window._jianBuySellList = config
    localStorage.setItem('jianBuySellList', JSON.stringify(config))
    return config
  },
  getXiongBuySellList: function (key) {
    let config = {}
    if (window._xiongBuySellList) {
      config = window._xiongBuySellList
    } else {
      const xiongBuySellListString = localStorage.getItem('xiongBuySellList')
      if (xiongBuySellListString) {
        config = JSON.parse(xiongBuySellListString)
      }
      window._xiongBuySellList = config
    }
    if (key) {
      return JSON.parse(config[key] || '["","","","",""]')
    }
    return config
  },
  setXiongBuySellList: function (key, value) {
    let config = this.getXiongBuySellList()
    config[key] = JSON.stringify(value)
    window._xiongBuySellList = config
    localStorage.setItem('xiongBuySellList', JSON.stringify(config))
    return config
  },
  getJianBuySellListLarge: function (key) {
    let config = {}
    if (window._jianBuySellListLarge) {
      config = window._jianBuySellListLarge
    } else {
      const jianBuySellListLargeString = localStorage.getItem('jianBuySellListLarge')
      if (jianBuySellListLargeString) {
        config = JSON.parse(jianBuySellListLargeString)
      }
      window._jianBuySellListLarge = config
    }
    if (key) {
      return JSON.parse(config[key] || '["","","","","","","",""]')
    }
    return config
  },
  setJianBuySellListLarge: function (key, value) {
    let config = this.getJianBuySellListLarge()
    config[key] = JSON.stringify(value)
    window._jianBuySellListLarge = config
    localStorage.setItem('jianBuySellListLarge', JSON.stringify(config))
    return config
  },
  getXiongBuySellListLarge: function (key) {
    let config = {}
    if (window._xiongBuySellListLarge) {
      config = window._xiongBuySellListLarge
    } else {
      const xiongBuySellListLargeString = localStorage.getItem('xiongBuySellListLarge')
      if (xiongBuySellListLargeString) {
        config = JSON.parse(xiongBuySellListLargeString)
      }
      window._xiongBuySellListLarge = config
    }
    if (key) {
      return JSON.parse(config[key] || '["","","","","","","",""]')
    }
    return config
  },
  setXiongBuySellListLarge: function (key, value) {
    let config = this.getXiongBuySellListLarge()
    config[key] = JSON.stringify(value)
    window._xiongBuySellListLarge = config
    localStorage.setItem('xiongBuySellListLarge', JSON.stringify(config))
    return config
  },
  getIndexNiuXiong: function (key) {
    let config = {}
    if (window._indexNiuXiong) {
      config = window._indexNiuXiong
    } else {
      const indexNiuXiongString = localStorage.getItem('indexNiuXiong')
      if (indexNiuXiongString) {
        config = JSON.parse(indexNiuXiongString)
      }
      window._indexNiuXiong = config
    }
    if (key) {
      return config[key]
    }
    return config
  },
  setIndexNiuXiong: function (key, value) {
    let config = this.getIndexNiuXiong()
    config[key] = value
    window._indexNiuXiong = config
    localStorage.setItem('indexNiuXiong', JSON.stringify(config))
    return config
  },
  getIndexDiff: function (key) {
    let config = {}
    if (window._indexDiff) {
      config = window._indexDiff
    } else {
      const indexDiffString = localStorage.getItem('indexDiff')
      if (indexDiffString) {
        config = JSON.parse(indexDiffString)
      }
      window._indexDiff = config
    }
    if (key) {
      return config[key]
    }
    return config
  },
  setIndexDiff: function (key, value) {
    let config = this.getIndexDiff()
    config[key] = value
    window._indexDiff = config
    localStorage.setItem('indexDiff', JSON.stringify(config))
    return config
  },
  getIndexYearDiff: function (key) {
    let config = {}
    if (window._indexYearDiff) {
      config = window._indexYearDiff
    } else {
      const indexYearDiffString = localStorage.getItem('indexYearDiff')
      if (indexYearDiffString) {
        config = JSON.parse(indexYearDiffString)
      }
      window._indexYearDiff = config
    }
    if (key) {
      return config[key]
    }
    return config
  },
  setIndexYearDiff: function (key, value) {
    let config = this.getIndexYearDiff()
    config[key] = value
    window._indexYearDiff = config
    localStorage.setItem('indexYearDiff', JSON.stringify(config))
    return config
  },
  getMonthFactor: function (key) {
    let config = {}
    if (window._monthFactor) {
      config = window._monthFactor
    } else {
      const monthFactorString = localStorage.getItem('monthFactor')
      if (monthFactorString) {
        config = JSON.parse(monthFactorString)
      }
      window._monthFactor = config
    }
    if (key) {
      return config[key]
    }
    return config
  },
  setMonthFactor: function (key, value) {
    let config = this.getMonthFactor()
    config[key] = value
    window._monthFactor = config
    localStorage.setItem('monthFactor', JSON.stringify(config))
    return config
  }
}

export default storageUtil
