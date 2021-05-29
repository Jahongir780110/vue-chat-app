<template>
  <ul ref="ul" :class="{ ulReply: replyData.show, ulEdit: editData.edited }">
    <li
      v-for="mes in messages"
      :key="mes.id"
      :class="{
        myMessage: mes.content.userId === $store.getters.userId,
        alienMessage: mes.content.userId !== $store.getters.userId,
        darkModeMessage: isDarkMode,
        lightModeMessage: !isDarkMode,
      }"
    >
      <div
        v-if="mes.content.deleted"
        class="deletedTex text-secondary text-right"
      >
        <i class="fas fa-trash mr-1"></i> This message was deleted
      </div>

      <div v-else>
        <div
          class="replied container-fluid"
          v-if="mes.content.replyName !== ''"
        >
          <div class="row">
            <div class="col-1 px-0 pl-3">
              <span class="replyLine bg-info"></span>
            </div>
            <div class="col-11 px-0">
              <p class="text-info my-0">
                <small>{{ mes.content.replyName }}</small>
              </p>
              <p class="text-white my-0">
                <small :style="{ color: isDarkMode ? 'white' : 'black' }">{{
                  mes.content.replyMessage
                }}</small>
              </p>
            </div>
          </div>
        </div>

        <span :style="{ color: mes.content.color }" class="font-weight-bolder"
          >{{ mes.content.name }}
        </span>

        <span class="messageMenuWrapper dropdown" data-toggle="dropdown"
          ><span
            class="messageMenu"
            :style="{ backgroundColor: isDarkMode ? '#6c757d' : 'black' }"
          ></span
        ></span>
        <div class="dropdown-menu py-0">
          <p
            @click="setReplyData(mes.content)"
            class="dropdown-item my-0 px-2 py-2"
          >
            <i class="fas fa-share mr-2"></i>Reply
          </p>
          <p
            v-if="mes.content.userId === $store.getters.userId"
            @click="editText(mes)"
            class="dropdown-item my-0 px-2 py-2"
          >
            <i class="fas fa-edit mr-2"></i>Edit
          </p>
          <p class="dropdown-item my-0 px-2 py-2" @click="copyText(mes)">
            <i class="far fa-copy mr-2"></i>Copy
          </p>
          <p
            v-if="mes.content.userId === $store.getters.userId"
            @click="deleteText(mes)"
            class="dropdown-item my-0 px-2 py-2"
          >
            <i class="fas fa-trash mr-2"></i>Delete
          </p>
        </div>

        <br />

        <span
          class="font-weight-light"
          :style="{ color: isDarkMode ? 'white' : 'black' }"
          >{{ mes.content.message }}</span
        >
        <br />
        <span class="small text-secondary d-block text-right">
          {{ mes.content.edited ? "edited" : null }}
          {{ hours(mes.content.hours) }}:{{ minutes(mes.content.minutes) }}
        </span>
      </div>
    </li>
  </ul>
</template>

<script>
import axios from "axios";
export default {
  props: ["messages", "replyData", "editData"],
  emits: ["set-focus", "set-reply", "set-edit"],
  watch: {
    messages(newVal, oldVal) {
      if (newVal.length !== oldVal.length) {
        setTimeout(() => {
          this.$refs.ul.scroll(0, 1000000);
        }, 100);
      }
    },
  },
  computed: {
    onlineUsers() {
      return this.$store.getters.onlineUsers;
    },
    isDarkMode() {
      return this.$store.getters.isDarkMode;
    },
  },
  methods: {
    isOnline(userId) {
      const onlineUsers = this.onlineUsers;
      let a = null;
      a = onlineUsers.find((item) => item.content.id === userId);
      if (a) return true;
      else return false;
    },
    hours(hour) {
      let newHour = "" + hour;
      if (newHour.length === 1) {
        newHour = "0" + newHour;
      }
      return newHour;
    },
    minutes(minute) {
      let newMinute = "" + minute;
      if (newMinute.length === 1) {
        newMinute = "0" + newMinute;
      }
      return newMinute;
    },
    setReplyData(data) {
      const name = data.name;
      const message = data.message;
      this.$emit("set-focus", false);
      setTimeout(() => {
        this.$emit("set-focus", true);
      }, 100);
      this.$emit("set-reply", {
        show: true,
        replyName: name,
        replyMessage: message,
      });
      this.$emit("set-edit", {
        edited: false,
        id: "",
        editMessage: "",
        name: "",
      });
    },
    copyText(data) {
      const message = data.content.message;
      navigator.clipboard.writeText(message);
    },
    editText(data) {
      this.$emit("set-focus", false);
      setTimeout(() => {
        this.$emit("set-focus", true);
      }, 100);
      this.$emit("set-edit", {
        edited: true,
        id: data.id,
        name: data.content.name,
        editMessage: data.content.message,
      });
      this.$emit("set-reply", {
        show: false,
        replyName: "",
        replyMessage: "",
      });
    },
    deleteText(data) {
      axios.put(
        "https://vue-chat-app-7befc-default-rtdb.firebaseio.com/messages/" +
          data.id +
          ".json",
        {
          ...data.content,
          deleted: true,
        }
      );
      this.$emit("set-reply", {
        show: false,
        replyName: "",
        replyMessage: "",
      });
      this.$emit("set-edit", {
        edited: false,
        id: "",
        editMessage: "",
        name: "",
      });
    },
  },
};
</script>

<style scoped>
ul {
  overflow-y: auto !important;
  list-style: none;
  height: 100%;
  margin: 0;
}
.ulReply,
.ulEdit {
  padding-bottom: 50px;
}
li {
  margin: 8px;
  border-radius: 5px;

  color: white;
  padding: 5px 8px;
  padding-bottom: 1px;
  width: 70%;
  font-size: 1.1rem;
  font-weight: 500;
}
.darkModeMessage {
  border-bottom-color: #33393f;
  background-color: #33393f;
}
.lightModeMessage {
  border-bottom-color: white;
  background-color: white;
}
.myMessage {
  margin-left: auto;
  margin-right: 20px;
  position: relative;
}
.myMessage:after {
  content: "";
  position: absolute;
  width: 0px;
  height: 0px;
  z-index: 300;
  bottom: 0;
  right: 0;
  border: 10px solid transparent;
  /* border-bottom-color: #33393f; */
  border-bottom-color: inherit;
  transform: translateX(50%);
}
.alienMessage {
  margin-left: 20px;
  position: relative;
}
.alienMessage:after {
  content: "";
  position: absolute;
  width: 0px;
  height: 0px;
  z-index: 300;
  bottom: 0;
  left: 0;
  border: 10px solid transparent;
  border-bottom-color: inherit;
  transform: translateX(-50%);
}
.messageMenuWrapper {
  display: inline-block;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
}
.messageMenu {
  display: inline-block;
  width: 3px;
  height: 3px;
  background-color: #ccc;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.messageMenu::after {
  content: "";
  display: inline-block;
  width: 3px;
  height: 3px;
  background-color: inherit;
  border-radius: 50%;
  position: absolute;
  top: -5px;
}
.messageMenu::before {
  content: "";
  display: inline-block;
  width: 3px;
  height: 3px;
  background-color: inherit;
  border-radius: 50%;
  position: absolute;
  top: 5px;
}
.dropdown-item {
  cursor: pointer;
}
.dropdown-item:hover {
  background-color: #ccc;
  transition: all 0.1s ease;
}
@media (max-width: 500px) {
  li {
    width: 85%;
  }
}
.replyLine {
  width: 2px;
  height: 100%;
  display: inline-block;
}
/* .onlineUserSpot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  top: 5px;
  left: 5px;
} */
</style>
