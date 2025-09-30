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
/* Style ทั่วไปสำหรับ App */
#app {
  text-align: center;
  color: #2c3e50;
}
header {
  background-color: #00B900;
  color: white;
  padding: 10px;
}
</style>