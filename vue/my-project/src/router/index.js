import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'


import Index from '@/components/index.vue';
import Button from '@/components/button.vue';

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/button', name: 'button', component: Button},
    {path: '/', name: 'index', component: Index}
  ]
})
