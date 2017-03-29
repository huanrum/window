import Vue from 'vue'
import Vuex from 'vuex'
// import userInfo from './modules/user_info'
// import login from './modules/login'
import doc from './modules/doc'
import patient from './modules/patient'
import followup from './modules/followup'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const store = new Vuex.Store({
  modules: {
    // userInfo,
    patient,
    followup,
    doc
    // login
  },
  strict: debug,
  middlewares: debug ? [] : []
})

export default store
