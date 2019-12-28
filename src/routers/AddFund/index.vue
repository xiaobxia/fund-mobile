<template>
  <div class="my-netValue-add">
    <mt-header title="添加" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-field label="代码" placeholder="请输入代码" v-model="code"></mt-field>
    </div>
    <div class="bottom-bar">
      <mt-button type="primary" @click="okHandler" class="main-btn">完成</mt-button>
    </div>
  </div>
</template>

<script>
import {MessageBox} from 'mint-ui'
import Toast from '@/common/toast.js'

export default {
  name: 'AddFund',
  data () {
    return {
      code: ''
    }
  },
  computed: {},
  created () {
  },
  methods: {
    backHandler () {
      this.$router.history.go(-1)
    },
    okHandler () {
      this.$http.post('fund/addFund', {
        code: this.code
      }).then((data) => {
        if (data.success) {
          Toast.success('操作成功')
          this.$router.history.go(-1)
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
