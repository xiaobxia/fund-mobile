<template>
  <div class="my-fund-add">
    <mt-header title="编辑" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div class="strategy-wrap">
        <span class="name">{{editType}}</span>
        <mt-button type="primary" @click="editTypeChangeHandler">改变</mt-button>
      </div>
      <template v-if="editType === '修改'">
        <mt-field label="基金资产成本" placeholder="请输入" v-model="form.fundAssetCost"></mt-field>
        <mt-field label="基金份额" placeholder="请输入" v-model="form.fundShares"></mt-field>
      </template>
      <template v-if="editType === '申购'">
        <mt-field label="加仓金额" placeholder="请输入" v-model="buyForm.asset"></mt-field>
        <p class="infoP">净值：{{this.netValueInfo.net_value}}</p>
        <p class="infoP">日期：{{this.netValueInfo.net_value_date}}</p>
      </template>
      <template v-if="editType === '赎回'">
        <mt-field label="赎回份额" placeholder="请输入" v-model="sellForm.shares"></mt-field>
      </template>
    </div>
    <div class="bottom-bar">
      <mt-button type="primary" @click="okHandler" class="main-btn">完成</mt-button>
    </div>
    <mt-popup
      v-model="editTypePopupVisible"
      position="bottom">
      <ul class="strategy-list">
        <li class="strategy-item" v-for="(item) in editTypeList" :key="item.code"
            @click="onEditTypeChangeHandler(item.name)">{{item.name}}
        </li>
      </ul>
    </mt-popup>
  </div>
</template>

<script>
import storageUtil from '@/util/storageUtil.js'
import Http from '@/util/httpUtil.js'
import Toast from '@/common/toast.js'
import numberUtil from '@/util/numberUtil.js'

export default {
  name: 'MyAsset',
  data () {
    const userFundAccountInfo = storageUtil.getUserFundAccountInfo()
    return {
      editTypePopupVisible: false,
      editTypeList: [{name: '修改'}, {name: '申购'}, {name: '赎回'}],
      form: {
        fundAssetCost: userFundAccountInfo.fund_asset_cost,
        fundShares: userFundAccountInfo.fund_shares
      },
      buyForm: {
        asset: 0
      },
      sellForm: {
        shares: 0
      },
      editType: '修改',
      netValueInfo: {
        net_value: userFundAccountInfo.last_net_value,
        net_value_date: userFundAccountInfo.last_net_value_date
      }
    }
  },
  computed: {},
  watch: {
  },
  mounted () {
    this.initPage()
  },
  methods: {
    initPage () {
    },
    toPath (path) {
      this.$router.push(path)
    },
    backHandler () {
      this.$router.history.go(-1)
    },
    editTypeChangeHandler () {
      this.editTypePopupVisible = true
    },
    onEditTypeChangeHandler (editType) {
      this.editType = editType
      this.editTypePopupVisible = false
    },
    toast (data) {
      if (data.success) {
        Toast.success('操作成功')
        this.$router.history.go(-1)
      } else {
        Toast.error('操作失败')
      }
    },
    okHandler () {
      let fundAssetCost = 0
      let fundShares = 0
      if (this.editType === '修改') {
        fundAssetCost = this.form.fundAssetCost
        fundShares = this.form.fundShares
      }
      if (this.editType === '申购') {
        let buyAsset = parseInt(this.buyForm.asset)
        fundAssetCost = this.form.fundAssetCost + buyAsset
        fundShares = this.form.fundShares + (buyAsset / (this.netValueInfo.net_value || 1))
      }
      if (this.editType === '赎回') {
        let sellShares = parseInt(this.sellForm.shares)
        fundShares = this.form.fundShares - sellShares
        fundAssetCost = fundShares * (this.form.fundAssetCost / this.form.fundShares)
      }
      Http.post('userFund/updateUserFundAssetInfo', {
        fundAssetCost: numberUtil.keepTwoDecimals(fundAssetCost),
        fundShares: numberUtil.keepTwoDecimals(fundShares)
      }).then((res) => {
        this.$http.get('userFund/getUserFundAccountInfo').then((res) => {
          storageUtil.initUserFundAccountInfo(res.data)
        })
        this.toast(res)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
