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
    name: 'MyFundAdd',
    path: '/page/myFundAdd',
    component: lazyLoading('MyFundAdd')
  },
  {
    name: 'IncomeAll',
    path: '/page/incomeAll',
    component: lazyLoading('IncomeAll')
  },
  {
    name: 'MyNetValueLine',
    path: '/page/myNetValueLine',
    component: lazyLoading('MyNetValueLine')
  },
  {
    name: 'MyNetValueRecord',
    path: '/page/myNetValueRecord',
    component: lazyLoading('MyNetValueRecord')
  },
  {
    name: 'MyNetValueAdd',
    path: '/page/myNetValueAdd',
    component: lazyLoading('MyNetValueAdd')
  },
  {
    name: 'Search',
    path: '/page/search',
    component: lazyLoading('Search')
  },
  {
    name: 'AddFund',
    path: '/page/addFund',
    component: lazyLoading('AddFund')
  },
  {
    name: 'Manual',
    path: '/page/manual',
    component: lazyLoading('Manual')
  },
  {
    name: 'MonthIncome',
    path: '/page/monthIncome',
    component: lazyLoading('MonthIncome')
  },
  {
    name: 'YearIncome',
    path: '/page/yearIncome',
    component: lazyLoading('YearIncome')
  },
  {
    name: 'DaysIncome',
    path: '/page/daysIncome',
    component: lazyLoading('DaysIncome')
  },
  {
    name: 'PositionConfig',
    path: '/page/positionConfig',
    component: lazyLoading('PositionConfig')
  },
  {
    name: 'ManyDown',
    path: '/page/manyDown',
    component: lazyLoading('ManyDown')
  },
  {
    name: 'AverageMonthIndex',
    path: '/page/averageMonthIndex',
    component: lazyLoading('AverageMonthIndex')
  },
  {
    name: 'Average30Index',
    path: '/page/average30Index',
    component: lazyLoading('Average30Index')
  },
  {
    name: 'AverageQuarterIndex',
    path: '/page/averageQuarterIndex',
    component: lazyLoading('AverageQuarterIndex')
  },
  {
    name: 'AverageHalfYearIndex',
    path: '/page/averageHalfYearIndex',
    component: lazyLoading('AverageHalfYearIndex')
  },
  {
    name: 'AverageYearIndex',
    path: '/page/averageYearIndex',
    component: lazyLoading('AverageYearIndex')
  },
  {
    name: 'AverageIndexSort',
    path: '/page/averageIndexSort',
    component: lazyLoading('AverageIndexSort')
  },
  {
    name: 'QuarterYearIndex',
    path: '/page/quarterYearIndex',
    component: lazyLoading('QuarterYearIndex')
  },
  {
    name: 'QuarterDiffIndex',
    path: '/page/quarterDiffIndex',
    component: lazyLoading('QuarterDiffIndex')
  },
  {
    name: 'BuySellConfig',
    path: '/page/buySellConfig',
    component: lazyLoading('BuySellConfig')
  },
  {
    name: 'RecentBuy',
    path: '/page/recentBuy',
    component: lazyLoading('RecentBuy')
  },
  {
    name: 'DaV',
    path: '/page/daV',
    component: lazyLoading('DaV')
  },
  {
    name: 'CountIncome',
    path: '/page/countIncome',
    component: lazyLoading('CountIncome')
  },
  {
    name: 'Ast',
    path: '/page/ast',
    component: lazyLoading('Ast')
  },
  {
    name: 'BtbIndex',
    path: '/page/btbIndex',
    component: lazyLoading('BtbIndex')
  },
  {
    name: 'BtbCount',
    path: '/page/btbCount',
    component: lazyLoading('BtbCount')
  },
  {
    name: 'MyBtbAdd',
    path: '/page/myBtbAdd',
    component: lazyLoading('MyBtbAdd')
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
