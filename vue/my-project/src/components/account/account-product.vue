<template>
  <div>
    <div class="deposit" v-if="hasBT">
      <accountProductItem :loanCode="'0201'" :queryProduct="queryProduct"></accountProductItem>
      <accountProductItem :loanCode="'0202'" :queryProduct="queryProduct"></accountProductItem>
    </div>
    <section v-else>
      <div class="acc-feture">
        <div class="item">
          <p>日费率</p>
          <p class="num">{{userApplyState.ICreditInfo.rateSum | formatFloat}}%</p>
        </div>
        <div class="item">
          <p>极速放款</p>
          <p>最快<span class="big">1</span>秒钟</p>
        </div>
        <div class="item">
          <p>随借随还</p>
          <p><span class="big">免</span>手续费</p>
        </div>
      </div>
      <footer class="fixed-wrap">
        <div class="btn" v-bind:class="{ 'btn-dis': accountFreeze }" v-on:click="toBorrow">提现</div>
      </footer>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import accountProductItem from './account-product-item'

export default {
  name: 'account-product',
  components: {
    accountProductItem
  },
  computed: {
    ...mapGetters({
      userApplyState: 'getUserApplyState',
      product: 'getProduct'
    }),
    // 是否SEG1用户
    hasBT () {
      // 授信状态 PS,BTPS:通过 RJ:拒绝 NN:非BT用户
      const bt = this.userApplyState.BTCreditInfo
      return bt && bt.creditStatus && bt.creditStatus !== 'NN'
    },
    // 账户是否冻结
    accountFreeze () {
      return this.userApplyState.ICreditInfo.accountStatus !== 'N'
    }
  },
  methods: {
    toBorrow () {
      if (this.userApplyState.isCreditEnough !== 'Y') {
        this.$tip.show({message: '额度不足'})
        return
      }
      if (this.accountFreeze) return
      this.queryProduct('0201')
    },
    queryProduct (loanCode) {
      this.$store.commit('setAccountParams', {
        paramsKey: 'productParams',
        jsonPara: JSON.stringify({
          loanCode: loanCode,
          applyNo: this.userApplyState.applyNo
        })
      })
      this.$store.dispatch('queryProduct').then((data) => {
        if (data.resultCode === '1') {
          // 资金开关
          if (data.signSwitch === '0') {
            this.$tip.show({message: data.switchMsg})
            return
          }
          // 风控审核 PS,BTPS:通过 RJ:拒绝 PA:审核中
          if (data.infoMap && data.infoMap.apvFlag === 'RJ') {
            this.$router.push({name: 'reject'})
            return
          }
          // 符合迁徙用户，弹出提示
          if (data.migrateMap && data.migrateMap.isMigrate === 'Y') {
            this.$tip.show({message: '暂时无法动用，请下载普惠APP进行动用哦。'})
            return
          }
          // 银行失效，渠道担保模式
          if (data.isValidity === '0' && data.fundingModel === 'L') {
            this.$tip.show({message: data.resultMsg})
            return
          }
          // 银行失效，但无可用银行
          if (data.isValidity === '0' && !data.newBank) {
            this.$tip.show({message: data.resultMsg})
            return
          }
          // 银行有效性判断
          if (data.isValidity === '0' && data.fundingModel === 'U') {
            if (data.isCredit === '1') {
              // 跳转电子签名页面
              this.$router.push({
                name: 'signature'
              })
            } else {
              // 银行变更接口
              this.bankAlter(loanCode)
            }
          } else {
            // 跳转试算页面
            this.$router.push({
              name: 'borrow',
              params: {
                loanCode: loanCode
              }
            })
          }
        } else {
          this.$tip.show({message: data.resultMsg})
        }
      })
    },
    bankAlter (loanCode) {
      this.$store.commit('setAccountParams', {
        paramsKey: 'bankParams',
        jsonPara: JSON.stringify({
          applyNo: this.userApplyState.applyNo,
          payApplyNo: this.product.payApplyNo,
          bankCode: this.product.bankCode,
          bankName: this.product.newBank
        })
      })
      this.$store.dispatch('bankAlter').then((data) => {
        if (data.resultCode === '1') {
          this.$router.push({
            name: 'borrow',
            params: {
              loanCode: loanCode
            }
          })
        } else {
          this.$tip.show({message: data.resultMsg})
        }
      })
    }
  }
}
</script>
