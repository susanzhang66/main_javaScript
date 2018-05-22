import Vuex from 'vuex'
import Vue from 'vue'
import login from './login'
import http from './http'
import account from './account'
import signature from './signature'
import borrow from './borrow'
Vue.use(Vuex)

// const store = new Vuex.Store({
//   state: {
//     count: 0,
//     login
//   },
//   mutations: {
//     increment (state) {
//       state.count++
//     }
//   }
// })

export default new Vuex.Store({
  modules: {
    http,
    login,
    account,
    signature,
    borrow
  }
})
