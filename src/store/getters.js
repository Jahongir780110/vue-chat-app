export default {
  token(state) {
    return state.token;
  },
  userId(state) {
    return state.userId;
  },
  isAuth(state) {
    return state.token !== null && state.name !== "";
  },
  name(state) {
    return state.name;
  },
  color(state) {
    return state.color;
  },
  authLoading(state) {
    return state.authLoading;
  },
  authError(state) {
    return state.authError;
  },
  onlineUsers(state) {
    return state.onlineUsers;
  },
  id(state) {
    return state.id;
  },
  isDarkMode(state) {
    return state.isDarkMode;
  },
};
