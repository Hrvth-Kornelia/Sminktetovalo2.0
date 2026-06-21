onscroll = () => {
  document.querySelectorAll(".kepek img, .menet-sor p").forEach(elem => {
    if (elem.getBoundingClientRect().top < innerHeight - 100) {
      elem.style.opacity = "1";
      elem.style.transform = "translate(0,0)";
    }
  });
}