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
import Toast from '@/common/toast.js'
import { mapGetters } from 'vuex'

export default {
  name: 'PositionConfig',
  data () {
    return {
      position: 100
    }
  },
  computed: {
    ...mapGetters([
      'userFundAccountInfo'
    ])
  },
  watch: {
  },
  created () {
    this.position = this.userFundAccountInfo.positionConfig
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
      this.$http.post('stock/updatePositionConfig', {
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
