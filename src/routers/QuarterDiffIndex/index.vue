<template>
  <div class="operating-info">
    <mt-header title="趋势线" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-button type="primary" @click="okHandler" class="main-btn">发送</mt-button>
      <div class="warn-wrap">
        <div class="fm-warn grey">{{up}}/{{all}}</div>
      </div>
      <mt-cell-swipe v-for="(item) in list" :key="item.code">
        <div slot="title">
          <h3>
            {{item.name}}
            <span style="float: right" :class="stockNumberClass(item.netChangeRatio)">{{item.netChangeRatio}}%</span>
          </h3>
        </div>
      </mt-cell-swipe>
    </div>
  </div>
</template>

<script>
import indexList from '@/common/indexList.js'
import storageUtil from '@/util/storageUtil.js'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'QuarterDiffIndex',
  data () {
    let list = []
    indexList.forEach((item) => {
      list.push({
        ...item,
        netChangeRatio: 0
      })
    })
    return {
      list,
      all: list.length,
      up: 0
    }
  },
  computed: {
    ...mapGetters([
      'userFundAccountInfo'
    ])
  },
  created () {
    this.initPage()
  },
  methods: {
    initPage () {
      let list = this.list
      let opList = []
      for (let i = 0; i < list.length; i++) {
        opList.push(this.queryData(list[i]))
      }
      Promise.all(opList).then(() => {
        this.list.sort((a, b) => {
          return b.netChangeRatio - a.netChangeRatio
        })
        localStorage.setItem('qdaPC', `${this.up}/${this.all}`)
        this.okHandler()
      })
    },
    queryData (item) {
      return this.$http.getWithCache(`stock/getStockPriceQDiffAV`, {
        code: item.code
      }, {interval: 20}).then((data) => {
        if (data.success) {
          item.netChangeRatio = data.data.diffAVRate
          if (item.netChangeRatio > 0) {
            this.up = this.up + 1
          }
          storageUtil.setData('qDiffAvRateIndex', item.key, item.netChangeRatio)
        }
      })
    },
    backHandler () {
      this.$router.history.go(-1)
    },
    updateStockIndex (key, value) {
      this.$http.post('stock/updateStockIndex', {
        key: key,
        ...value
      }).then((data) => {
      })
    },
    okHandler () {
      const list = []
      this.list.forEach((v) => {
        const stockIndexPSF = storageUtil.getData('stockIndexPSF', v.key) || ''
        list.push({
          key: v.key,
          name: v.name,
          netChangeRatio: v.netChangeRatio,
          stockIndexPSF
        })
      })
      if (this.userFundAccountInfo.marketOpen) {
        const date = moment().format('YYYY-MM-DD')
        this.$http.post(`${this.$fbsUrl}/riskSignal/updateSignal`, {
          trade_date: date,
          record: JSON.stringify(list)
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
