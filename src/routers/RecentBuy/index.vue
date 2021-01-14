<template>
  <div class="page-my-proportion">
    <mt-header title="近期状态" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div style="text-align: center">{{bgTime}}</div>
      <mt-button type="primary" @click="selectDate" class="main-btn">选择时间</mt-button>
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
      <mt-datetime-picker
        ref="picker"
        v-model="pickerVisible"
        type="date"
        :startDate="startDate"
        :endDate="endDate"
        @confirm="handleConfirm">
      </mt-datetime-picker>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
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
      endDate: new Date()
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
      this.$refs.picker.open()
    },
    aYData () {
      let allCost = 0
      let allValuation = 0
      let bondCost = 0
      let bondValuation = 0
      let fixCost = 0
      let fixValuation = 0
      for (let i = 0; i < this.list.length; i++) {
        const item = this.list[i]
        item.position_record.forEach((record) => {
          if (record.confirm_date >= this.bgTime) {
            allCost += record.costSum
            allValuation += record.valuationSum
            if (item.strategy === '1') {
              // 波
              bondCost += record.costSum
              bondValuation += record.valuationSum
            } else {
              // 定
              fixCost += record.costSum
              fixValuation += record.valuationSum
            }
          }
        })
      }
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
</style>
