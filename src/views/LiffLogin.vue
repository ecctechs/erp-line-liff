<template>
  <div>
    <p v-if="loading" class="liff-container status-message">🚀 กำลังโหลด LIFF...</p>
    <p v-else-if="error" class="liff-container status-message error">❌ เกิดข้อผิดพลาด: {{ error }}</p>
    <p v-else class="liff-container status-message">กรุณา login ผ่าน LINE</p>
  </div>
</template>

<script>
import liff from '@line/liff';
import router from '../router';

export default {
  name: 'LiffLogin',
  data() {
    return {
      liffId: '2008202406-5BYrEdBE',
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

          const userData = localStorage.getItem('userData');
          console.log("userData",userData)

          if(userData){
            console.log("Dashboard")
            this.$router.push("/dashboard");
          }else{
            console.log("RegisterBusiness")
            this.$router.push("/register");
          }

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
