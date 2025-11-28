import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBAC9EjInKrD0xtwt_7b9ON5zhGXFOqbmM",
  authDomain: "loja-roupas-bb4bd.firebaseapp.com",
  databaseURL: "https://loja-roupas-bb4bd-default-rtdb.firebaseio.com",
  projectId: "loja-roupas-bb4bd",
  storageBucket: "loja-roupas-bb4bd.appspot.com",
  messagingSenderId: "945613714271",
  appId: "1:945613714271:web:53f52c3624177786c8c2a4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const rtdb = getDatabase(app);

export { app, auth, rtdb };
