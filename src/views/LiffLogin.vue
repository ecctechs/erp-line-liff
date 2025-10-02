<template>
  <div>  
    <!-- กรณีโหลดข้อมูล LIFF -->
    <div v-if="loading" class="liff-container status-message">
      <p>🚀 กำลังเตรียมข้อมูล LIFF...</p>
    </div>

    <!-- กรณีเกิดข้อผิดพลาด -->
    <div v-else-if="error" class="liff-container status-message error">
      <p>เกิดข้อผิดพลาด:</p>
      <p>{{ error }}</p>
    </div>

    <!-- กรณี Login สำเร็จ -->
    <!-- <HeaderMenu v-else-if="profile" :profile="profile" /> -->

    <!-- กรณียังไม่ Login -->
    <div v-else class="liff-container status-message">
      <p>กรุณา Login ผ่าน LINE</p>
    </div>

  </div>
</template>

<script>
import HeaderMenu from '../components/HeaderMenu.vue';
import RegisterBusiness from '../views/RegisterBusiness.vue';
import liff from '@line/liff';

export default {
  name: 'LiffLogin',
  components: { HeaderMenu , RegisterBusiness },
  data() {
    return {
      liffId: '2008202406-5BYrEdBE',
      profile: null,
      error: null,
      loading: true
    };
  },

  methods: {
    async initLiff() {
      try {
        console.log('เริ่มต้นการทำงานของ LIFF...');
        await liff.init({ liffId: this.liffId });
        console.log('LIFF initialised');

        if (!liff.isLoggedIn()) {
          console.log('ผู้ใช้ยังไม่ได้ Login, กำลัง redirect...');
          liff.login();
        } else {
          console.log('ผู้ใช้ Login อยู่แล้ว, กำลังดึงข้อมูลโปรไฟล์...');
          const userProfile = await liff.getProfile();
          console.log('ดึงข้อมูลโปรไฟล์สำเร็จ:', userProfile);
          this.profile = userProfile;

          localStorage.setItem('profile', JSON.stringify(userProfile));

          this.$router.push({ name: 'RegisterBusiness' });

        }
      } catch (err) {
        console.error('เกิดข้อผิดพลาดในการทำงานของ LIFF:', err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  },

  mounted() {
    this.initLiff();
  }
};
</script>

<style scoped>
.liff-container {
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  text-align: center;
}

.status-message {
  font-size: 1.2em;
  color: #555;
}

.error {
  color: #d9534f;
}
</style>
