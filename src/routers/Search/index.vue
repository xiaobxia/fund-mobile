<template>
  <div class="page-search">
    <mt-header title="搜索" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <mt-search
        v-model="searchText"
        cancel-text="取消"
        placeholder="搜索">
        <div class="simple">
          <mt-cell-swipe v-for="(item) in showList" :key="item.code" :to="'/page/fundDetail?code='+item.code">
            <div slot="title">
              <h3>{{item.code}} {{formatFundName(item.name)}} <span style="float: right" :class="stockNumberClass(item.change_ratio)">{{item.change_ratio}}%</span></h3>
            </div>
          </mt-cell-swipe>
        </div>
      </mt-search>
    </div>
  </div>
</template>

<script>
let searchTimer = null

export default {
  name: 'Search',
  data () {
    return {
      searchText: '',
      showList: []
    }
  },
  computed: {},
  watch: {
    searchText (val) {
      this.onSearch(val)
    }
  },
  created () {
    this.initPage()
  },
  methods: {
    initPage () {
    },
    onSearch (searchText) {
      clearTimeout(searchTimer)
      searchTimer = setTimeout(() => {
        this.$http.get('fund/searchFunds', {
          keyword: searchText,
          current: 1,
          pageSize: 40
        }).then((res) => {
          this.showList = res.data.list
        })
      }, 1000)
    },
    okHandler () {
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
