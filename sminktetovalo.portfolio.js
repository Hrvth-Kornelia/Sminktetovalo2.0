document.addEventListener("DOMContentLoaded", function () {
  const osszesSlider = document.querySelectorAll("section");

  osszesSlider.forEach(function (slider) {
    const kepekLista = slider.querySelector(".kepek-lista");
    const balNyil = slider.querySelector(".bal-nyil");
    const jobbNyil = slider.querySelector(".jobb-nyil");
    const kepek = slider.querySelectorAll(".kepek-lista img");

    if (!kepekLista || !balNyil || !jobbNyil || kepek.length === 0) {
      return;
    }

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
    sliderFrissites();
  });
});