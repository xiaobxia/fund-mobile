import Vue from 'vue'
import Vuex from 'vuex'
import storageUtil from '@/util/storageUtil.js'

Vue.use(Vuex)

const defaultTab = 'fund'

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    // app部分
    tabSelect: storageUtil.getData('appConfig', 'homeTabSelect') || defaultTab,
    userFundAccountInfo: {},
    stockIndexAll: [],
    stockMarketQuestion: []
  },
  getters: {
    tabSelect: state => state.tabSelect,
    userFundAccountInfo: state => state.userFundAccountInfo,
    stockIndexAll: state => state.stockIndexAll,
    stockMarketQuestion: state => state.stockMarketQuestion
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
    updateStockMarketQuestion: (state, data) => {
      state.stockMarketQuestion = data
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
