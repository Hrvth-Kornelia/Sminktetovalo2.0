
// =========================
// FELSZABADULT IDŐPONT MENTÉSE
// =========================

import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp
} from
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

 import {
    getAuth,
    onAuthStateChanged
} from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js"; 

const firebaseConfig = {
  apiKey: "AIzaSyDMCR4wwStafbPxpY2eNffJ895ZLm4Js5w",
  authDomain: "sienna-bloom-pushup.firebaseapp.com",
  projectId: "sienna-bloom-pushup",
  storageBucket: "sienna-bloom-pushup.firebasestorage.app",
  messagingSenderId: "341488518116",
  appId: "1:341488518116:web:563707b1314856e8033df1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);

onAuthStateChanged(auth,(user) => {
    if (!user) {
        window.location.href = "admin-bejelentkezes.html";
    }
});

const kuldesGomb =
  document.getElementById("kuldes");

const datumInput =
  document.getElementById("datum");

const idoInput =
  document.getElementById("ido");

const adminLista =
  document.getElementById("adminIdopontLista");


// =========================
// LISTA BETÖLTÉSE
// =========================

async function betoltIdopontok() {

  if (!adminLista) return;

  try {

    const q = query(
      collection(db, "felszabadultIdopontok"),
      orderBy("datum", "asc")
    );

    const snapshot = await getDocs(q);

    adminLista.innerHTML = "";

    if (snapshot.empty) {
      adminLista.innerHTML =
        `<p class="ures-lista">Nincs felvitt időpont.</p>`;
      return;
    }

    snapshot.forEach((dokumentum) => {

      const adat = dokumentum.data();

      const sor =
        document.createElement("div");

      sor.className = "idopont-sor";

      sor.innerHTML = `
        <div>
          <strong>${adat.datum}</strong>
          <span>${adat.ido}</span>
        </div>

        <button
          class="torles-gomb"
          data-id="${dokumentum.id}"
          type="button">
          ×
        </button>
      `;

      adminLista.appendChild(sor);

    });

  } catch (error) {

    console.error(
      "Lista betöltési hiba:",
      error
    );

  }
}


// =========================
// MENTÉS
// =========================

if (kuldesGomb && datumInput && idoInput) {

  kuldesGomb.addEventListener(
    "click",
    async () => {

      const datum = datumInput.value;
      const ido = idoInput.value;

      if (!datum || !ido) {
        alert("Adj meg dátumot és időpontot.");
        return;
      }

      try {

        kuldesGomb.disabled = true;
        kuldesGomb.textContent = "Mentés...";

        await addDoc(
          collection(
            db,
            "felszabadultIdopontok"
          ),
          {
            datum,
            ido,
            createdAt: serverTimestamp()
          }
        );

        datumInput.value = "";
        idoInput.value = "";

        await betoltIdopontok();

      } catch (error) {

        console.error(
          "Mentési hiba:",
          error
        );

        alert(
          "Nem sikerült elmenteni az időpontot."
        );

      } finally {

        kuldesGomb.disabled = false;
        kuldesGomb.textContent = "+ Mentés";

      }

    }
  );

}


// =========================
// TÖRLÉS
// =========================

if (adminLista) {

  adminLista.addEventListener(
    "click",
    async (event) => {

      const gomb =
        event.target.closest(".torles-gomb");

      if (!gomb) return;

      const biztos =
        confirm(
          "Biztosan törölni szeretnéd ezt az időpontot?"
        );

      if (!biztos) return;

      try {

        await deleteDoc(
          doc(
            db,
            "felszabadultIdopontok",
            gomb.dataset.id
          )
        );

        await betoltIdopontok();

      } catch (error) {

        console.error(
          "Törlési hiba:",
          error
        );

        alert(
          "Nem sikerült törölni az időpontot."
        );

      }

    }
  );

}


// Első betöltés
betoltIdopontok();