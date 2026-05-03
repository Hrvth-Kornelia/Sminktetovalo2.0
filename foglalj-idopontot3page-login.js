console.log("JS BETÖLTÖTT");

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence
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

await setPersistence(auth, browserLocalPersistence);

const loginButton = document.querySelector(".bejelentkezes-gomb");

// Visszatérés Google loginból
try {
  const result = await getRedirectResult(auth);

  if (result && result.user) {
    const user = result.user;

    sessionStorage.setItem("felhasznaloNev", user.displayName || "Ismeretlen felhasználó");
    sessionStorage.setItem("felhasznaloEmail", user.email || "");

    console.log("LOGIN OK:", user.email);

    window.location.href = "foglalj-idopontot2page.html";
  }
} catch (error) {
  console.error("REDIRECT HIBA:", error);
  alert("Bejelentkezési hiba!");
}

// Login gomb
if (loginButton) {
  loginButton.addEventListener("click", async () => {
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("BEJELENTKEZÉSI HIBA:", error);
      alert("Bejelentkezési hiba!");
    }
  });
} else {
  console.error("NEM TALÁLJA A BEJELENTKEZÉS GOMBOT!");
}