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

environmentUtil.setAdaptive()

Vue.use(MintUI)
Vue.use(VCharts)

Vue.config.productionTip = false

Vue.prototype.$http = Http

Vue.prototype.numberClass = function (number) {
  if (!number) {
    return ''
  }
  return number < 0 ? 'green-text' : 'red-text'
}

Vue.prototype.formatFundName = function (name, len) {
  len = len || 12
  if (name.length > len) {
    const lastChart = name.substr(name.length - 1)
    console.log(lastChart)
    if (lastChart === 'A' || lastChart === 'C') {
      return name.substr(0, (len - 2)) + '...' + lastChart
    }
    return name.substr(0, (len - 1)) + '...'
  } else {
    return name
  }
}

Vue.prototype.countDifferenceRate = function (numerator, denominator) {
  return numberUtil.countDifferenceRate(numerator, denominator)
}

Vue.prototype.countDifferenceRate = function (numerator, denominator) {
  return numberUtil.countDifferenceRate(numerator, denominator)
}

Vue.prototype.keepTwoDecimals = function (number) {
  return numberUtil.keepTwoDecimals(number)
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
