<template>
  <div class="header-menu-mobile d-flex align-items-center p-2 bg-light gap-2">
    <!-- รูปโปรไฟล์ -->
    <img
      v-if="profile && profile.pictureUrl"
      :src="profile.pictureUrl"
      alt="Profile"
      class="rounded-circle"
      width="40"
      height="40"
    />

    <!-- ข้อความ greeting -->
    <div class="greeting">
      <span v-if="profile && profile.displayName">
        สวัสดี {{ profile.displayName }}
      </span>
      <span v-else>
        สวัสดี ผู้ใช้งาน
      </span>
      <div v-if="profile && profile.statusMessage" class="small text-muted">
        {{ profile.statusMessage }}
      </div>
    </div>

    <!-- ปุ่ม Login (ถ้าไม่มี profile) -->
    <button
      v-if="!profile"
      @click="login"
      class="btn btn-sm btn-primary ms-auto"
    >
      เข้าสู่ระบบ
    </button>
  </div>
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

<style scoped>
.header-menu-mobile {
  height: 60px;
}

.header-menu-mobile img {
  object-fit: cover;
}

.greeting {
  font-weight: 500;
  font-size: 1rem;
}
</style>
