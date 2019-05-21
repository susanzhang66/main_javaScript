<template>
  <div class="containter" v-if="renderPage">
    <navBar :pageName="pageName" :back="back" :backFuc="backFuc" :rightText="rightText" :rightFuc="rightFuc"></navBar>
    <accountBanner></accountBanner>
    <section class="account">
      <accountChart></accountChart>
      <accountProduct></accountProduct>
    </section>
  </div>
</template>

<script>
import accountBanner from './account-banner'
import accountChart from './account-chart'
import accountProduct from './account-product'
import navBar from '../nav-bar'
import { mapGetters } from 'vuex'

export default {
  name: 'account',
  props: ['renderPage'],
  components: {
    accountBanner,
    accountChart,
    accountProduct,
    navBar
  },
  data () {
    return {
      pageName: '我的i贷',
      back: false,
      rightText: '立即还款'
    }
  },
  computed: {
    ...mapGetters({
      userApplyState: 'getUserApplyState'
    })
  },
  methods: {
    rightFuc () {
      if (this.userApplyState.rpyInfo.rpyStatus === 'LP') {
        this.$router.push({name: 'repay'})
      } else {
        this.$router.push({name: 'repayRecord'})
      }
    },
    backFuc () {
      this.$router.go(-1)
    }
  }
}
</script>
