<template>
  <div class="login-info">
    <div class="login-item">
      <div class="login-item-hd"><i class="login-icon icon-phone"></i></div>
      <div class="login-item-bd"><input ref="inputMobile" v-model="inputMobile"  class="ipt" type="tel" placeholder="请输入您申请的手机号" maxlength="11"></div>
    </div>
    <div class="login-item login-item-vcode" v-show="showPicCode">
      <div class="login-item-hd"><i class="login-icon icon-code"></i></div>
      <div class="login-item-bd"><input ref="inputPicCode" v-model="inputPicCode" class="ipt" type="text" placeholder="请输入右边的图形码" maxlength="4"></div>
      <div class="login-item-ft">
        <div class="vcode-img" v-on:click="fetchPicCode">
          <figure class="vcode-img-up">
            <img v-bind:src="picCode.image" alt="图形验证码">
          </figure>
          <figure class="vcode-img-down">
            <img src="../../assets/images/refresh.png" alt="换一换">
          </figure>
        </div>
      </div>
    </div>
    <div class="login-item login-item-vcode login-item-last">
      <div class="login-item-hd"><i class="login-icon icon-code"></i></div>
      <div class="login-item-bd"><input ref="inputSmsCode" v-model="inputSmsCode" class="ipt" type="tel" placeholder="请输入短信验证码" maxlength="7"></div>
      <div class="login-item-ft"><div class="vcode-btn" v-bind:class="{'btn-gray': smsCodeText !== '获取验证码'}" v-on:click="fetchSmsCode">{{ smsCodeText }}</div></div>
    </div>
    <div class="fixed-wrap fixed-white">
      <div class="btn" v-bind:class="{'btn-dis': !enableNext}" v-on:click="fetchOtp">下一步</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'


const WAITTIME = 60

export default {
    name: 'login',
    data () {
        return {
            inputMobile: '',
            showPicCode: false,
            inputPicCode: '',
            inputSmsCode: '',
            smsCodeText: '获取验证码',
            enableNext: false
        }
    },
    created: function(){
        //this.$dialog.show({'msg':'dafdafda'})
    },
    //computed的key值不能跟 data /props的key值一样
    computed:{
          //当一个组件需要获取多个状态时候，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，我们可以使用 mapState 辅助函数帮助我们生成计算属性，让你少按几次键：
          ...mapGetters({
              picCode: 'getPicCode',
              smsCode: 'getSmsCode'
          })
    },
    watch: {
        //监听数据变化
        inputMobile ( val ){
              if (val.length < this.$refs.inputMobile.maxLength) return
                console.log('获取验证码')
                this.validateMobile();
        }
    },
    methods: {
        //检验手机号，并请求图片地址。
        validateMobile ( e ) {
              const isMobileNo = str => /^1(3|4|5|7|8)\d{9}$/.test(str)
              if (isMobileNo(this.inputMobile)) {
                this.fetchPicCode();
                return true
              } else {
                console.log('手机号有误，请重新输入！')
                // this.$tip.show({message: '手机号有误，请重新输入！'})
                this.inputMobile = ''
                return false
              }

        },
        validatePicCode () {
          const isPicCode = str => /[A-Za-z0-9]{4}/.test(str)
          if (isPicCode(this.inputPicCode)) {
            return true
          } else {
            this.$tip.show({message: '图形码有误，请重新输入！'})
            this.inputPicCode = ''
            this.inputSmsCode = ''
            return false
          }
        },
        validateSmsCode () {
          const isSmsCode = str => /\d{7}/.test(str)
          if (isSmsCode(this.inputSmsCode)) {
            return true
          } else {
            this.$tip.show({message: '验证码有误，请重新输入！'})
            this.inputSmsCode = ''
            return false
          }
        },
        //获取图形接口
        fetchPicCode () {
              var self = this;

                  //setLoginParams,这个mutations,相当于给state['picCodeParams'] = {
                  //  type: 'h5_login_code',
                  //  mobile: this.inputMobile
                  // }
                  this.$store.commit('setLoginParams', {
                    paramsKey: 'picCodeParams',
                    type: 'h5_login_code',
                    mobile: this.inputMobile
                  })
                  this.$store.dispatch('picCode').then((data) => {
                      this.showPicCode = true
                      this.$nextTick(function () {
                        this.$refs.inputPicCode.focus()
                      })
                  })            
            
        },
        countDown ( times ) {
            var self = this;
            var interval = setInterval(function(){
                if( times ){
                    times--;
                    self.smsCodeText = '重新发送'+times+'s';
                }else{
                    clearInterval( interval );
                    self.smsCodeText = '获取验证码';
                }
            },1000)

        },
        //获取验证码接口
        fetchSmsCode () {
            if(! this.validatePicCode() ) return;
            if(this.smsCodeText !== '获取验证码') return;
            //请求入參
            this.$store.commit('setLoginParams', {
              paramsKey: 'smsCodeParams',   //设置的新的state的key名称。下面的是 它的值。
              picCode: this.inputPicCode,
              mobile: this.rsaEncrypt(this.inputMobile)
            })
            //发起请求
            this.$store.dispatch('smsCode').then((data) => {

               this.inputSmsCode = ''
               this.enableNext = true
               this.countDown( 20 )
               this.$refs.inputSmsCode.focus()
            })

        },
        fetchOtp () {
            if (!this.enableNext) return
            if (this.validateMobile() && this.validateSmsCode()) {
              this.$store.commit('setLoginParams', {
                paramsKey: 'loginParams',
                mobile: this.rsaEncrypt(this.inputMobile)
              })
              this.$store.commit('setLoginParams', {
                paramsKey: 'otpParams',
                smsCode: this.inputSmsCode,
                smsSerialNO: this.smsCode.smsSerialNO,
                mobile: this.rsaEncrypt(this.inputMobile)
              })
              this.$store.dispatch('otp').then((data) => {
                this.$router.push({ name: 'identity' })
              })
            }

        }
    }
}
</script>
