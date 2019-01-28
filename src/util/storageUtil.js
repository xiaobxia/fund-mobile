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
  getGoodBad: function (key) {
    let config = {}
    if (window._goodBad) {
      config = window._goodBad
    } else {
      const goodBadString = localStorage.getItem('goodBad')
      if (goodBadString) {
        config = JSON.parse(goodBadString)
      }
      window._goodBad = config
    }
    if (key) {
      return config[key]
    }
    return config
  },
  setGoodBad: function (key, value) {
    let config = this.getGoodBad()
    config[key] = value
    window._goodBad = config
    localStorage.setItem('goodBad', JSON.stringify(config))
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
  }
}

export default storageUtil
