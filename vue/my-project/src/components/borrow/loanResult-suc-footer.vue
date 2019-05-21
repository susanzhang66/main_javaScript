<template>
  <footer class="fixed-wrap">
      <div class="btn" @click="goAccount" v-if="$route.params.loanCode ==='0201'">确定</div>
      <div v-if="$route.params.loanCode ==='0202'">
        <p class="red tac">剩余额度<span>{{getLoanConfirm.remainAmt}}</span>元，您可继续还卡。</p>
    		<div class="btn-flex mt3">
    			<div class="btn" @click="goAccount">我的i贷</div>
    			<div class="btn-full" v-if="getLoanConfirm.remainAmt > 0" @click="continueBorrow">继续还卡</div>
    		</div>
      </div>
  </footer>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'loanResultFooter',
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      getLoanConfirm: 'getLoanConfirm',
      getLoanInfoQuery: 'getLoanInfoQuery',
      getProduct: 'getProduct',
      getLogin: 'getLogin' // 获取登录信息
    }),
    // 客户申请号
    applyNo () {
      return this.getProduct.applyNo
    },
    cgiMode () {
      return this.getLoanInfoQuery.infoMap.fundingModel.toUpperCase() === 'U' || this.getLoanInfoQuery.infoMap.fundingModel.toUpperCase() === 'D'
    }
  },
  created () {
  },
  methods: {
    goAccount () {
      this.$router.push({
        name: 'account'
      })
    },
    // 点击继续还卡
    continueBorrow () {
      // 获取新的支用申请号
      this.$store.commit('setBorrowParams', {
        paramsKey: 'chooseProductParams',
        accountId: this.getLogin.accountId,
        applyNo: this.applyNo
      })
      this.$store.dispatch('chooseProduct')
      .then((data) => {
        // 将上一笔支用申请号更新为当前的
        this.$store.commit('setNewPayApplyNo', data.payApplyNo)
        this.$router.push({
          name: 'borrow',
          params: {
            from: 'loanResult'
          }
        })
      })
    }
  }
}
</script>
