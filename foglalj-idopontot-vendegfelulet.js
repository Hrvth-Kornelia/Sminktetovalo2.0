// ===== FIREBASE =====

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
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

const vallalkozoId = "sienna-bloom-sminktetovalo";


// ===== SESSION ADATOK =====

const foglalasiAdatSzoveg = sessionStorage.getItem("kivalasztottFoglalasiAdat");
const foglalasiAdat = foglalasiAdatSzoveg ? JSON.parse(foglalasiAdatSzoveg) : null;


// ===== HTML ELEMEK =====

const evSelect = document.getElementById("ev");
const honapSelect = document.getElementById("honap");
const napokDiv = document.getElementById("napok");
const szabadIdopontokDiv = document.getElementById("szabad-idopontok");
const kivalasztottDatumSzoveg = document.getElementById("kivalasztott-datum-szoveg");
const folytatasGomb = document.getElementById("folytatas-gomb");

const balraGomb = document.getElementById("balra-gomb");
const jobbraGomb = document.getElementById("jobbra-gomb");
const aktualisIdopontElem = document.getElementById("aktualis-idopont");


// ===== ADATOK =====

const honapNevek = [
  "Január", "Február", "Március", "Április", "Május", "Június",
  "Július", "Augusztus", "Szeptember", "Október", "November", "December"
];

const mintaIdopontok = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00"
];

const maiDatum = new Date();

let aktualisEv = maiDatum.getFullYear();
let aktualisHonap = maiDatum.getMonth();
let kivalasztottNap = null;
let kivalasztottIdopont = null;
let aktualisIdopontIndex = 0;
let aktualisSzabadIdopontok = [];


// ===== SEGÉDFÜGGVÉNYEK =====

function datumLetrehozasa() {
  return aktualisEv + "-" + (aktualisHonap + 1) + "-" + kivalasztottNap;
}

function idoPercre(ido) {
  const [ora, perc] = ido.split(":").map(Number);
  return ora * 60 + perc;
}

function utkozik(ujKezdes, ujVege, regiKezdes, regiVege) {
  return ujKezdes < regiVege && ujVege > regiKezdes;
}

async function foglalasokLekerdezese(datum) {
  const q = query(
    collection(db, "vallalkozok", vallalkozoId, "idopontok"),
    where("datum", "==", datum)
  );

  const snapshot = await getDocs(q);
  const foglalasok = [];

  snapshot.forEach((doc) => {
    foglalasok.push(doc.data());
  });

  return foglalasok;
}

function szabadIdopontokSzurese(foglalasok) {
  const szolgaltatasPerc = Number(foglalasiAdat?.idoPerc || 30);

  return mintaIdopontok.filter((ido) => {
    const ujKezdes = idoPercre(ido);
    const ujVege = ujKezdes + szolgaltatasPerc;

    const vanUtkozes = foglalasok.some((foglalas) => {
      const regiKezdes = idoPercre(foglalas.idopont);
      const regiVege = regiKezdes + Number(foglalas.idoPerc);

      return utkozik(ujKezdes, ujVege, regiKezdes, regiVege);
    });

    return !vanUtkozes;
  });
}


// ===== NAPTÁR =====

function evekBetoltese() {
  for (let ev = aktualisEv; ev <= 2033; ev++) {
    const ujOpcio = document.createElement("option");
    ujOpcio.value = ev;
    ujOpcio.textContent = ev;
    evSelect.appendChild(ujOpcio);
  }
}

function honapokBetoltese() {
  honapNevek.forEach((honapNeve, index) => {
    const ujOpcio = document.createElement("option");
    ujOpcio.value = index;
    ujOpcio.textContent = honapNeve;
    honapSelect.appendChild(ujOpcio);
  });
}

function naptarKirajzolasa(ev, honap) {
  napokDiv.innerHTML = "";

  const elsoNap = new Date(ev, honap, 1);
  const utolsoNap = new Date(ev, honap + 1, 0);

  let hetNapja = elsoNap.getDay();
  if (hetNapja === 0) hetNapja = 7;

  const napokSzama = utolsoNap.getDate();

  for (let i = 1; i < hetNapja; i++) {
    const ures = document.createElement("div");
    ures.className = "nap-mezo ures-mezo";
    napokDiv.appendChild(ures);
  }

  for (let nap = 1; nap <= napokSzama; nap++) {
    const napDoboz = document.createElement("div");
    napDoboz.className = "nap-mezo";
    napDoboz.textContent = nap;

    if (nap === kivalasztottNap) {
      napDoboz.classList.add("kivalasztott-nap");
    }

    napDoboz.addEventListener("click", async function () {
      kivalasztottNap = nap;
      kivalasztottIdopont = null;
      aktualisIdopontIndex = 0;
      folytatasGomb.disabled = true;

      naptarKirajzolasa(aktualisEv, aktualisHonap);
      datumSzovegFrissitese();
      await idopontokKirajzolasa();
      mobilIdopontFrissitese();
    });

    napokDiv.appendChild(napDoboz);
  }
}

function datumSzovegFrissitese() {
  if (!kivalasztottNap) {
    kivalasztottDatumSzoveg.textContent = "Válassz napot";
    return;
  }

  kivalasztottDatumSzoveg.textContent =
    aktualisEv + ". " + honapNevek[aktualisHonap] + " " + kivalasztottNap + ".";
}


// ===== IDŐPONTOK KIRAJZOLÁSA ÜTKÖZÉSSEL =====

async function idopontokKirajzolasa() {
  szabadIdopontokDiv.innerHTML = "";

  if (!kivalasztottNap) {
    aktualisSzabadIdopontok = [];
    return;
  }

  const datum = datumLetrehozasa();
  const foglalasok = await foglalasokLekerdezese(datum);

  aktualisSzabadIdopontok = szabadIdopontokSzurese(foglalasok);

  if (aktualisSzabadIdopontok.length === 0) {
    szabadIdopontokDiv.innerHTML = "<p>Nincs szabad időpont erre a napra.</p>";
    aktualisIdopontElem.textContent = "--:--";
    kivalasztottIdopont = null;
    folytatasGomb.disabled = true;
    return;
  }

  aktualisSzabadIdopontok.forEach((ido) => {
    const gomb = document.createElement("button");
    gomb.className = "szabad-idopontok-gomb";
    gomb.textContent = ido;

    if (ido === kivalasztottIdopont) {
      gomb.classList.add("kivalasztott-idopont");
    }

    gomb.addEventListener("click", function () {
      kivalasztottIdopont = ido;
      aktualisIdopontIndex = aktualisSzabadIdopontok.indexOf(ido);
      folytatasGomb.disabled = false;

      idopontokKirajzolasa();
      mobilIdopontFrissitese();
    });

    szabadIdopontokDiv.appendChild(gomb);
  });
}

function mobilIdopontFrissitese() {
  if (!kivalasztottNap || aktualisSzabadIdopontok.length === 0) {
    aktualisIdopontElem.textContent = "--:--";
    kivalasztottIdopont = null;
    folytatasGomb.disabled = true;
    return;
  }

  if (aktualisIdopontIndex >= aktualisSzabadIdopontok.length) {
    aktualisIdopontIndex = 0;
  }

  aktualisIdopontElem.textContent = aktualisSzabadIdopontok[aktualisIdopontIndex];
  kivalasztottIdopont = aktualisSzabadIdopontok[aktualisIdopontIndex];

  folytatasGomb.disabled = false;
}


// ===== IDŐPONT NAVIGÁCIÓ =====

balraGomb.addEventListener("click", function () {
  if (!kivalasztottNap || aktualisSzabadIdopontok.length === 0) return;

  aktualisIdopontIndex--;

  if (aktualisIdopontIndex < 0) {
    aktualisIdopontIndex = aktualisSzabadIdopontok.length - 1;
  }

  mobilIdopontFrissitese();
});

jobbraGomb.addEventListener("click", function () {
  if (!kivalasztottNap || aktualisSzabadIdopontok.length === 0) return;

  aktualisIdopontIndex++;

  if (aktualisIdopontIndex >= aktualisSzabadIdopontok.length) {
    aktualisIdopontIndex = 0;
  }

  mobilIdopontFrissitese();
});


// ===== ÉV / HÓNAP VÁLTÁS =====

evSelect.addEventListener("change", async function () {
  aktualisEv = Number(evSelect.value);
  kivalasztottNap = null;
  kivalasztottIdopont = null;
  aktualisIdopontIndex = 0;
  folytatasGomb.disabled = true;

  naptarKirajzolasa(aktualisEv, aktualisHonap);
  datumSzovegFrissitese();
  await idopontokKirajzolasa();
  mobilIdopontFrissitese();
});

honapSelect.addEventListener("change", async function () {
  aktualisHonap = Number(honapSelect.value);
  kivalasztottNap = null;
  kivalasztottIdopont = null;
  aktualisIdopontIndex = 0;
  folytatasGomb.disabled = true;

  naptarKirajzolasa(aktualisEv, aktualisHonap);
  datumSzovegFrissitese();
  await idopontokKirajzolasa();
  mobilIdopontFrissitese();
});


// ===== FIREBASE MENTÉS ÜTKÖZÉS ELLENŐRZÉSSEL =====

folytatasGomb.addEventListener("click", async function () {
  if (!kivalasztottNap || !kivalasztottIdopont) {
    alert("Válassz napot és időpontot!");
    return;
  }

  const datum = datumLetrehozasa();

  try {
    const foglalasok = await foglalasokLekerdezese(datum);
    const frissSzabadIdopontok = szabadIdopontokSzurese(foglalasok);

    if (!frissSzabadIdopontok.includes(kivalasztottIdopont)) {
      alert("Ezt az időpontot közben már lefoglalták. Kérlek válassz másikat.");
      await idopontokKirajzolasa();
      mobilIdopontFrissitese();
      return;
    }

    await addDoc(
      collection(db, "vallalkozok", vallalkozoId, "idopontok"),
      {
        datum: datum,
        idopont: kivalasztottIdopont,
        felhasznaloNev: foglalasiAdat?.felhasznaloNev || "Névtelen",
        email: foglalasiAdat?.email || "",
        idoPerc: Number(foglalasiAdat?.idoPerc || 30),
        szolgaltatasNev: foglalasiAdat?.nev || ""
      }
    );

    alert("Sikeres foglalás!");

    kivalasztottIdopont = null;
    aktualisIdopontIndex = 0;
    folytatasGomb.disabled = true;

    await idopontokKirajzolasa();
    mobilIdopontFrissitese();

  } catch (error) {
    console.error("Hiba:", error);
    alert("Hiba történt a mentésnél!");
  }
});


// ===== INDÍTÁS =====

evekBetoltese();
honapokBetoltese();

evSelect.value = aktualisEv;
honapSelect.value = aktualisHonap;

naptarKirajzolasa(aktualisEv, aktualisHonap);
datumSzovegFrissitese();
idopontokKirajzolasa();
mobilIdopontFrissitese();