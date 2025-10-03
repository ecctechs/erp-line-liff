// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import LiffLogin from "../views/LiffLogin.vue";
import RegisterBusiness from "../views/RegisterBusiness.vue";
import HomePage from "../views/HomePage.vue";

const routes = [
  { path: "/", name: "HomePage", component: HomePage },
  { path: "/register", name: "RegisterBusiness", component: RegisterBusiness },
  // { path: "/dashboard", name: "Dashboard", component: Dashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
