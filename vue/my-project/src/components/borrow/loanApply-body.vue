<template>
  <div>
    <p class="t-m">{{$route.params.loanCode ==='0201' ? '提现' : '借款'}}金额<span class="span">（最低{{loanInfoQuery.minLoanAmt | formatMoney}} 元，最高 {{maxFormat | formatMoney}}元）</span></p>
    <div class="with-ipt clear">
        <div class="icon-sm icon-money"></div>
        <div class="ipt-box">
            <input type="tel" class="ipt red" :placeholder="placeholderValue" @blur="calculateRepayment" @focus="showAmountInput" v-model="amount" @input="changePlaceholder">
            <input type="button" style="width:0; height:0">
        </div>
    </div>
    <div class="acc-feture">
        <div class="item">
            <p>日费率</p>
            <p>{{loanInfoQuery.rateSum | formatFloat}}%</p>
        </div>
        <div class="item">
            <p>动用手续费</p>
            <p>{{counterFee | formatMoney}}元</p>
        </div>
        <div class="item">
            <p>还款方式</p>
            <p>等额本金</p>
        </div>
    </div>
    <loanApplyBodyTip></loanApplyBodyTip>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import loanApplyBodyTip from './loanApply-body-tip'

export default {
  name: 'inputMoney',
  data () {
    return {
      amount: '',
      unformatAmount: '',
      counterFee: '0.00',
      maxFormat: '',
      placeholderValue: '0.00'
    }
  },
  components: {
    loanApplyBodyTip
  },
  props: {
    hasRepayPlan: {
      type: Function,
      default: null
    },
    showErrorTip: {
      type: Function,
      default: null
    },
    updateAmount: {
      type: Function,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      getProduct: 'getProduct',
      getLoanInfoQuery: 'getLoanInfoQuery',
      getRepayCalculate: 'getRepayCalculate',
      getLoanAmt: 'getLoanAmt'
    }),
    loanInfoQuery () {
      return this.getLoanInfoQuery.infoMap
    },
    applyNo () {
      return this.getProduct.applyNo
    }
  },
  created () {
    // 还卡试算页面,默认带出最大借款金额,并进行还款试算
    this.autoCalculateRepay()
  },
  // keep-alive的原因,从还卡申请成功页跳到试算页面,不会刷新页面,但是需要重新请求借款查询接口,并带出当前最大金额,且试算出结果
  activated () {
    if (this.$route.params.loanCode === '0202' && this.$route.params.from === 'loanResult') {
      // 借款查询接口
      this.$store.commit('setBorrowParams', {
        paramsKey: 'loanInfoQueryParams',
        jsonPara: JSON.stringify({
          applyNo: this.applyNo,
          loanCode: this.$route.params.loanCode,
          payApplyNo: this.getProduct.payApplyNo
        })
      })
      this.$store.dispatch('loanInfoQuery')
      .then((data) => {
        this.$router.push({
          name: 'selectCard'
        })
        this.autoCalculateRepay()
      })
    }
  },
  methods: {
    // 还卡试算页面,默认带出最大借款金额,并进行还款试算
    autoCalculateRepay () {
      this.maxFormat = parseInt(Number(this.loanInfoQuery.maxLoanAmt) / (this.loanInfoQuery.loanLimit)) * (this.loanInfoQuery.loanLimit)
      this.amount = this.maxFormat
      this.calculateRepayment()
    },
    // 输入框失去焦点事件
    calculateRepayment () {
      this.placeholderValue = this.amount === '' ? '0.00' : ''
      // 重新试算前隐藏上一次试算弹出的还款计划和下一步按钮
      this.hasRepayPlan(false)
      this.amount = this.amountRange(this.amount)
      if (this.amount !== '') {
        this.$store.commit('setBorrowParams', {
          paramsKey: 'repayCalculateParams',
          jsonPara: JSON.stringify({
            loanCode: this.$route.params.loanCode,
            payApplyNo: this.getProduct.payApplyNo,
            loanAmt: String(this.amount),
            rpyDay: String(this.loanInfoQuery.rpyDay)
          })
        })
        this.$store.dispatch('repayCalculate')
        .then((data) => {
          this.counterFee = data.counterFee
          // 将还款试算页显示长度百分比计算出来
          this.addListWidth(data.planList, 100, 50)
          // 触发父组件展示还款计划
          this.hasRepayPlan(true)
        })
        // 更新父组件的amount
        this.updateAmount(this.amount)
        this.unformatAmount = this.amount
        this.$store.commit('setNewAmount', this.amount)
        // 展示的是格式化的
        this.amount = this.formatMoney(this.amount)
      }
    },
    // 增加还款计划页展示的长度
    addListWidth (lists, max, min) {
      let maxAmt = 0
      let minAmt = 0
      lists.forEach((item) => {
        let rpyAmt = parseFloat(item.rpyAmt)
        if (maxAmt === 0) {
          maxAmt = rpyAmt
        } else if (rpyAmt - maxAmt > 0) {
          maxAmt = rpyAmt
        }
      })
      lists.forEach((item) => {
        let rpyAmt = parseFloat(item.rpyAmt)
        if (minAmt === 0) {
          minAmt = rpyAmt
        } else if (rpyAmt - minAmt < 0) {
          minAmt = rpyAmt
        }
      })
      lists.forEach((element) => {
        if (maxAmt - minAmt > 0) {
          element.percent = (min + (element.rpyAmt - minAmt) * (max - min) / (maxAmt - minAmt)).toFixed(2)
        } else {
          element.percent = max
        }
      })
    },
    // 输入金额校验
    amountRange (val) {
      if (val && /^(0|[1-9]\d*)(\.\d{1,2})?$/.test(val)) {
        let min = parseInt(this.loanInfoQuery.minLoanAmt)
        let step = parseInt(this.loanInfoQuery.loanLimit)
        let max = parseInt(this.maxFormat / step) * step
        let amount = parseFloat(val)
        if (amount > max) {
          this.showErrorTip('输入金额不能超过最高可申请金额，请重新输入')
          return max
        } else if (amount < min) {
          this.showErrorTip('不能低于最低金额' + min + '元，请重新输入')
          return min
        } else if (amount % step) {
          this.showErrorTip('请输入' + step + '的整数倍')
          return parseInt(val / step) * step
        }
        return amount
      }
      this.showErrorTip('请输入金额并符合正确格式')
      return ''
    },
    // 输入框重新聚焦,展示未格式化金额,隐藏还款计划和下一步
    showAmountInput (e) {
      // 如果本身金额是空,那聚焦时候展示为空,否则展示未格式化金额
      this.amount = this.amount === '' ? '' : this.unformatAmount
      let length = String(this.amount).length
      setTimeout(() => {
        this.setSelectionRange(e.target, length, length)
      }, 10)
      this.placeholderValue = this.amount === '' ? '' : '0.00'
      this.hasRepayPlan(false)
      this.counterFee = '0.00'
    },
    // focus事件将光标移到最后
    setSelectionRange (input, selectionStart, selectionEnd) {
      if (input.setSelectionRange) {
        input.focus()
        input.setSelectionRange(selectionStart, selectionEnd)
      } else if (input.createTextRange) {
        var range = input.createTextRange()
        range.collapse(true)
        range.moveEnd('character', selectionEnd)
        range.moveStart('character', selectionStart)
        range.select()
      }
    },
    changePlaceholder (e) {
      let elem = e.target
      let val = elem.value
      this.placeholderValue = val === '' ? '' : '0.00'
    }
  }
}
</script>
