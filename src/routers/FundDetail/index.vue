<template>
  <div class="fund-detail">
    <mt-header :title="currentFund.name" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
      <mt-button slot="right">
        <i class="far fa-edit" v-if="type==='edit'" @click="toEditHandler"></i>
        <i class="fas fa-plus" v-else @click="toAddHandler"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div :class="['info-wrap',infoColor]">
        <span class="item">基金代码：{{currentFund.code}}</span>
        <span class="item">基金净值：{{currentFund.net_value}}</span>
        <span class="item">估算净值：{{currentFund.valuation}}</span>
        <span class="item">估算涨幅：{{currentFund.change_ratio}}%</span>
        <span class="item">买入费率：{{currentFund.buy_rate_one}}</span>
        <span class="item">卖出费率：{{currentFund.sell_rate_two}}</span>
        <span v-if="type==='edit'"  class="item">可卖金额：{{parseInt(canSellInfo.sum || 0)}}</span>
        <span v-if="type==='edit'"  class="item">可卖份额：{{parseInt(canSellInfo.shares || 0)}}</span>
        <div class="shares-list-wrap">
          <div v-if="type==='edit'" v-for="(item, index) in countSharesList(canSellInfo.shares)" :key="index">{{item.name}}: <span>份额 {{item.shares}}</span><span>金额 {{item.sum}}</span></div>
        </div>
        <div>估值时间：{{formatDate(currentFund.valuation_date)}}</div>
      </div>
      <div class="theme-wrap">
        <span class="name">{{filterTheme}}</span>
        <mt-button type="primary" @click="themeChangeHandler">改变</mt-button>
      </div>
    </div>
    <mt-popup
      v-model="popupVisible"
      position="bottom">
      <ul class="theme-list">
        <li class="theme-item" v-for="(item) in filterList" :key="item.code" @click="onThemeChangeHandler(item.name)">{{item.name || '置空'}}</li>
      </ul>
    </mt-popup>
  </div>
</template>

<script>
import fundAccountUtil from '@/util/fundAccountUtil.js'
import moment from 'moment'
import Toast from '@/common/toast.js'
import indexInfoUtil from '@/util/indexInfoUtilXiong.js'

const codeMap = indexInfoUtil.codeMap
export default {
  name: 'FundDetail',
  data () {
    let filterList = []
    for (let key in codeMap) {
      filterList.push({
        key: key,
        code: codeMap[key].code,
        name: codeMap[key].name
      })
    }
    filterList.push({
      key: 'kong',
      code: 'kong',
      name: ''
    })
    return {
      currentFund: {
        code: '',
        net_value: 1,
        valuation: 1,
        valuation_date: ''
      },
      queryData: {},
      type: 'add',
      filterTheme: '',
      filterList,
      popupVisible: false,
      canSellInfo: {}
    }
  },

  computed: {
    infoColor () {
      let rate = 0
      if (this.currentFund.change_ratio) {
        rate = this.currentFund.change_ratio
        return rate < 0 ? 'green' : 'red'
      } else {
        return ''
      }
    }
  },
  mounted () {
    this.initPage()
  },

  methods: {
    initPage () {
      const query = this.$router.history.current.query
      this.type = query.type
      const code = this.$router.history.current.query.code
      // 判断是否有持仓
      this.$http.get('userFund/getUserFund', {
        code: code
      }).then((res) => {
        if (res.success === true && res.data.code) {
          const userFund = res.data
          this.currentFund = userFund
          this.filterTheme = userFund.theme || '未设置'
          if (userFund.position_record) {
            this.canSellInfo = fundAccountUtil.getUnLockInfo(userFund)
            this.type = 'edit'
            this.queryData = {
              type: 'edit',
              code
            }
          }
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
      this.$router.push({path: '/page/myFundAdd', query: {...this.queryData}})
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
    themeChangeHandler () {
      this.popupVisible = true
    },
    onThemeChangeHandler (theme) {
      this.filterTheme = theme
      this.popupVisible = false
      this.updateFundTheme(theme)
    },
    countSharesList (shares) {
      shares = shares || 0
      let sharesList = [
        {
          name: '1/5',
          rate: 1 / 5
        },
        {
          name: '1/4',
          rate: 1 / 4
        },
        {
          name: '1/3',
          rate: 1 / 3
        },
        {
          name: '1/2',
          rate: 1 / 2
        },
        {
          name: '2/3',
          rate: 2 / 3
        },
        {
          name: '3/4',
          rate: 3 / 4
        },
        {
          name: '4/5',
          rate: 4 / 5
        }
      ]
      sharesList.map((item) => {
        item.shares = parseInt(shares * item.rate)
        item.sum = parseInt(shares * item.rate * this.currentFund.valuation)
      })
      return sharesList
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
