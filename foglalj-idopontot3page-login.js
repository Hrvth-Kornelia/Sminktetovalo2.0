console.log("JS BETÖLTÖTT");

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCa2Giy3VwqXOksqHKIi7HxD5a-KZqfutQ",
  authDomain: "idopont-adat-tarolo.firebaseapp.com",
  projectId: "idopont-adat-tarolo",
  storageBucket: "idopont-adat-tarolo.firebasestorage.app",
  messagingSenderId: "168738647840",
  appId: "1:168738647840:web:62bdaa0ca0852e2785f145"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account"
});

await setPersistence(auth, browserSessionPersistence);

const loginButton = document.querySelector(".bejelentkezes-gomb");

if (loginButton) {
  loginButton.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const felhasznaloNev = user.displayName || "Ismeretlen felhasználó";
      const felhasznaloEmail = user.email || "";

      sessionStorage.setItem("felhasznaloNev", felhasznaloNev);
      sessionStorage.setItem("felhasznaloEmail", felhasznaloEmail);

      console.log("LOGIN OK:", felhasznaloNev, felhasznaloEmail);

      window.location.href = "foglalj-idopontot2page.html";

    } catch (error) {
      console.error("TELJES HIBA:", error);
      alert("Bejelentkezési hiba!");
    }
  });
} else {
  console.error("NEM TALÁLJA A GOMBOT!");
}