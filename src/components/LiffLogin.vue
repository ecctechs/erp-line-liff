<template>
  <div class="liff-container">
    <div v-if="loading" class="status-message">
      <p>🚀 กำลังเตรียมข้อมูล LIFF...</p>
    </div>

    <div v-else-if="error" class="status-message error">
      <p>เกิดข้อผิดพลาด:</p>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="profile" class="profile-card">
      <img :src="profile.pictureUrl" alt="Profile Picture" class="profile-image" />
      <h2 class="display-name">สวัสดี, {{ profile.displayName }}!</h2>
      <p class="user-id">User ID: {{ profile.userId }}</p>
    </div>
    
    <div v-else class="status-message">
      <p>กรุณา Login ผ่าน LINE</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import liff from '@line/liff';

// LIFF ID ของคุณ
const liffId = '2008202406-5BYrEdBE';

// สร้าง Reactive State สำหรับเก็บข้อมูล
const profile = ref(null);
const error = ref(null);
const loading = ref(true);

// onMounted จะทำงานเมื่อ Component ถูกสร้างขึ้น
onMounted(async () => {
  try {
    console.log('เริ่มต้นการทำงานของ LIFF...');
    
    // 1. เริ่มต้น LIFF (Initialize)
    await liff.init({ liffId });
    console.log('LIFF initialised');

    // 2. ตรวจสอบสถานะการ Login
    if (!liff.isLoggedIn()) {
      console.log('ผู้ใช้ยังไม่ได้ Login, กำลังจะ redirect...');
      // ถ้ายังไม่ Login, LIFF จะเปิดหน้า Login ของ LINE ให้เอง
      // ไม่ต้องเขียนโค้ดเพิ่มเติมในส่วนนี้ เพราะ liff.login() จะ redirect ทั้งหน้าจอ
      liff.login();
    } else {
      console.log('ผู้ใช้ Login อยู่แล้ว, กำลังดึงข้อมูลโปรไฟล์...');
      // 3. ถ้า Login แล้ว, ดึงข้อมูลโปรไฟล์
      const userProfile = await liff.getProfile();
      console.log('ดึงข้อมูลโปรไฟล์สำเร็จ:', userProfile);
      
      // 4. นำข้อมูลที่ได้ไปเก็บใน State
      profile.value = userProfile;
    }
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการทำงานของ LIFF:', err);
    error.value = err.message;
  } finally {
    // เมื่อทำงานเสร็จ (ไม่ว่าจะสำเร็จหรือล้มเหลว) ให้ปิดสถานะ Loading
    loading.value = false;
  }
});
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

.profile-card {
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  max-width: 300px;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #00c300;
  object-fit: cover;
  margin-bottom: 15px;
}

.display-name {
  margin: 10px 0;
  font-size: 1.5em;
  color: #333;
}

.user-id {
  font-size: 0.9em;
  color: #777;
  word-wrap: break-word;
}

.status-message {
  font-size: 1.2em;
  color: #555;
}

.error {
  color: #d9534f;
}
</style>