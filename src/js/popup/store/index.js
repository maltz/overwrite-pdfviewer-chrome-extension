import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
	tabId: '',
	selected_text_array: [],
}

const mutations = {

}

const actions = {
	push_selected_text ({ state }, payload) {
		state.selected_text_array.push(payload)
	}
}

export default new Vuex.Store({
	state,
	actions,
	mutations,
})