import { createStore } from "vuex";
import mutations from "./mutations.js";
import getters from "./getters.js";
import actions from "./actions.js";

const store = createStore({
  state() {
    return {
      token: null,
      userId: null,
      name: "",
      color: "",
      id: null,
      authLoading: false,
      authError: null,
      onlineUsers: [],
      isDarkMode: true,
    };
  },

  mutations,

  getters,

  actions,
});

export default store;
