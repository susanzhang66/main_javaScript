<template>
  <body>
    <navBar :pageName="pageName" :back="back"></navBar>
    <!-- 提现 / 还卡 成功页 -->
    <section v-if="$route.params.loanResult === 'suc'">
      <loanResultSucHeader></loanResultSucHeader>
      <loanResultSucBody v-if="firstRender" :closeTip="closeTip"></loanResultSucBody>
      <loanResultSucFooter></loanResultSucFooter>
    </section>
    <!-- 提现 / 还卡 失败页 -->
    <section>
      <loanResultFail v-if="$route.params.loanResult === 'fail'"></loanResultFail>
    </section>
  </body>
</template>

<script>
import loanResultSucHeader from './loanResult-suc-header'
import loanResultSucBody from './loanResult-suc-body'
import loanResultSucFooter from './loanResult-suc-footer'
import loanResultFail from './loanResult-fail'
import navBar from '../nav-bar'

export default {
  name: 'loanResult',
  data () {
    return {
      pageName: this.$route.params.loanResult === 'suc' ? '申请成功' : '申请失败',
      back: false,
      firstRender: false
    }
  },
  created () {
    this.firstRender = true
  },
  components: {
    loanResultSucHeader,
    loanResultSucBody,
    loanResultSucFooter,
    loanResultFail,
    navBar
  },
  methods: {
    closeTip () {
      this.firstRender = false
    }
  }
}

</script>
