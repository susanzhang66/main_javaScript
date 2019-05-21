<template>
  <div class="containter box-orient">
    <navBar :pageName="pageName" :back="back"></navBar>
    <div class="agreement">
      <div class="logo-pa"></div>
      <div class="fwb mt30">
        <!-- <p>《个人征信查询及信息使用授权书》</p> -->
        <!-- <p>《综合授权书》</p> -->
        <p>《{{ product.newBank }}查询使用个人信用信息基础数据库授权书》</p>
      </div>
    </div>
    <div class="agreement box-scroll" style="padding: 0 0.3rem;">
      <!-- <authorizationCredit></authorizationCredit> -->
      <!-- <authorizationMultiple></authorizationMultiple> -->
      <authorizationBank :bank="product.newBank"></authorizationBank>
    </div>
    <div class="agreement">
      <div class="signature" v-on:click="toSign">客户签名：
        <span v-show="!imageSrc">点击签名</span>
        <img v-show="imageSrc" alt="点击签名" v-bind:src="imageSrc" style="height: 0.8rem;vertical-align: middle;"/>
      </div>
    </div>
    <div class="btn-wrap fixed-white">
      <div class="btn-flex">
        <div class="btn" v-on:click="digree">不同意</div>
        <div class="btn-full" v-on:click="agree">同意</div>
      </div>
    </div>
    <sign v-if="showSign" :keyword="keyWord" :cancle="cancle" :success="success"></sign>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import navBar from '../nav-bar'
// import authorizationCredit from './authorization-credit'
// import authorizationMultiple from './authorization-multiple'
import authorizationBank from './authorization-bank'
import sign from './any-sign'

export default {
  name: 'signature',
  data () {
    return {
      pageName: '我的i贷',
      back: false,
      keyWord: '授权人（签字）',
      showSign: false,
      imageSrc: ''
    }
  },
  components: {
    // authorizationCredit,
    // authorizationMultiple,
    navBar,
    authorizationBank,
    sign
  },
  computed: {
    ...mapGetters({
      product: 'getProduct'
    })
  },
  methods: {
    toSign () {
      this.showSign = true
    },
    digree () {
      this.$router.go(-1)
    },
    agree () {
      if (this.barCode && this.signData && this.imageData) {
        this.$store.commit('setSignParams', {
          paramsKey: 'signatureParams',
          jsonPara: JSON.stringify({
            productId: 'ILOANH5',
            platform: window.navigator.platform,
            loanCompanyCode: this.product.loanCompanyCode,
            // 电子签名信息
            businessNo: this.barCode,
            imgDenseStr: this.signData,
            imgBytes: this.imageData,
            ocrKey: 'N',
            ocrNeed: 'N',
            isDomesticAlgorithm: 'Y',
            // 银行变更接口入参
            applyNo: this.product.applyNo,
            payApplyNo: this.product.payApplyNo,
            bankCode: this.product.bankCode,
            bankName: this.product.newBank
          })
        })
        this.$store.dispatch('signature').then((data) => {
          this.$router.push({
            name: 'borrow',
            params: {
              loanCode: this.product.infoMap.loanCode
            }
          })
        })
      } else {
        this.$tip.show({message: '请先签名'})
      }
    },
    cancle () {
      this.showSign = false
    },
    success ({imageData, signData, barCode}) {
      this.showSign = false
      this.imageData = imageData
      this.signData = signData
      this.barCode = barCode
      this.imageSrc = /^data:image/.test(this.imageData) ? this.imageData : 'data:image/png;base64,' + imageData
    }
  }
}
</script>
