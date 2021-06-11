<template>
  <div>
    <mt-header title="比特币" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-switch v-model="btbOpen" @change="openChange">是否开启策略</mt-switch>
      <mt-field label="仓位" placeholder="请输入" v-model="position"></mt-field>
      <mt-field label="USDT价格" placeholder="请输入" v-model="usdtMoney"></mt-field>
      <div class="r">总计：{{parseFloat(usdtAll).toFixed(2)}}，市值：{{usdtCountMoney(usdtAll)}}，仓位：{{countRate(positionAll, usdtAll)}}%</div>
      <div>上穿时macd必须是红的</div>
      <div
        v-for="(item, index) in list"
        :key="index"
        class="r"
        :class="{
          'green-bg-a': getText(item.info).indexOf('卖') !== -1,
          'red-bg-a': getText(item.info).indexOf('买') !== -1
        }"
      >
        <div>
          <van-row>
            <van-col span="12">{{item.code}}</van-col>
            <van-col span="12">
              <span>仓位：{{countRate(item.count, getCountUsdt(item.proportion))}}%</span>
            </van-col>
          </van-row>
        </div>
        <div>
          <span>当前价：{{item.close}}</span>
        </div>
        <div>
          <span>占比：{{item.proportion}}</span>
        </div>
        <div>
          <span>期望总计：{{parseFloat(getCountUsdt(item.proportion)).toFixed(2)}}，期望市值：{{usdtCountMoney(getCountUsdt(item.proportion))}}</span>
        </div>
        <div>
          <span>实际总计：{{parseFloat(item.count).toFixed(2)}}，实际市值：{{usdtCountMoney(item.count)}}</span>
        </div>
        <div>
        </div>
        <template v-if="item.code !== 'USDT'">
          <div>
            <span>5/10偏差：<span :class="biNumberClass(item.diff)">{{item.diff}}</span></span>
            <span class="red-text" v-if="item.info.isDiff5to10ValToUp">，转红（操作）</span>
            <span class="green-text" v-if="item.info.isDiff5to10ValToDown">，转绿（操作）</span>
          </div>
          <div>
            <span>macd：<span :class="stockNumberClass(item.macd)">{{parseFloat(item.macd).toFixed(2)}}</span></span>
            <span class="red-text" v-if="item.info.ismacdValToUp">，转红（操作）</span>
            <span class="green-text" v-if="item.info.ismacdValToDown">，转绿（操作）</span>
          </div>
          <div>{{getText(item.info)}}</div>
          <!--<van-row>-->
            <!--<van-col span="12">-->
              <!--<div>-->
                <!--<mt-switch v-model="item.indexDetail.condition_buy_status" @change="stChange(item.indexDetail)">条件买策略</mt-switch>-->
              <!--</div>-->
            <!--</van-col>-->
            <!--<van-col span="12">-->
              <!--<div>-->
                <!--{{item.indexDetail.condition_buy_number}}-->
                <!--&lt;!&ndash;<van-radio-group&ndash;&gt;-->
                  <!--&lt;!&ndash;direction="horizontal"&ndash;&gt;-->
                  <!--&lt;!&ndash;v-model="item.indexDetail.condition_buy_number"&ndash;&gt;-->
                <!--&lt;!&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;<van-radio :name="0.5">1/2</van-radio>&ndash;&gt;-->
                  <!--&lt;!&ndash;<van-radio :name="1">1</van-radio>&ndash;&gt;-->
                <!--&lt;!&ndash;</van-radio-group>&ndash;&gt;-->
              <!--</div>-->
            <!--</van-col>-->
          <!--</van-row>-->
          <!--<div>-->
            <!--<van-row>-->
              <!--<van-col span="12">-->
                <!--<div>-->
                  <!--<mt-switch v-model="item.indexDetail.condition_sell_status"  @change="stChange(item.indexDetail)">条件卖策略</mt-switch>-->
                <!--</div>-->
              <!--</van-col>-->
              <!--<van-col span="12">-->
                <!--<div>-->
                  <!--{{item.indexDetail.condition_sell_number}}-->
                  <!--&lt;!&ndash;<van-radio-group&ndash;&gt;-->
                    <!--&lt;!&ndash;direction="horizontal"&ndash;&gt;-->
                    <!--&lt;!&ndash;v-model="item.indexDetail.condition_sell_number"&ndash;&gt;-->
                  <!--&lt;!&ndash;&gt;&ndash;&gt;-->
                    <!--&lt;!&ndash;<van-radio :name="0.5">1/2</van-radio>&ndash;&gt;-->
                    <!--&lt;!&ndash;<van-radio :name="1">1</van-radio>&ndash;&gt;-->
                  <!--&lt;!&ndash;</van-radio-group>&ndash;&gt;-->
                <!--</div>-->
              <!--</van-col>-->
            <!--</van-row>-->
          <!--</div>-->
          <!--<div>-->
          <!--<mt-radio-->
          <!--title="卖条件数量"-->
          <!--v-model="item.indexDetail.condition_sell_number"-->
          <!--:options="[0.5, 1]">-->
          <!--</mt-radio>-->
          <!--</div>-->
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import {Indicator} from 'mint-ui'
import numberUtil from '@/util/numberUtil.js'
import macdUtil from '@/util/macdUtil.js'

function getAverage (netValue, day, index) {
  let start = index - day + 1
  start = start < 0 ? 0 : start
  let count = 0
  for (let i = index; i >= start; i--) {
    count += netValue[i]['close']
  }
  return numberUtil.keepTwoDecimals(count / (index + 1 - start))
}

export default {
  name: 'BtbIndex',
  data () {
    return {
      list: [],
      proportionAll: 0,
      usdtAll: 0,
      usdtMoney: localStorage.getItem('usdtMoney') || 0,
      positionAll: 0,
      position: 0,
      btbOpen: false
    }
  },
  watch: {
    usdtMoney (val) {
      localStorage.setItem('usdtMoney', val || 0)
    },
    position (val) {
      this.positionChange()
    }
  },
  created () {
    this.queryPosition()
    this.queryOpen()
    this.$http.get('btbIndex/getMyBalanceInfo').then((res) => {
      const data = res.data || {}
      let all = data['ALL'].count
      let proportionAll = 0
      let positionAll = 0
      let list = []
      for (let key in data) {
        if (key !== 'ALL') {
          if (key !== 'USDT') {
            positionAll += data[key].count
          }
          list.push({
            code: key,
            count: data[key].count,
            proportion: data[key].proportion,
            close: 0,
            diff: 0,
            macd: 0,
            diff5C20: 0,
            info: {},
            indexDetail: {}
          })
          proportionAll += data[key].proportion
        }
      }
      this.list = list
      this.proportionAll = proportionAll
      this.usdtAll = all
      this.positionAll = positionAll
    }).then(() => {
      this.list.forEach((v) => {
        if (v.code !== 'USDT') {
          this.queryBIKlines(v)
          this.queryDetail(v)
        }
      })
    })
  },
  methods: {
    getText (info) {
      let f1 = ''
      let f2 = ''
      let f3 = ''
      if (info.ismacdValToUp || info.isDiff5to10ValToUp) {
        f1 = '买入'
        f2 = info.buyTwo ? '开盘价' : '收盘价'
        if (info.close5 > info.close20) {
          f3 = 1
        } else {
          f3 = 2
        }
        // 买入
      }
      if (info.ismacdValToDown || info.isDiff5to10ValToDown) {
        f1 = '卖出'
        f2 = info.sellTwo ? '开盘价' : '收盘价'
        if (info.close5 > info.close20) {
          f3 = 2
        } else {
          f3 = 1
        }
      }
      if (f1) {
        return `${f1}，${f2}，分${f3}天，第${f2.indexOf('开') !== -1 ? 2 : 1}天`
      }
      return ''
    },
    getAverageList (netValue, day) {
      const list = []
      const newList = []
      netValue.forEach((item) => {
        newList.unshift(item)
      })
      newList.forEach((item, index) => {
        const average = getAverage(newList, day, index)
        list.push(average)
      })
      return list
    },
    queryBIKlines (item) {
      return this.$http.get('stock/getBIKlines', {
        name: item.code
      }).then((res) => {
        const list = res.data || []
        const now = list[list.length - 1]
        item.close = now.close
        // 计算
        const count = this.getCount(list)
        item.diff = count.diff
        item.macd = count.macd
        item.diff5C20 = count.diff5C20
        item.info = count
      })
    },
    queryDetail (item) {
      return this.$http.get('btbIndex/getBtbIndexByCode', {
        code: item.code
      }).then((res) => {
        item.indexDetail = res.data || {}
        item.indexDetail.condition_buy_status = !!item.indexDetail.condition_buy_status
        item.indexDetail.condition_sell_status = !!item.indexDetail.condition_sell_status
      })
    },
    getCount (list) {
      // 计算
      // 正序
      const newList = []
      list.forEach((item) => {
        item.netChangeRatio = this.countDifferenceRate(item.close, item.open)
        newList.push(item)
      })
      const macdList = macdUtil.macd_data(list)
      // 倒序
      newList.reverse()
      // 正序
      const list5 = this.getAverageList(newList, 5)
      const list10 = this.getAverageList(newList, 10)
      const list20 = this.getAverageList(newList, 20)
      const diff5to10List = []
      list5.forEach((v, i) => {
        diff5to10List.push(v - list10[i])
      })
      const lastIndex = list5.length - 1
      const diffC = this.countDifferenceRate(list5[lastIndex], list10[lastIndex])
      const diff5C20 = this.countDifferenceRate(list5[lastIndex], list20[lastIndex])
      const diff5To10Macd = macdUtil.getDiff5To10Macd(macdList, diff5to10List, lastIndex)
      return {
        diff: diffC,
        diff5C20,
        macd: macdList[macdList.length - 1],
        ...diff5To10Macd,
        close5: list5[lastIndex],
        close10: list10[lastIndex],
        close20: list20[lastIndex]
      }
    },
    backHandler () {
      this.$router.history.go(-1)
    },
    toEdit (item) {
      this.$router.push({
        path: '/page/myBtbAdd',
        query: {
          type: item.type
        }
      })
    },
    stChange (item) {
      this.$http.post('btbIndex/updateBtbIndex', {
        _id: item._id,
        condition_buy_status: item.condition_buy_status ? 1 : 0,
        condition_sell_status: item.condition_sell_status ? 1 : 0,
        condition_buy_number: item.condition_buy_number,
        condition_sell_number: item.condition_sell_number
      })
    },
    usdtCountMoney (count) {
      const usdtMoney = parseFloat(this.usdtMoney || 0) || 0
      return parseInt((count) * usdtMoney)
    },
    getCountUsdt (proportion) {
      return this.usdtAll * (proportion / this.proportionAll)
    },
    queryPosition () {
      this.$http.get('sys/getDictionaryByKey', {
        key: 'btbPositionConfig'
      }).then((res) => {
        const data = res.data || {}
        const value = parseInt(data.value || 0) || 0
        this.position = value
      })
    },
    queryOpen () {
      this.$http.get('sys/getDictionaryByKey', {
        key: 'btbOpen'
      }).then((res) => {
        const data = res.data || {}
        this.btbOpen = data.value === 'true'
      })
    },
    positionChange () {
      this.$http.post('sys/updateDictionaryByKey', {
        key: 'btbPositionConfig',
        value: this.position
      })
    },
    openChange () {
      this.$http.post('sys/updateDictionaryByKey', {
        key: 'btbOpen',
        value: `${this.btbOpen}`
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .to {
    margin-bottom: 60px;
  }
  .r {
    background-color: #eee;
    padding: 20px;
    div {
      margin-bottom: 10px;
    }
    margin-bottom: 10px;
  }
  .type-card {
    background-color: #eee;
    margin: 20px 0;
  }
</style>
