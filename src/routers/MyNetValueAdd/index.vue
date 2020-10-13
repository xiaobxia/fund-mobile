<template>
  <div class="my-netValue-add">
    <mt-header :title="type==='add'?'添加':'编辑'" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
      <mt-button slot="right" v-if="type==='edit'">
        <i class="far fa-trash-alt red-text" @click="deleteHandler"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-field label="今日盈亏" placeholder="请输入今日盈亏" v-model="form.today_income"></mt-field>
      <mt-field label="总盈亏" placeholder="请输入总盈亏" v-model="form.income" @change="incomeChange"></mt-field>
      <mt-field label="份额" placeholder="请输入份额" v-model="form.shares"></mt-field>
      <mt-field label="资产" placeholder="请输入资产" v-model="form.asset"></mt-field>
      <mt-field label="资产成本" placeholder="请输入资产成本" v-model="form.asset_cost"></mt-field>
      <mt-field label="净值日期" placeholder="请输入净值日期" v-model="form.net_value_date"></mt-field>
      <mt-field label="仓位" placeholder="请输入仓位" v-model="form.position"></mt-field>
    </div>
    <div class="bottom-bar">
      <mt-button type="primary" @click="okHandler" class="main-btn">完成</mt-button>
    </div>
  </div>
</template>

<script>
import {MessageBox} from 'mint-ui'
import Toast from '@/common/toast.js'

function createFormKey (tar) {
  const raw = {
    shares: 0,
    asset: 0,
    asset_cost: 0,
    net_value_date: '',
    today_income: 0,
    income: 0,
    position: 100
  }
  if (tar) {
    for (const key in raw) {
      raw[key] = tar[key]
    }
  }
  return raw
}

export default {
  name: 'MyNetValueAdd',
  data () {
    return {
      type: 'add',
      form: {},
      assetCost: 0,
      income: 0,
      fundShares: 0
    }
  },
  watch: {
  },
  computed: {},
  created () {
    this.initPage()
  },
  methods: {
    incomeChange () {
      this.form.asset = parseInt(
        parseFloat(this.form.income) +
        parseFloat(this.form.asset_cost)
      )
    },
    initPage () {
      this.initQuery()
    },
    initQuery () {
      const query = this.$router.history.current.query
      this.type = query.type
      if (query.type === 'add') {
        this.form = createFormKey()
      } else {
        this.$http.get('userFund/getUserNetValue', {
          date: query.net_value_date
        }).then((res) => {
          this.form = createFormKey(res.data)
        })
      }
    },
    backHandler () {
      this.$router.history.go(-1)
    },
    deleteHandler () {
      MessageBox.confirm('确定执行此操作?').then(action => {
        if (action === 'confirm') {
          this.$http.get('userFund/deleteUserNetValue', {net_value_date: this.form.net_value_date}).then((data) => {
            if (data.success) {
              Toast.success('操作成功')
              this.$router.history.go(-1)
            } else {
              Toast.error('操作失败')
            }
          })
        }
      })
    },
    okHandler () {
      this.$http.post(this.type === 'add' ? 'userFund/addUserNetValue' : 'userFund/updateUserNetValue', this.form).then((data) => {
        if (data.success) {
          Toast.success('操作成功')
          this.$router.history.go(-1)
        } else {
          Toast.error('操作失败')
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
