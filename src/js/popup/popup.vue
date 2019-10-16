<template>
	<div class="columns">
		<div class="column is-three-quarters">
			<pdfviewer />
		</div>
		<div class="column">
			<sidebar id='sidebar'/>
		</div>
  </div>
</template>

<script>
import pdfviewer from './components/pdfviewer.vue'
import sidebar from './components/sidebar.vue'

export default {
  components: {
		sidebar,
		pdfviewer,
	},
  created() {
    this.init()
  },
  methods: {
		init() {
    //  this.$store.dispatch('get_tabId')
    //  this.$store.dispatch('add_listener')
    }
  }
}
</script>
<style>
html, body {
	background-color: rgb(82, 86, 89);
}
#sidebar {
	position: -webkit-sticky;
  position: sticky;
  top: 0;
}
</style>