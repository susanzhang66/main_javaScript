<template v-if="renderPage">
  <div>
    <navBar :pageName="pageName" :back="back" :backFuc="backFuc" :rightText="rightText"></navBar>
    <component v-bind:is="currentView"></component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import navBar from '../nav-bar'
import agreementGuarantee from './agreement-guarantee'
import agreementGuaranteeV11 from './agreement-guarantee-v11'
import agreementGuaranteeV12 from './agreement-guarantee-v12'
import agreementCgi from './agreement-cgi'
import agreementCgiV3 from './agreement-cgi-v3'
import agreementCgiV31 from './agreement-cgi-v31'
import agreementCgiV32 from './agreement-cgi-v32'
import agreementCgiV4 from './agreement-cgi-v4'

export default {
  name: 'agreement',
  props: ['renderPage'],
  components: {
    agreementGuarantee,
    agreementGuaranteeV11,
    agreementGuaranteeV12,
    agreementCgi,
    agreementCgiV3,
    agreementCgiV31,
    agreementCgiV32,
    navBar
  },
  data () {
    return {
      pageName: '合同签订',
      back: true,
      rightText: ''
    }
  },
  methods: {
    backFuc () {
      this.$router.go(-1)
    }
  },
  computed: {
    ...mapGetters({
      userApplyState: 'getUserApplyState'
    }),
    currentView () {
      const version = {
        'v1.0': agreementGuarantee,
        'v1.1': agreementGuaranteeV11,
        'v1.2': agreementGuaranteeV12,
        'v2.0': agreementCgi,
        'v3.0': agreementCgiV3,
        'v3.1': agreementCgiV31,
        'v3.2': agreementCgiV32,
        'v4.0': agreementCgiV4
      }
      return version[this.userApplyState.versionNo]
    }
  }
}
</script>
