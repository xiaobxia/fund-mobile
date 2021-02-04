import Vue from 'vue'
import Vuex from 'vuex'
import storageUtil from '@/util/storageUtil.js'
import indexListAll from '@/common/indexListAll.js'

Vue.use(Vuex)

const defaultTab = 'fund'

const indexBondBuyMap = {}
const indexBondSellMap = {}
const indexHighSellMap = {}
const bondSignalMap = {}
indexListAll.forEach((i) => {
  indexBondBuyMap[i.key] = 0
  indexBondSellMap[i.key] = 0
  indexHighSellMap[i.key] = false
  bondSignalMap[i.key] = {}
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
    indexBondSellMap: indexBondSellMap,
    indexHighSellMap: indexHighSellMap,
    bondSignalMap: bondSignalMap
  },
  getters: {
    tabSelect: state => state.tabSelect,
    userFundAccountInfo: state => state.userFundAccountInfo,
    stockIndexAll: state => state.stockIndexAll,
    stockMarketQuestion: state => state.stockMarketQuestion,
    indexBondBuyMap: state => state.indexBondBuyMap,
    indexBondSellMap: state => state.indexBondSellMap,
    indexHighSellMap: state => state.indexHighSellMap,
    bondSignalMap: state => state.bondSignalMap
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
    },
    updateIndexHighSellMap: (state, data) => {
      state.indexHighSellMap[data.key] = data.value
    },
    updateBondSignalMap: (state, data) => {
      state.bondSignalMap[data.key] = data
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
