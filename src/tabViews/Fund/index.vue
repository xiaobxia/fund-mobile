<template>
  <div>
    <div class="has-bar">
      <div class="img-card" @click="toPath('/page/averageYearIndex')">
        <div class="container">
          <div class="content">
            <img src="../../assets/阴.png" alt="">
          </div>
          <div class="bottom">年线策略</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/averageHalfYearIndex')">
        <div class="container">
          <div class="content">
            <img src="../../assets/相对标准偏差.png" alt="">
          </div>
          <div class="bottom">半年线策略</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/averageQuarterIndex')">
        <div class="container">
          <div class="content">
            <img src="../../assets/季度线.png" alt="">
          </div>
          <div class="bottom">季度线</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/averageMonthIndex')">
        <div class="container">
          <div class="content">
            <img src="../../assets/均值.png" alt="">
          </div>
          <div class="bottom">月线策略</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/averageIndex')">
        <div class="container">
          <div class="content">
            <img src="../../assets/均线买卖.png" alt="">
          </div>
          <div class="bottom">均线策略</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/manyDown')">
        <div class="container">
          <div class="content">
            <img src="../../assets/阴.png" alt="">
          </div>
          <div class="bottom">多阴策略</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/yearIncome')">
        <div class="container">
          <div class="content">
            <img src="../../assets/全年无休.png" alt="">
          </div>
          <div class="bottom">指数年收益</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/monthIncome')">
        <div class="container">
          <div class="content">
            <img src="../../assets/收益期.png" alt="">
          </div>
          <div class="bottom">指数月收益</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/fixedInvestment')">
        <div class="container">
          <div class="content">
            <img src="../../assets/投币.png" alt="">
          </div>
          <div class="bottom">定投策略</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/todayIndex')">
        <div class="container">
          <div class="content">
            <img src="../../assets/今日.png" alt="">
          </div>
          <div class="bottom">今日指数</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/operatingInfo?type=jian')">
        <div class="container">
          <div class="content">
            <img src="../../assets/卖出记录.png" alt="">
          </div>
          <div class="bottom">操作分析-简</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/operatingInfo?type=xiong')">
        <div class="container">
          <div class="content">
            <img src="../../assets/熊市.png" alt="">
          </div>
          <div class="bottom">操作分析-熊</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/daysIncome')">
        <div class="container">
          <div class="content">
            <img src="../../assets/策略-选中.png" alt="">
          </div>
          <div class="bottom">近期涨幅</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/average30Index')">
        <div class="container">
          <div class="content">
            <img src="../../assets/线.png" alt="">
          </div>
          <div class="bottom">30日线</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/quarterYearIndex')">
        <div class="container">
          <div class="content">
            <img src="../../assets/季度报告.png" alt="">
          </div>
          <div class="bottom">季度年线</div>
        </div>
      </div>
      <div class="img-card" @click="toPath('/page/averageIndexSort')">
        <div class="container">
          <div class="content">
            <img src="../../assets/组合.png" alt="">
          </div>
          <div class="bottom">均线排序</div>
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
