const szolgaltatasok = document.querySelectorAll(".szolgaltatas");

szolgaltatasok.forEach((szolgaltatas) => {
  szolgaltatas.addEventListener("click", function () {

    const nev = szolgaltatas.querySelector(".szolgaltatas-cim").textContent;
    const idoSzoveg = szolgaltatas.querySelector(".szolgaltatas-ido").textContent;
    const idoPerc = Number(idoSzoveg.replace(" perc", ""));

const felhasznaloNev = sessionStorage.getItem("felhasznaloNev") || "Ismeretlen felhasználó";

    const adat = {
      felhasznaloNev: felhasznaloNev,
      nev: nev,
      idoPerc: idoPerc
    };

    sessionStorage.setItem("kivalasztottFoglalasiAdat", JSON.stringify(adat));

    window.location.href = "foglalj-idopontot-vendegfelulet.html";
  });
});