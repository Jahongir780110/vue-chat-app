<template>
  <router-view></router-view>
</template>

<script>
// import axios from "axios";
export default {
  created() {
    this.$store.dispatch("tryLogin");
  },
  // updated() {
  //   window.onbeforeunload = function(e) {
  //     const link =
  //       "https://vue-chat-app-7befc-default-rtdb.firebaseio.com/users/" +
  //       this.$store.getters.id +
  //       ".json";
  //     axios.put(link, {
  //       color: this.$store.getters.color,
  //       id: this.$store.getters.userId,
  //       name: this.$store.getters.name,
  //       isOnline: false,
  //       event: e,
  //     });
  //   };
  // },
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html {
  width: 100%;
}
body {
  height: 100vh;
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Roboto", sans-serif !important;
}
</style>
