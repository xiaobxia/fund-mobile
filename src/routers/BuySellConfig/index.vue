<template>
  <div class="my-fund-add">
    <mt-header title="买卖配置" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-field label="买比例" placeholder="请输入" v-model="buy"></mt-field>
      <mt-field label="卖比例" placeholder="请输入" v-model="sell"></mt-field>
    </div>
    <div class="bottom-bar">
      <mt-button type="primary" @click="okHandler" class="main-btn">完成</mt-button>
    </div>
  </div>
</template>

<script>
import storageUtil from '@/util/storageUtil.js'
import Toast from '@/common/toast.js'

export default {
  name: 'BuySellConfig',
  data () {
    const buy = storageUtil.getAppConfig('buy')
    const sell = storageUtil.getAppConfig('sell')
    return {
      buy: buy || 1,
      sell: sell || 1
    }
  },
  computed: {},
  watch: {
  },
  mounted () {
    this.initPage()
  },
  methods: {
    initPage () {
    },
    backHandler () {
      this.$router.history.go(-1)
    },
    toast (data) {
      if (data.success) {
        Toast.success('操作成功')
        this.$router.history.go(-1)
      } else {
        Toast.error('操作失败')
      }
    },
    okHandler () {
      storageUtil.setAppConfig('sell', this.sell)
      storageUtil.setAppConfig('buy', this.buy)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
