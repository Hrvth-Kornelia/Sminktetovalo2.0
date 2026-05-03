console.log("JS BETÖLTÖTT");

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged
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

function adatMentesEsTovabb(user) {
  const felhasznaloNev = user.displayName || "Ismeretlen felhasználó";
  const felhasznaloEmail = user.email || "";

  localStorage.setItem("felhasznaloNev", felhasznaloNev);
  localStorage.setItem("felhasznaloEmail", felhasznaloEmail);

  sessionStorage.setItem("felhasznaloNev", felhasznaloNev);
  sessionStorage.setItem("felhasznaloEmail", felhasznaloEmail);

  console.log("LOGIN OK:", felhasznaloNev, felhasznaloEmail);

  window.location.href = "foglalj-idopontot2page.html";
}

// Redirect visszatérés kezelése
try {
  const result = await getRedirectResult(auth);

  if (result && result.user) {
    adatMentesEsTovabb(result.user);
  }
} catch (error) {
  console.error("REDIRECT HIBA:", error);
}

// Ha már be van jelentkezve, vigye tovább
onAuthStateChanged(auth, (user) => {
  if (user) {
    adatMentesEsTovabb(user);
  }
});

// Login gomb
if (loginButton) {
  loginButton.addEventListener("click", async () => {
    try {
      const isStandalone =
        window.navigator.standalone === true ||
        window.matchMedia("(display-mode: standalone)").matches;

      if (isStandalone) {
        await signInWithRedirect(auth, provider);
      } else {
        const result = await signInWithPopup(auth, provider);
        adatMentesEsTovabb(result.user);
      }

    } catch (error) {
      console.error("BEJELENTKEZÉSI HIBA:", error);
      alert(error.code + "\n" + error.message);
    }
  });
} else {
  console.error("NEM TALÁLJA A BEJELENTKEZÉS GOMBOT!");
}