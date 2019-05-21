import Vue from 'vue'
import Router from 'vue-router'

import login from './login'
import account from './account'
import signature from './signature'
import borrow from './borrow'


Vue.use(Router)

export default new Router({
  routes: [
    login,
    account,
    signature,
    borrow
  ]
})

// const User = {
// 	// $route.params 这个可以拿到路由的参数。
//   template: '<div>User {{ $route.params.id }}<div>嵌套路由<router-view/></div></div>',
//   // 响应路由参数的变化1，$route
//   watch: {
//     '$route' (to, from) {
//       // 对路由变化作出响应...
//     }
//   },
//   //响应路由变化2 beforeRouteUpdate
//   beforeRouteUpdate (to, from, next) {
//     console.log( to );
//   }
// }

// const UserProfile = {
// 	// $route.params 这个可以拿到路由的参数。
//   template: '<div>UserProfile 子路由</div>',
//   // 响应路由参数的变化1，$route
//   watch: {
//     '$route' (to, from) {
//       // 对路由变化作出响应...
//     }
//   },
//   //响应路由变化2 beforeRouteUpdate
//   beforeRouteUpdate (to, from, next) {
//     console.log( to );
//   }
// }
// const UserPosts = {
// 	// $route.params 这个可以拿到路由的参数。
//   template: '<div>UserPosts 子路由</div>',
//   // 响应路由参数的变化1，$route
//   watch: {
//     '$route' (to, from) {
//       // 对路由变化作出响应...
//     }
//   },
//   //响应路由变化2 beforeRouteUpdate
//   beforeRouteUpdate (to, from, next) {
//     console.log( to );
//   }
// }
// const Foo = { template: '<div>foo</div>' }
// export default new Router({
//   routes: [
//     // 动态路径参数 以冒号开头  即以user开头的 都会映射到这个组件。
//     // 动态路由匹配
//     { path: '/', name: 'user', component: User,
//     	children: [     //嵌套路由  重要  todos。。。
//         {
//           // 当 /user/:id/profile 匹配成功，
//           // UserProfile 会被渲染在 User 的 <router-view> 中
//           path: 'profile',
//           component: UserProfile
//         },
//         {
//           // 当 /user/:id/posts 匹配成功
//           // UserPosts 会被渲染在 User 的 <router-view> 中
//           path: 'posts',
//           component: UserPosts
//         }
//       ]   
//     },
//     { path: '/foo', component: Foo }  //这个点击后的逻辑 是如何渲染的？？？
//     // {
//     //   path: '/',
//     //   name: 'HelloWorld',
//     //   component: HelloWorld
//     // }
//   ]
// })

