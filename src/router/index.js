/**
 * Created by xiaobxia on 2018/4/9.
 */
import Vue from 'vue'
import Router from 'vue-router'
const lazyLoading = (path, index = true) => () => System.import(`@/routers/${path}${index ? '/index' : ''}.vue`)

Vue.use(Router)

const routers = [
  {
    name: 'Index',
    path: '/',
    component: null
  },
  {
    name: 'HelloWorld',
    path: '/page/helloWorld',
    component: lazyLoading('HelloWorld'),
    meta: {
      auth: true,
      roles: {
        include: ['admin']
      }
    }
  },
  {
    name: 'Login',
    path: '/page/login',
    component: lazyLoading('Login')
  },
  {
    name: 'NoPermission',
    path: '/noPermission',
    component: lazyLoading('NoPermission')
  },
  {
    name: 'MyProportion',
    path: '/page/myProportion',
    component: lazyLoading('MyProportion')
  },
  {
    name: 'MyFund',
    path: '/page/myFund',
    component: lazyLoading('MyFund')
  },
  {
    name: 'FundDetail',
    path: '/page/fundDetail',
    component: lazyLoading('FundDetail')
  },
  {
    name: 'OperatingInfo',
    path: '/page/operatingInfo',
    component: lazyLoading('OperatingInfo')
  },
  {
    name: 'IndexDetail',
    path: '/page/indexDetail',
    component: lazyLoading('IndexDetail')
  },
  {
    name: 'AverageIndex',
    path: '/page/averageIndex',
    component: lazyLoading('AverageIndex')
  },
  {
    name: 'ChangeMarket',
    path: '/page/changeMarket',
    component: lazyLoading('ChangeMarket')
  },
  {
    name: 'TodayIndex',
    path: '/page/todayIndex',
    component: lazyLoading('TodayIndex')
  },
  {
    name: 'FixedInvestment',
    path: '/page/fixedInvestment',
    component: lazyLoading('FixedInvestment')
  },
  {
    name: 'IndexDifference',
    path: '/page/indexDifference',
    component: lazyLoading('IndexDifference')
  },
  {
    name: 'Market',
    path: '/page/market',
    component: lazyLoading('Market')
  },
  {
    name: 'Schedule',
    path: '/page/schedule',
    component: lazyLoading('Schedule')
  },
  {
    name: 'DataConfig',
    path: '/page/dataConfig',
    component: lazyLoading('DataConfig')
  },
  {
    name: 'Principle',
    path: '/page/principle',
    component: lazyLoading('Principle')
  },
  {
    name: 'MyAsset',
    path: '/page/myAsset',
    component: lazyLoading('MyAsset')
  },
  {
    name: 'GoodBad',
    path: '/page/goodBad',
    component: lazyLoading('GoodBad')
  },
  {
    name: 'MyFundAdd',
    path: '/page/myFundAdd',
    component: lazyLoading('MyFundAdd')
  },
  {
    name: '404',
    path: '*',
    component: lazyLoading('NotMatch')
  }
]

console.log(`路由数量：${routers.length}`)

export default new Router({
  // hash, history
  mode: 'hash',
  linkActiveClass: 'is-active',
  // 这个功能只在 HTML5 history 模式下可用
  scrollBehavior: () => ({y: 0}),
  routes: routers
})
