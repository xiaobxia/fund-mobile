<template>
  <div>
    <div class="has-bar">
      <div class="img-card" @click="toPath('/page/fixedInvestment')">
        <!--<img src="../../assets/timg.jpg" alt="">-->
        <div class="container">
          <div class="content">
            <img src="../../assets/投币.png" alt="">
            <!--<i class="fas fa-allergies"></i>-->
          </div>
          <div class="bottom">定投策略</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/market')">
        <div class="container">
          <div class="content">
            <img src="../../assets/行情.png" alt="">
            <!--<i class="fab fa-cloudversify"></i>-->
          </div>
          <div class="bottom">市场行情</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/operatingInfo?type=jian')">
        <!--<img src="../../assets/timg.jpg" alt="">-->
        <div class="container">
          <div class="content">
            <img src="../../assets/卖出记录.png" alt="">
            <!--<i class="fas fa-allergies"></i>-->
          </div>
          <div class="bottom">操作分析-简</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/operatingInfo?type=xiong')">
        <!--<img src="../../assets/timg.jpg" alt="">-->
        <div class="container">
          <div class="content">
            <img src="../../assets/熊市.png" alt="">
            <!--<i class="fas fa-allergies"></i>-->
          </div>
          <div class="bottom">操作分析-熊</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/changeMarket')">
        <!--<img src="../../assets/800_600_dribbble_icons.jpg" alt="">-->
        <div class="container">
          <div class="content">
            <img src="../../assets/变脸.png" alt="">
            <!--<i class="fab fa-sellsy"></i>-->
          </div>
          <div class="bottom">变盘策略</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/todayIndex')">
        <div class="container">
          <div class="content">
            <img src="../../assets/今日.png" alt="">
            <!--<i class="fab fa-cloudversify"></i>-->
          </div>
          <div class="bottom">今日指数</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/averageIndex')">
        <!--<img src="../../assets/800_600_dribbble_icons.jpg" alt="">-->
        <div class="container">
          <div class="content">
            <img src="../../assets/均线买卖.png" alt="">
            <!--<i class="fas fa-balance-scale"></i>-->
          </div>
          <div class="bottom">均线策略</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/indexDifference')">
        <!--<img src="../../assets/800_600_dribbble_icons.jpg" alt="">-->
        <div class="container">
          <div class="content">
            <img src="../../assets/相对标准偏差.png" alt="">
            <!--<i class="fab fa-sellsy"></i>-->
          </div>
          <div class="bottom">差价策略</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/monthIncome')">
        <!--<img src="../../assets/800_600_dribbble_icons.jpg" alt="">-->
        <div class="container">
          <div class="content">
            <img src="../../assets/收益期.png" alt="">
            <!--<i class="fab fa-sellsy"></i>-->
          </div>
          <div class="bottom">指数月收益</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/yearIncome')">
        <!--<img src="../../assets/800_600_dribbble_icons.jpg" alt="">-->
        <div class="container">
          <div class="content">
            <img src="../../assets/全年无休.png" alt="">
            <!--<i class="fab fa-sellsy"></i>-->
          </div>
          <div class="bottom">指数年收益</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Fund',
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
