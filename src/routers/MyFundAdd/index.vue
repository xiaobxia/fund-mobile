<template>
  <div class="my-fund-add">
    <mt-header :title="ifHas?'编辑':'添加'" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
      <mt-button slot="right" v-if="ifHas">
        <i class="far fa-trash-alt red-text" @click="deleteHandler"></i>
      </mt-button>
    </mt-header>
    <div class="main-body has-bar">
      <mt-field label="代码" v-model="fundInfo.code" disabled></mt-field>
      <mt-field label="名称" v-model="fundInfo.name" disabled></mt-field>
      <template v-if="ifHas">
        <div class="filter-select-wrap">
          <span class="name">{{editType}}</span>
          <mt-button type="primary" @click="editTypeChangeHandler">改变</mt-button>
        </div>
      </template>
      <div class="edit-type-body">
        <template v-if="!ifHas || (ifHas && editType === '修改')">
          <div class="filter-select-wrap">
            <span class="name">{{form.strategy === '1' ? '波段':'定投'}}</span>
            <mt-button type="primary" @click="strategyChangeHandler">改变</mt-button>
          </div>
          <template v-if="!ifHas">
            <mt-field label="成本" placeholder="请输入成本" v-model="form.cost"></mt-field>
            <mt-field label="金额" placeholder="请输入金额" v-model="form.asset"></mt-field>
            <mt-field label="确认日期" placeholder="请输入确认日期" v-model="form.confirm_date"></mt-field>
          </template>
          <template v-else>
            <div class="page-content-title">持仓记录</div>
            <div class="position-record" v-for="(item, index) in positionRecord" :key="index">
              <mt-field label="成本" placeholder="请输入成本" v-model="item.cost"></mt-field>
              <mt-field label="份额" placeholder="请输入份额" v-model="item.shares"></mt-field>
              <mt-field label="确认日期" placeholder="请输入确认日期" v-model="item.confirm_date"></mt-field>
            </div>
          </template>
        </template>
        <template v-if="ifHas && editType === '加仓'">
          <mt-field label="加仓金额" placeholder="加仓金额" v-model="addForm.asset"></mt-field>
          <mt-field label="确认日期" placeholder="确认日期" v-model="addForm.confirm_date"></mt-field>
          <div class="content">成本：{{fundInfo.net_value}}</div>
        </template>
        <template v-if="ifHas && editType === '减仓'">
          <mt-field label="减仓份额" placeholder="减仓份额" v-model="cutForm.shares"></mt-field>
          <div class="position_record_list">
            <div v-for="(item, index) in positionRecord" :key="index" :class="{lock: item.ifLock}">
              <span class="item">
                <span class="label">成本：</span>
                <span class="value">{{item.costSum}}</span>
              </span>
              <span class="item">
                <span class="label">市值：</span>
                <span class="value">{{item.sum}}</span>
              </span>
              <span class="item">
                <span class="label">份额：</span>
                <span class="value">{{keepTwoDecimals(item.shares)}}</span>
              </span>
              <span class="item">
                <span class="label">确认日期：</span>
                <span class="value">{{item.confirm_date}}</span>
              </span>
            </div>
          </div>
        </template>
      </div>
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
    <mt-popup
      v-model="popupVisible"
      position="bottom">
      <ul class="filter-select-list">
        <li class="filter-select-item" v-for="(item) in strategyList" :key="item.code"
            @click="onStrategyChangeHandler(item.name)">{{item.name}}
        </li>
      </ul>
    </mt-popup>
  </div>
</template>

<script>
import {MessageBox} from 'mint-ui'
import Toast from '@/common/toast.js'
import moment from 'moment-timezone'

moment.tz.setDefault('Asia/Shanghai')

export default {
  name: 'MyFundAdd',
  data () {
    return {
      type: 'add',
      popupVisible: false,
      editTypePopupVisible: false,
      strategyList: [{name: '波段'}, {name: '定投'}],
      editTypeList: [{name: '修改'}, {name: '加仓'}, {name: '减仓'}],
      form: {
        confirm_date: moment().format('YYYY-MM-DD')
      },
      positionRecord: [],
      fundInfo: {},
      addForm: {
        asset: '',
        confirm_date: moment().format('YYYY-MM-DD')
      },
      cutForm: {
        shares: ''
      },
      editType: '修改',
      ifHas: false
    }
  },
  computed: {},
  created () {
    this.initPage()
  },
  methods: {
    initPage () {
      this.initQuery()
    },
    initQuery () {
      const query = this.$router.history.current.query
      this.$http.get('userFund/getUserFund', {
        code: query.code
      }).then((res) => {
        if (res.success === true && res.data.code) {
          const userFund = res.data
          if (userFund.has) {
            this.ifHas = true
            this.type = 'edit'
            this.positionRecord = userFund.position_record
            this.form.strategy = userFund.strategy
          } else {
            this.type = 'add'
            this.form.strategy = '1'
          }
          this.fundInfo = userFund
          this.form.cost = userFund.net_value
          this.form.code = query.code
        }
      })
    },
    deleteHandler () {
      MessageBox.confirm('确定执行此操作?').then(action => {
        if (action === 'confirm') {
          this.$http.get('userFund/deleteUserFund', {code: this.fundInfo.code}).then((data) => {
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
    strategyChangeHandler () {
      this.popupVisible = true
    },
    editTypeChangeHandler () {
      this.editTypePopupVisible = true
    },
    onStrategyChangeHandler (strategy) {
      const strategyMap = {
        '波段': '1',
        '定投': '2'
      }
      this.form.strategy = strategyMap[strategy]
      this.popupVisible = false
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
      if (this.type === 'add') {
        this.form.shares = this.keepTwoDecimals(parseFloat(this.form.asset) / this.form.cost)
        this.$http.post('userFund/addUserFund', this.form).then(this.toast)
      }
      if (this.type === 'edit') {
        if (this.editType === '修改') {
          let positionRecord = []
          this.positionRecord.map((item) => {
            if (parseFloat(item.shares) !== 0) {
              positionRecord.push({
                cost: parseFloat(item.cost),
                shares: parseFloat(item.shares),
                confirm_date: item.confirm_date
              })
            }
          })
          positionRecord.sort((a, b) => {
            return moment(a.confirm_date).isAfter(b.confirm_date)
          })
          let editData = {
            code: this.form.code,
            strategy: this.form.strategy,
            position_record: JSON.stringify(positionRecord)
          }
          this.$http.post('userFund/updateUserFund', editData).then(this.toast)
        } else if (this.editType === '加仓') {
          const newForm = {
            code: this.form.code,
            shares: this.keepTwoDecimals(this.addForm.asset / this.fundInfo.net_value),
            cost: this.fundInfo.net_value,
            confirm_date: this.addForm.confirm_date
          }
          this.$http.post('userFund/addFundPosition', newForm).then(this.toast)
        } else if (this.editType === '减仓') {
          const newForm = {
            code: this.form.code,
            shares: this.keepTwoDecimals(this.cutForm.shares)
          }
          this.$http.post('userFund/cutFundPosition', newForm).then(this.toast)
        }
      }
    },
    toPath (path) {
      this.$router.push(path)
    },
    backHandler () {
      this.$router.history.go(-1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
