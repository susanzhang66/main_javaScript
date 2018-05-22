<template>
  <div>
    <navBar :pageName="pageName" :back="back"></navBar>
    <section class="intro-bg">
    	<section class="intro box-orient">
    		<section>
    			<div class="iDai">i贷到期还款有<span>手动还款</span>和<span>自动还款</span>两种方式。</div>
    		</section>
    		<div class="intro-con intro-top"><div class="pk"></div>
    			<ul>
    				<li>
    					<div class="intro-tip">
    						<h2>手动还款</h2>
    						<div class="in-item">
    							<p>扣款账户内充值足够金额</p>
    							<p>登录app</p>
    							<p>手动发起还款</p>
    							<p>输入还款金额</p>
    							<p>还款成功</p>
    						</div>
    					</div>
    				</li>
    				<li>
    					<div class="intro-tip">
    						<h2>自动还款</h2>
    						<div class="in-item">
    							<p><span class="in-circle"></span>扣款账户内充值足够金额</p>
    							<p><span class="in-circle"></span>还款日系统自动扣款</p>
    							<p><span class="in-circle"></span>还款成功</p>
    						</div>
    					</div>
    				</li>
    			</ul>
    		</div>
    		<div class="intro-con box-flex">
    			<ul>
    				<li>
    					<div class="intro-f">
    						<p><span class="red">5步</span>完成还款</p>
    						<p>如忘记会有逾期风险</p>
    					</div>
    					<div class="brow">
    						<div class="i-brow"></div>
    						<p><span class="red">1%</span>的用户会选择</p>
    					</div>
    				</li>
    				<li>
    					<div class="intro-f">
    						<p><span class="red">1步</span>完成还款</p>
    						<p>无需担心逾期</p>
    					</div>
    					<div class="brow">
    						<div class="i-brow2"></div>
    						<p><span class="red">99%</span>的用户会选择</p>
    					</div>
    				</li>
    			</ul>
    		</div>
        <section>
    			<div class="btn-full" @click="goLoanResult">我知道了</div>
    		</section>
        <section>
          <div style="background:#fff; height: .8rem;"></div>
        </section>
    	</section>
    </section>
  </div>
</template>

<script>
import navBar from '../nav-bar'

export default {
  name: 'intro',
  data () {
    return {
      pageName: 'i贷到期还款',
      back: false
    }
  },
  components: {
    navBar
  },
  methods: {
    goLoanResult () {
      this.$router.go(-1)
    }
  }
}

</script>
