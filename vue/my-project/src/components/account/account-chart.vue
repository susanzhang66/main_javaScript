<template>
  <div>
    <div class="chart">
      <div class="tar"><span class="link" @click="showAgreement">查看协议</span></div>
      <div class="account-svg" v-bind:class="accountClass">
        <svg width="220px" height="190px">
            <path d="M38 180 A 100 100, 0, 1, 1, 180 180" stroke="#d8d8d8" stroke-width="12" stroke-linecap="round" fill="transparent"></path>
            <path d="M38 180 A 100 100, 0, 1, 1, 180 180" id="path" stroke-width="4" stroke-linecap="round" fill="transparent" v-bind:style="pathStyle"></path>
        </svg>
        <div class="svg-con">
            <h2>可用额度(元)</h2>
            <p>{{ userApplyState.availableCredit | formatMoney }}</p>
        </div>
      </div>
      <div class="txt" v-if="accountFreeze">您的账户已冻结<br>请点击“立即还款”还清{{ overDate ? '逾期' : '' }}应还款项。</div>
    </div>
    <section class="leayer" v-if="cgiMode" v-show="actionSheet">
      <div class="fixed">
        <div class="btn-ios">
          <ul>
            <li @click="toAgreement">《借款协议》</li>
            <li @click="toContract">《资料代传合同》</li>
          </ul>
          <ul>
            <li v-on:click="showActionSheet(false)">取消</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'account-chart',
  data () {
    return {
      actionSheet: false
    }
  },
  computed: {
    ...mapGetters({
      userApplyState: 'getUserApplyState'
    }),
    // 资金模式
    cgiMode () {
      return this.userApplyState.fundingModel === 'U' || this.userApplyState.fundingModel === 'D'
    },
    // 是否逾期
    overDate () {
      return this.userApplyState.rpyInfo.rpyStatus === 'OD' || this.userApplyState.rpyInfo.rpyStatus === 'LP'
    },
    // 账户是否冻结
    accountFreeze () {
      // 账户状态 N:正常 FZ:冻结 FF:永久冻结
      const accountStatusI = this.userApplyState.ICreditInfo.accountStatus
      const accountStatusBT = this.userApplyState.BTCreditInfo && this.userApplyState.BTCreditInfo.accountStatus
      return accountStatusI !== 'N' && accountStatusBT !== 'N'
    },
    // 账户冻结和可用额度为零的样式
    accountClass () {
      const availableCredit = this.userApplyState.availableCredit
      return {
        'account-zreo': availableCredit === '0',
        'gray-svg': this.accountFreeze
      }
    },
    // 额度转盘样式
    pathStyle () {
      const availableCredit = this.userApplyState.availableCredit
      const credit = this.userApplyState.credit
      const dior = availableCredit / credit
      const num1 = Math.floor(471 * dior)
      const num2 = 471 - num1
      return {
        'stroke-dasharray': num1 + ' ' + num2
      }
    }
  },
  methods: {
    // 查看协议
    showAgreement () {
      if (this.cgiMode) {
        this.showActionSheet(true)
      } else {
        this.toAgreement()
      }
    },
    showActionSheet (boolean) {
      this.actionSheet = boolean
    },
    // 借款协议
    toAgreement () {
      this.$router.push({name: 'agreement'})
    },
    // 资料代传合同
    toContract () {
      this.$router.push({name: 'contract'})
    }
  }
}
</script>
