<template>
  <div>
    <div class="has-bar">
      <div class="img-card" @click="toPath('/page/search')">
        <div class="container">
          <div class="content">
            <img src="../../assets/搜索.png" alt="">
            <!--<i class="fas fa-book"></i>-->
          </div>
          <div class="bottom">搜索</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/addFund')">
        <div class="container">
          <div class="content">
            <img src="../../assets/添加.png" alt="">
            <!--<i class="fas fa-book"></i>-->
          </div>
          <div class="bottom">添加</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Square',
  data () {
    return {}
  },
  mounted () {
    this.initPage()
  },

  methods: {
    initPage () {

    },
    toPath (path) {
      this.$router.push(path)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .content-body {
    padding: 30px;
  }
</style>
