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
        this.$dialog.show({'msg':'dafdafda'})
    },
    computed:{
          ...mapGetters({
              picCode: 'getPicCode'
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
                // this.showPicCode = false
                // this.inputPicCode = ''
                // this.inputSmsCode = ''
                // this.enableNext = false
                return false
              }

        },
        //获取图形接口
        fetchPicCode () {
              var self = this;
              utils.$delay( picode, 500 );

              function picode(){
                  //this = self;
                  this.$store.commit('setLoginParams', {
                    paramsKey: 'picCodeParams',
                    type: 'h5_login_code',
                    mobile: this.inputMobile
                  })
                  this.$store.dispatch('picCode').then((data) => {
                      this.showPicCode = true
                      this.inputPicCode = ''
                      this.inputSmsCode = ''
                      this.enableNext = false
                      this.$nextTick(function () {
                        this.$refs.inputPicCode.focus()
                      })
                  })

              }
                
              
            
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
            if(this.smsCodeText !== '获取验证码') return;
            this.$store.commit('setLoginParams', {
              paramsKey: 'smsCodeParams',   //设置的新的state的key名称。下面的是 它的值。
              picCode: this.inputPicCode,
              mobile: this.rsaEncrypt(this.inputMobile)
            })
            this.$store.dispatch('smsCode').then((data) => {

               this.inputSmsCode = ''
               this.enableNext = true
               this.countDown( 20 )
               this.$refs.inputSmsCode.focus()
            })

        },
        fetchOtp () {
            if (!this.enableNext) return
            this.$store.commit('setLoginParams', {
                  paramsKey: 'otpParams',   //设置的新的state的key名称。下面的是 它的值。 注意这里的otpParams要与store里设置的值一样。  用来发起请求时带上这些下面的 key-value值。
                  smsCode: this.inputSmsCode,
                  smsSerialNO: this.smsCode.smsSerialNO,
                  mobile: this.rsaEncrypt(this.inputMobile)
            })
            this.$store.dispatch('otp').then((data) => {
               this.inputSmsCode = ''
               this.enableNext = true
               this.countDown( 20 )
               this.$refs.inputSmsCode.focus()
            })

        }
    }
}
</script>
