// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// import filters from './plugins/filter'
import prototypes from './plugins/prototype'
import Dialog from './components/dialog/index.js'
import utils from './plugins/util'


// 注册全局函数   这个是加解秘， jsencrypt。
Object.keys(prototypes).forEach(k => { Vue.prototype[k] = prototypes[k] })

Vue.use( Dialog );

Vue.config.productionTip = false 

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },// 局部组件。
  template: '<App/>'
});



// 单页路由
// const NotFound = { template: '<p>Page not found</p>' }
// const Home = { template: '<p>home page</p>' }
// const About = { template: '<p>about page</p>' }

// const routes = {
//   '/': Home,
//   '/about': About
// }

// new Vue({
//   el: '#app',
//   data: {
//     currentRoute: window.location.pathname
//   },
//   computed: {
//     ViewComponent () {
//       return routes[this.currentRoute] || NotFound
//     }
//   },
//   render (h) { return h(this.ViewComponent) }
// })