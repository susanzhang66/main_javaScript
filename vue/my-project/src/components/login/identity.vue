<template>
  <div class="login-info">
    <div v-if="otp.subProcessCode === 'RP'">
      <div class="login-title">登录信息验证</div>
      <div class="login-item login-item-last">
        <div class="login-item-hd">{{ otp.prefixIdNO }}</div>
        <div class="login-item-bd"><input v-model="inputIdNo" class="ipt" type="tel" placeholder="请补全您的身份证号码" maxlength="14"></div>
        <div class="login-item-ft"><div style="padding-right: 2.4rem;">{{ otp.suffixIdNO }}</div></div>
      </div>
    </div>
    <div class="login-message" v-else><p>{{ tipMsg }}</p></div>
    <div class="login-tip">
      <div class="gray"><i class="login-icon icon-attention"></i>&nbsp;若有任何疑问，可电话咨询平安普惠官方客服：4008580580</div>
    </div>
    <div class="fixed-wrap fixed-white">
      <div class="btn" v-on:click="login" v-if="otp.subProcessCode === 'RP'">登录</div>
      <div v-if="otp.subProcessCode === 'SSNR' || otp.subProcessCode === 'SSOE'">
        <div class="btn-download btn-blue fl" v-on:click="download"><i class="btn-icon icon-apple"></i>&nbsp;iphone下载</div>
        <div class="btn-download btn-green fr" v-on:click="download"><i class="btn-icon icon-android"></i>&nbsp;android下载</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'identity',
  data () {
    return {
      inputIdNo: ''
    }
  },
  computed: {
    ...mapGetters({
      otp: 'getOtp'
    }),
    tipMsg () {
      if (this.otp.isPassTel === 'N') return this.otp.resultMsg
      switch (this.otp.subProcessCode) {
        case 'SSNR':
          return '抱歉，您暂还不是平安普惠客户，请下载平安普惠APP注册账户。'
        case 'SSOE':
          return '抱歉，您暂时无法使用此服务，请下载平安普惠APP申请或操作I贷产品。或请您确认输入的手机号为申请i贷的手机号。'
        case 'AM':
        case 'AF':
        case 'AY':
        case 'AC':
        case 'AP':
          return '抱歉，您正在通过其他渠道申请了平安普惠i贷产品。'
        default:
          return '抱歉，您暂时无法使用此服务。'
      }
    }
  },
  methods: {
    validateId () {
      const isIDCard = str => /\d{14}/.test(str)
      if (isIDCard(this.inputIdNo)) {
        return true
      } else {
        this.$tip.show({message: '您输入的身份证号格式不正确！'})
        this.inputIdNo = ''
        return false
      }
    },
    login () {
      if (!this.inputIdNo) return
      if (this.validateId()) {
        this.$store.commit('setLoginParams', {
          paramsKey: 'loginParams',
          idNO: this.rsaEncrypt(this.otp.prefixIdNO + this.inputIdNo + this.otp.suffixIdNO),
          otpSerialNO: this.otp.otpSerialNO
        })
        this.$store.dispatch('login').then((data) => {
          // 调用弹出对话框
          this.$dialog.show({
            msg: '登录成功！<br>额度内循环动用，随借随还。',
            confirmCallback: () => {
              this.$router.replace({name: 'account'})
            }
          })
        })
      }
    },
    download () {
      window.location.href = 'https://m.10100000.com/m/app/download/index.html'
    }
  }
}
</script>
