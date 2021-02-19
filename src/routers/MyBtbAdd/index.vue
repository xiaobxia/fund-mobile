<template>
  <div class="my-fund-add">
    <mt-header title="编辑" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body has-bar">
      <mt-field label="类型" v-model="info.type" disabled></mt-field>
      <div class="edit-type-body">
        <template v-if="editType === '加仓'">
          <mt-field label="加仓份额" placeholder="加仓份额" v-model="addForm.shares"></mt-field>
        </template>
        <template v-if="editType === '减仓'">
          <mt-field label="减仓份额" placeholder="减仓份额" v-model="cutForm.shares"></mt-field>
          <div class="position_record_list">
            <div v-for="(item, index) in positionRecord" :key="index">
              <span class="item">
                <span class="label">份额：</span>
                <span class="value">{{item.shares}}</span>
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
  </div>
</template>

<script>
import {MessageBox} from 'mint-ui'
import Toast from '@/common/toast.js'
import moment from 'moment-timezone'

moment.tz.setDefault('Asia/Shanghai')

export default {
  name: 'MyBtbAdd',
  data () {
    return {
      type: 'add',
      popupVisible: false,
      editTypePopupVisible: false,
      editTypeList: [{name: '加仓'}, {name: '减仓'}],
      form: {
      },
      positionRecord: [],
      info: {},
      addForm: {
        shares: ''
      },
      cutForm: {
        shares: ''
      },
      editType: '加仓',
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
      this.$http.get('btb/getUserBtb', {
        type: query.type
      }).then((res) => {
        if (res.success === true && res.data.code) {
          const userBtb = res.data
          this.info = userBtb
          this.positionRecord = userBtb.position_record
        }
      })
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
      const query = this.$router.history.current.query
      if (this.editType === '加仓') {
        const newForm = {
          type: query.type,
          shares: this.addForm.shares
        }
        this.$http.post('btb/addPosition', newForm).then(this.toast)
      } else if (this.editType === '减仓') {
        const newForm = {
          type: query.type,
          cutForm: this.addForm.shares
        }
        this.$http.post('btb/cutPosition', newForm).then(this.toast)
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
