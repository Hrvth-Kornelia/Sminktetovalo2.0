
// Firebase importok
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// A Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCa2Giy3VwqX0ksqHKIi7HxD5a-KZqfutQ",
  authDomain: "idopont-adat-tarolo.firebaseapp.com",
  projectId: "idopont-adat-tarolo",
  storageBucket: "idopont-adat-tarolo.firebasestorage.app",
  messagingSenderId: "168738647840",
  appId: "1:168738647840:web:62bdaa0ca0852e2785f145"
};
// Firebase indítás
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);




const foglalasiAdatSzoveg = sessionStorage.getItem("kivalasztottFoglalasiAdat");
const foglalasiAdat = foglalasiAdatSzoveg ? JSON.parse(foglalasiAdatSzoveg) : null;

if (foglalasiAdat) {
  console.log("Felhasználó neve:", foglalasiAdat.felhasznaloNev);
  console.log("Szolgáltatás neve:", foglalasiAdat.nev);
  console.log("Időtartam percben:", foglalasiAdat.idoPerc);
}

const evSelect = document.getElementById("ev");
const honapSelect = document.getElementById("honap");
const napokDiv = document.getElementById("napok");
const szabadIdopontokDiv = document.getElementById("szabad-idopontok");
const kivalasztottDatumSzoveg = document.getElementById("kivalasztott-datum-szoveg");
const folytatasGomb = document.getElementById("folytatas-gomb");

const mobilIdopontValaszto = document.getElementById("mobil-idopont-valaszto");
const balraGomb = document.getElementById("balra-gomb");
const jobbraGomb = document.getElementById("jobbra-gomb");
const aktualisIdopontElem = document.getElementById("aktualis-idopont");

const honapNevek = [
  "Január", "Február", "Március", "Április", "Május", "Június",
  "Július", "Augusztus", "Szeptember", "Október", "November", "December"
];

const mintaIdopontok = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00",
  "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"
];

const maiDatum = new Date();

let aktualisEv = maiDatum.getFullYear();
let aktualisHonap = maiDatum.getMonth();
let kivalasztottNap = null;
let kivalasztottIdopont = null;
let aktualisIdopontIndex = 0;

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
  if (hetNapja === 0) {
    hetNapja = 7;
  }

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

    napDoboz.addEventListener("click", function () {
      kivalasztottNap = nap;
      kivalasztottIdopont = null;
      aktualisIdopontIndex = 0;
      folytatasGomb.disabled = true;

      naptarKirajzolasa(aktualisEv, aktualisHonap);
      datumSzovegFrissitese();
      idopontokKirajzolasa();
      mobilIdopontFrissitese();
    });

    napokDiv.appendChild(napDoboz);
  }
}

function datumSzovegFrissitese() {
  if (kivalasztottNap === null) {
    kivalasztottDatumSzoveg.textContent = "Válassz napot";
    return;
  }

  kivalasztottDatumSzoveg.textContent =
    aktualisEv + ". " + honapNevek[aktualisHonap] + " " + kivalasztottNap + ".";
}

function idopontokKirajzolasa() {
  szabadIdopontokDiv.innerHTML = "";

  if (kivalasztottNap === null) {
    return;
  }

  mintaIdopontok.forEach((ido) => {
    const gomb = document.createElement("button");
    gomb.className = "szabad-idopontok-gomb";
    gomb.textContent = ido;

    if (ido === kivalasztottIdopont) {
      gomb.classList.add("kivalasztott-idopont");
    }

    gomb.addEventListener("click", function () {
      kivalasztottIdopont = ido;
      aktualisIdopontIndex = mintaIdopontok.indexOf(ido);
      folytatasGomb.disabled = false;
      idopontokKirajzolasa();
      mobilIdopontFrissitese();
    });

    szabadIdopontokDiv.appendChild(gomb);
  });
}

function mobilIdopontFrissitese() {
  if (kivalasztottNap === null || mintaIdopontok.length === 0) {
    aktualisIdopontElem.textContent = "--:--";
    folytatasGomb.disabled = true;
    return;
  }

  aktualisIdopontElem.textContent = mintaIdopontok[aktualisIdopontIndex];
  kivalasztottIdopont = mintaIdopontok[aktualisIdopontIndex];
}

balraGomb.addEventListener("click", function () {
  if (kivalasztottNap === null) return;

  aktualisIdopontIndex--;

  if (aktualisIdopontIndex < 0) {
    aktualisIdopontIndex = mintaIdopontok.length - 1;
  }

  mobilIdopontFrissitese();
});

jobbraGomb.addEventListener("click", function () {
  if (kivalasztottNap === null) return;

  aktualisIdopontIndex++;

  if (aktualisIdopontIndex >= mintaIdopontok.length) {
    aktualisIdopontIndex = 0;
  }

  mobilIdopontFrissitese();
});

evSelect.addEventListener("change", function () {
  aktualisEv = Number(evSelect.value);
  kivalasztottNap = null;
  kivalasztottIdopont = null;
  aktualisIdopontIndex = 0;
  folytatasGomb.disabled = true;

  naptarKirajzolasa(aktualisEv, aktualisHonap);
  datumSzovegFrissitese();
  idopontokKirajzolasa();
  mobilIdopontFrissitese();
});

honapSelect.addEventListener("change", function () {
  aktualisHonap = Number(honapSelect.value);
  kivalasztottNap = null;
  kivalasztottIdopont = null;
  aktualisIdopontIndex = 0;
  folytatasGomb.disabled = true;

  naptarKirajzolasa(aktualisEv, aktualisHonap);
  datumSzovegFrissitese();
  idopontokKirajzolasa();
  mobilIdopontFrissitese();
});



// === A felhasználó által kiválasztott dátum és időpont mentése a Firebase adatbázisba ===

folytatasGomb.addEventListener("click", async function () {
  if (kivalasztottNap && kivalasztottIdopont) {

    const datum = aktualisEv + "-" + (aktualisHonap + 1) + "-" + kivalasztottNap;

    try {
      await addDoc(
        collection(db, "vallalkozok", "sienna-bloom-sminktetovalo", "idopontok"),
        {
          datum: datum,
          idopont: kivalasztottIdopont,
          felhasznaloNev: foglalasiAdat?.felhasznaloNev || "Névtelen",
          email: foglalasiAdat?.email || "",
          idoPerc: foglalasiAdat?.idoPerc || 0,
          szolgaltatasNev: foglalasiAdat?.nev || ""
        }
      );

      alert("Sikeres foglalás!");

    } catch (error) {
      console.error("Hiba:", error);
      alert("Hiba történt a mentésnél!");
    }
  }
});