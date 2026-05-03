
const lista = document.getElementById("foglalasokLista");

// PÉLDA ADATOK
let foglalasok = [
  {
    felhasznaloNev: "Kiss Anna",
    szolgaltatasNev: "Ajaktetoválás",
    foglaltIdo: "13:00",
    idoPerc: 180,
    datum: "2026-06-18"
  },
  {
    felhasznaloNev: "Nagy Eszter",
    szolgaltatasNev: "Szemöldöktetoválás",
    foglaltIdo: "09:30",
    idoPerc: 120,
    datum: "2026-06-18"
  }
];

// LEJÁRT TÖRLÉS
function torlesLejart() {
  const most = new Date();

  foglalasok = foglalasok.filter(f => {
    const vege = new Date(f.datum + "T23:59:59");
    return most <= vege;
  });
}

// KÁRTYÁK KIRAJZOLÁSA
function render() {
  lista.innerHTML = "";

  if (foglalasok.length === 0) {
    lista.innerHTML = "<div>Nincs foglalás</div>";
    return;
  }

  foglalasok.forEach((f, i) => {

    const kartya = document.createElement("div");
    kartya.className = "foglalas-kartya";

    kartya.innerHTML = `
      <div class="ido-blokk">
        <div class="foglalt-ido">${f.foglaltIdo}</div>
        <div class="foglalasi-idotartam">${f.idoPerc} perc</div>
      </div>

      <div class="elvalaszto-vonal"></div>

      <div class="adat-blokk">
        <div class="szolgaltatas-nev">${f.szolgaltatasNev}</div>
        <div class="felhasznalonev">Vendég: ${f.felhasznaloNev}</div>
      </div>

      <button class="torles-gomb" data-i="${i}">
        Törlés
      </button>
    `;

    lista.appendChild(kartya);
  });

  // TÖRLÉS
  document.querySelectorAll(".torles-gomb").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.i;
      foglalasok.splice(index, 1);
      render();
    });
  });
}

// INDÍTÁS
torlesLejart();
render();