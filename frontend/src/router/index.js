import { createRouter, createWebHistory } from "vue-router";
import AuthView from "@/views/AuthView.vue";
import HomeView from "@/views/HomeView.vue";

const routes = [
  { path: "/", component: AuthView },
  { path: "/home", component: HomeView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
