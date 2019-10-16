<template>
  <div>
    <div class="message">{{ msg }}</div>
    <div>
      このように、画面を目一杯使ったコンテンツも作れます。
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        msg: 'Hello from Vue Options component!'
      }
    }
  }
</script>

<style>
  .message {
    color: green;
  }
</style>
