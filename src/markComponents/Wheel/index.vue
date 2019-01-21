<template>
  <div class="page-logo">
    <mt-header title="Logo" :fixed="true">
      <mt-button slot="left">
        <i class="fas fa-chevron-left"></i>
      </mt-button>
      <mt-button slot="right">
        <i class="fas fa-plus"></i>
      </mt-button>
    </mt-header>
    <div class="main-body">
      <a href="#/page/helloWorld">/page/helloWorld</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Wheel',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
