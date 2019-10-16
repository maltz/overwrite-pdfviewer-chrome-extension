import Vue from 'vue'
import PopUp from './popup/popup.vue'
import store from './popup/store'

import Buefy from 'buefy'
// import 'buefy/dist/buefy.css'
Vue.use(Buefy)

new Vue({
  el: '#app',
  store,
  components: { PopUp }
})