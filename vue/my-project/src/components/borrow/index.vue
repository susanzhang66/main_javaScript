<template>
  <keep-alive>
    <router-view v-if="isDone"></router-view>
  </keep-alive>
</template>

<script>
import { mapGetters } from 'vuex'
import borrow from './borrow'

export default {
  name: 'borrow-index',
  data () {
    return {
      isDone: false
    }
  },
  components: {
    borrow
  },
  computed: {
    ...mapGetters({
      getLostParamsState: 'getLostParamsState',
      getProduct: 'getProduct',
      getLastPageParams: 'getLastPageParams'
    })
  },
  watch: {
    getLostParamsState (val) {
      if (val === true) {
        this.$tip.show({message: '参数缺失，返回首页'})
        this.$router.push({
          name: 'account'
        })
      }
    }
  },
  created () {
    // store值不存在，说明是产险页面跳过来的
    if (!this.getProduct.applyNo) {
      this.$store.commit('setApplyNo', this.getLastPageParams.applyNo)
      this.$store.commit('setNewPayApplyNo', this.getLastPageParams.payApplyNo)
    }
    // 需要补录身份证信息,跳身份信息补录页面
    if (this.getProduct.idvalid === 'N') {
      this.$router.replace({
        name: 'identityRecord'
      })
    }
    // 请求借款查询接口
    this.queryApplyInfo()
  },
  methods: {
    // 借款查询接口
    queryApplyInfo () {
      this.$store.commit('setBorrowParams', {
        paramsKey: 'loanInfoQueryParams',
        jsonPara: JSON.stringify({
          applyNo: this.getProduct.applyNo,
          loanCode: this.$route.params.loanCode,
          payApplyNo: this.getProduct.payApplyNo
        })
      })
      this.$store.dispatch('loanInfoQuery')
      .then((data) => {
        this.isDone = true
      })
    }
  }
}
</script>
