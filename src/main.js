import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router";

// jQuery + DataTables
import "jquery";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/dataTables.dataTables.css";

const app = createApp(App);
app.use(router);
app.mount("#app");
