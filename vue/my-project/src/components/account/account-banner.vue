<template>
  <section class="acc-pay" v-if="isSettle">
    <p class="no">
      ◆&nbsp;&nbsp;◆&nbsp;&nbsp;◆&nbsp;&nbsp;&nbsp;
      <span>当前无欠款</span>
      &nbsp;&nbsp;&nbsp;◆&nbsp;&nbsp;◆&nbsp;&nbsp;◆
    </p>
  </section>
  <section class="acc-pay" v-on:click="toRepay" v-else>
    <div class="icon-sm icon-right" v-if="!isPending"></div>
    <p>{{userApplyState.rpyInfo.rpyDate}}将从{{userApplyState.rpyInfo.remindInfo}}自动扣除</p>
    <div class="money" v-bind:class="rpyInfo.className">
      <span class="num">{{isPending ? "--" : userApplyState.rpyInfo.rpyAmt | formatMoney }}</span><span class="yuan">元</span>
      <span class="btn-state">{{ rpyInfo.text }}</span>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

const rpyCode = {
  TD: {text: '待放款', className: 'pending gray'},
  RP: {text: '还款中', className: ''},
  OD: {text: '已逾期', className: 'overdue'},
  LP: {text: '已逾期', className: 'overdue'}
}

export default {
  name: 'account-banner',
  computed: {
    ...mapGetters({
      userApplyState: 'getUserApplyState'
    }),
    isSettle () {
      return this.userApplyState.rpyInfo.rpyStatus === 'SE' || this.userApplyState.rpyInfo.rpyStatus === 'NP'
    },
    rpyInfo () {
      return rpyCode[this.userApplyState.rpyInfo.rpyStatus]
    },
    isPending () {
      return this.userApplyState.rpyInfo.rpyStatus === 'TD'
    }
  },
  methods: {
    toRepay () {
      if (this.isPending) return
      this.$router.push({
        name: 'repay'
      })
    }
  }
}
</script>
