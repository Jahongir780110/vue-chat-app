<template>
  <div
    class="chat-wrapper"
    :style="{ backgroundColor: isDarkMode ? '#18191d' : '#92dff3' }"
  >
    <the-header></the-header>
    <the-messages
      :messages="messages"
      :replyData="replyData"
      :editData="editData"
      @set-focus="setFocus"
      @set-reply="setReply"
      @set-edit="setEdit"
    ></the-messages>
    <input-message
      @set-focus="setFocus"
      @set-reply="setReply"
      @set-edit="setEdit"
      :replyData="replyData"
      :editData="editData"
      :isFocus="isFocus"
    ></input-message>
  </div>
</template>

<script>
import InputMessage from "../components/InputMessage.vue";
import TheMessages from "../components/TheMessages.vue";
import TheHeader from "../components/TheHeader.vue";
import fire from "../fire.js";
import axios from "axios";

export default {
  components: { TheMessages, InputMessage, TheHeader },
  data() {
    return {
      messages: [],
      isFocus: false,
      replyData: {
        show: false,
        replyName: "",
        replyMessage: "",
      },
      editData: {
        edited: false,
        id: "",
        editMessage: "",
        name: "",
      },
    };
  },
  computed: {
    isAuth() {
      return this.$store.getters.isAuth;
    },
    isDarkMode() {
      return this.$store.getters.isDarkMode;
    },
  },
  watch: {
    isAuth(value) {
      if (!value) {
        this.$router.push("/");
      }
    },
  },
  methods: {
    setFocus(val) {
      this.isFocus = val;
    },
    setReply(val) {
      this.replyData = val;
    },
    setEdit(val) {
      this.editData = val;
    },
  },
  mounted() {
    let viewMessage = this;
    const itemsRef = fire.database().ref("messages");
    itemsRef.on("value", (snapshot) => {
      let data = snapshot.val();
      let messages = [];
      for (const key in data) {
        messages.push({
          id: key,
          content: data[key],
        });
      }
      viewMessage.messages = messages;
    });

    const usersRef = fire.database().ref("users");
    usersRef.on("value", (snapshot) => {
      let data = snapshot.val();
      let users = [];
      for (const key in data) {
        users.push({
          id: key,
          content: data[key],
        });
      }
      const onlineUsers = users.filter((item) => {
        return item.content.isOnline === true;
      });
      this.$store.dispatch("setOnlineUsers", onlineUsers);
    });

    const link =
      "https://vue-chat-app-7befc-default-rtdb.firebaseio.com/users/" +
      this.$store.getters.id +
      ".json";
    axios.put(link, {
      color: this.$store.getters.color,
      id: this.$store.getters.userId,
      name: this.$store.getters.name,
      isOnline: true,
    });
  },
  // beforeUnmount() {
  //   const link =
  //     "https://vue-chat-app-7befc-default-rtdb.firebaseio.com/users/" +
  //     this.$store.getters.id +
  //     ".json";
  //   axios.put(link, {
  //     color: this.$store.getters.color,
  //     id: this.$store.getters.userId,
  //     name: this.$store.getters.name,
  //     isOnline: false,
  //   });
  // },
  async beforeUnmount() {
    const link =
      "https://vue-chat-app-7befc-default-rtdb.firebaseio.com/users/" +
      this.$store.getters.id +
      ".json";
    await axios.put(link, {
      color: this.$store.getters.color,
      id: this.$store.getters.userId,
      name: this.$store.getters.name,
      isOnline: false,
    });
  },
};
</script>

<style scoped>
.chat-wrapper {
  width: 500px;
  height: 500px;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  padding-top: 50px;
  padding-bottom: 50px;
  position: relative;
}
@media (max-width: 500px) {
  .chat-wrapper {
    width: 100vw;
    height: 100vh;
  }
}
</style>
