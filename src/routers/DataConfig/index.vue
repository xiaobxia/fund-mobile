<template>
  <div>
    <mt-header title="数据配置" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-radio
        align="right"
        v-model="stockApiWay"
        :options="['东方', '腾讯', '雪球']">
      </mt-radio>
      <div class="bottom-bar">
        <mt-button type="primary" @click="clearHandler" class="main-btn">清除本地存储数据</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from '@/common/toast.js'
import storageUtil from '@/util/storageUtil.js'

export default {
  name: 'DataConfig',
  data () {
    const stockApiWay = storageUtil.getData('appConfig', 'stockApiWay') || '腾讯'
    return {
      stockApiWay
    }
  },
  watch: {
    stockApiWay (val) {
      storageUtil.setData('appConfig', 'stockApiWay', val)
    }
  },
  created () {
  },
  methods: {
    backHandler () {
      this.$router.history.go(-1)
    },
    clearHandler () {
      localStorage.clear()
      Toast.success('操作成功')
      setTimeout(() => {
        location.reload()
      }, 1000)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
