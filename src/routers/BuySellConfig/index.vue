<template>
  <div class="my-fund-add">
    <mt-header title="买卖配置" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-radio
        align="right"
        v-model="fake"
        :options="['真', '假']">
      </mt-radio>
      <mt-field label="假资产" placeholder="请输入" v-model="fakeAsset"></mt-field>
      <div class="bottom-bar">
        <mt-button type="primary" @click="okHandler" class="main-btn">完成</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import storageUtil from '@/util/storageUtil.js'
import Toast from '@/common/toast.js'

export default {
  name: 'BuySellConfig',
  data () {
    const fake = storageUtil.getAppConfig('fake')
    const fakeAsset = storageUtil.getAppConfig('fakeAsset')
    return {
      fake: fake || '真',
      fakeAsset: fakeAsset || 0
    }
  },
  computed: {},
  watch: {
    fake (val) {
      storageUtil.setAppConfig('fake', val)
    }
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
    okHandler () {
      storageUtil.setAppConfig('fakeAsset', this.fakeAsset)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
