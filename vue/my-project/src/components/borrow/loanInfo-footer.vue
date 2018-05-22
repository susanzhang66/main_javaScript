<template>
  <div>
    <div class="checkbox" :class="isShowAgreement ? '' : 'vsb'">
        <label :class="buttonGray ? '' : 'checked'"><span class="icon-sm icon-checkbox" @click="changeButton"></span>同意</label>
        <span>
          <span class="link" v-if="!cgiMode" @click="toAgreement">《借款及担保协议》</span>
          <span class="link" v-if="cgiMode" @click="toAgreement">《借款协议》</span>
          <span class="link" v-if="cgiMode && loanInfoQuery.infoMap.isAccountValid === '0'" @click="toContract">《资料代传合同》</span>
        </span>
    </div>
    <footer class="fixed fixed-wrap">
      <div class="btn" :class="buttonGray ? 'btn-dis' : ''" @click="buttonGray ? '' : loanConfirm()">{{isShowAgreement ? '同意协议并确认' + productName : '确认' + productName}}</div>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'loanInfoFooter',
  data () {
    return {
      buttonGray: false,
      productName: this.$route.params.loanCode === '0201' ? '提现' : '借款'
    }
  },
  props: {
    // 跳转到借款成功/失败页
    loanConfirm: {
      type: Function,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      getLoanInfoQuery: 'getLoanInfoQuery' // 借款查询接口
    }),
    loanInfoQuery () {
      return this.getLoanInfoQuery
    },
    cgiMode () {
      return this.getLoanInfoQuery.infoMap.fundingModel.toUpperCase() === 'U' || this.getLoanInfoQuery.infoMap.fundingModel.toUpperCase() === 'D'
    },
    // 展示借款协议和变更下一步按钮
    isShowAgreement () {
      return this.loanInfoQuery.infoMap.isAccountValid === '0' || this.loanInfoQuery.infoMap.isUpdateAgreement === 'Y'
    }
  },
  methods: {
    // 勾选切换按钮是否可点击
    changeButton () {
      this.buttonGray = !this.buttonGray
    },
    // 借款协议
    toAgreement () {
      this.$router.push({name: 'agreementLoanInfo'})
    },
    // 资料代传合同
    toContract () {
      this.$router.push({name: 'contractLoanInfo'})
    }
  }
}
</script>
