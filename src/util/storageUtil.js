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
  }
}

export default storageUtil
