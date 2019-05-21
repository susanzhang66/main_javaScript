import { GET_PIC_CODE, GET_SMS_CODE, CHECK_OTP, VERIFY_IDENTITY } from './urls'

// initial state
const state = {
  picCode: {},
  smsCode: {},
  otp: {},
  login: {}
}

// getters
// Getter 接受 state 作为其第一个参数：第二个参数 getter,.mapgetter可以方便的将getters的属性暴露，而不用写很多。
// Getter 会暴露为 store.getters 对象：
// store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
const getters = {
  getPicCode: state => state.picCode,
  getSmsCode: state => state.smsCode,
  getOtp: state => state.otp,
  getLogin: (state) => {
    if (state.login.token) {
      return state.login
    } else {
      return JSON.parse(localStorage.getItem('ILOAN_USER_CACHE')) || {}
    }
  }
}

// actions
const actions = {
  picCode: ({ state, dispatch }) => {
    return dispatch('httpRequest', {
      url: GET_PIC_CODE,
      params: state.picCodeParams,
      mutations: 'setPicCode'
    })
  },
  smsCode: ({ state, dispatch }) => {
    return dispatch('httpRequest', {
      url: GET_SMS_CODE,
      params: state.smsCodeParams,
      mutations: 'setSmsCode'
    })
  },
  otp: ({ state, dispatch }) => {
    return dispatch('httpRequest', {
      url: CHECK_OTP,
      params: state.otpParams,
      mutations: 'setOtp'
    })
  },
  login: ({ state, dispatch }) => {
    return dispatch('httpRequest', {
      url: VERIFY_IDENTITY,
      params: state.loginParams,
      mutations: 'setLogin'
    })
  }
}

// mutations
const mutations = {
  setPicCode: (state, data) => {
    state.picCode = data
  },
  setSmsCode: (state, data) => {
    state.smsCode = data
  },
  setOtp: (state, data) => {
    state.otp = data
  },
  setLogin: (state, data) => {
    state.login = data
    try { // safari无痕浏览报错
      localStorage.setItem('ILOAN_USER_CACHE', JSON.stringify(data))
    } catch (e) {
      console.log(e)
    }
  },
  setLoginParams: (state, data) => {
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
