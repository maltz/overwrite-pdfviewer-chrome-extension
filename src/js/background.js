import Vue from 'vue'
import store from './background/store'

new Vue({
	el: '#app',
	store,
	created () {
		this.init()
	},
	methods: {
		init () {
      console.log('vue init');
      this.$store.dispatch('addOnClickedListener')
      this.$store.dispatch('addListenerOnMessage')
		}
	}
})
