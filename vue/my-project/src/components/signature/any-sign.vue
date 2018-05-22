<template>
  <div class="leayer">
    <!-- <iframe src="./static/html5Esign/esign.html" width="100%" height="100%" frameborder="0" v-on:load="sendMessage"></iframe> -->
    <!-- 新版电子签名 -->
    <iframe src="./static/AnySignMiniCoreH5V2.3.0/esign.html" width="100%" height="100%" frameborder="0" v-on:load="sendMessage"></iframe>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'anySign',
  props: ['keyword', 'cancle', 'success'],
  computed: {
    ...mapGetters({
      login: 'getLogin'
    })
  },
  created () {
    window.addEventListener('message', this.reciveMessage)
  },
  destroyed () {
    window.removeEventListener('message', this.reciveMessage)
  },
  methods: {
    sendMessage () {
      window.frames[0].postMessage({
        userName: this.rsaDecrypt(this.login.custName),
        userId: this.rsaDecrypt(this.login.identityNumber),
        keyword: this.keyword
      }, window.location.origin)
    },
    reciveMessage (e) {
      if (e.origin !== window.location.origin) return
      if (e.data) {
        this.success(e.data)
      } else {
        this.cancle()
      }
    }
  }
}
</script>
