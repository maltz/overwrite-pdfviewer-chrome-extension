import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const state = {

}

const mutations = {

}

const actions = {
	// ToolbarのIconが押されたときのイベント
	addOnClickedListener ({ state, dispatch, getters }) {
		chrome.browserAction.onClicked.addListener(function (tab) {
			console.log('tab', tab);
			// chrome.tabs.create({url: config.signinPage})
    })
	},
	addListenerOnMessage({ dispatch }) {
		chrome.runtime.onMessage.addListener(
			function(req, sender, sendResponse) {
				console.log(req)
			}
		)
  },
}
export default new Vuex.Store({
	state,
	actions,
	mutations,
	modules: {}
})