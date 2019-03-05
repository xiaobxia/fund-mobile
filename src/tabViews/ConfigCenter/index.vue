<template>
  <div>
    <div class="has-bar">
      <div class="img-card" @click="toPath('/page/schedule')">
        <!--<img src="../../assets/timg.jpg" alt="">-->
        <div class="container">
          <div class="content">
            <img src="../../assets/定时.png" alt="">
            <!--<i class="far fa-calendar-alt"></i>-->
          </div>
          <div class="bottom">定时任务</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/dataConfig')">
        <div class="container">
          <div class="content">
            <img src="../../assets/数据.png" alt="">
            <!--<i class="fas fa-database"></i>-->
          </div>
          <div class="bottom">数据配置</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/principle')">
        <div class="container">
          <div class="content">
            <img src="../../assets/保险条款.png" alt="">
            <!--<i class="fas fa-book"></i>-->
          </div>
          <div class="bottom">买卖原则</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/myAsset')">
        <div class="container">
          <div class="content">
            <img src="../../assets/资产管理.png" alt="">
            <!--<i class="fas fa-book"></i>-->
          </div>
          <div class="bottom">资产管理</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/goodBad')">
        <div class="container">
          <div class="content">
            <img src="../../assets/雷暴.png" alt="">
            <!--<i class="fas fa-book"></i>-->
          </div>
          <div class="bottom">利好利空</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/indexAttitude')">
        <div class="container">
          <div class="content">
            <img src="../../assets/笑脸表情.png" alt="">
            <!--<i class="fas fa-book"></i>-->
          </div>
          <div class="bottom">指数态度</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/manual')">
        <div class="container">
          <div class="content">
            <img src="../../assets/手动更新.png" alt="">
            <!--<i class="fas fa-book"></i>-->
          </div>
          <div class="bottom">手动更新</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/positionConfig')">
        <div class="container">
          <div class="content">
            <img src="../../assets/仓位.png" alt="">
            <!--<i class="fas fa-book"></i>-->
          </div>
          <div class="bottom">仓位配置</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfigCenter',
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
