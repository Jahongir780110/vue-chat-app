<template>
  <form
    class="input-wrapper"
    :style="{
      backgroundColor: isDarkMode ? '#33393f' : 'white',
      borderTop: isDarkMode ? null : '1px solid silver',
    }"
  >
    <div
      class="replyBar container-fluid"
      :style="{ backgroundColor: isDarkMode ? '#282e33' : 'white' }"
      v-if="replyData.show"
    >
      <div class="row align-items-center d-flex px-2">
        <div class="px-1">
          <i class="fas fa-share"></i>
        </div>
        <div class="px-1">
          <p class="my-0 text-info">{{ replyData.replyName }}</p>
          <p class="my-0" :style="{ color: isDarkMode ? 'white' : 'black' }">
            <!-- {{ replyData.replyMessage.substr(0, 20) }}... -->
            {{
              replyData.replyMessage.length > 20
                ? replyData.replyMessage.substr(0, 20) + "..."
                : replyData.replyMessage
            }}
          </p>
        </div>
        <div @click="closeReply" class="exitReply text-center px-1 ml-auto">
          ✖
        </div>
      </div>
    </div>

    <div
      class="editBar container-fluid"
      :style="{ backgroundColor: isDarkMode ? '#282e33' : 'white' }"
      v-if="editData.edited"
    >
      <div class="row align-items-center d-flex px-2">
        <div class="px-1">
          <i class="fas fa-edit"></i>
        </div>
        <div class="flex-fill px-1">
          <p class="my-0 text-info">{{ editData.name }}</p>
          <p class="my-0" :style="{ color: isDarkMode ? 'white' : 'black' }">
            {{
              editData.editMessage.length > 20
                ? editData.editMessage.substr(0, 20) + "..."
                : editData.editMessage
            }}
            <!-- {{ editData.editMessage.substr(0, 20) }}... -->
          </p>
        </div>
        <div @click="closeEdit" class="exitEdit text-center px-0 ml-auto px-1">
          ✖
        </div>
      </div>
    </div>

    <input
      type="text"
      placeholder="Write a message..."
      v-model="message"
      ref="input"
      :style="{ color: isDarkMode ? 'white' : 'black' }"
    />
    <span>
      <button class="send-button" @click.prevent="addMessage">
        <i class="fas fa-paper-plane"></i>
      </button>
    </span>
  </form>
</template>

<script>
import fire from "../fire.js";
import axios from "axios";
export default {
  props: ["isFocus", "replyData", "editData"],
  emits: ["set-focus", "set-reply", "set-edit"],
  data() {
    return {
      message: "",
    };
  },
  computed: {
    isDarkMode() {
      return this.$store.getters.isDarkMode;
    },
  },
  watch: {
    isFocus(val) {
      if (val === true) {
        this.$refs.input.focus();
      }
    },
    editData(val) {
      this.message = val.editMessage;
    },
  },
  methods: {
    addMessage() {
      if (this.message.trim() !== "") {
        const message = {
          message: this.message,
          name: this.$store.getters.name,
          hours: new Date().getHours(),
          minutes: new Date().getMinutes(),
          userId: this.$store.getters.userId,
          color: this.$store.getters.color,
          replyName: this.replyData.replyName,
          replyMessage: this.replyData.replyMessage,
        };
        if (this.editData.edited) {
          const url =
            "https://vue-chat-app-7befc-default-rtdb.firebaseio.com/messages/" +
            this.editData.id +
            ".json";
          axios.get(url).then((res) => {
            axios.put(url, {
              ...res.data,
              message: message.message,
              edited: true,
            });
          });
          this.message = "";
          this.$refs.input.focus();
          this.closeEdit();
          this.closeReply();
        } else {
          fire
            .database()
            .ref("messages")
            .push(message);
          this.message = "";
          this.$refs.input.focus();
          this.closeReply();
          this.closeEdit();
        }
      }
    },
    closeReply() {
      this.$emit("set-focus", false);
      this.$emit("set-reply", {
        show: false,
        replyName: "",
        replyMessage: "",
      });
    },
    closeEdit() {
      this.$emit("set-focus", false);
      this.$emit("set-edit", {
        edited: false,
        id: "",
        editMessage: "",
        name: "",
      });
    },
  },
  mounted() {
    this.$refs.input.focus();
  },
};
</script>

<style scoped>
.input-wrapper {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  position: absolute;
  bottom: 0;
  width: 100%;
}
input {
  font-size: 1rem;
  outline: none !important;
  border: none;
  background-color: transparent;
  flex-grow: 2;
  font-family: "Roboto", sans-serif;
}
button {
  padding: 6px;
  outline: none !important;
  border: none !important;
  background-color: transparent;
  cursor: pointer;
}
i {
  font-size: 1.2rem;
  color: #7b7b7b;
}
.load-button {
  margin-left: 5px;
}
.replyBar,
.editBar {
  position: absolute;
  bottom: 51px;
  z-index: 10000;
  left: 0;
}
.exitReply,
.exitEdit {
  color: #7b7b7b;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
}
</style>
