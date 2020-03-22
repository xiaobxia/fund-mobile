<template>
  <div>
    <div class="has-bar">
      <div class="img-card" @click="toPath('/page/schedule')">
        <div class="container">
          <div class="content">
            <img src="../../assets/定时.png" alt="">
          </div>
          <div class="bottom">定时任务</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/dataConfig')">
        <div class="container">
          <div class="content">
            <img src="../../assets/数据.png" alt="">
          </div>
          <div class="bottom">数据配置</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/principle')">
        <div class="container">
          <div class="content">
            <img src="../../assets/保险条款.png" alt="">
          </div>
          <div class="bottom">买卖原则</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/myAsset')">
        <div class="container">
          <div class="content">
            <img src="../../assets/资产管理.png" alt="">
          </div>
          <div class="bottom">资产管理</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/manual')">
        <div class="container">
          <div class="content">
            <img src="../../assets/手动更新.png" alt="">
          </div>
          <div class="bottom">手动更新</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/positionConfig')">
        <div class="container">
          <div class="content">
            <img src="../../assets/仓位.png" alt="">
          </div>
          <div class="bottom">仓位配置</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/daV')">
        <div class="container">
          <div class="content">
            <img src="../../assets/大V.png" alt="">
          </div>
          <div class="bottom">大V观点</div>
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
  created () {
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
