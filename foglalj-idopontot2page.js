const szolgaltatasok = document.querySelectorAll(".szolgaltatas");

szolgaltatasok.forEach((szolgaltatas) => {
  szolgaltatas.addEventListener("click", function () {

    const nev = szolgaltatas.querySelector(".szolgaltatas-cim").textContent;
    const idoSzoveg = szolgaltatas.querySelector(".szolgaltatas-ido").textContent;
    const idoPerc = Number(idoSzoveg.replace(" perc", ""));

    const adat = {
      nev: nev,
      idoPerc: idoPerc
    };

    sessionStorage.setItem("kivalasztottSzolgaltatas", JSON.stringify(adat));

    window.location.href = "foglalj-idopontot-vendegfelulet.html";
  });
});