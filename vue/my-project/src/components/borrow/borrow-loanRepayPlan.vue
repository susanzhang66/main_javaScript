<template>
  <div>
    <navBar :pageName="pageName" :back="back" :backFuc="backFuc"></navBar>
    <section class="box-orient">
      <borrowLoanRepayPlanHeader></borrowLoanRepayPlanHeader>
      <borrowLoanRepayPlanBody></borrowLoanRepayPlanBody>
    </section>
  </div>
</template>

<script>
import borrowLoanRepayPlanHeader from './borrow-loanRepayPlan-header'
import borrowLoanRepayPlanBody from './borrow-loanRepayPlan-body'
import navBar from '../nav-bar'

export default {
  name: 'borrowLoanRepayPlan',
  data () {
    return {
      pageName: '还款计划',
      back: true
    }
  },
  components: {
    borrowLoanRepayPlanHeader,
    borrowLoanRepayPlanBody,
    navBar
  },
  methods: {
    backFuc () {
      this.$router.go(-1)
    }
  }
}
</script>
