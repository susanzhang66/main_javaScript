<template>
  <body class="white-bg">
    <navBar :pageName="pageName" :back="back"></navBar>
    <section class="result2">
      <div class="icon-cry" style="margin: 0 auto 1rem;"></div>
      <h2>对不起，您的申请未通过审核(T_T)</h2>
      <h2>建议您过段时间再来试试！</h2>
      <div class="fixed fixed-wrap3">
        <div class="btn" @click="backToAccount">返回首页</div>
      </div>
    </section>
  </body>
</template>

<script>
import navBar from '../nav-bar'

export default {
  name: 'creditFailResult',
  data () {
    return {
      pageName: '申请失败',
      back: false
    }
  },
  components: {
    navBar
  },
  methods: {
    backToAccount () {
      this.$router.push({
        name: 'account'
      })
    }
  }
}

</script>
