<template>
  <div class="fund-detail">
    <mt-header :title="currentFund.name" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
      <mt-button slot="right">
        <i class="far fa-edit" v-if="ifHas" @click="toEditHandler"></i>
        <i class="fas fa-plus" v-else @click="toAddHandler"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div class="detail-info-wrap">
        <span class="item"><span class="label">基金代码：</span><span class="value">{{currentFund.code}}</span></span>
        <span class="item"><span class="label">基金净值：</span><span class="value">{{currentFund.net_value}}</span></span>
        <span class="item"><span class="label">估算净值：</span><span class="value">{{currentFund.valuation}}</span></span>
        <span class="item"><span class="label">估算涨幅：</span><span :class="['value', stockNumberClass(currentFund.change_ratio)]">{{currentFund.change_ratio}}%</span></span>
        <template v-if="ifHas">
          <span class="item"><span class="label">持仓金额：</span><span class="value">{{parseInt(sum || 0)}}</span></span>
          <span class="item"><span class="label">持仓份额：</span><span class="value">{{parseInt(shares || 0)}}</span></span>
          <span class="item"><span class="label">可卖金额：</span><span class="value">{{parseInt(canSellInfo.valuationSum || 0)}}</span></span>
          <span class="item"><span class="label">可卖份额：</span><span class="value">{{parseInt(canSellInfo.shares || 0)}}</span></span>
        </template>
        <div class="ct"><span class="label">估值时间：</span><span class="value">{{formatDate(currentFund.valuation_date)}}</span></div>
        <div class="page-content-title">主题</div>
        <div class="filter-select-wrap">
          <span class="name">{{filterTheme}}</span>
          <mt-button class="select-btn" type="primary" @click="themeChangeHandler">改变</mt-button>
        </div>
        <div  v-if="ifHas">
          <div class="page-content-title">份额计算</div>
          <div>
            <mt-field label="金额" placeholder="请输入" v-model="sellMoney"></mt-field>
            <mt-field label="份额" placeholder="请输入" :disabled="true" v-model="sellShare"></mt-field>
          </div>
          <div class="page-content-title">比例表</div>
          <div class="shares-list-wrap">
            <div>
                <span class="item">
                  <span class="label">份额：</span>
                 <span class="value">{{parseInt((shares || 0)/15)}}</span>
                </span>
              <span class="item">
                  <span class="label">比例：</span>
                  <span class="value">1/15</span>
                </span>
            </div>
            <div>
                <span class="item">
                  <span class="label">份额：</span>
                 <span class="value">{{parseInt((shares || 0)/12)}}</span>
                </span>
              <span class="item">
                  <span class="label">比例：</span>
                  <span class="value">1/12</span>
                </span>
            </div>
            <div>
                <span class="item">
                  <span class="label">份额：</span>
                 <span class="value">{{parseInt((shares || 0)/10)}}</span>
                </span>
              <span class="item">
                  <span class="label">比例：</span>
                  <span class="value">1/10</span>
                </span>
            </div>
            <div>
                <span class="item">
                  <span class="label">份额：</span>
                 <span class="value">{{parseInt((shares || 0)/6)}}</span>
                </span>
              <span class="item">
                  <span class="label">比例：</span>
                  <span class="value">1/6</span>
                </span>
            </div>
            <div>
                <span class="item">
                  <span class="label">份额：</span>
                  <span class="value">{{parseInt((shares || 0)/4)}}</span>
                </span>
              <span class="item">
                  <span class="label">比例：</span>
                  <span class="value">1/4</span>
                </span>
            </div>
            <div>
                <span class="item">
                  <span class="label">份额：</span>
                  <span class="value">{{parseInt((shares || 0) * 0.3)}}</span>
                </span>
              <span class="item">
                  <span class="label">比例：</span>
                  <span class="value">3/10</span>
                </span>
            </div>
            <div>
                <span class="item">
                  <span class="label">份额：</span>
                  <span class="value">{{parseInt((shares || 0)/3)}}</span>
                </span>
              <span class="item">
                  <span class="label">比例：</span>
                  <span class="value">1/3</span>
                </span>
            </div>
            <div>
                <span class="item">
                  <span class="label">份额：</span>
                  <span class="value">{{parseInt((shares || 0)/2)}}</span>
                </span>
              <span class="item">
                  <span class="label">比例：</span>
                  <span class="value">1/2</span>
                </span>
            </div>
            <div>
                <span class="item">
                  <span class="label">份额：</span>
                  <span class="value">{{parseInt((shares || 0) * 2 / 3)}}</span>
                </span>
              <span class="item">
                  <span class="label">比例：</span>
                  <span class="value">2/3</span>
                </span>
            </div>
          </div>
          <div class="page-content-title">份额表</div>
          <div class="shares-list-wrap">
            <div v-for="(item, index) in countSharesListByMoney(canSellInfo.shares)" :key="index">
              <div>
                <span class="item">
                  <span class="label">份额：</span>
                  <span class="value">{{item.shares}}</span>
                </span>
                <span class="item">
                  <span class="label">金额：</span>
                  <span class="value">{{item.sum}}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <mt-button type="primary" @click="updateFund" class="main-btn">更新基金</mt-button>
    </div>
    <mt-popup
      v-model="popupVisible"
      position="bottom">
      <ul class="filter-select-list">
        <li class="filter-select-item" v-for="(item) in filterList" :key="item.code" @click="onThemeChangeHandler(item.value)">{{item.name}}</li>
      </ul>
    </mt-popup>
  </div>
</template>

<script>
import fundAccountUtil from '@/util/fundAccountUtil.js'
import moment from 'moment'
import Toast from '@/common/toast.js'
import indexListAll from '@/common/indexListAll.js'

export default {
  name: 'FundDetail',
  data () {
    let filterList = []
    indexListAll.forEach((item) => {
      filterList.push({
        key: item.key,
        name: item.name,
        value: item.name
      })
    })
    filterList.push({
      key: 'kong',
      name: '置空',
      value: ''
    })
    return {
      currentFund: {
        code: '',
        net_value: 1,
        valuation: 1,
        valuation_date: ''
      },
      queryData: {},
      shares: 0,
      sum: 0,
      filterTheme: '',
      filterList,
      popupVisible: false,
      canSellInfo: {},
      sellMoney: 0,
      ifHas: false
    }
  },

  computed: {
    sellShare () {
      return parseInt(this.sellMoney / this.currentFund.valuation)
    }
  },
  created () {
    this.initPage()
  },

  methods: {
    initPage () {
      const code = this.$router.history.current.query.code
      // 判断是否有持仓
      this.$http.get('userFund/getUserFund', {
        code: code
      }).then((res) => {
        if (res.success === true && res.data.code) {
          const userFund = res.data
          if (userFund.has) {
            this.ifHas = true
            if (userFund.position_record) {
              this.canSellInfo = fundAccountUtil.getUnLockInfo(userFund)
            }
            this.sum = userFund.sum
            this.shares = userFund.shares
          }
          this.currentFund = userFund
          this.filterTheme = userFund.theme || '未设置'
        }
      })
    },
    toPath (path) {
      this.$router.push(path)
    },
    backHandler () {
      this.$router.history.go(-1)
    },
    formatDate (date) {
      if (date) {
        return moment(date).format('YYYY-MM-DD HH:mm:SS')
      } else {
        return moment().format('YYYY-MM-DD HH:mm:SS')
      }
    },
    toEditHandler () {
      this.$router.push({
        path: '/page/myFundAdd',
        query: {
          code: this.currentFund.code
        }
      })
    },
    toAddHandler () {
      this.$router.push({
        path: '/page/myFundAdd',
        query: {
          code: this.currentFund.code
        }
      })
    },
    successMessage () {
      Toast.success('操作成功')
    },
    errorMessage () {
      Toast.error('操作失败')
    },
    updateFundTheme (theme) {
      const code = this.$router.history.current.query.code
      this.$http.post('fund/updateFundTheme', {theme, code})
    },
    updateFund () {
      const code = this.$router.history.current.query.code
      this.$http.post('fund/updateFund', {code})
    },
    themeChangeHandler () {
      this.popupVisible = true
    },
    onThemeChangeHandler (theme) {
      this.filterTheme = theme
      this.popupVisible = false
      this.updateFundTheme(theme)
    },
    countSharesListByMoney () {
      let sharesList = []
      let number = 20
      for (let i = 1; i < (number + 1); i++) {
        sharesList.push({
          name: i * 100,
          money: i * 100
        })
      }
      const canSellShares = parseInt(this.canSellInfo.shares || 0)
      const newSharesList = []
      for (let i = 0; i < number; i++) {
        const item = sharesList[i]
        const shares = parseInt(item.money / this.currentFund.valuation)
        item.shares = shares
        if (canSellShares < shares) {
          item.shares = canSellShares
        }
        item.sum = Math.ceil(item.shares * this.currentFund.valuation)
        newSharesList.push({
          ...item
        })
        if (canSellShares < shares) {
          break
        }
      }
      return newSharesList
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>
  .filter-select-wrap {
    padding: 0 30px;
    margin-top: 20px;
  }
</style>
