import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";
import TheComments from "./pages/TheComments.vue";
import TheAuth from "./pages/TheAuth.vue";
import NotFound from "./components/NotFound.vue";

import store from "./store/index.js";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/auth" },
    { path: "/auth", component: TheAuth },
    {
      path: "/chat",
      component: TheComments,
      beforeEnter(_, _2, next) {
        if (!store.getters.isAuth) {
          next({ path: "/", component: TheAuth });
        } else {
          next();
        }
      },
    },
    { path: "/:notFound(.*)", component: NotFound },
  ],
});

const app = createApp(App);
app.use(router);
app.use(store);
app.mount("#app");
