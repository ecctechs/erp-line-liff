<template>
  <div>
    <HeaderMenu />
    <h2>Dashboard</h2>
    <p>ยินดีต้อนรับเข้าสู่ Dashboard</p>
  </div>
</template>

<script>
import HeaderMenu from './components/HeaderMenu.vue'; 

export default {
  name: "Dashboard",
  components: HeaderMenu ,
};
</script>

<style scoped>
h2 {
  color: #333;
}
</style>
