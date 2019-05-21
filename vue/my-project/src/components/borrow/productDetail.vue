<template>
    <body class="white-bg">
      <navBar :pageName="pageName" :back="back" :backFuc="backFuc"></navBar>
    	<section class="product-display">
    		<img src="../../assets/images/product-detail.png">
    	</section>
    </body>
</template>

<script>
import navBar from '../nav-bar'

export default {
  name: 'productDetail',
  data () {
    return {
      pageName: '还卡攻略',
      back: true
    }
  },
  components: {
    navBar
  },
  methods: {
    backFuc () {
      this.$router.go(-1)
    }
  }
}

</script>
