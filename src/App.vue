<script setup lang="ts">
// import Wallet from './components/Wallet.vue'
import Ganache from './components/Ganache.vue'
</script>

<template>
  <div id="app">
    <Ganache />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
