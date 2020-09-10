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
      <div class="warn-wrap">
        <div class="fm-warn blue">没预兆直接闷的时候，可以在反弹时选择不卖</div>
      </div>
      <div class="bottom-bar">
        <div class="to">
          <mt-button type="primary" @click="clearHandler" class="main-btn">清除本地存储数据</mt-button>
        </div>
        <mt-button type="primary" @click="copyData" class="main-btn">备份数据</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from '@/common/toast.js'
import storageUtil from '@/util/storageUtil.js'
import {Indicator} from 'mint-ui'

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
    },
    copyData () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      Promise.all([
        this.$http.get('http://47.92.210.171:3050/copyFundData/fund/copyUserFund'),
        this.$http.get('http://47.92.210.171:3050/copyFundData/fund/copyUserNetValue')
      ]).then(() => {
        Indicator.close()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .to {
    margin-bottom: 60px;
  }
</style>
