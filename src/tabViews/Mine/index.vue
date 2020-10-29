<template>
  <div class="tab-view-mine has-bar">
    <div class="info-wrap">
      <div class="user-img-wrap">
        <img src="../../assets/app-icon.png" alt="">
      </div>
    </div>
    <div class="my-info-wrap simple large">
      <mt-cell-swipe :to="'/page/myFund'" is-link>
        <div slot="title">
          <h3><i class="fab fa-shirtsinbulk"></i>我的持仓</h3>
        </div>
      </mt-cell-swipe>
      <mt-cell-swipe :to="'/page/myProportion'" is-link>
        <div slot="title">
          <h3><i class="fas fa-chart-pie"></i>持仓数据</h3>
        </div>
      </mt-cell-swipe>
      <mt-cell-swipe :to="'/page/myNetValueLine'" is-link>
        <div slot="title">
          <h3><i class="fas fa-chart-area"></i>净值管理</h3>
        </div>
      </mt-cell-swipe>
      <mt-cell-swipe :to="'/page/incomeAll'" is-link>
        <div slot="title">
          <h3><i class="fas fa-hand-holding-usd"></i>总收益</h3>
        </div>
      </mt-cell-swipe>
      <mt-cell-swipe :to="'/page/countIncome'" is-link>
        <div slot="title">
          <h3><i class="fas fa-hand-holding-usd"></i>预期收益</h3>
        </div>
      </mt-cell-swipe>
      <mt-cell-swipe :to="'/page/ast'" is-link>
        <div slot="title">
          <h3><i class="fas fa-hand-holding-usd"></i>个人助理</h3>
        </div>
      </mt-cell-swipe>
    </div>
    <div class="btn-wrap">
      <mt-button type="primary" @click="okHandler" class="main-btn">退出登录</mt-button>
    </div>
  </div>
</template>

<script>
import Toast from '@/common/toast.js'
import { mapGetters } from 'vuex'

export default {
  name: 'Mine',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'userFundAccountInfo'
    ])
  },
  created () {
    this.initPage()
  },
  methods: {
    initPage () {
    },
    okHandler () {
      this.$http.get('auth/logout', {token: window._token}).then((data) => {
        if (data.success) {
          localStorage.removeItem('token')
          this.$router.push('/page/login')
          location.reload()
        } else {
          Toast.error('操作失败')
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
