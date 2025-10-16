import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router";

// jQuery + DataTables
import "jquery";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/dataTables.dataTables.css";

// --- Version ของแอป ---
// เปลี่ยนค่า APP_VERSION ทุกครั้งที่ build ใหม่
const APP_VERSION = '1.0.1'; 

// --- ตรวจสอบ version ที่บันทึกไว้ใน localStorage ---
const savedVersion = localStorage.getItem('app_version');

if (savedVersion !== APP_VERSION) {
  console.log('New version detected. Clearing localStorage...');
  localStorage.clear();                 // ล้างข้อมูลเก่า
  localStorage.setItem('app_version', APP_VERSION); // บันทึก version ใหม่
}
// localStorage.clear();

const app = createApp(App);
app.use(router);
app.mount("#app");
