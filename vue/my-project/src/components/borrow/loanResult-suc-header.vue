<template>
  <section class="containter">
        <section class="result">
            <ul class="step-rel">
              <li class="one active">
                  <span class="icon"></span>
                  <p><span class="red">{{getLoanConfirm.loanAmt | formatMoney}}元</span><span v-text="$route.params.loanCode ==='0201' ? '提现' : '借款'"></span>申请提交成功</p>
                  <div class="line"></div>
              </li>
              <li>
                  <span class="icon"></span>
                  <p>稍后转入您的<span class="red">{{creditCardName}}</span><br>请留意短信通知</p>
                  <div class="line"></div>
              </li>
            </ul>
        </section>
        <div class="f-row f-line" v-if="$route.params.loanCode ==='0202'">
    			<ul>
    				<li>
    					<div class="row">
    						<div class="col-l">信用卡还款提醒<span class="icon-sm icon-qa" @click="toShowTip"></span></div>
    						<div class="col-r">
    							<input class="ios7CBox" type="checkbox" :class="isCheck ? 'checked' : ''" @click="switchRemind">
    						</div>
    						<div class="tooltip opa" v-if="showTip" >
    							防止错过信用卡还款日，你可选择开启信用卡还款提醒。
    						</div>
    					</div>
    				</li>
    				<li v-if="isCheck">
    					<div class="row" @click="showSelectDate(true)">
    						<div class="col-l">设置提醒日</div>
    						<div class="col-r">{{selectDay}}<span class="icon-sm icon-arrow"></span></div>
    					</div>
    				</li>
    			</ul>
    		</div>
        <section class="leayer" v-if="showSelectDateList">
      		<div class="dialog"><div class="close" @click="showSelectDate(false)"></div>
      			<div class="ui-select">
      				<h2>设置提醒日</h2>
      				<div class="option">
      					<ul>
      					  <li class="js-date" v-for="i in 28" @click="selectDayValue(i)">{{i}}日</li>
      					</ul>
      				</div>
      			</div>
      		</div>
      	</section>
        <section class="mt white-bg bor-tb">
            <div class="snow-sm">
                <p><span class="icon-sm icon-snow"></span>还款提示：系统将于<span class="red">每月{{loanInfoQuery.infoMap.rpyDay}}日</span>从您的<span class="red" v-text="$route.params.loanCode ==='0201' ? creditCardName : loanInfoQuery.infoMap.rpyBnakName"></span>自动扣款，请确保扣款账户资金充足。</p>
                <p class="tac link-udr mt" @click="goIntroPage">查看还款指引</p>
            </div>
        </section>
    </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'loanResultHeader',
  data () {
    return {
      isCheck: false,
      showTip: false,
      showSelectDateList: false,
      selectDay: '请选择',
      creditCardName: '',
      remindSwitch: 'N',
      remindDay: ''
    }
  },
  // keep-alive组件激活时调用
  activated () {
    // 从loanInfo页面过来，清除还款提醒日state数据
    this.$route.params.loanCode === '0202' && this.$route.params.from && this.clearRemindDayState()
    // 从intro页面过来，获取还款提醒日state数据
    this.$route.params.loanCode === '0202' && !this.$route.params.from && this.getRemindDayState()
    // 还卡流程确认借款页面一进来先获取信用卡信息
    this.getCreditCard()
  },
  computed: {
    ...mapGetters({
      getLoanInfoQuery: 'getLoanInfoQuery', // 借款查询接口
      getLoanConfirm: 'getLoanConfirm',
      getLogin: 'getLogin', // 获取登录信息
      getRemindDay: 'getRemindDay' // 获取是否勾选提醒还款日
    }),
    loanInfoQuery () {
      return this.getLoanInfoQuery
    },
    // 银行编号
    loanBindNo () {
      return this.$route.query.loanBindNo || this.getLoanInfoQuery.infoMap.loanBindNo
    }
  },
  methods: {
    // 获取loanBindNo匹配的银行卡
    getCreditCard () {
      // 还卡是从url上带过来的,提现一直都在state中
      if (this.$route.params.loanCode === '0202') {
        let creditCardList = this.loanInfoQuery.infoMap.creditCardList
        creditCardList.forEach((item) => {
          if (item.loanBindNo === this.loanBindNo) {
            this.creditCardName = item.cardName
          }
        })
      } else if (this.$route.params.loanCode === '0201') {
        this.creditCardName = this.getLoanInfoQuery.infoMap.creditCardName
      }
    },
    // 提醒开关切换
    switchRemind () {
      this.remindSwitch = this.remindSwitch === 'N' ? 'Y' : 'N'
      this.isCheck = !this.isCheck
      this.selectDay !== '请选择' && this.toSetRemindDay()
      this.selectDay === '请选择' && this.changeRemindState()
    },
    // 弹出提示
    toShowTip () {
      this.showTip = !this.showTip
    },
    // 是否展开选择提醒日期列表
    showSelectDate (bollean) {
      this.showSelectDateList = bollean
    },
    // 选择提醒日期
    selectDayValue (i) {
      this.remindDay = i
      this.selectDay = '每月' + i + '日'
      this.showSelectDate(false)
      this.toSetRemindDay()
    },
    // 设置还款日期接口
    toSetRemindDay () {
      this.$store.commit('setBorrowParams', {
        paramsKey: 'toSetRemindDayParams',
        remindSwitch: this.remindSwitch,
        remindDay: (parseInt(this.remindDay) < 10 ? ['0', parseInt(this.remindDay)].join('') : this.remindDay),
        accountId: this.getLogin.accountId
      })
      this.$store.dispatch('toSetRemindDay')
      .then((data) => {
        this.changeRemindState()
      })
    },
    // 更新store存储的提醒日参数
    changeRemindState () {
      this.$store.commit('setRemindDay', {
        remindSwitch: this.remindSwitch,
        remindDay: this.remindDay
      })
    },
    // 获取是否勾选提醒还款日
    getRemindDayState () {
      this.getRemindDay && this.getRemindDay.remindSwitch ? this.remindSwitch = this.getRemindDay.remindSwitch : ''
      this.isCheck = this.remindSwitch !== 'N'
      this.getRemindDay && this.getRemindDay.remindDay ? this.selectDay = '每月' + this.getRemindDay.remindDay + '日' : ''
      this.getRemindDay && this.getRemindDay.remindDay ? this.remindDay = this.getRemindDay.remindDay : ''
    },
    // 清空还款日state值
    clearRemindDayState () {
      this.$store.commit('setRemindDay', {})
    },
    goIntroPage () {
      this.$router.push({
        name: 'intro'
      })
    }
  }
}

</script>
