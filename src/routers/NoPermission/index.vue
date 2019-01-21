<template>
  <div class="page-no-permission">
    <mt-header title="没有权限" :fixed="true">
      <mt-button slot="left" @click="backHandler">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <h1>没有权限</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoPermission',
  data () {
    return {
    }
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
