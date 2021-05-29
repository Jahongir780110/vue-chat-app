<template>
  <div
    class="header p-3"
    :style="{
      backgroundColor: isDarkMode ? '#33393f' : 'white',
      borderBottom: isDarkMode ? null : '1px solid silver',
    }"
  >
    <i
      class="fas"
      :class="{ 'fa-sun': isDarkMode, 'fa-moon': !isDarkMode }"
      @click="setMode"
    ></i>
    <p class="name" :style="{ color: isDarkMode ? 'white' : 'black' }">
      {{ name }}
    </p>
    <i class="fas fa-sign-out-alt" @click="logout"></i>
  </div>
</template>

<script>
export default {
  computed: {
    name() {
      return this.$store.getters.name;
    },
    isDarkMode() {
      return this.$store.getters.isDarkMode;
    },
  },
  methods: {
    setMode() {
      this.$store.dispatch("setMode");
    },
    logout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>

<style scoped>
.header {
  height: 50px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #282e33;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
i {
  color: #7b7b7b;
  font-size: 1.6rem;
  cursor: pointer;
}
p {
  font-size: 1.4rem;
  color: white;
  margin: 0 !important;
}
</style>
