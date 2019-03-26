<template>
  <div class="my-fund-add">
    <mt-header title="仓位配置" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
        <mt-field label="仓位" placeholder="请输入" v-model="position"></mt-field>
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
  name: 'PositionConfig',
  data () {
    const userFundAccountInfo = storageUtil.getUserFundAccountInfo()
    return {
      position: userFundAccountInfo.position_config || 100
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
      this.$http.post('market/updatePositionConfig', {
        position: this.position
      }).then((data) => {
        if (data.success) {
          Toast.success('操作成功')
        } else {
          Toast.error('操作失败')
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
