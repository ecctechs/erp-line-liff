<template>
  <div id="app">
    <main>
      <LiffLogin />
    </main>
  </div>
</template>

<script setup>
// Import Component ที่เราสร้างไว้
import LiffLogin from './components/LiffLogin.vue'; 
</script>

<style>
html, body, #app, main {
  height: 100%;
  margin: 0;
  padding: 0;
}

main {
  display: flex;
  flex-direction: column;
}
</style>