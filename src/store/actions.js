import axios from "axios";

function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

let timer;

export default {
  authenticate(context, payload) {
    context.commit("errorOccured", null);
    context.commit("changeLoading", true);
    context.commit("setUserData", {
      token: null,
      userId: null,
      name: "",
      color: "",
      id: null,
    });
    if (!payload.isSignIn) {
      axios
        .post(
          "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCOdSgHRACGeOaRwYZbOwghB8cLKTX9JFQ",
          {
            email: payload.email,
            password: payload.password,
            returnSecureToken: true,
          }
        )
        .then((res) => {
          const color = randomColor();

          axios
            .post(
              "https://vue-chat-app-7befc-default-rtdb.firebaseio.com/users.json",
              {
                name: payload.name,
                id: res.data.localId,
                color: color,
              }
            )
            .then((userRes) => {
              const expiresIn = +res.data.expiresIn * 1000;
              const expirationDate = new Date().getTime() + expiresIn;

              localStorage.setItem("token", res.data.idToken);
              localStorage.setItem("userId", res.data.localId);
              localStorage.setItem("color", color);
              localStorage.setItem("name", payload.name);
              localStorage.setItem("id", userRes.data.name);
              localStorage.setItem("tokenExpiration", expirationDate);

              timer = setTimeout(function() {
                context.dispatch("logout");
              }, expiresIn);

              context.commit("setUserData", {
                token: res.data.idToken,
                userId: res.data.localId,
                name: payload.name,
                color: color,
                id: userRes.data.name,
              });
              context.commit("changeLoading", false);
            });
        })
        .catch(() => {
          context.commit("changeLoading", false);
          context.commit(
            "errorOccured",
            "An error occured while authenticating!"
          );
        });
    } else {
      axios
        .post(
          "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCOdSgHRACGeOaRwYZbOwghB8cLKTX9JFQ",
          {
            email: payload.email,
            password: payload.password,
            returnSecureToken: true,
          }
        )
        .then((res) => {
          const resp = res;
          axios
            .get(
              "https://vue-chat-app-7befc-default-rtdb.firebaseio.com/users.json"
            )
            .then((res) => {
              const response = res.data;
              const users = [];
              for (const key in response) {
                users.push({
                  id: response[key].id,
                  name: response[key].name,
                  color: response[key].color,
                  rootId: key,
                });
              }
              const user = users.find((item) => item.id === resp.data.localId);

              const expiresIn = +resp.data.expiresIn * 1000;
              const expirationDate = new Date().getTime() + expiresIn;

              localStorage.setItem("token", resp.data.idToken);
              localStorage.setItem("userId", resp.data.localId);
              localStorage.setItem("name", user.name);
              localStorage.setItem("color", user.color);
              localStorage.setItem("id", user.rootId);
              localStorage.setItem("tokenExpiration", expirationDate);

              timer = setTimeout(function() {
                context.dispatch("logout");
              }, expiresIn);

              context.commit("setUserData", {
                token: resp.data.idToken,
                userId: resp.data.localId,
                name: user.name,
                color: user.color,
                id: user.rootId,
              });
              context.commit("changeLoading", false);
            });
        })
        .catch(() => {
          context.commit("changeLoading", false);
          context.commit(
            "errorOccured",
            "An error occured while authenticating!"
          );
        });
    }
  },
  setOnlineUsers(context, payload) {
    context.commit("setOnlineUsers", payload);
  },
  logout(context) {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("color");
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    localStorage.removeItem("tokenExpiration");

    clearTimeout(timer);

    context.commit("setUserData", {
      token: null,
      userId: null,
      name: "",
      color: "",
      id: null,
    });
  },
  tryLogin(context) {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const color = localStorage.getItem("color");
    const name = localStorage.getItem("name");
    const id = localStorage.getItem("id");
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    const expiresIn = +tokenExpiration - new Date().getTime();

    if (expiresIn < 0) {
      return;
    }

    timer = setTimeout(function() {
      context.dispatch("logout");
    }, expiresIn);

    if (token && userId && name && color && id) {
      context.commit("setUserData", {
        token: token,
        userId: userId,
        color: color,
        name: name,
        id: id,
      });
    }
  },
  setMode(context) {
    context.commit("setMode");
  },
};
