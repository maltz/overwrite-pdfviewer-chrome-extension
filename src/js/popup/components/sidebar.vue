<template>
  <div style="padding: 20px">
    <div style="padding: 20px;background: white; width:100%; text-align:left">
      <div>
				Original contents
			</div>
			<div style="margin: 20px 0;">
				{{ test_data }}
			</div>
      <div v-for="(item, index) in selected_text_array" :key="index" class="selected_text">
        {{ item }}
      </div>
      <button @click="open_my_history">
        open my history page
      </button>
    </div>
  </div>
</template>

<script>

export default {
  components: {},
  data () {
    return {
      test_data: '左側のテキストを選択して下さい'
    }
  },
  computed: {
    selected_text_array () {
      return this.$store.state.selected_text_array
    },
  },
  methods: {
    open_my_history() {
      const url = chrome.runtime.getURL('options.html')
      window.open(url)
    }
  },
}
</script>

<style>
.selected_text {
  font-size: 12px;
  font-weight: bold;
}
</style>