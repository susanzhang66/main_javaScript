<template>
  <div id="app">

    <http></http>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import http from './components/http'

export default{
  name:'counter',
  components: {
    http
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    //如果你想将一个 getter 属性另取一个名字，使用对象形式：比如：getLogin改名 login
    ...mapGetters({
        login: 'getLogin'
    })
  },
  created () {
    this.checkLogin()
  },
  watch: {
    // 对路由变化作出响应...
    '$route': 'checkLogin'
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
      const routeName = this.$route.name
      console.log(routeName)
      if (routeName === 'login' || routeName === 'identity') return
      if (!this.login.token) {
        this.$router.replace('/login')
      } else {
        this.$store.commit('setCommonParams', this.login)
      }
      this.checkUrl()
    }
  }
}
</script>

<style>
  @import url(./assets/css/index.css)
</style>

