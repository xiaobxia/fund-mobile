<template>
  <div class="page-my-proportion">
    <mt-header title="近期状态" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-field label="买入日期" placeholder="请输入" v-model="bgTime"></mt-field>
      <!--<div style="text-align: center">{{bgTime}}</div>-->
      <mt-button type="primary" @click="selectDate" class="main-btn">查询</mt-button>
      <div class="detail-info-wrap">
        <span class="item">
          <span class="label">总买入：</span>
          <span class="value">{{$formatMoney(allCost)}}</span>
        </span>
        <span class="item">
          <span class="label">总盈亏：</span>
          <span class="value" :class="stockNumberClass(allValuation - allCost)">{{$formatMoney(allValuation - allCost)}}</span>
        </span>
        <span class="item">
          <span class="label">定投买入：</span>
          <span class="value">{{$formatMoney(fixCost)}}</span>
        </span>
        <span class="item">
          <span class="label">定投盈亏：</span>
          <span class="value" :class="stockNumberClass(fixValuation - fixCost)">{{$formatMoney(fixValuation - fixCost)}}</span>
        </span>
        <span class="item">
          <span class="label">波段买入：</span>
          <span class="value">{{$formatMoney(bondCost)}}</span>
        </span>
        <span class="item">
          <span class="label">波段盈亏：</span>
          <span class="value" :class="stockNumberClass(bondValuation - bondCost)">{{$formatMoney(bondValuation - bondCost)}}</span>
        </span>
      </div>
      <h4>定投</h4>
      <div>
        <div v-for="(item) in fixList" :key="`d${item.key}`">
          <div class="dt">
            <span style="text-align: left" >{{item.key}}</span>
            <span style="text-align: center" >{{$formatMoney(item.cost)}}</span>
            <span style="text-align: right" :class="stockNumberClass(item.res)">{{$formatMoney(item.res)}}</span>
          </div>
        </div>
      </div>
      <h4>波段</h4>
      <div>
        <div v-for="(item) in bondList" :key="`b${item.key}`" class="dt">
          <span style="text-align: left" >{{item.key}}</span>
          <span style="text-align: center" >{{$formatMoney(item.cost)}}</span>
          <span style="text-align: right" :class="stockNumberClass(item.res)">{{$formatMoney(item.res)}}</span>
        </div>
      </div>
      <!--<mt-datetime-picker-->
        <!--ref="picker"-->
        <!--v-model="pickerVisible"-->
        <!--type="date"-->
        <!--:startDate="startDate"-->
        <!--:endDate="endDate"-->
        <!--@confirm="handleConfirm">-->
      <!--</mt-datetime-picker>-->
    </div>
  </div>
</template>
<script>
import moment from 'moment-timezone'
moment.tz.setDefault('Asia/Shanghai')
export default{
  name: 'RecentBuy',
  data () {
    const start = moment().subtract(6, 'months').format('YYYY/MM/DD')
    return {
      pickerVisible: false,
      bgTime: '',
      list: [],
      allCost: 0,
      allValuation: 0,
      bondCost: 0,
      bondValuation: 0,
      fixCost: 0,
      fixValuation: 0,
      startDate: new Date(start),
      endDate: new Date(),
      bondList: {},
      fixList: {}
    }
  },
  computed: {
  },
  created () {
    this.queryRecord()
  },
  methods: {
    queryRecord () {
      this.$http.get('userFund/getUserFunds').then((data) => {
        if (data.success) {
          this.list = data.data.list || []
        }
      })
    },
    handleConfirm (data) {
      this.bgTime = moment(data).format('YYYY-MM-DD')
      this.aYData()
    },
    selectDate () {
      this.aYData()
    },
    aYData () {
      let allCost = 0
      let allValuation = 0
      let bondCost = 0
      let bondValuation = 0
      let fixCost = 0
      let fixValuation = 0
      const bondMap = {}
      const fixMap = {}
      for (let i = 0; i < this.list.length; i++) {
        const item = this.list[i]
        item.position_record.forEach((record) => {
          // 用买入日期，而不是确认日期
          if (record.confirm_date > this.bgTime) {
            allCost += record.costSum
            allValuation += record.valuationSum
            if (item.strategy === '1') {
              bondCost += record.costSum
              bondValuation += record.valuationSum
              if (bondMap[item.theme]) {
                bondMap[item.theme].cost += record.costSum
                bondMap[item.theme].valuation += record.valuationSum
              } else {
                bondMap[item.theme] = {
                  cost: record.costSum,
                  valuation: record.valuationSum
                }
              }
            } else {
              fixCost += record.costSum
              fixValuation += record.valuationSum
              if (!item.theme) {
                item.theme = '混合'
              }
              if (fixMap[item.theme]) {
                fixMap[item.theme].cost += record.costSum
                fixMap[item.theme].valuation += record.valuationSum
              } else {
                fixMap[item.theme] = {
                  cost: record.costSum,
                  valuation: record.valuationSum
                }
              }
            }
          }
        })
      }
      const bondList = []
      const fixList = []
      for (let key in bondMap) {
        const v = bondMap[key]
        bondList.push({
          key: key,
          cost: v.cost,
          valuation: v.valuation,
          res: v.valuation - v.cost
        })
      }
      for (let key in fixMap) {
        const v = fixMap[key]
        fixList.push({
          key: key,
          cost: v.cost,
          valuation: v.valuation,
          res: v.valuation - v.cost
        })
      }
      fixList.sort((a, b) => {
        return b.res - a.res
      })
      bondList.sort((a, b) => {
        return b.res - a.res
      })
      console.log(fixList)
      console.log(bondList)
      this.bondList = bondList
      this.fixList = fixList
      this.allCost = allCost
      this.allValuation = allValuation
      this.bondCost = bondCost
      this.bondValuation = bondValuation
      this.fixCost = fixCost
      this.fixValuation = fixValuation
    },
    backHandler () {
      this.$router.history.go(-1)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .r-wi {
    display: inline-block;
    width: 4em;
  }
  .m-wi {
    display: inline-block;
    width: 5em;
  }
  .dt {
    border-bottom: 1px solid #ccc;
    span {
      vertical-align: top;
      display: inline-block;
      width: 32%;
    }
  }
</style>
