<template>
  <div id="app">
  这个是测试
  </div>
</template>

<script>


export default {
  name: 'app',

  computed: {

  },
  watch: {

  },
  created () {
    this.checkLogin()
  },
  methods: {
    // 对分享链接被拼接参数进行删除处理
    checkUrl () {
      let url = window.location.href
      if (url.indexOf('?') !== -1 && (url.indexOf('login') !== -1 || this.$route.name === 'account')) {
        url = url.substring(0, url.indexOf('?')) + url.substring(url.indexOf('#'))
        window.location.replace(url)
      }
    },
    checkLogin () {
      this.checkUrl()
    }
  }
}
</script>

<style>
  @import url(../app/main.css)
</style>
