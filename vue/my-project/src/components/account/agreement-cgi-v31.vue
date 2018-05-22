<template>
  <article class="article">
    <h2>湖南小贷借款协议</h2>
    <p class="number">
      协议编号：<span class="num">{{ applyNo }}-1</span>
    </p>
    <div class="summary">
        <p>特别提醒：</p>
        <p class="tin">本协议以数据电文形式签订，数据电文相关规定参照《电子签名法》及《合同法》执行。在您确认签署本协议之前，请您务必仔细阅读本协议所有条款，特别是以粗体或下划线标注的条款。一旦您签署本协议，即意味着您已充分理解本协议所有条款的含义及相应的法律后果，并接受本协议约束。</p>
    </div>
    <div class="con">
        <h3>第一部分：借款明细</h3>
        <div>
          <p>借款人姓名：{{ login.custName | rsaDecrypt }}</p>
          <p>借款人身份证件号：{{ login.identityNumber | rsaDecrypt | formatIdCardNo }}</p>
          <p>初始可用额度：人民币{{ userApplyState.credit | formatMoney }}元</p>
          <p>每月还款日：以平安普惠APP上显示的每月还款日为准</p>
        </div>
        <p>注：上述借款明细中列明的信息及实际借款利率、服务费率、手续费率、应还款额等相关数据可能根据实际情况进行调整。借款人、贷款人同意前述所有数据以交易系统中展示的并经您确认的所载具体数据为准。</p>
        <h3>第二部分：借款通用条款</h3>
        <p><strong>1.	本协议的签约方</strong>
        </p>
        <h1>湖南小贷</h1>
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'agreement-cgi-v31',
  computed: {
    ...mapGetters({
      userApplyState: 'getUserApplyState',
      login: 'getLogin',
      getProduct: 'getProduct'
    }),
    // 客户申请号
    applyNo () {
      return this.userApplyState.applyNo || this.getProduct.applyNo
    }
  }
}
</script>
