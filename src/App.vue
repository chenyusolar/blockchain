<script setup lang="ts">
// import Wallet from './components/Wallet.vue'
// import Ganache from './components/Ganache.vue'
// import Bnb from './components/Bnb.vue'
// import Sol from './components/Solana.vue'
import Bitcoin from './components/Bitcoin.vue'
</script>

<template>
  <div id="app">
    <Bitcoin />
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
