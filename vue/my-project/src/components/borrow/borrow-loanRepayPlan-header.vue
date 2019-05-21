<template>
  <section class="currency">
      <p>剩余还款总额(元)</p>
      <p class="money">{{repayCalculateData.rpyTotalAmt | formatMoney}}</p>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'loanRepayPlanHeader',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      getRepayCalculate: 'getRepayCalculate'
    }),
    repayCalculateData () {
      return this.getRepayCalculate
    }
  }
}
</script>
