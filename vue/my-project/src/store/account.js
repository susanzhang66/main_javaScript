import { QUERY_USER_APPLY_STATE, QUERY_PRODUCT, BANK_ALTER } from './urls'

// initial state
const state = {
  userApplyState: {},
  product: {},
  bank: {}
}

// getters
const getters = {
  getUserApplyState: state => state.userApplyState,
  getProduct: state => state.product,
  getBank: state => state.bank
}

// actions
const actions = {
  queryUserApplyState: ({ state, dispatch }) => {
    return dispatch('httpRequest', {
      url: QUERY_USER_APPLY_STATE,
      params: state.userApplyStateParams,
      mutations: 'setUserApplyState'
    })
  },
  queryProduct: ({ state, dispatch }) => {
    return dispatch('httpRequest', {
      url: QUERY_PRODUCT,
      params: state.productParams,
      mutations: 'setProduct'
    })
  },
  bankAlter: ({ state, dispatch }) => {
    return dispatch('httpRequest', {
      url: BANK_ALTER,
      params: state.bankParams,
      mutations: 'setBank'
    })
  }
}

// mutations
const mutations = {
  setUserApplyState: (state, data) => {
    state.userApplyState = data
  },
  setProduct: (state, data) => {
    state.product = data
  },
  setBank: (state, data) => {
    state.bank = data
  },
  setAccountParams: (state, data) => {
    const key = data.paramsKey
    delete data.paramsKey
    if (!state[key]) {
      state[key] = {}
    }
    Object.assign(state[key], data)
  },
  // 更新用户申请号
  setApplyNo: (state, data) => {
    state.product.applyNo = data
  },
  // 更新支用申请号
  setNewPayApplyNo: (state, data) => {
    state.product.payApplyNo = data
  },
  // 更新初始授信额度
  setCredit: (state, data) => {
    state.userApplyState.credit = data
  },
  // 更新协议版本号
  setVersionNo: (state, data) => {
    state.userApplyState.versionNo = data
  },
  // 更新资料代传合同版本号
  setDataVersionNo: (state, data) => {
    state.userApplyState.dataVersionNo = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
