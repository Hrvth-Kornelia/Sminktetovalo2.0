console.log("JS BETÖLTÖTT");

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// 🔴 IDE MÁSOLD BE A FIREBASE KONFIGOT (NE HAGYD BENNE A MINTÁT!)
const firebaseConfig = {
  apiKey: "AIzaSyDmiMiBlUok7S1TrHFhwR59uqse5d1J8S8  ",
  authDomain: "idopontfoglalo-1597f.firebaseapp.com",
  projectId: "idopontfoglalo-1597f",
  storageBucket: "idopontfoglalo-1597f.firebasestorage.app",
  messagingSenderId: "1036972908206",
  appId: "1:1036972908206:web:c3dc5cd32cea3aec48573f"
};

console.log("CONFIG:", firebaseConfig);

// Firebase inicializálás
const app = initializeApp(firebaseConfig);
console.log("FIREBASE INIT OK");

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
console.log("AUTH OK");

// Gomb keresése
const loginButton = document.querySelector(".bejelentkezes-gomb");
console.log("GOMB:", loginButton);

// Kattintás kezelése
if (loginButton) {
  loginButton.addEventListener("click", async () => {
    alert("JS kattintas lefutott"); // 👉 TESZT

    console.log("KATTINTÁS OK");

    try {
      await setPersistence(auth, browserSessionPersistence);
      console.log("PERSISTENCE OK");

      const result = await signInWithPopup(auth, provider);
      console.log("LOGIN OK:", result.user.email);

      // Sikeres login után átirányítás
      window.location.href = "foglalj-idopontot2page.html";

    } catch (error) {
      console.error("TELJES HIBA:", error);

      alert(
        "Hiba kód: " + error.code +
        "\nÜzenet: " + error.message
      );
    }
  });
} else {
  console.error("NEM TALÁLJA A GOMBOT!");
}