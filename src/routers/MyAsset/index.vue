<template>
  <div class="my-asset">
    <mt-header title="编辑" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div class="warn-wrap">
        <div class="yellow fm-warn">申购在每月第一个交易日进行，申购前确保资产校对过</div>
        <div class="fm-warn blue">基金规模的增长理论上控制在33%</div>
        <div class="fm-warn grey">基金占比9/10</div>
        <div class="fm-warn grey">资产理论上每月加一万</div>
      </div>
      <div class="filter-select-wrap">
        <span class="name">{{editType}}</span>
        <mt-button type="primary" @click="editTypeChangeHandler">改变</mt-button>
      </div>
      <template v-if="editType === '修改'">
        <mt-field label="资产" placeholder="请输入" v-model="form.asset"></mt-field>
        <mt-field label="资产成本" placeholder="请输入" v-model="form.asset_cost"></mt-field>
        <mt-field label="份额" placeholder="请输入" v-model="form.shares"></mt-field>
        <mt-field label="总收益" placeholder="请输入" v-model="form.income"></mt-field>
        <div>对应总资产：{{allAsset}}</div>
        <div>行情不好时去买固收组合：15%（{{gushou}}）</div>
      </template>
      <template v-if="editType === '申购'">
        <mt-field label="加仓金额" placeholder="请输入" v-model="buyForm.asset"></mt-field>
        <div class="content">
          <p class="infoP">净值：{{this.netValueInfo.net_value}}</p>
          <p class="infoP">日期：{{this.netValueInfo.net_value_date}}</p>
        </div>
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
      <ul class="filter-select-list">
        <li class="filter-select-item" v-for="(item) in editTypeList" :key="item.code"
            @click="onEditTypeChangeHandler(item.name)">{{item.name}}
        </li>
      </ul>
    </mt-popup>
  </div>
</template>

<script>
import Toast from '@/common/toast.js'
import { mapGetters } from 'vuex'

export default {
  name: 'MyAsset',
  data () {
    return {
      editTypePopupVisible: false,
      editTypeList: [{name: '修改'}, {name: '申购'}, {name: '赎回'}],
      form: {
        shares: 0,
        asset: 0,
        asset_cost: 0,
        income: 0
      },
      buyForm: {
        asset: 0
      },
      sellForm: {
        shares: 0
      },
      editType: '修改',
      netValueInfo: {
        net_value: 1,
        net_value_date: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'userFundAccountInfo'
    ]),
    allAsset () {
      return parseInt(this.form.asset / 0.95)
    },
    gushou () {
      return parseInt(this.form.asset * 0.15)
    }
  },
  watch: {
  },
  created () {
    const user = this.userFundAccountInfo.user
    const userLastTradeDateNetValue = this.userFundAccountInfo.userLastTradeDateNetValue
    this.form = {
      shares: user.shares,
      asset: user.asset,
      asset_cost: user.asset_cost,
      income: user.income
    }
    this.netValueInfo = {
      net_value: userLastTradeDateNetValue.net_value,
      net_value_date: userLastTradeDateNetValue.net_value_date || ''
    }
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
      let updateData = {
        ...this.form
      }
      if (this.editType === '申购') {
        let buyAsset = parseInt(this.buyForm.asset)
        updateData.asset_cost = this.form.asset_cost + buyAsset
        updateData.asset = this.form.asset + buyAsset
        updateData.shares = this.form.shares + (buyAsset / this.netValueInfo.net_value)
      }
      if (this.editType === '赎回') {
        let sellShares = parseInt(this.sellForm.shares)
        updateData.shares = this.form.shares - sellShares
        updateData.asset = this.form.asset * (updateData.shares / this.form.shares)
        updateData.asset_cost = this.form.asset_cost * (updateData.shares / this.form.shares)
      }
      this.$http.post('user/updateUserAsset', updateData).then((res) => {
        this.toast(res)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
