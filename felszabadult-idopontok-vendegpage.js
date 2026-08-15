import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot
} from
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


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

const lista =
  document.getElementById("vendegIdopontLista");

if (lista) {

  const q = query(
    collection(db, "felszabadultIdopontok"),
    orderBy("datum", "asc")
  );

  onSnapshot(
    q,
    (snapshot) => {

      lista.innerHTML = "";

      if (snapshot.empty) {
        lista.innerHTML = `
          <p class="ures-lista">
            Jelenleg nincs felszabadult időpont.
          </p>
        `;
        return;
      }

      snapshot.forEach((dokumentum) => {

        const adat =
          dokumentum.data();

        const sor =
          document.createElement("div");

        sor.className =
          "vendeg-idopont-sor";

        sor.innerHTML = `
          <strong>${adat.datum}</strong>
          <span>${adat.ido}</span>
        `;

        lista.appendChild(sor);

      });

    },
    (error) => {

      console.error(
        "Időpontok figyelési hibája:",
        error
      );

      lista.innerHTML = `
        <p class="ures-lista">
          Nem sikerült betölteni az időpontokat.
        </p>
      `;

    }
  );

}