import firebase from "firebase";
import "firebase/firestore";

var config = {
    apiKey: "AIzaSyCOdSgHRACGeOaRwYZbOwghB8cLKTX9JFQ",
    authDomain: "vue-chat-app-7befc.firebaseapp.com",
    databaseURL: "https://vue-chat-app-7befc-default-rtdb.firebaseio.com",
    projectId: "vue-chat-app-7befc",
    storageBucket: "vue-chat-app-7befc.appspot.com",
    messagingSenderId: "230069827657",
    appId: "1:230069827657:web:5d1495170bb3978d0f2798"
  };

var fire = firebase.initializeApp(config);
export default fire;
