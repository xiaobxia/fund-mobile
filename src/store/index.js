import Vue from 'vue'
import Vuex from 'vuex'
import storageUtil from '@/util/storageUtil.js'

Vue.use(Vuex)

const defaultTab = 'index'

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    tabSelect: storageUtil.getAppConfig('homeTabSelect') || defaultTab
  },
  // getters就是state的计算属性
  getters: {
    // tabSelect: state => {
    //   return state.tabSelect
    // }
  },
  mutations: {
    SET_TAB_SELECT: (state, data) => {
      state.tabSelect = data
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
