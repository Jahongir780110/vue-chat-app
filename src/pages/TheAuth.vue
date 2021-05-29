<template>
  <div class="authWrapper">
    <teleport to="body">
      <loading-modal v-if="authLoading === true"></loading-modal>
    </teleport>
    <h1 class="text-center">Welcome</h1>
    <h5 class="text-danger" v-if="authError">{{ authError }}</h5>

    <form>
      <div class="container-fluid mt-4">
        <div class="row">
          <div class="col px-0">
            <div class="input-group" v-if="!isSignIn">
              <div class="input-group-prepend">
                <span class="input-group-text"
                  ><i class="fas fa-user"></i
                ></span>
              </div>
              <input
                type="text"
                class="form-control"
                placeholder="Name"
                v-model.trim="name"
              />
            </div>
            <p class="text-danger" v-if="errorName && !isSignIn">
              {{ errorName }}
            </p>

            <div class="input-group mt-4">
              <div class="input-group-prepend">
                <span class="input-group-text"
                  ><i class="fas fa-envelope"></i
                ></span>
              </div>
              <input
                type="email"
                class="form-control"
                placeholder="Email"
                v-model.trim="email"
              />
            </div>
            <p class="text-danger" v-if="errorEmail">
              {{ errorEmail }}
            </p>

            <div class="input-group mt-4">
              <div class="input-group-prepend">
                <span class="input-group-text"
                  ><i class="fas fa-lock"></i
                ></span>
              </div>
              <input
                type="password"
                placeholder="Password"
                class="form-control"
                v-model.trim="password"
              />
            </div>
            <p class="text-danger" v-if="errorPassword">
              {{ errorPassword }}
            </p>

            <p class="text-center">
              <button
                class="btn btn-secondary mx-auto mt-4 px-4"
                @click.prevent="sendData"
              >
                {{ !isSignIn ? "CREATE ACCOUNT" : "ENTER CHAT" }}
              </button>
            </p>

            <p class="text-center mt-4">
              {{ !isSignIn ? "Already have an account?" : "Are you new?" }}
              <span @click="switchSign" class="switchSign">{{
                !isSignIn ? "Sign in" : "Sign up"
              }}</span>
            </p>
          </div>
        </div>
      </div>
    </form>
  </div>

  <!-- <div>
    <input type="file" @change="previewImage" accept="image/*" />
    <p>
      Progress: {{ uploadValue.toFixed() + "%" }}
      <progress id="progress" :value="uploadValue" max="100"></progress>
    </p>
    <div v-if="imageData != null">
      <img class="preview" :src="picture" />
      <br />
      <button @click="onUpload">Upload</button>
    </div>
  </div> -->
</template>

<script>
// import firebase from "firebase";
import LoadingModal from "../components/LoadingModal.vue";

export default {
  components: { LoadingModal },
  data() {
    return {
      errorName: "",
      errorEmail: "",
      errorPassword: "",
      error: false,
      name: "",
      email: "",
      password: "",
      isSignIn: false,

      // imageData: null,
      // picture: null,
      // uploadValue: 0,
    };
  },
  computed: {
    isAuth() {
      return this.$store.getters.isAuth;
    },
    authLoading() {
      return this.$store.getters.authLoading;
    },
    authError() {
      return this.$store.getters.authError;
    },
  },
  watch: {
    isAuth(val) {
      if (val) {
        this.$router.push("/chat");
      }
    },
  },
  created() {
    if (this.isAuth) {
      this.$router.push("/chat");
    }
  },
  methods: {
    sendData() {
      this.error = false;
      this.errorName = "";
      this.errorEmail = "";
      this.errorPassword = "";
      if (this.name.length < 2 && !this.isSignIn) {
        this.errorName = "Please enter at least 2 characters!";
        this.error = true;
      } else if (this.name.length > 12) {
        this.errorName = "Please enter maximum 12 characters!";
        this.error = true;
      }
      if (
        !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          this.email
        )
      ) {
        this.errorEmail = "Please enter valid email!";
        this.error = true;
      }
      if (this.password.length < 6) {
        this.errorPassword = "Please enter at least 6 characters";
        this.error = true;
      }

      if (!this.error) {
        if (!this.isSignIn) {
          this.$store.dispatch("authenticate", {
            email: this.email,
            password: this.password,
            name: this.name,
            isSignIn: false,
          });
          // this.onUpload();
        } else {
          this.$store.dispatch("authenticate", {
            email: this.email,
            password: this.password,
            name: this.name,
            isSignIn: true,
          });
        }
      }
    },
    switchSign() {
      this.isSignIn = !this.isSignIn;
      this.errorName = "";
      this.errorEmail = "";
      this.errorPassword = "";
      this.error = false;
      this.name = "";
      this.email = "";
      this.password = "";
    },

    // previewImage(event) {
    //   this.uploadValue = 0;
    //   this.picture = null;
    //   this.imageData = event.target.files[0];
    // },
    // onUpload() {
    //   this.picture = null;
    //   const storageRef = firebase
    //     .storage()
    //     .ref(`${this.imageData.name}`)
    //     .put(this.imageData);
    //   storageRef.on(
    //     `state_changed`,
    //     (snapshot) => {
    //       this.uploadValue =
    //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //     },
    //     (error) => {
    //       console.log(error.message);
    //     },
    //     () => {
    //       this.uploadValue = 100;
    //       storageRef.snapshot.ref.getDownloadURL().then((url) => {
    //         this.picture = url;
    //       });
    //     }
    //   );
    // },
  },
};
</script>

<style scoped>
/* img.preview {
  width: 200px;
} */
.authWrapper {
  width: 500px;
  background-color: #18191d;
  padding: 20px 50px;
  border-radius: 20px;
  color: #7b7b7b;
  padding-top: 64px;
}
.form-group {
  border-radius: 10px;
}
h1 {
  color: #ddd;
}
.switchSign {
  cursor: pointer;
  color: #ddd;
}
.img-icon {
  font-size: 1.2rem;
}
@media (max-width: 520px) {
  .authWrapper {
    width: 94vw;
    padding: 20px 30px;
  }
}
</style>
