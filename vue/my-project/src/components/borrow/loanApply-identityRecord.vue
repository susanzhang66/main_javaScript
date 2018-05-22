<template>
<section>
  <navBar :pageName="pageName" :back="back" :backFuc="backFuc"></navBar>
  <p class="supply-txt">请补充姓名(拼音)及身份证有效日期</p>
  <div class="supply-info">
    <ul>
      <li>
        <div>姓名(中文)：</div>
        <div class="box-flex">
          <input type="text" :value="name" class="sup-ipt" readOnly>
        </div>
      </li>
      <li class="input-edit">
        <label for="englishName">姓名(拼音)：</label>
        <div class="box-flex">
          <input type="text" style="ime-mode:disabled" maxLength="200" :placeholder="namePlaceholder" onchange="value=value.replace(/[^\a-\z\A-\Z]/g,'')" class="sup-ipt" :value="englishName" @change="onEnlishNameChange">
        </div>
      </li>
    </ul>
  </div>
  <div class="supply-info mt18">
    <ul>
      <li>
        <div>身份证号：</div>
        <div class="box-flex">
          <input type="text" readOnly placeholder="" class="sup-ipt" :value="getLogin.identityNumber | rsaDecrypt | formatIdCardNo">
        </div>
      </li>
      <li class="input-edit">
        <div>身份证有效起始日期：</div>
        <div class="box-flex">
          <input type="date" :value="startDateValue" @input="changeDate($event, 'start')" class="sup-ipt" :class="dateClassStartValue ? 'date' : ''" :placeholder="changeDatePlaceholderStart" style="background: transparent;" />
        </div>
      </li>
      <li class="input-edit">
        <div>身份证有效截止日期：</div>
        <div class="box-flex">
          <input type="date" :value="endingDateValue" @input="changeDate($event, 'end')" class="sup-ipt" :class="dateClassValue ? 'date' : ''" :placeholder="changeDatePlaceholderEnd" :disabled="disabledState" style="background: transparent;" />
        </div>
      </li>
    </ul>
  </div>
  <p class="supply-txt" @click="changeButton">
    <label :class="buttonGray ? '' : 'checked'" class="checkbox-style"><span class="icon-sm icon-checkbox"></span></label>
    <span class="icon-remark"></span>勾选代表永久身份证有效截止日期
  </p>
  <div class="btn-content">
    <div class="btn" @click="onSubmitMessge">确定</div>
  </div>
</section>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import navBar from '../nav-bar'

export default {
  name: 'loanApply-identityRecord',
  data () {
    return {
      pageName: '补充身份信息',
      back: true,
      name: '',
      englishName: '',
      namePlaceholder: '请输入姓名拼音（例如WANGYIYI）',
      datePlaceholderStart: '请选择日期',
      datePlaceholderEnd: '请选择日期',
      idCard: '',
      startDate: '',
      endDate: '',
      startDateString: '',
      endingDateString: '',
      idCardFormate: '',
      buttonGray: true,
      dateTime: '',
      dateClassStart: true,
      dateClass: true,
      disabledState: false
    }
  },
  components: {
    navBar
  },
  created () {
    this.idCard = this.rsaDecrypt(this.getLogin.identityNumber)
    this.name = this.rsaDecrypt(this.getLogin.custName)
    // 请求接口获取之前补录的身份信息
    this.getOtherCustomerInfo()
  },
  computed: {
    ...mapGetters({
      getLogin: 'getLogin' // 获取登录信息
    }),
    startDateValue () {
      return this.startDateString
    },
    endingDateValue () {
      return this.endingDateString
    },
    changeDatePlaceholderEnd () {
      return this.datePlaceholderEnd
    },
    changeDatePlaceholderStart () {
      return this.datePlaceholderStart
    },
    dateClassStartValue () {
      return this.dateClassStart
    },
    dateClassValue () {
      return this.dateClass
    }
  },
  methods: {
    // 请求接口获取之前补录的身份信息
    getOtherCustomerInfo () {
      this.$store.commit('setBorrowParams', {
        paramsKey: 'otherCustomerInfoParams',
        jsonPara: JSON.stringify({
          accountId: this.getLogin.accountId
        })
      })
      this.$store.dispatch('otherCustomerInfo')
        .then((data) => {
          this.englishName = data.name
          // 用于显示在页面上的日期
          this.startDateString = data.startingDate ? this.formateDate(data.startingDate.replace(/-/g, '/')) : ''
          this.endingDateString = data.endingDate ? this.formateDate(data.endingDate.replace(/-/g, '/')) : ''
          // 用于校验的日期
          this.startDate = data.startingDate.replace(/-/g, '/')
          this.endDate = data.endingDate.replace(/-/g, '/')
        })
    },
    // 名字拼音转大写
    onEnlishNameChange (e) {
      let elem = e.target
      let val = elem.value
      val = val.toUpperCase()
      this.englishName = val
      // 兼容Safari浏览器做的处理
      if (val === '') {
        this.namePlaceholder = '请输入姓名拼音（例如WANGYIYI）'
      }
    },
    // 校验英文名
    unEnglishName () {
      this.englishName = this.englishName && this.englishName.replace(/\s/g, '')
      let reg = /[^A-Z]/g
      if (!this.englishName || this.englishName.match(reg)) {
        return '您输入的拼音有误，请重新输入'
      }
      if (this.englishName.length > 200) {
        return '姓名拼音不能大于200个字符'
      }
      return false
    },
    // 校验选择的身份证有效期
    unIdCardDate () {
      // let reg = /^\d{4}[年]\d{2}[月]\d{2}[日]$/
      let now = new Date()
      // 只取年月日，用于选择的日期比较
      let nowTime = new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate()).getTime()
      let nextDayTime = nowTime + 24 * 60 * 60 * 1000 // 多加一天的时间戳
      let startTime = new Date(this.startDate).getTime()
      let endTime = new Date(this.endDate).getTime()
      let birthdayTime = new Date(this.getBirthDay(this.idCard)).getTime()
      // 起始日期不能小于出生日期,不能大于等于当前系统时间
      // 截止日期大于当前系统时间加一天
      if (!this.startDateString || startTime < birthdayTime || startTime >= nowTime) {
        return '您输入的身份证有效起始日期有误，请重新输入'
      }
      if (!this.endingDateString || startTime > endTime || endTime <= nextDayTime) {
        return '您输入的身份证有效截止日期有误，请重新输入'
      }
      return false
    },
    // 通过身份证号码获取出生日期4****** 19910227 ****
    getBirthDay (idcard) {
      let year = idcard.substr(6, 4)
      let mon = idcard.substr(10, 2)
      let date = idcard.substr(12, 2)
      return year + '/' + mon + '/' + date
    },
    // date 标准的date字符串格式（yy/mm/dd），或者日期类型
    formateDate (date, flag) {
      if (!date) return ''
      let newDate = new Date(date)
      let mon = parseInt(newDate.getMonth() + 1)
      let day = parseInt(newDate.getDate())
      if (flag) {
        return newDate.getFullYear() + '/' + (mon > 9 ? mon : '0' + mon) + '/' + (day > 9 ? day : '0' + day)
      }
      return newDate.getFullYear() + '年' + (mon > 9 ? mon : '0' + mon) + '月' + (day > 9 ? day : '0' + day) + '日'
    },
    // 提交补录信息到接口
    onSubmitMessge (e) {
      let englishNameMsg = this.unEnglishName()
      let idCardMsg = this.unIdCardDate()
      if (englishNameMsg) {
        this.$tip.show({
          message: englishNameMsg
        })
        return
      }
      if (idCardMsg) {
        this.$tip.show({
          message: idCardMsg
        })
        return
      }
      this.$store.commit('setBorrowParams', {
        paramsKey: 'appendOtherCustomerInfoParams',
        name: this.englishName,
        startingDate: this.startDate.replace(/\//g, '-'),
        endingDate: this.endDate.replace(/\//g, '-')
      })
      this.$store.dispatch('appendOtherCustomerInfo').then((data) => {
        this.$router.replace({
          name: 'borrow',
          params: {
            loanCode: this.$route.params.loanCode
          }
        })
      })
    },
    // 勾选切换按钮是否可点击
    changeButton () {
      this.buttonGray = !this.buttonGray
      this.endingDateString = this.endingDateString === '9999-12-31' ? '' : '9999-12-31'
      this.dateClass = this.endingDateString !== '9999-12-31'
      this.disabledState = this.endingDateString === '9999-12-31'
      this.datePlaceholderEnd = this.endingDateString === '' ? '请选择日期' : ''
      this.endDate = '9999/12/31'
    },
    backFuc () {
      this.$router.go(-1)
    },
    changeDate (e, type) {
      if (e.target.value !== '') {
        if (type === 'start') {
          this.datePlaceholderStart = ''
          this.startDateString = e.target.value
          this.startDate = this.startDateString.replace(/-/g, '/')
          this.dateClassStart = false
        } else {
          this.endingDateString = e.target.value
          this.endDate = this.endingDateString.replace(/-/g, '/')
          this.dateClass = false
        }
      } else if (e.target.value !== null) {
        if (type === 'start') {
          this.startDateString = e.target.value
          this.datePlaceholderStart = '请选择日期'
          this.dateClassStart = true
        } else {
          this.endingDateString = e.target.value
          this.buttonGray = true
          this.dateClass = true
          this.datePlaceholderEnd = '请选择日期'
        }
      }
    }
  }
}
</script>

<style>
.mt18 {
  margin-top: .18rem;
}

.btn-content {
  padding: .6rem .3rem;
}

.checkbox-style {
  margin-right: -0.1rem;
}

.supply-txt {
  font-size: .26rem;
  color: #727272;
  padding: .09rem .3rem
}

.supply-info {
  font-size: .32rem;
  border-top: 1px solid #d8d8d8
}

.supply-info li {
  height: .86rem;
  line-height: .86rem;
  padding: 0 .3rem;
  color: #313131;
  border-bottom: 1px solid #d8d8d8;
  background: #fff;
  display: -webkit-box
}

.sup-ipt {
  line-height: .6rem;
  font-size: .32rem;
  color: #313131;
  width: 100%
}

.supply-info .input-edit,
.supply-info .input-edit .sup-ipt {
  transition: background .2s
}

.supply-info .input-edit:active,
.supply-info .input-edit:active .sup-ipt {
  background: #ccc
}

.date::before {
  content: attr(placeholder);
  color: #999;
}
</style>
