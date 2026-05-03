
// ===== FIREBASE =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyCa2Giy3VwqX0ksqHKIi7HxD5a-KZqfutQ",
  authDomain: "idopont-adat-tarolo.firebaseapp.com",
  projectId: "idopont-adat-tarolo",
  storageBucket: "idopont-adat-tarolo.firebasestorage.app",
  messagingSenderId: "168738647840",
  appId: "1:168738647840:web:62bdaa0ca0852e2785f145"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// ===== HTML =====
const lista = document.getElementById("lista");
// ===== ADATOK BETÖLTÉSE =====
async function betoltes() {
  lista.innerHTML = "";
  const querySnapshot = await getDocs(
    collection(db, "vallalkozok", "sienna-bloom-sminktetovalo", "idopontok")
  );
  let vanFoglalas = false;
  querySnapshot.forEach((docSnap) => {
    const adat = docSnap.data();
    // Lejárt időpontok elrejtése
    const most = new Date();
    const kezdes = new Date(adat.datum + "T" + adat.idopont);
    const vege = new Date(kezdes.getTime() + Number(adat.idoPerc || 0) * 60000);
    if (vege < most) {
      return;
    }
    vanFoglalas = true;
    const kartya = document.createElement("div");
    kartya.className = "kartya";
    kartya.innerHTML = `
      <h3>${adat.szolgaltatasNev || "Foglalás"}</h3>
      <p>
        <i class="bi bi-calendar"></i>
        ${adat.datum || "-"} - ${adat.idopont || "-"}
      </p>
      <div class="also-sor">
        <p>
          <i class="bi bi-clock"></i>
          ${adat.idoPerc || 0} perc
        </p>
        <button class="torles-gomb" data-id="${docSnap.id}">
          <i class="bi bi-trash"></i>
          Törlés
        </button>
      </div>
    `;
    lista.appendChild(kartya);
  });
  if (!vanFoglalas) {
    lista.innerHTML = `
      <div class="kartya">
        <h3>Nincs aktuális foglalásod.</h3>
      </div>
    `;
  }
  torlesBekotes();
}
// ===== TÖRLÉS =====
function torlesBekotes() {
  document.querySelectorAll(".torles-gomb").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const biztos = confirm("Biztosan törölni szeretnéd ezt a foglalást?");
      if (!biztos) return;
      const id = btn.dataset.id;
      await deleteDoc(
        doc(db, "vallalkozok", "sienna-bloom-sminktetovalo", "idopontok", id)
      );
      betoltes();
    });
  });
}
// ===== INDÍTÁS =====
betoltes();