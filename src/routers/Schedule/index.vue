<template>
  <div>
    <mt-header title="定时任务" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body has-bar simple">
      <mt-cell-swipe v-for="(item) in scheduleList" :key="item._id">
        <div slot="title">
          <h3>{{item.name}}</h3>
          <p class="explain">{{item.describe}}</p>
        </div>
        <div class="right-wrap">
          <mt-switch v-model="item.open" @change="stateChangeHandler(item.name)"></mt-switch>
        </div>
      </mt-cell-swipe>
    </div>
  </div>
</template>

<script>
import { Indicator } from 'mint-ui'
export default {
  name: 'Schedule',
  data () {
    return {
      scheduleList: []
    }
  },
  mounted () {
    this.initPage()
  },
  methods: {
    initPage () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('schedule/all').then((data) => {
        Indicator.close()
        let list = data.data.list
        this.scheduleList = list
      })
    },
    stateChangeHandler (name) {
      const item = this.scheduleList.find((item) => {
        return item.name === name
      })
      this.$http.post('schedule/changeStatus', {
        name: item.name,
        open: item.open ? 'open' : 'close'
      }).then((data) => {
        if (data.success) {
          this.initPage()
        }
        return data
      })
    },
    backHandler () {
      this.$router.history.go(-1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
