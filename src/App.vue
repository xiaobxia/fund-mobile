<template>
  <div id="app">
    <div class="loading-wrap" v-if="!ifChecked">
      <i class="fas fa-spinner fa-spin"></i>
      <p>加载中...</p>
    </div>
    <template v-else>
      <router-view v-if="subPath"/>
      <template v-else>
        <fund v-if="tabSelect === 'fund'"/>
        <configCenter v-if="tabSelect === 'configCenter'"/>
        <mine v-if="tabSelect === 'mine'"/>
        <square v-if="tabSelect === 'square'"></square>
        <mt-tabbar v-model="tabSelect" :fixed="true">
          <mt-tab-item id="fund">
            <img v-if="tabSelect === 'fund'" src="./assets/t-交易.png" alt="" slot="icon">
            <img v-else src="./assets/t-交易(1).png" alt="" slot="icon">
            <p>基金</p>
          </mt-tab-item>
          <mt-tab-item id="configCenter">
            <img v-if="tabSelect === 'configCenter'" src="./assets/t-配置.png" alt="" slot="icon">
            <img v-else src="./assets/t-配置(1).png" alt="" slot="icon">
            <p>配置</p>
          </mt-tab-item>
          <mt-tab-item id="square">
            <img v-if="tabSelect === 'square'" src="./assets/t-广场.png" alt="" slot="icon">
            <img v-else src="./assets/t-广场(1).png" alt="" slot="icon">
            <p>广场</p>
          </mt-tab-item>
          <mt-tab-item id="mine">
            <img v-if="tabSelect === 'mine'" src="./assets/t-我的.png" alt="" slot="icon">
            <img v-else src="./assets/t-我的(1).png" alt="" slot="icon">
            <p>我的</p>
          </mt-tab-item>
        </mt-tabbar>
      </template>
    </template>
  </div>
</template>

<script>
import storageUtil from '@/util/storageUtil.js'
import Mine from '@/tabViews/Mine/index.vue'
import Index from '@/tabViews/Index/index.vue'
import Fund from '@/tabViews/Fund/index.vue'
import ConfigCenter from '@/tabViews/ConfigCenter/index.vue'
import Square from '@/tabViews/Square/index.vue'

export default {
  name: 'App',
  data () {
    return {
      subPath: false,
      ifChecked: false
    }
  },
  watch: {
  },
  computed: {
    tabSelect: {
      get () {
        return this.$store.state.tabSelect
      },
      set (val) {
        storageUtil.setData('appConfig', 'homeTabSelect', val)
        this.$store.dispatch('setTabSelect', val)
      }
    }
  },
  components: {Index, Mine, Fund, ConfigCenter, Square},
  created () {
    this.initPage()
  },
  methods: {
    initPage () {
      this.checkLogin()
    },
    checkLogin () {
      const token = localStorage.getItem('token') || ''
      this.$http.get('auth/checkLogin', {token}).then((data) => {
        window._token = data.data.token
        if (data.data.isLogin === false) {
          storageUtil.setData('userInfo', {
            isLogin: false
          })
          this.ifChecked = true
          this.$router.push('/page/login')
        } else {
          this.$http.get('user/getUserAccountInfo').then((res) => {
            storageUtil.setData('userAccountInfo', {
              ...res.data.user,
              positionConfig: res.data.positionConfig
            })
            this.$store.commit('updateUserFundAccountInfo', res.data)
            this.otherDataInit().then(() => {
              this.ifChecked = true
            })
          })
          storageUtil.setData('userInfo', {
            ...data.data,
            isLogin: true
          })
        }
      })
      this.$router.beforeEach((transition, from, next) => {
        this.checkSubPath(transition.path)
        next()
      })
      // after只有真正进入了页面才会执行
      this.$router.afterEach((transition) => {
        this.checkSubPath(transition.path)
      })
    },
    checkSubPath (path) {
      this.subPath = path !== '/'
    },
    checkAuthPath (current) {
      const now = current || this.$router.history.current
      // 需要鉴权的才转登录
      return now.meta && now.meta.auth === true
    },
    checkPermissionPath (current) {
      const now = current || this.$router.history.current
      // 需要鉴权的才转登录
      return now.meta && now.meta.roles
    },
    checkIn (userRoles, roleList) {
      for (let i = 0; i < userRoles.length; i++) {
        const userRole = userRoles[i]
        for (let j = 0; j < userRoles.length; j++) {
          const roleItem = roleList[j]
          if (roleItem === userRole) {
            return true
          }
        }
      }
    },
    checkPermission (userRoles, roleMap) {
      // roles :{include, exclude}
      if (roleMap) {
        let permission = true
        const include = roleMap.include
        const exclude = roleMap.exclude
        // 存在于include
        if (include) {
          permission = this.checkIn(userRoles, include)
        }
        // 存在于exclude
        if (exclude && this.checkIn(userRoles, exclude)) {
          permission = false
        }
        // exclude有决定权
        return permission
      } else {
        // 没有权限要求
        return true
      }
    },
    checkUser (user, transition) {
      if (user.isLogin !== true) {
        this.$router.push('/page/login')
      } else {
        const roles = this.checkPermissionPath(transition)
        if (roles) {
          if (!this.checkPermission(user.roles, roles)) {
            // 替换为404
            this.$router.replace('/noPermission')
          }
        }
      }
    },
    otherDataInit () {
      return Promise.all([
        this.$http.get('stock/getStockIndexAll').then((res) => {
          this.$store.commit('updateStockIndexAll', res.data)
          const data = {}
          const yearAverage = {}
          const status = {}
          const noSellStatus = {}
          const quarterHot = {}
          const z45 = {}
          const recentStatus = {}
          const oneDeep = {}
          const targetUpClose = {}
          const targetDownClose = {}
          res.data.forEach((item) => {
            data[item.key] = item.flag || '正常'
            status[item.key] = item.status || '正常'
            noSellStatus[item.key] = item.no_sell_status || '正常'
            quarterHot[item.key] = item.danger || '关闭'
            z45[item.key] = item.z45 || '关闭'
            yearAverage[item.key] = item.year_average
            targetUpClose[item.key] = item.target_up_close || 0
            targetDownClose[item.key] = item.target_down_close || 0
            recentStatus[item.key] = item.recent_status || '正常'
            oneDeep[item.key] = item.one_deep || '否'
          })
          storageUtil.setData('stockIndexFlag', data)
          storageUtil.setData('stockIndexStatus', status)
          storageUtil.setData('stockIndexNoSellStatus', noSellStatus)
          storageUtil.setData('stockIndexQuarterHot', quarterHot)
          storageUtil.setData('stockIndexZ45', z45)
          storageUtil.setData('yearAverageIndex', yearAverage)
          storageUtil.setData('stockIndexTargetUpClose', targetUpClose)
          storageUtil.setData('stockIndexTargetDownClose', targetDownClose)
          storageUtil.setData('stockIndexRecentStatus', recentStatus)
          storageUtil.setData('stockIndexOneDeep', oneDeep)
        }),
        this.$http.get('stock/getStockMarketQuestion').then((res) => {
          const data = {}
          res.data.forEach((item) => {
            data[item.key] = item.value
          })
          storageUtil.setData('stockMarketQuestion', data)
        })
      ])
    }
  }
}
</script>

<style>

</style>
