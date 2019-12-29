<template>
  <div class="income-all">
    <mt-header title="总收益" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div class="">
        <table width="100%" cellspacing="1" cellpadding="20">
          <tr>
            <th>指数</th>
            <th>总收益（基于本账户）</th>
          </tr>
          <tr v-for="(item, index) in list" :key="index">
            <td>{{item.name}}</td>
            <td>{{item.netChangeRatio}}%<span v-if="item.key !== 'my'" :class="stockNumberClass(myNetChangeRatio - item.netChangeRatio)">( {{keepTwoDecimals(myNetChangeRatio - item.netChangeRatio)}}% )</span></td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {Indicator} from 'mint-ui'
import indexListAll from '@/common/indexListAll.js'
import { mapGetters } from 'vuex'

export default {
  name: 'IncomeAll',
  data () {
    let list = []
    indexListAll.forEach((item) => {
      if (item.mix) {
        list.push({
          ...item,
          netChangeRatio: 0
        })
      }
    })
    return {
      list,
      myNetChangeRatio: 0
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
      this.myNetChangeRatio = this.countDifferenceRate(
        this.userFundAccountInfo.userNewestNetValue.net_value,
        1
      )
      const start = this.userFundAccountInfo.firstNetValueDate
      if (start) {
        Indicator.open({
          spinnerType: 'fading-circle'
        })
        const opList = []
        this.list.forEach((item) => {
          opList.push(
            this.$http.get(`stock/getStockPriceNetChangeRatioByStart`, {
              code: item.code,
              start: start
            }).then((res) => {
              if (res.success) {
                item.netChangeRatio = res.data.netChangeRatio
              }
            })
          )
        })
        Promise.all(opList).then(() => {
          this.list.push({
            key: 'my',
            name: '我的',
            netChangeRatio: this.myNetChangeRatio
          })
          Indicator.close()
        })
      } else {
        this.list.push({
          key: 'my',
          name: '我的',
          netChangeRatio: this.myNetChangeRatio
        })
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
