<template>
  <div class="my-asset">
    <mt-header title="预期收益" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-field label="本金" placeholder="请输入" v-model="form.benjin"></mt-field>
      <mt-field label="年收益率" placeholder="请输入" v-model="form.nianshouyilv"></mt-field>
      <mt-field label="收入" placeholder="请输入" v-model="form.shouru"></mt-field>
      <mt-field label="定投收益率" placeholder="请输入" v-model="form.dingtoushouyilv"></mt-field>
      <mt-field label="其他增量" placeholder="请输入" v-model="form.zengliang"></mt-field>
      <mt-button type="primary" @click="okHandler" class="main-btn">计算</mt-button>
      <div style="position: absolute">
        <div
          v-for="(item, index) in list"
          :key="index"
        >
          <span>第{{index+1}}年：{{parseInt(item)}}，增加：{{parseInt(item - (list[index-1]|| form.benjin))}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CountIncome',
  data () {
    return {
      form: {
        benjin: '',
        nianshouyilv: '',
        shouru: '',
        dingtoushouyilv: '',
        zengliang: ''
      },
      list: []
    }
  },
  computed: {
    ...mapGetters([
    ])
  },
  watch: {
  },
  created () {
  },
  methods: {
    initPage () {
    },
    toPath (path) {
      this.$router.push(path)
    },
    backHandler () {
      this.$router.history.go(-1)
    },
    baseCount (benjinRaw) {
      const benjin = parseFloat(benjinRaw || this.form.benjin) || 0
      const nianshouyilv = parseFloat(this.form.nianshouyilv) || 1
      const shouru = parseFloat(this.form.shouru) || 0
      const dingtoushouyilv = parseFloat(this.form.dingtoushouyilv) || 1
      const zengliang = parseFloat(this.form.zengliang) || 0
      return (benjin * nianshouyilv) + (shouru * dingtoushouyilv) + zengliang
    },
    okHandler () {
      let last = this.baseCount()
      let list = [last]
      for (let i = 1; i < 20; i++) {
        last = this.baseCount(last)
        list.push(last)
      }
      this.list = list
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
