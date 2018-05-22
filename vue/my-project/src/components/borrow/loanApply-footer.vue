<template>
  <div>
    <section class="play">
      <div class="t pr0"><span class="icon-sm icon-snow"></span><span class="red">[按日计息，随借随还] </span>次日即可提前还款哦 <span class="free">免手续费</span></div>
        <div class="f-row" @click="goRepayPlanPage">
            <ul>
                <li class="mul">
                    <div class="row">
                        <div class="col-l"><span class="icon-sm icon-play"></span>还款计划</div>
                        <div class="col-r" v-if="$route.params.loanCode === '0201'"><div class="arrow">总息费{{repayCalculateData.interestFee | formatMoney}}元</div></div>
                        <div class="col-r" v-if="$route.params.loanCode === '0202'"><div class="arrow">月均息费{{repayCalculateData.interestFee | formatMoney}}元<p class="blue economize-text">比银行省约{{repayCalculateData.saveAmt | formatMoney}}元</p></div></div>
                        <div><span class="icon-sm icon-arrow"></span></div>
                    </div>
                </li>
            </ul>
        </div>
    </section>
    <section class="leayer" v-if="isShowFrequencyLimit">
        <div class="dialog">
            <div class="pop-change">
                <div class=""></div>
                <h3 class="fwb">温馨提示</h3>
                <p class="mt" >您当前未结清的借款笔数不能超过<span>{{loanInfoQuery.frequencyLimit}}</span>笔，请先结清其他借款后再来申请。</p>
            </div>
            <div class="dialog-flex">
                <div class="b-txt" @click="frequencyLimitTip(false)">稍后申请</div>
                <div class="b-txt red" @click="toGoRepay">去还款</div>
            </div>
        </div>
    </section>
    <section class="leayer" v-if="isShowInsurancePrompt">
        <div class="insurance-popup"><div class="close js-prompt-close" @click="showInsurancePrompt(false)"></div>
                <h2>个人借款保证保险投保须知</h2>
                <p><strong>您需签订《平安个人借款保证保险投保单》，以继续您的借款申请流程，点击&nbsp;“下一步”&nbsp;后将为您跳转至产险页面。</strong></p>
                <div class="insurance-margin-top">
                    <p><strong>[保险费用]</strong></p>
                    <p>前述日费率及还款计划中已包含投保后的相关费用，<span class="hl-words">未放款不收费</span>（具体还款金额以放款后实际发生为准）。</p>
                </div>
                <div class="insurance-margin-top">
                    <p><strong>[安全保障]</strong></p>
                    <p>本保险服务由平安产险提供，您的基本信息将同步至投保单，安全有保障。</p>
                </div>
        </div>
    </section>
    <footer class="fixed-wrap">
        <p class="prompt padding-up" v-if="cgiMode">点击&nbsp;"下一步"&nbsp;签约个人借款保证保险投保单 <span class="icon-note know-detail" @click="showInsurancePrompt(true)"></span></p>
        <div class="btn" @click="toGoLoanInfoPage">下一步</div>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'repayPlan',
  data () {
    return {
      isShowFrequencyLimit: false,
      isShowInsurancePrompt: false
    }
  },
  props: {
    goLoanInfoPage: {
      type: Function,
      default: null
    },
    goRepayPlanPage: {
      type: Function,
      default: null
    },
    getH5Link: {
      type: Function,
      default: null
    },
    creditCardIdentify: {
      type: Function,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      getRepayCalculate: 'getRepayCalculate',
      getBtRepayCalculate: 'getBtRepayCalculate',
      getLoanInfoQuery: 'getLoanInfoQuery'
    }),
    loanInfoQuery () {
      return this.getLoanInfoQuery.infoMap
    },
    repayCalculateData () {
      return this.getRepayCalculate
    },
    cgiMode () {
      return this.getLoanInfoQuery.infoMap.fundingModel.toUpperCase() === 'U' || this.getLoanInfoQuery.infoMap.fundingModel.toUpperCase() === 'D'
    }
  },
  methods: {
    // 跳转到确认借款信息页面
    toGoLoanInfoPage () {
      let isLoan = this.getLoanInfoQuery.infoMap.isLoan
      if (!this.loanInfoQuery.creditCardName) {
        this.$tip.show({message: '请先添加收款信用卡! '})
      } else if (isLoan && isLoan === 'N') {
        this.frequencyLimitTip(true)
      } else {
        // 还卡流程需要先银联验证信用卡
        this.$route.params.loanCode === '0202' ? this.creditCardIdentify() : this.isGoInsurance()
      }
    },
    // 是否去产险投保
    isGoInsurance () {
      this.cgiMode ? this.getH5Link() : this.goLoanInfoPage()
    },
    // 借款笔数提示展示
    frequencyLimitTip (bollean) {
      this.isShowFrequencyLimit = bollean
    },
    // 投保提示展示
    showInsurancePrompt (bollean) {
      this.isShowInsurancePrompt = bollean
    },
    // 跳转到还款详情页面
    toGoRepay () {
      this.$router.push({
        name: 'repayRecord'
      })
    }
  }
}
</script>

<style>
.padding-up {
  padding: 0.3rem 0.27rem !important;
}
</style>
