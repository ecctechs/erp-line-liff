// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import LiffLogin from "@/views/LiffLogin.vue";
import RegisterBusiness from "@/views/RegisterBusiness.vue";
import DashboardVue from "@/views/DashboardVue.vue";

const routes = [
  { path: "/", name: "LiffLogin", component: LiffLogin },
  { path: "/register", name: "RegisterBusiness", component: RegisterBusiness },
  { path: "/dashboard", name: "Dashboard", component: DashboardVue },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
