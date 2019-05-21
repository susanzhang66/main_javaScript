import {
  QUERY_ILOAN_CREDIT_AMT, // 借款查询接口
  REPAYMENT_CALCULATE, // 还款试算接口
  COMMIT_SIGN_APPL, // 再次借款签约接口
  OTHER_CUSTOMER_INFO, // 获取补录身份信息接口
  APPEND_OTHER_CUSTOMER_INFO, // 补录身份信息
  GET_INSURANCE_H5_LINK, // 获取H5链接接口
  CREDITCARDUNIONPAYCERTIFICATION, // 信用卡银联认证接口
  ADVISE_UNDER_WRITING, // 调用通知核保接口
  CHOOSEPRODECT, // 还卡选择产品，获取支用申请号
  SETGIVEBACKDATE // 设置还款日期接口
} from './urls'

// initial state
const state = {
  lostParams: false,
  loanInfoQuery: {},
  repayCalculate: {},
  creditCardIdentify: {},
  getH5Link: {},
  getUnderwritingRes: {},
  loanConfirm: {},
  chooseProduct: {},
  toSetRemindDay: {},
  otherCustomerInfo: {},
  appendOtherCustomerInfo: {},
  amount: '',
  loanInfoParams: {},
  notTraceless: true
}

// getters
const getters = {
  getLostParamsState: state => state.lostParams,
  getLoanInfoQuery: state => state.loanInfoQuery,
  getRepayCalculate: state => state.repayCalculate,
  getH5LinkParams: state => state.getH5Link,
  getLastPageParams: (state) => {
    if (state.loanInfoParams.applyNo) {
      return state.loanInfoParams
    } else {
      return JSON.parse(localStorage.getItem('ILOAN_PAGE_PARAMS')) || {}
    }
  },
  getLoanConfirm: state => state.loanConfirm,
  getLoanAmt: state => state.amount,
  getTraceless: state => state.notTraceless,
  getRemindDay: state => state.toSetRemindDay
}

const actions = {
  // 借款查询接口
  loanInfoQuery: ({ state, dispatch, commit }) => {
    if (!JSON.parse(state.loanInfoQueryParams.jsonPara).applyNo) {
      commit('setLostParams', true)
    }
    return dispatch('httpRequest', {
      url: QUERY_ILOAN_CREDIT_AMT,
      params: state.loanInfoQueryParams,
      mutations: 'setLoanInfoQuery'
    })
  },
  // 还款试算借款
  repayCalculate: ({ state, dispatch }) => {
    return dispatch('httpRequest', {
      url: REPAYMENT_CALCULATE,
      params: state.repayCalculateParams,
      mutations: 'setRepayCalculate'
    })
  },
  // 信用卡银联认证
  creditCardIdentify: ({ state, dispatch }) => {
    return dispatch('httpRequest', {
      url: CREDITCARDUNIONPAYCERTIFICATION,
      params: state.creditCardIdentifyParams,
      mutations: 'setCreditCardIdentify'
    })
  },
  // 获取H5链接接口
  getH5Link: ({ state, dispatch }) => {
    return dispatch('httpRequest', {
      url: GET_INSURANCE_H5_LINK,
      params: state.getH5LinkParams,
      mutations: 'setH5Link'
    })
  },
  // 通知核保接口
  getUnderwritingRes: ({ state, dispatch }) => {
    return dispatch('httpRequest', {
      url: ADVISE_UNDER_WRITING,
      params: state.getUnderwritingResParams,
      mutations: 'setGetUnderwritingRes'
    })
  },
  // 再次确认借款接口
  loanConfirm: ({ state, dispatch }) => {
    return dispatch('httpRequest', {
      url: COMMIT_SIGN_APPL,
      params: state.loanConfirmParams,
      mutations: 'setloanConfirm'
    })
  },
  // 还卡选择产品，获取支用申请号
  chooseProduct: ({ state, dispatch }) => {
    return dispatch('httpRequest', {
      url: CHOOSEPRODECT,
      params: state.chooseProductParams,
      mutations: 'setChooseProduct'
    })
  },
  // 设置还款日期接口
  toSetRemindDay: ({ state, dispatch }) => {
    return dispatch('httpRequest', {
      url: SETGIVEBACKDATE,
      params: state.toSetRemindDayParams,
      mutations: 'setRemindDay'
    })
  },
  // 获取补录身份信息接口
  otherCustomerInfo: ({ state, dispatch }) => {
    return dispatch('httpRequest', {
      url: OTHER_CUSTOMER_INFO,
      params: state.otherCustomerInfoParams,
      mutations: 'setOtherCustomerInfo'
    })
  },
  // 补录身份接口
  appendOtherCustomerInfo: ({ state, dispatch }) => {
    return dispatch('httpRequest', {
      url: APPEND_OTHER_CUSTOMER_INFO,
      params: state.appendOtherCustomerInfoParams,
      mutations: 'setAppendOtherCustomerInfo'
    })
  }
}

// mutations
const mutations = {
  setCreditCardIdentify: (state, data) => {
    state.creditCardIdentify = data
  },
  setH5Link: (state, data) => {
    state.getH5Link = data
  },
  setGetUnderwritingRes: (state, data) => {
    state.getUnderwritingRes = data
  },
  setLoanInfoQuery: (state, data) => {
    state.loanInfoQuery = data
  },
  setRepayCalculate: (state, data) => {
    state.repayCalculate = data
  },
  setloanConfirm: (state, data) => {
    state.loanConfirm = data
  },
  setChooseProduct: (state, data) => {
    state.chooseProduct = data
  },
  setRemindDay: (state, data) => {
    state.toSetRemindDay = data
  },
  setOtherCustomerInfo: (state, data) => {
    state.otherCustomerInfo = data
  },
  setAppendOtherCustomerInfo: (state, data) => {
    state.appendOtherCustomerInfo = data
  },
  setNewCreditCard: (state, data) => {
    state.loanInfoQuery.infoMap.creditCardName = data.activeCardName
    state.loanInfoQuery.infoMap.loanBindNo = data.activeLoanBindNo
  },
  setNewAmount: (state, data) => {
    state.amount = data
  },
  setLoanInfoParams: (state, data) => {
    state.loanInfoParams = data
    try {
      localStorage.setItem('ILOAN_PAGE_PARAMS', data)
    } catch (e) {
      alert('您处于无痕浏览，无法为您跳转')
      state.notTraceless = false
    }
  },
  setLoanBindNo: (state, data) => {
    state.loanInfoQuery.infoMap.loanBindNo = data
  },
  setTerm: (state, data) => {
    state.repayCalculate.term = data
  },
  setInsuranceNo: (state, data) => {
    state.getH5Link.cover_no = data
  },
  setCounterFee: (state, data) => {
    state.repayCalculate.counterFee = data
  },
  setLostParams: (state, data) => {
    state.lostParams = data
  },
  setBorrowParams: (state, data) => {
    const key = data.paramsKey
    delete data.paramsKey
    if (!state[key]) {
      state[key] = {}
    }
    Object.assign(state[key], data)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
