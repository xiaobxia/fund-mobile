<template>
  <div class="today-index">
    <mt-header title="指数月收益" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-cell-swipe v-for="(item, index) in list" :key="item.code"  :class="{'has-back': item.mix, my: item.key==='my'}">
        <div slot="title">
          <h3>
            <span class="name">{{item.name}}</span>
            <span v-if="hasCount[item.name]" class="has-count">{{hasCount[item.name]}}</span>
            <span class="paiming">{{index + 1}}</span>
            <span style="float: right" :class="numberClass(rateInfo[item.key])">{{rateInfo[item.key]}}%</span>
          </h3>
        </div>
      </mt-cell-swipe>
    </div>
    <div class="btn-list-wrap">
      <mt-button type="primary" @click="sortChangeHandler" class="main-btn">排序</mt-button>
    </div>
  </div>
</template>

<script>
import storageUtil from '@/util/storageUtil.js'

const codeMap = {
  'chuangye': {
    code: 'sz399006',
    name: '创业',
    mix: true
  },
  'gangtie': {
    code: 'sz399440',
    name: '钢铁'
  },
  'jungong': {
    code: 'sz399959',
    name: '军工'
  },
  'yiyao': {
    code: 'sh000037',
    name: '医药'
  },
  'meitan': {
    code: 'sz399998',
    name: '煤炭'
  },
  'youse': {
    code: 'sh000823',
    name: '有色'
  },
  'jisuanji': {
    code: 'sz399363',
    name: '计算机'
  },
  'baijiu': {
    code: 'sz399997',
    name: '白酒'
  },
  'xinxi': {
    code: 'sh000993',
    name: '信息'
  },
  'xiaofei': {
    code: 'sh000990',
    name: '消费'
  },
  'baoxian': {
    code: 'sz399809',
    name: '保险'
  },
  'wulin': {
    code: 'sh000016',
    name: '50',
    mix: true
  },
  'chuanmei': {
    code: 'sz399971',
    name: '传媒'
  },
  'dianzi': {
    code: 'sz399811',
    name: '电子'
  },
  'yiliao': {
    code: 'sz399989',
    name: '医疗'
  },
  'shengwu': {
    code: 'sz399441',
    name: '生物'
  },
  'sanbai': {
    code: 'sh000300',
    name: '300',
    mix: true
  },
  'wubai': {
    code: 'sh000905',
    name: '500',
    mix: true
  },
  'yinhang': {
    code: 'sz399986',
    name: '银行'
  },
  'dichan': {
    code: 'sz399393',
    name: '地产'
  },
  'huanbao': {
    code: 'sh000827',
    name: '环保'
  },
  'shangzheng': {
    code: 'sh000001',
    name: '上证',
    mix: true
  },
  'zhengquan': {
    code: 'sz399437',
    name: '证券'
  },
  'jijian': {
    code: 'sz399995',
    name: '基建'
  },
  'qiche': {
    code: 'sz399432',
    name: '汽车'
  },
  'yiqian': {
    code: 'sh000852',
    name: '1000',
    mix: true
  },
  'my': {
    name: '我'
  }
}
export default {
  name: 'MonthIncome',
  data () {
    const userFundAccountInfo = storageUtil.getUserFundAccountInfo()
    let list = []
    let rateInfo = {}
    let hasCount = {}
    let sortRate = {}
    for (let key in codeMap) {
      list.push({
        key: key,
        code: codeMap[key].code,
        name: codeMap[key].name,
        mix: codeMap[key].mix,
        sortRate: 0
      })
      rateInfo[key] = 0
      sortRate[codeMap[key].name] = 0
      hasCount[codeMap[key].name] = 0
    }
    return {
      list: list,
      rateInfo: rateInfo,
      sortRate,
      hasCount,
      myAsset: userFundAccountInfo.pre_asset,
      tradeTime: '',
      fundShares: userFundAccountInfo.fund_shares,
      nowMonthRate: 0
    }
  },
  beforeDestroy () {
  },
  mounted () {
    this.$http.get('userFund/getUserFunds').then((data) => {
      if (data.success) {
        const list = data.data.list
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          if (item.theme) {
            // 计入定投
            if (this.hasCount[item.theme]) {
              this.hasCount[item.theme] += parseInt(item.sum)
            } else {
              this.hasCount[item.theme] = parseInt(item.sum)
            }
          }
        }
      }
    })
    this.$http.get('userFund/getUserNetValueNowMonthRate').then((res) => {
      const netChangeRatio = res.data.rate
      this.sortRate['my'] = netChangeRatio
      this.rateInfo['my'] = this.keepTwoDecimals(netChangeRatio)
      this.nowMonthRate = res.data.rate
      this.initPage()
    })
  },
  methods: {
    initPage () {
      // 最新的
      let queryList = []
      let list = this.list
      for (let i = 0; i < list.length; i++) {
        queryList.push(this.queryData(list[i]))
      }
      Promise.all(queryList).then(() => {
        this.sortChangeHandler()
      })
    },
    queryData (item) {
      if (!item.code) {
        return true
      }
      return this.$http.getWithCache(`stock/getStockPriceNowMonthRate`, {
        code: item.code
      }, {interval: 30}).then((data) => {
        if (data.success) {
          if (this.tradeTime === '') {
            this.tradeTime = data.data.tradeTime
          }
          const netChangeRatio = parseFloat(data.data.rate)
          this.sortRate[item.key] = netChangeRatio
          this.rateInfo[item.key] = this.keepTwoDecimals(netChangeRatio)
          // 指数大我多少
          const diff = netChangeRatio - this.nowMonthRate
          let indexDiff = 1
          // 大我15以内，越大比例越高
          if (diff > 0 && diff <= 15) {
            indexDiff = (0.3 * diff / 15) + 1
          }
          // 小我15以内，越小比例越小
          if (diff < 0 && diff >= -15) {
            indexDiff = (0.3 * diff / 15) + 1
          }
          storageUtil.setIndexDiff(item.key, indexDiff)
        }
      })
    },
    backHandler () {
      this.$router.history.go(-1)
    },
    sortChangeHandler () {
      for (let key in this.sortRate) {
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].key === key) {
            this.list[i].sortRate = this.sortRate[key]
          }
        }
      }
      this.list.sort((a, b) => {
        return b.sortRate - a.sortRate
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
