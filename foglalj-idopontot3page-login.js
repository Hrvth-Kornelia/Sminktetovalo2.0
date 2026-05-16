// ===== FIREBASE IMPORT =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
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


// ===== GOOGLE BEJELENTKEZÉS =====
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account"
});


// ===== SESSION STORAGE HASZNÁLATA =====
await setPersistence(auth, browserSessionPersistence);


// ===== VISSZATÉRÉS GOOGLE BEJELENTKEZÉS UTÁN =====
try {
  const result = await getRedirectResult(auth);

  if (result && result.user) {
    const user = result.user;

    const felhasznaloNev = user.displayName || "Ismeretlen felhasználó";
    const felhasznaloEmail = user.email || "";

    sessionStorage.setItem("felhasznaloNev", felhasznaloNev);
    sessionStorage.setItem("felhasznaloEmail", felhasznaloEmail);

    window.location.href = "./foglalj-idopontot2page.html";
  }

} catch (error) {
  console.error("BEJELENTKEZÉSI HIBA:", error);
  alert("Bejelentkezési hiba!");
}


// ===== GOMB KIVÁLASZTÁSA =====
const loginButton = document.querySelector(".bejelentkezes-gomb");


// ===== GOMB KATTINTÁS =====
if (loginButton) {
  loginButton.addEventListener("click", async () => {
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("LOGIN HIBA:", error);
      alert("Bejelentkezési hiba! Próbáld újra az alkalmazás bezárást követően");
    }
  });
} else {
  console.error("Nem találja a bejelentkezés gombot!");
}