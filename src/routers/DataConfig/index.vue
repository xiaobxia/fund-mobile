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
        v-model="dataWay"
        :options="['中金', '东方', '腾讯', '雪球']">
      </mt-radio>
      <mt-button type="primary" @click="clearHandler" class="main-btn">清除本地存储数据</mt-button>
    </div>
  </div>
</template>

<script>
import Toast from '@/common/toast.js'
import storageUtil from '@/util/storageUtil.js'

export default {
  name: 'DataConfig',
  data () {
    const dataWay = storageUtil.getAppConfig('dataWay') || '腾讯'
    return {
      dataWay: dataWay
    }
  },
  watch: {
    dataWay (val) {
      storageUtil.setAppConfig('dataWay', val)
    }
  },
  mounted () {
  },
  methods: {
    backHandler () {
      this.$router.history.go(-1)
    },
    clearHandler () {
      localStorage.clear()
      Toast.success('操作成功')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .main-btn {
    position: absolute;
    bottom: 20px;
  }
</style>
