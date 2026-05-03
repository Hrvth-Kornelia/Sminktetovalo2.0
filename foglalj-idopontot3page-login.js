// ===== FIREBASE IMPORT =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
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

// ===== PROVIDER =====
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account"
});

// ===== SESSION STORAGE =====
await setPersistence(auth, browserSessionPersistence);

// ===== GOMB KIVÁLASZTÁS =====
const loginButton = document.querySelector(".bejelentkezes-gomb");

// ===== LOGIN =====
if (loginButton) {
  loginButton.addEventListener("click", async () => {

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ===== ADATOK =====
      const felhasznaloNev = user.displayName || "Ismeretlen felhasználó";
      const felhasznaloEmail = user.email || "";

      // ===== MENTÉS =====
      sessionStorage.setItem("felhasznaloNev", felhasznaloNev);
      sessionStorage.setItem("felhasznaloEmail", felhasznaloEmail);

      console.log("LOGIN OK:", felhasznaloEmail);

      // ===== ÁTIRÁNYÍTÁS (EZ A LÉNYEG!) =====
      setTimeout(() => {
        window.location.href = "./foglalj-idopontot2page.html";
      }, 200);

    } catch (error) {
      console.error("LOGIN HIBA:", error);
      alert("Bejelentkezési hiba!");
    }
  });

} else {
  console.error("Nem találja a bejelentkezés gombot!");
}