console.log("JS BETÖLTÖTT");

// ===== FIREBASE IMPORT =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


// ===== FIREBASE CONFIG =====
const firebaseConfig = {
  apiKey: "AIzaSyCa2Giy3VwqXOksqHKIi7HxD5a-KZqfutQ",
  authDomain: "idopont-adat-tarolo.firebaseapp.com",
  projectId: "idopont-adat-tarolo",
  storageBucket: "idopont-adat-tarolo.firebasestorage.app",
  messagingSenderId: "168738647840",
  appId: "1:168738647840:web:62bdaa0ca0852e2785f145"
};


// ===== FIREBASE INDÍTÁS =====
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account"
});


// ===== SESSION PERSISTENCE =====
await setPersistence(auth, browserSessionPersistence);


// ===== GOMB =====
const loginButton = document.querySelector(".bejelentkezes-gomb");


// ===== MOBIL FIX (REDIRECT UTÁNI BELÉPÉS) =====
getRedirectResult(auth)
  .then((result) => {
    if (result) {
      const user = result.user;

      const nev = user.displayName || "Ismeretlen";
      const email = user.email || "";

      sessionStorage.setItem("felhasznaloNev", nev);
      sessionStorage.setItem("felhasznaloEmail", email);

      console.log("REDIRECT LOGIN OK:", email);

      // 🔥 ÁTIRÁNYÍTÁS
      window.location.href = "foglalj-idopontot2page.html";
    }
  })
  .catch((error) => {
    console.error("REDIRECT HIBA:", error);
  });


// ===== KATTINTÁS =====
if (loginButton) {
  loginButton.addEventListener("click", async () => {

    try {
      // 🔥 MOBILON REDIRECT (EZ A KULCS!)
      await signInWithRedirect(auth, provider);

    } catch (error) {
      console.error("LOGIN HIBA:", error);
      alert("Bejelentkezési hiba!");
    }
  });
} else {
  console.error("NEM TALÁLJA A GOMBOT!");
}