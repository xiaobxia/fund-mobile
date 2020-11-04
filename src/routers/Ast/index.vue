<template>
  <div class="page-manual">
    <mt-header title="助理" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-button :disabled="!(isUp || isDown)" type="primary" @click="xiaban" class="main-btn">
        <span v-if="isUp">上班打卡</span>
        <span v-else-if="isDown">下班打卡</span>
        <span v-else>禁</span>
      </mt-button>
      <mt-button type="primary" @click="xiabanSch" class="main-btn cc">
        <span>定时上班打卡</span>
      </mt-button>
      <mt-button type="primary" @click="quxiaoDingshi" class="main-btn cc">
        <span>取消定时</span>
      </mt-button>
    </div>
  </div>
</template>

<script>
import {Indicator} from 'mint-ui'

export default {
  name: 'Ast',
  data () {
    return {
    }
  },
  computed: {
    isUp () {
      const d = this.getDate()
      const hour = d.getHours()
      const minute = d.getMinutes()
      if (hour < 9 || (hour === 9 && minute <= 30)) {
        return true
      }
      return false
    },
    isDown () {
      const d = this.getDate()
      const hour = d.getHours()
      if (hour >= 18) {
        return true
      }
      return false
    }
  },
  watch: {
  },
  created () {
  },
  methods: {
    backHandler () {
      this.$router.history.go(-1)
    },
    xiaban () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('http://47.98.140.76:3031/daka/xiaban').then(() => {
        Indicator.close()
      })
    },
    xiabanSch () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('http://47.98.140.76:3031/daka/xiabanSchedule').then((res) => {
        Indicator.close()
        alert(res.data)
      })
    },
    quxiaoDingshi () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('http://47.98.140.76:3031/daka/quXiaoDingShi').then(() => {
        Indicator.close()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .main-body {
    padding: 50px 20px 0 20px;
  }
  .cc {
    margin-top: 20px;
  }
</style>
