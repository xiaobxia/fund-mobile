// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import MintUI from 'mint-ui'
import router from './router/index'
import App from './App'
import './style/main.scss'
import VCharts from 'v-charts'
import '../static/web-fonts-with-css/css/fontawesome-all.css'
import environmentUtil from './util/environmentUtil'
import Http from '@/util/httpUtil.js'
import store from './store'
import numberUtil from '@/util/numberUtil.js'
import dateUtil from '@/util/dateUtil.js'

environmentUtil.setAdaptive()

Vue.use(MintUI)
Vue.use(VCharts)

Vue.config.productionTip = false

Vue.prototype.$http = Http

Vue.prototype.stockNumberClass = function (number) {
  if (!number) {
    return ''
  }
  return number < 0 ? 'green-text' : 'red-text'
}

Vue.prototype.biNumberClass = function (number) {
  if (!number) {
    return 'yellow-text'
  }
  if (number < 0) {
    return 'green-text'
  } else {
    if (number >= 0.2) {
      return 'red-text'
    } else {
      return 'yellow-text'
    }
  }
}

Vue.prototype.numberBgClass = function (number) {
  if (!number) {
    return ''
  }
  return number < 0 ? 'green-bg' : 'red-bg'
}

Vue.prototype.formatFundName = function (name, len) {
  len = len || 12
  if (name.length > len) {
    const lastChart = name.substr(name.length - 1)
    if (lastChart === 'A' || lastChart === 'C') {
      return name.substr(0, (len - 2)) + '...' + lastChart
    }
    return name.substr(0, (len - 1)) + '...'
  } else {
    return name
  }
}

Vue.prototype.keep100 = function (number) {
  return Math.round(number / 100) * 100
}

for (const key in numberUtil) {
  Vue.prototype[key] = numberUtil[key]
}

for (const key in dateUtil) {
  Vue.prototype[key] = dateUtil[key]
}

Vue.prototype.$fbsUrl = 'http://47.92.210.171:3051/fbsServer'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
