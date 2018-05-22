<template v-if="renderPage">
  <div>
    <navBar :pageName="pageName" :back="back" :backFuc="backFuc" :rightText="rightText"></navBar>
    <component v-bind:is="currentView"></component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import navBar from '../nav-bar'
import contractV1 from './contract-v1'
import contractV11 from './contract-v11'

export default {
  name: 'contract',
  props: ['renderPage'],
  components: {
    contractV1,
    contractV11,
    navBar
  },
  data () {
    return {
      pageName: '资料代传合同签订',
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
        'v1.0': contractV1,
        'v1.1': contractV11
      }
      return version[this.userApplyState.dataVersionNo]
    }
  }
}
</script>
