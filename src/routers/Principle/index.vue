<template>
  <div class="principle-wrap">
    <mt-header title="原则" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <div class="question">
        锁仓由18以上转12以内
      </div>
      <div class="answer">
        <mt-radio
          align="right"
          v-model="question_10"
          :options="['是', '否']">
        </mt-radio>
      </div>
      <div class="question">
        是否有持续恐慌大事件？（大跌后不翻红，才算出清）
      </div>
      <div class="answer">
        <mt-radio
          align="right"
          v-model="question_9"
          :options="['是', '否']">
        </mt-radio>
      </div>
      <div class="question">
        市场阶段？（根据年线判断）
      </div>
      <div class="answer">
        <mt-radio
          align="right"
          v-model="question_1"
          :options="['筑底', '正常','筑顶', '筑顶后大跌']">
        </mt-radio>
      </div>
      <div class="question">
        是否需要护盘？
      </div>
      <div class="answer">
        <mt-radio
          align="right"
          v-model="question_2"
          :options="['是', '否']">
        </mt-radio>
      </div>
      <div class="question">
        市场强弱情况？
      </div>
      <div class="answer">
        <mt-radio
          align="right"
          v-model="question_3"
          :options="['强', '略强', '略弱', '弱']">
        </mt-radio>
      </div>
      <div class="question">
        消息面情况？
      </div>
      <div class="answer">
        <mt-radio
          align="right"
          v-model="question_4"
          :options="['利好', '无', '利空']">
        </mt-radio>
      </div>
      <div class="question">
        明天是否是特殊的时间点（事件，周五，假期）？
      </div>
      <div class="answer">
        <mt-radio
          align="right"
          v-model="question_5"
          :options="['是', '否']">
        </mt-radio>
      </div>
      <div class="question">
        是否有上涨的意愿（高开冲高，只看前30分钟）？
      </div>
      <div class="answer">
        <mt-radio
          align="right"
          v-model="question_6"
          :options="['是', '一般','否']">
        </mt-radio>
      </div>
      <div class="question">
        是否悲观？
      </div>
      <div class="answer">
        <mt-radio
          align="right"
          v-model="question_7"
          :options="['乐观', '无', '悲观']">
        </mt-radio>
      </div>
      <div class="question">
        挣钱是否变吃力？
      </div>
      <div class="answer">
        <mt-radio
          align="right"
          v-model="question_8"
          :options="['吃力', '不吃力']">
        </mt-radio>
      </div>
    </div>
  </div>
</template>
<script>
import storageUtil from '@/util/storageUtil.js'
export default {
  name: 'Principle',
  data () {
    return {
      question_1: storageUtil.getData('stockMarketQuestion', 'question_1'),
      question_2: storageUtil.getData('stockMarketQuestion', 'question_2'),
      question_3: storageUtil.getData('stockMarketQuestion', 'question_3'),
      question_4: storageUtil.getData('stockMarketQuestion', 'question_4'),
      question_5: storageUtil.getData('stockMarketQuestion', 'question_5'),
      question_6: storageUtil.getData('stockMarketQuestion', 'question_6'),
      question_7: storageUtil.getData('stockMarketQuestion', 'question_7'),
      question_8: storageUtil.getData('stockMarketQuestion', 'question_8'),
      question_9: storageUtil.getData('stockMarketQuestion', 'question_9'),
      question_10: storageUtil.getData('stockMarketQuestion', 'question_10')
    }
  },
  watch: {
    question_1 (val) {
      this.$http.post('stock/updateStockMarketQuestion', {
        key: 'question_1',
        value: val
      })
    },
    question_2 (val) {
      this.$http.post('stock/updateStockMarketQuestion', {
        key: 'question_2',
        value: val
      })
    },
    question_3 (val) {
      this.$http.post('stock/updateStockMarketQuestion', {
        key: 'question_3',
        value: val
      })
    },
    question_4 (val) {
      this.$http.post('stock/updateStockMarketQuestion', {
        key: 'question_4',
        value: val
      })
    },
    question_5 (val) {
      this.$http.post('stock/updateStockMarketQuestion', {
        key: 'question_5',
        value: val
      })
    },
    question_6 (val) {
      this.$http.post('stock/updateStockMarketQuestion', {
        key: 'question_6',
        value: val
      })
    },
    question_7 (val) {
      this.$http.post('stock/updateStockMarketQuestion', {
        key: 'question_7',
        value: val
      })
    },
    question_8 (val) {
      this.$http.post('stock/updateStockMarketQuestion', {
        key: 'question_8',
        value: val
      })
    },
    question_9 (val) {
      this.$http.post('stock/updateStockMarketQuestion', {
        key: 'question_9',
        value: val
      })
    },
    question_10 (val) {
      this.$http.post('stock/updateStockMarketQuestion', {
        key: 'question_10',
        value: val
      })
    }
  },
  computed: {},
  created () {
  },
  methods: {
    backHandler () {
      this.$router.history.go(-1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
