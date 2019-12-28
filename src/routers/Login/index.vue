<template>
  <div class="page-login">
    <div class="app-icon">
      <img src="../../assets/app-icon.png" alt="">
    </div>
    <div class="input-item">
      <input type="text" v-model="account">
    </div>
    <div class="input-item">
      <input type="text" v-model="password">
    </div>
    <div class="input-item">
      <mt-button type="primary" @click="loginHandler">登录</mt-button>
    </div>
  </div>
</template>

<script>
import md5 from 'md5'
import storageUtil from '@/util/storageUtil.js'
import Toast from '@/common/toast.js'

export default {
  name: 'Login',
  data () {
    return {
      account: '',
      password: ''
    }
  },
  computed: {},
  created () {
    this.initPage()
  },
  methods: {
    initPage () {
    },
    loginHandler () {
      this.$http.post('auth/login', {account: this.account, password: md5(this.password), platform: 'pc'}).then((data) => {
        if (data.success) {
          window._token = data.data.token
          localStorage.setItem('token', data.data.token)
          this.$router.push('/')
          storageUtil.setData('userInfo', {
            ...data.data,
            isLogin: true
          })
          Toast.success('登录成功')
        } else {
          Toast.error(data.message)
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-icon {
    position: relative;
    margin: auto;
    height: 120px;
    width: 120px;
    border-radius: 120px;
    overflow: hidden;
    margin-bottom: 100px;
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
