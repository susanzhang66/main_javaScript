<template>
  <div>
    <navBar :pageName="pageName" :back="back" :backFuc="backFuc"></navBar>
    <!-- 确认提现 / 还卡 -->
    <section>
      <section class="containter fix-btm">
          <section class="confirm">
            <loanInfoHeader></loanInfoHeader>
            <loanInfoTip v-if="levelChangeTip"></loanInfoTip>
            <loanInfoFooter :loanConfirm="loanConfirm"></loanInfoFooter>
          </section>
      </section>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import loanInfoHeader from './loanInfo-header'
import loanInfoFooter from './loanInfo-footer'
import loanInfoTip from './loanInfo-tip'
import navBar from '../nav-bar'

export default {
  name: 'loanInfo',
  data () {
    return {
      pageName: this.$route.params.loanCode === '0201' ? '确认提现信息' : '确认借款信息',
      back: true,
      levelChangeTip: false
    }
  },
  created () {
    // 从产险投保回来，将sessionStorage值更新到store
    if (this.cgiMode) {
      this.$store.commit('setLoanBindNo', this.getLastPageParams.loanBindNo)
      this.$store.commit('setNewAmount', this.getLastPageParams.amount)
      this.$store.commit('setTerm', this.getLastPageParams.term)
      this.$store.commit('setInsuranceNo', this.getLastPageParams.insuranceNo)
      this.$store.commit('setCounterFee', this.getLastPageParams.counterFee)
      this.showArgeement && this.$store.commit('setCredit', this.getLastPageParams.credit)
      // 更新到store，用于确认信息页面协议展示，协议展示判断用的是申请状态查询接口的字段
      this.showArgeement && this.$store.commit('setDataVersionNo', this.getDataVersionNo())
    }
    // 借款协议包括cgi的借款协议和担保下的借款及担保协议，当协议需要更新的时候，都需要更新store
    this.showArgeement && this.$store.commit('setVersionNo', this.getVersionNo())
    this.cgiMode && this.$route.params.loanCode === '0201' && this.getUnderwritingRes()
  },
  activated () {
    // 还卡流程确认借款页面一进来先获取信用卡信息
    this.cgiMode && this.$route.params.loanCode === '0202' && this.getUnderwritingRes()
  },
  components: {
    loanInfoHeader,
    loanInfoFooter,
    loanInfoTip,
    navBar
  },
  computed: {
    ...mapGetters({
      getLoanInfoQuery: 'getLoanInfoQuery', // 借款查询接口
      getProduct: 'getProduct',
      getLoanAmt: 'getLoanAmt',
      getLastPageParams: 'getLastPageParams',
      getRepayCalculate: 'getRepayCalculate',
      getH5LinkParams: 'getH5LinkParams'
    }),
    cgiMode () {
      return this.getLoanInfoQuery.infoMap.fundingModel.toUpperCase() === 'U' || this.getLoanInfoQuery.infoMap.fundingModel.toUpperCase() === 'D'
    },
    // 客户申请号
    applyNo () {
      return this.getProduct.applyNo
    },
    // 支用申请号
    payApplyNo () {
      return this.getProduct.payApplyNo
    },
    // 银行编号
    loanBindNo () {
      return this.getLoanInfoQuery.infoMap.loanBindNo
    },
    // 借款金额
    amount () {
      return this.getLoanAmt
    },
    // 借款期数
    term () {
      return this.getRepayCalculate.term
    },
    // 投保单号
    insuranceNo () {
      return this.getH5LinkParams.cover_no
    },
    // 动用手续费
    counterFee () {
      return this.getRepayCalculate.counterFee
    },
    // 确认页面是否需要显示协议
    showArgeement () {
      return this.getLoanInfoQuery.infoMap.isAccountValid === '0' || this.getLoanInfoQuery.infoMap.isUpdateAgreement === 'Y'
    },
    // 是否更新资料代传合同
    isUpdateAgreement () {
      let isAccountValid = this.getLoanInfoQuery.infoMap.isAccountValid
      return isAccountValid && isAccountValid === '0' ? 'Y' : this.getLoanInfoQuery.infoMap.isUpdateAgreement
    },
    // 是否变更借款合同有效期
    isAccountValid () {
      let isAccountValid = this.getLoanInfoQuery.infoMap.isAccountValid
      return isAccountValid && isAccountValid === '0' ? '1' : ''
    }
  },
  methods: {
    // 调用通知核保接口
    getUnderwritingRes () {
      this.$store.commit('setBorrowParams', {
        paramsKey: 'getUnderwritingResParams',
        insuranceRate: this.getLoanInfoQuery.infoMap.premium,  // 日保费费率
        insuranceRateCode: this.getLoanInfoQuery.infoMap.insuranceRateCode, // 保费率码值 525产险剥离二期添加
        term: this.term,  // 贷款期数
        applyNo: this.applyNo,  // 申请号
        insuranceNo: this.insuranceNo,  // 投保单号
        ln_amt: this.amount  // 借款金额
      })
      this.$store.dispatch('getUnderwritingRes')
      .then((data) => {
        // 核保失败跳转到系统开小差页
        if (data.resultCode !== '1') {
          this.$router.push({
            name: 'loanResult',
            params: {
              loanResult: 'fail'
            }
          })
        }
      })
    },
    // 变更versionNo
    getVersionNo () {
      // 版本更新是写死在这里的，总是改为最新的。
      const cgiVersionNo = {
        'L': 'v4.0',
        'H': 'v3.1', // 湖南小贷
        'C': 'v3.2' // 重庆小贷
      }
      const loanCompanyCode = this.getLoanInfoQuery.loanCompanyCode || 'L'
      // 如果是担保模式，借款协议版本号写死最新的，如果是cgi模式，按照匹配的返回
      return this.cgiMode ? cgiVersionNo[loanCompanyCode] : 'v1.2'
    },
    // 资料代传协议版本号
    getDataVersionNo () {
      return this.cgiMode ? 'v1.1' : ''
    },
    // 调用确认借款信息接口
    loanConfirm () {
      this.$store.commit('setBorrowParams', {
        paramsKey: 'loanConfirmParams',
        jsonPara: JSON.stringify({
          applyNo: this.applyNo,
          loanCode: this.$route.params.loanCode,
          payApplyNo: this.payApplyNo,
          loanBindNo: this.loanBindNo,
          loanAmt: String(this.amount),
          insuranceNo: this.insuranceNo, // 511版本,首贷/再贷提现确认增加投保单号入参
          versionNo: this.getVersionNo(),
          dataVersionNo: this.getDataVersionNo(), // 资料代传 版本
          isUpdateAgreement: this.isUpdateAgreement,
          isAccountValid: this.isAccountValid
        })
      })
      this.$store.dispatch('loanConfirm')
      .then((data) => {
        // 签约被拒绝情况
        if (data.subProcessCode === 'RJ') {
          this.$router.push({
            name: 'creditFailResult'
          })
        // 签约重新评级情况
        } else if (data.levelChange === '1') {
          this.levelChangeTip = true
        // 跳转到借款结果页面
        } else {
          this.goLoanResult(data)
        }
      })
    },
    // 跳转到借款结果页面
    goLoanResult (data) {
      if (data.signSwitch === '1') {
        // resultCode为1跳签约成功页,其他为签约失败
        if (data.resultCode === '1') {
          // 联合放款才需要url带参,因为跳到产险投保新开页面
          let queryParams = this.cgiMode ? {
            loanBindNo: this.$route.params.loanCode === '0202' ? this.loanBindNo : this.getLoanInfoQuery.infoMap.loanBindNo,
            applyNo: this.$route.params.loanCode === '0202' ? this.applyNo : ''
          } : {}
          // 签约成功页
          this.$router.replace({
            name: 'loanResult',
            params: {
              loanCode: this.$route.params.loanCode,
              loanResult: 'suc',
              from: 'loanInfo'
            },
            query: queryParams
          })
        } else {
          // 签约失败页面
          this.$router.replace({
            name: 'loanResult',
            params: {
              loanCode: this.$route.params.loanCode,
              loanResult: 'fail'
            }
          })
        }
      } else {
        this.$tip.show({message: data.switchMsg || data.resultMsg})
      }
    },
    backFuc () {
      // 如果本地数据有支用申请号,说明是产险过来的,点击返回跳试算页面
      if (this.cgiMode) {
        this.$router.push({
          name: 'borrow'
        })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>
