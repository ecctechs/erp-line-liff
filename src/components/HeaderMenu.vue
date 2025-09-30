<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img src="/logo.png" alt="Logo" width="30" height="30" class="d-inline-block align-text-top">
        MyApp
      </a>

      <div class="collapse navbar-collapse" id="navbarMenu">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item"><a class="nav-link" href="#">หน้าแรก</a></li>
          <li class="nav-item"><a class="nav-link" href="#">สินค้า</a></li>
          <li class="nav-item"><a class="nav-link" href="#">รายงาน</a></li>
        </ul>

        <!-- แสดง profile -->
        <div class="d-flex align-items-center">
          <img v-if="profile" :src="profile.pictureUrl" alt="Profile" class="rounded-circle me-2" width="40" height="40">
          <span v-if="profile" class="fw-bold">{{ profile.displayName }}</span>
          <button v-else class="btn btn-outline-primary btn-sm" @click="login">Login</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "HeaderMenu",
  props: {
    profile: {
      type: Object,
      default: null
    }
  },
  methods: {
    login() {
      if (window.liff) window.liff.login();
    }
  }
};
</script>
