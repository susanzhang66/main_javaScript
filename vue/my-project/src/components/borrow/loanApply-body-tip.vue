<template>
  <div>
    <section class="leayer" v-if="loanInfoQuery.maxLoanAmt - loanInfoQuery.minLoanAmt < 0">
        <div class="dialog">
            <div class="rmd-con">
                <div class="img-money"></div>
                <p class="txt">您的当前可用额度不足</p>
                <div class="mt50 tac">
                    <div class="btn btn-up" @click="backToAccount">我的i贷</div>
                </div>
            </div>
        </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'iloanApplyBodyTip',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      getLoanInfoQuery: 'getLoanInfoQuery'
    }),
    loanInfoQuery () {
      return this.getLoanInfoQuery.infoMap
    }
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
