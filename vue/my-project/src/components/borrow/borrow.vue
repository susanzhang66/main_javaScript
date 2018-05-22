<template>
  <div>
    <navBar :pageName="pageName" :back="back" :backFuc="backFuc" :rightText="rightText" :rightFuc="rightFuc"></navBar>
    <!-- 申请提现 / 还卡 -->
    <section class="containter">
        <div class="error-top topPosition" v-if="isShowErrorTip"><span class="icon-sm icon-tip"></span>&nbsp;&nbsp;<span>{{errorTipMsg}}</span></div>
        <section class="withdrawal">
            <loanApplyHeader :loanCode="$route.params.loanCode"></loanApplyHeader>
            <div class="with-drawal" :class="$route.params.loanCode ==='0202' ? 'mt' : ''">
              <loanApplyBody :hasRepayPlan="showRepayPlan" :showErrorTip="showErrorTip" :updateAmount="updateAmount" :loanCode="$route.params.loanCode"></loanApplyBody>
            </div>
        </section>
        <loanApplyFooter v-if="showRepay" :goLoanInfoPage="goLoanInfoPage" :goRepayPlanPage="goRepayPlanPage" :getH5Link="getH5Link" :creditCardIdentify="creditCardIdentify"></loanApplyFooter>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import loanApplyHeader from './loanApply-header'
import loanApplyBody from './loanApply-body'
import loanApplyFooter from './loanApply-footer'
import loanApplyIdentityRecord from './loanApply-identityRecord'
import navBar from '../nav-bar'

export default {
  name: 'borrow',
  data () {
    return {
      pageName: this.$route.params.loanCode === '0201' ? '申请提现' : '代还信用卡',
      back: true,
      rightText: this.$route.params.loanCode === '0202' ? '还卡攻略' : '',
      showRepay: false,
      isShowErrorTip: false,
      errorTipMsg: '',
      amount: ''
    }
  },
  components: {
    loanApplyHeader,
    loanApplyBody,
    loanApplyFooter,
    loanApplyIdentityRecord,
    navBar
  },
  computed: {
    ...mapGetters({
      getProduct: 'getProduct',
      getLoanInfoQuery: 'getLoanInfoQuery',
      getRepayCalculate: 'getRepayCalculate',
      getTraceless: 'getTraceless',
      getUserApplyState: 'getUserApplyState'
    }),
    cgiMode () {
      return this.getLoanInfoQuery.infoMap.fundingModel.toUpperCase() === 'U' || this.getLoanInfoQuery.infoMap.fundingModel.toUpperCase() === 'D'
    },
    payApplyNo () {
      return this.getProduct.payApplyNo
    },
    // 客户申请号
    applyNo () {
      return this.getProduct.applyNo
    },
    // 确认页面是否需要显示协议
    showArgeement () {
      return this.getLoanInfoQuery.infoMap.isAccountValid === '0' || this.getLoanInfoQuery.infoMap.isUpdateAgreement === 'Y'
    }
  },
  methods: {
    // 显示还款试算栏
    showRepayPlan (bollean) {
      this.showRepay = bollean
    },
    // 输入金额错误弹出提示
    showErrorTip (errorMsg) {
      this.isShowErrorTip = true
      this.errorTipMsg = errorMsg
      window.setTimeout(() => {
        this.isShowErrorTip = false
        this.errorTipMsg = ''
      }, 2000)
    },
    // 跳转到确认提现页面
    goLoanInfoPage () {
      this.$router.push({
        name: 'loanInfo',
        params: {
          loanCode: this.$route.params.loanCode
        }
      })
    },
    // 子组件传递过来的借款金额更新到父组件
    updateAmount (amount) {
      this.amount = amount
    },
    // 跳转到还款计划页面
    goRepayPlanPage () {
      this.$router.push({
        name: 'loanRepayPlan',
        params: {
          loanCode: this.$route.params.loanCode
        }
      })
    },
    // 银联认证接口
    creditCardIdentify () {
      this.$store.commit('setBorrowParams', {
        paramsKey: 'creditCardIdentifyParams',
        loanBindNo: this.getLoanInfoQuery.infoMap.loanBindNo, // 绑定号
        applyNo: this.applyNo, // 申请号
        payApplyNo: this.payApplyNo, // 支用申请号
        bankCardNo: ''
      })
      this.$store.dispatch('creditCardIdentify')
      .then((data) => {
        // 银联认证被拒,跳转到拒绝页面
        if (data.apvFlag === 'RJ') {
          this.$router.push({
            name: 'creditFailResult'
          })
        // 银联认证时银行卡账号无效（重新绑卡）
        } else if (data.reBindFlag === 'Y') {
          this.showErrorTip('此信用卡不符合放款要求，请更换信用卡')
        // 判断是否是联合放款,如果是先去投保再跳回借款确认页面,担保+小贷直接去借款确认页面
        } else {
          this.isGoInsurance()
        }
      })
    },
    // 是否去产险投保
    isGoInsurance () {
      this.cgiMode ? this.getH5Link() : this.goLoanInfoPage()
    },
    // 获取跳产险页面的url
    getH5Link () {
      // 产险回来页面需要用到的数据通过sessionStorage保存
      let nextPageParams = {
        amount: this.amount,
        counterFee: this.getRepayCalculate.counterFee,
        term: this.getRepayCalculate.term,
        applyNo: this.applyNo,
        loanBindNo: this.getLoanInfoQuery.infoMap.loanBindNo,
        payApplyNo: this.payApplyNo,
        credit: this.showArgeement ? this.getUserApplyState.credit : ''
      }
      this.$store.commit('setBorrowParams', {
        paramsKey: 'getH5LinkParams',
        jsonPara: JSON.stringify({
          success_link: window.location.href + 'loanInfo',  // 页面成功链接函数
          fail_link: window.location.origin + window.location.pathname + '#/loanResult/' + this.$route.params.loanCode + '/fail',  // 页面失败链接函数
          h5_link_addr_expire_date: '1',  // H5链接的有效天数
          is_rebuild: 'Y',  // 是否重新生成链接
          ln_amt: this.amount,  // 借款金额
          ln_term: this.getRepayCalculate.term,  // 借款期限
          appl_no: this.payApplyNo,  // 申请号的值改为支用申请号
          funding_model: this.getLoanInfoQuery.infoMap.fundingModel,
          is_send_insured_SMS: 'N',  // 是否发送投保短信
          use_type: this.getLoanInfoQuery.isFirstPay
        })
      })
      this.$store.dispatch('getH5Link')
      .then((data) => {
        this.$tip.show({message: '您正在进入保险公司网页，保险相关服务由保险公司提供。'})
        setTimeout(() => {
          // 保险单号加入sessionStorage存储对象中
          nextPageParams.insuranceNo = data.cover_no
          this.$store.commit('setLoanInfoParams', JSON.stringify(nextPageParams))
          if (this.getTraceless) {
            location.href = data.h5_link_addr
          }
        }, 2000)
      })
    },
    backFuc () {
      this.$router.push({
        name: 'account'
      })
    },
    rightFuc () {
      this.$router.push({
        name: 'productDetail'
      })
    }
  }
}
</script>

<style>
.topPosition {
  top: 0.9rem;
}
</style>
