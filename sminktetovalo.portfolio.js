const kepekLista = document.querySelector(".kepek-lista");
const balNyil = document.querySelector(".bal-nyil");
const jobbNyil = document.querySelector(".jobb-nyil");
const kepek = document.querySelectorAll(".kepek-lista img");

let aktualisIndex = 0;

function lathatoKepekSzama() {
  const szelesseg = window.innerWidth;

  if (szelesseg >= 350 && szelesseg <= 500) {
    return 2;
  }

  if (szelesseg > 500 && szelesseg <= 760) {
    return 3;
  }

  return 4;
}

function gapMeret() {
  const stilus = window.getComputedStyle(kepekLista);
  return parseFloat(stilus.gap) || 0;
}

function egyLepesSzelesseg() {
  if (kepek.length === 0) {
    return 0;
  }

  return kepek[0].offsetWidth + gapMeret();
}

function maxIndexSzamitas() {
  return Math.max(0, kepek.length - lathatoKepekSzama());
}

function sliderFrissites() {
  const maxIndex = maxIndexSzamitas();

  if (aktualisIndex > maxIndex) {
    aktualisIndex = maxIndex;
  }

  const eltol = aktualisIndex * egyLepesSzelesseg();

  kepekLista.style.transform = `translateX(-${eltol}px)`;

  balNyil.disabled = aktualisIndex === 0;
  jobbNyil.disabled = aktualisIndex === maxIndex;
}

balNyil.addEventListener("click", function () {
  if (aktualisIndex > 0) {
    aktualisIndex--;
    sliderFrissites();
  }
});

jobbNyil.addEventListener("click", function () {
  if (aktualisIndex < maxIndexSzamitas()) {
    aktualisIndex++;
    sliderFrissites();
  }
});

window.addEventListener("resize", sliderFrissites);
window.addEventListener("load", sliderFrissites);