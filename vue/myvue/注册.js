   vue.js截取的。注册插件。。
    function initUse(Vue) {
        Vue.use = function(plugin) {
            /* istanbul ignore if */
            if (plugin.installed) {
                return
            }
            // additional parameters
            var args = toArray(arguments, 1);
            args.unshift(this);
            if (typeof plugin.install === 'function') {
                plugin.install.apply(plugin, args);
            } else if (typeof plugin === 'function') {
                plugin.apply(null, args);
            }
            plugin.installed = true;
            return this
        };
    }

    注册组件的几种方式
    1. 全局组件。
    // <div id="counter-event-example">
    //     <p>{{ total }}</p>
    //    name: increment, value:incrementTotal; 监听注册事件。
    //     <button-counter v-on:increment="incrementTotal"></button-counter>
    //     <button-counter v-on:increment="incrementTotal"></button-counter>
    // </div>
    Vue.component('button-counter', {
        template: '<button v-on:click="increment1">{{ counter }}</button>',
        data: function() {
            return {
                counter: 0
            }
        },
        methods: {
            increment1: function() {
                this.counter += 1
                this.$emit('increment')
            }
        },
    })
    new Vue({
        el: '#counter-event-example',
        data: {
            total: 0
        },
        methods: {   //这里的方法先 看模版里的（v-on） 首先 监听注册。？  这个函数应该是全局的。。
            incrementTotal: function() {
                this.total += 1
            }
        }
    })

    2. 局部子组件，注意局部注册的组件在其子组件中不可用。
    // <template>
    //   <div id="app">
    //     <http></http>
    //     <router-view></router-view>
    //   </div>
    // </template>
import http from './components/http'
export default{
  name:'counter',
  components: {   //这里是一个 局部子组件，
    http
  },
  watch: {
    // 对路由变化作出响应...
    '$route': 'checkLogin'
  },
  methods: {}

}

3.基础组件的自动化全局注册
