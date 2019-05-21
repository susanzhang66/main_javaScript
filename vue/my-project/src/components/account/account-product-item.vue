<template>
  <div>
    <div class="item clear" v-if="productInfo.creditStatus === 'RJ' && !accountFreeze">
      <div class="icon-sm icon-right"></div>
      <div class="item-l" v-html="productInfo.productName" v-bind:class="{'line-height45': loanCode === '0202'}"></div>
      <div class="item-r">暂不能为您服务</div>
    </div>
    <div class="item clear z-big" v-else v-on:click="toBorrow">
      <div class="dis" v-if="accountFreeze">已冻结</div>
      <div class="icon-sm icon-right" v-else></div>
      <div class="item-l" v-html="productInfo.productName" v-bind:class="{active: !accountFreeze, 'line-height45': loanCode === '0202'}"></div>
      <div class="item-r">
        <p>日费率<span class="black">&nbsp{{ productInfo.rateSum | formatFloat }}%</span></p>
        <p class="mt3" v-html="productInfo.slogan"></span>
        </p>
      </div>
    </div>    
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'account-product-item',
  props: [
    'loanCode',
    'queryProduct'
  ],
  computed: {
    ...mapGetters({
      userApplyState: 'getUserApplyState'
    }),
    productInfo () {
      return {
        creditStatus: this.loanCode === '0201' ? this.userApplyState.ICreditInfo.creditStatus : this.userApplyState.BTCreditInfo.creditStatus,
        accountStatus: this.loanCode === '0201' ? this.userApplyState.ICreditInfo.accountStatus : this.userApplyState.BTCreditInfo.accountStatus,
        rateSum: this.loanCode === '0201' ? this.userApplyState.ICreditInfo.rateSum : this.userApplyState.BTCreditInfo.rateSum,
        productName: this.loanCode === '0201' ? '提现' : '代还<br>信用卡',
        slogan: this.loanCode === '0201' ? '极速放款<span class="black">&nbsp最快1秒钟' : '代还信用卡<span class="black">&nbsp利息省20%'
      }
    },
    // 账户是否冻结
    accountFreeze () {
      return this.productInfo.accountStatus === 'FF' || this.productInfo.accountStatus === 'FZ'
    }
  },
  methods: {
    toBorrow () {
      if (this.userApplyState.isCreditEnough !== 'Y') {
        this.$tip.show({message: '额度不足'})
        return
      }
      if (this.accountFreeze) return
      this.queryProduct(this.loanCode)
    }
  }
}
</script>
