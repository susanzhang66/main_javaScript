// webpack 在编译时，会静态地解析代码中的 require.ensure()，同时将模块添加到一个分开的 chunk 当中。这个新的 chunk 会被 webpack 通过 jsonp 来按需加载。
const signature = r => require.ensure([], () => r(require('@/components/signature')), 'group-signature')

export default {
  path: '/signature',
  name: 'signature',
  component: signature
}
