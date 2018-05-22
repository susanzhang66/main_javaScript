<template>
  <article class="article">
    <h2>资料代传递服务委托书</h2>
    <p class="number">委托书编号：<span class="num">{{ applyNo }}</span><span class="num">-2</span></p>
    <div class="summary">
      <p>姓名：{{ login.custName | rsaDecrypt }}</p>
      <p>证件类型：身份证</p>
      <p>证件号码：{{ login.identityNumber | rsaDecrypt | formatIdCardNo }}</p>
      <p>联系电话：{{ login.mobile | rsaDecrypt | formatMobile }}</p>
    </div>
    <div class="con">
				<p class="tin">本人委托平安普惠投资咨询有限公司（以下简称“受托方”）向本人提供资料代传递服务，委托事项及相关内容如下：</p>
				<p><strong>一、委托事项</strong>
					</br>本人委托受托方提供如下资料代传递服务：
					</br>1.	为本人的个人借款申请提供资料代传递服务，将本人提交的借款申请等相关资料和信息转递至与受托人合作的借款提供方、保险公司、中介服务机构等主体。
					</br>2.	为本人提供资料代传递服务相关的平台服务。
				</p>
				<p>
					<strong>二、承诺及保证</strong>
					</br>1.本人保证填写的个人借款的申请资料是真实、准确、全面、完整、有效的，并提供个人证件、个人资料及其他借款申请所需的材料。
					</br>2.因本人违反法律法规或提供的材料不真实而给受托方和/或任何第三方造成的一切损失，均由本人承担。
					</br>3.本人应向受托方支付服务费。
				</p>
				<p>
					<strong>三、服务费</strong>
					</br>1.本人接受受托方提供的资料代传递服务的，日服务费=借款本金余额*日服务费费率，具体金额应按照交易系统上相关页面公布的数据向受托方支付资料代传递服务费；
					</br>2.若受托方未能从上述本人壹钱包账户或本人银行还款账户中扣收的，本人仍应承担付款义务；
					</br>3.本人同意通过电子签约的形式向受托方确认上述服务费的费率。由本人通过电子形式确认服务费的费率后，受托方将通过交易系统通知本人。通过交易系统告知形式确认的服务费的费率为本合同不可分割的组成部分，系本人真实意思的表示，一经确认，不得撤销或变更。
					</br>4.本人同意并确认，若本人借款成功，本人需根据相关协议的约定支付相关应付款项。
				</p>
				<p>
					<strong>四、动用手续费</strong>
					</br>每次额度动用申请成功后将可能产生手续费，由受托方一次性收取，并计入您首期应还金额中。
				</p>
				<p>
					<strong>五、解除及终止</strong>
					</br>1. 本人同意，未经受托方书面同意，本人不得单方面解除委托。
					</br>2. 有下列情况之一的，本委托自动终止：
					</br>（1）本人未同意受托方提出的服务费费率的；
					</br>（2）受托方因政策变动无法继续为本人提供服务的；
					</br>（3）其他导致委托事项无法履行的情况。
				</p>
				<p>
					<strong>六、法律适用和争议解决</strong>
					</br>1. 本委托书的签订、生效、履行、变更、解除、解释均适用中华人民共和国法律。
					</br>2. 因委托事项进行中发生的任何争议，本人同意首先以友好协商的方式解决，协商不成的，任一方均可将争议提交上海仲裁委员会仲裁，仲裁地点为上海浦东，仲裁裁决具有终局效力。
				</p>
				<p>
					<strong>七、其他事宜</strong>
					</br>1. 本人确认并同意，受托方将通过电子签约的形式与本人确认服务费的费率，并将双方确认的服务费费率在交易系统中通知本人。本人通过电子签约签署的形式确认的服务费的费率系本人真实意思的表示，本委托书及电话录音均对本人有法律约束力。
					</br>2. 除另有约定外，本委托书中所使用术语与《借款协议》等文件中使用的术语具有相同含义。
				</p>
				<div class="tar">
				</div>
		</div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'contract-v11',
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
