export default {
  changeLoading(state, payload) {
    state.authLoading = payload;
  },
  errorOccured(state, payload) {
    state.authError = payload;
  },
  setUserData(state, payload) {
    state.token = payload.token;
    state.userId = payload.userId;
    state.name = payload.name;
    state.color = payload.color;
    state.id = payload.id;
  },
  setOnlineUsers(state, payload) {
    state.onlineUsers = payload;
  },
  setMode(state) {
    state.isDarkMode = !state.isDarkMode;
  },
};
