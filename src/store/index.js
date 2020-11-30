import Vue from 'vue'
import Vuex from 'vuex'
import storageUtil from '@/util/storageUtil.js'
import indexListAll from '@/common/indexListAll.js'

Vue.use(Vuex)

const defaultTab = 'fund'

const indexBondBuyMap = {}
const indexBondSellMap = {}
indexListAll.forEach((i) => {
  indexBondBuyMap[i.key] = 0
  indexBondSellMap[i.key] = 0
})

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    // app部分
    tabSelect: storageUtil.getData('appConfig', 'homeTabSelect') || defaultTab,
    userFundAccountInfo: {},
    stockIndexAll: [],
    stockMarketQuestion: [],
    indexBondBuyMap: indexBondBuyMap,
    indexBondSellMap: indexBondSellMap
  },
  getters: {
    tabSelect: state => state.tabSelect,
    userFundAccountInfo: state => state.userFundAccountInfo,
    stockIndexAll: state => state.stockIndexAll,
    stockMarketQuestion: state => state.stockMarketQuestion,
    indexBondBuyMap: state => state.indexBondBuyMap,
    indexBondSellMap: state => state.indexBondSellMap
  },
  mutations: {
    SET_TAB_SELECT: (state, data) => {
      state.tabSelect = data
    },
    updateUserFundAccountInfo: (state, data) => {
      state.userFundAccountInfo = data
    },
    updateStockIndexAll: (state, data) => {
      state.stockIndexAll = data
    },
    updateIndexBondBuyMap: (state, data) => {
      state.indexBondBuyMap[data.key] = data.value
    },
    updateIndexBondSellMap: (state, data) => {
      state.indexBondSellMap[data.key] = data.value
    }
  },
  actions: {
    setTabSelect ({commit}, data) {
      return new Promise(resolve => {
        commit('SET_TAB_SELECT', data)
        resolve()
      })
    }
  }
})

export default store
