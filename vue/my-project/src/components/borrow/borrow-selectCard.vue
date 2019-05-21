<template>
  <div>
    <navBar :pageName="pageName" :back="back" :backFuc="backFuc"></navBar>
    <div class="bank-card">
      <ul>
        <li v-for=" (item,index) in yqbLists" class="clear js_tap" @doSelect="doSelect(index, 'yqb')" :class="{active:item.loanBindNo === activeLoanBindNo}" :item="item" :key="index" :index="index" is="cardList">
        <li v-for=" (item,index) in cardLists" class="clear js_tap" @doSelect="doSelect(index, 'card')" :class="{active:item.loanBindNo === activeLoanBindNo}" :item="item" :key="index" :index="index" is="cardList">
        </li>
      </ul>
      <div class="fixed btn-box">
        <div class="fixed-wrap">
            <div class="btn" @click="backToLoanApplyPage">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { forEachValue } from '../../plugins/util'
import cardList from '../repay/repay-saving-card-list'
import navBar from '../nav-bar'

export default {
  name: 'borrowSelectCard',
  data () {
    return {
      pageName: '选择银行卡',
      back: true,
      cardLists: [],
      activeLoanBindNo: '',
      activeCardName: ''
    }
  },
  components: {
    cardList,
    navBar
  },
  computed: {
    ...mapGetters({
      getLoanInfoQuery: 'getLoanInfoQuery',
      BANKLIST: 'getBankList'
    }),
    loanInfoQuery () {
      return this.getLoanInfoQuery.infoMap
    }
  },
  created () {
    // 还卡流程暂不支持壹钱包,所以壹钱包数组设置为空
    this.yqbLists = this.$route.params.loanCode === '0201' ? this.loanInfoQuery.yqbList : []
    // 银行卡列表,如果是提现,取借记卡或者储蓄卡数组.如果是还卡,取信用卡数组
    this.cardLists = this.$route.params.loanCode === '0202' ? this.loanInfoQuery.creditCardList : this.loanInfoQuery.debitCarList
    // 设置默认选中的卡
    this.activeLoanBindNo = this.loanInfoQuery.loanBindNo
    this.activeCardName = this.loanInfoQuery.creditCardName
    // 从银行卡列表匹配对应的卡logo编号,用于子组件渲染
    forEachValue(this.cardLists, (item) => {
      item.logo = this.BANKLIST[item.bankNo].logo
    })
    forEachValue(this.yqbLists, (item) => {
      item.logo = this.BANKLIST[item.bankNo].logo
    })
  },
  methods: {
    // 选择其中一张卡,区分壹钱包和银行卡,将所选卡更新为前选中的
    doSelect (index, type) {
      this.activeLoanBindNo = type === 'card' ? this.cardLists[index].loanBindNo : this.yqbLists[index].loanBindNo
      this.activeCardName = type === 'card' ? this.cardLists[index].cardName : this.yqbLists[index].cardName
    },
    // 点击确定,将选中卡的loanBindNo和cardName更新到store中
    backToLoanApplyPage () {
      this.$store.commit('setNewCreditCard', {
        activeLoanBindNo: this.activeLoanBindNo,
        activeCardName: this.activeCardName
      })
      this.$router.go(-1)
    },
    backFuc () {
      this.$router.go(-1)
    }
  }
}
</script>
