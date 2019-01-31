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
            <img src="./assets/fund.png" alt="" slot="icon">
            <!--<i class="fas fa-donate" slot="icon"></i>-->
            <p>基金</p>
          </mt-tab-item>
          <mt-tab-item id="configCenter">
            <img src="./assets/config.png" alt="" slot="icon">
            <!--<i class="fas fa-cogs" slot="icon"></i>-->
            <p>配置</p>
          </mt-tab-item>
          <mt-tab-item id="square">
            <img src="./assets/find.png" alt="" slot="icon">
            <!--<i class="far fa-compass" slot="icon"></i>-->
            <p>广场</p>
          </mt-tab-item>
          <mt-tab-item id="mine">
            <img src="./assets/my.png" alt="" slot="icon">
            <!--<i class="far fa-user" slot="icon"></i>-->
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
    tabSelect (val) {

    }
  },
  computed: {
    tabSelect: {
      get () {
        return this.$store.state.tabSelect
      },
      set (val) {
        storageUtil.setAppConfig('homeTabSelect', val)
        this.$store.dispatch('setTabSelect', val)
      }
    }
  },
  components: {Index, Mine, Fund, ConfigCenter, Square},
  mounted () {
    this.initPage()
    setInterval(() => {
      storageUtil.clearQueryCache()
    }, 1000 * 60 * 5)
  },
  methods: {
    initPage () {
      this.checkLogin()
      this.checkSubPath(this.$router.history.current.path)
      // 刷新的时候before和after都不会执行
      this.$router.beforeEach((transition, from, next) => {
        if (this.checkAuthPath(transition)) {
          const user = storageUtil.getUserInfo()
          this.checkUser(user, transition)
        }
        this.checkSubPath(transition.path)
        next()
      })
      // after只有真正进入了页面才会执行
      this.$router.afterEach((transition) => {
        // 验证路由过去是否需要登录状态
        if (this.checkAuthPath(transition)) {
          const user = storageUtil.getUserInfo()
          this.checkUser(user, transition)
        }
        this.checkSubPath(transition.path)
      })
    },
    checkLogin () {
      const token = localStorage.getItem('token') || ''
      this.$http.get('auth/checkLogin', {token}).then((data) => {
        window._token = data.data.token
        if (data.data.isLogin === false) {
          storageUtil.initUserInfo({
            isLogin: false
          })
          const user = storageUtil.getUserInfo()
          this.ifChecked = true
          if (user.isLogin !== true) {
            this.$router.push('/page/login')
          }
        } else {
          this.$http.get('userFund/getUserFundAccountInfo').then((res) => {
            storageUtil.initUserFundAccountInfo(res.data)
            this.ifChecked = true
            this.otherDataInit()
          })
          storageUtil.initUserInfo({
            ...data.data,
            isLogin: true
          })
        }
      })
    },
    checkSubPath (path) {
      this.subPath = path !== '/'
      // this.subPath = path.startsWith('/page')
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
      this.$http.get('market/getIndexAttitude').then((res) => {
        let list = res.data
        list.map((item) => {
          storageUtil.setIndexAttitude(item.key, item.value)
        })
      })
      this.$http.get('market/getMarketQuestion').then((res) => {
        let list = res.data
        list.map((item) => {
          storageUtil.setMarketStatus(item.key, item.value)
        })
      })
    }
  }
}
</script>

<style>

</style>
