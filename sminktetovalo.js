
// Mindig frissült CSS-s


function copytoclipboard(elementID){
    const text=document.getElementById(elementID).innerText;
    navigator.clipboard.writeText(text).then(()=>{
        alert('Másolva: ' + text);
    
    });
}

//A weboldal apkent telepitheto telefonra

let deferredPrompt;
const mentesnevjegykent = document.getElementById('mentesnevjegykent'); // A gomb ID-je

// Eltároljuk a telepítési promptot, ha elérhető
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

// Gomb kattintás esemény
if (mentesnevjegykent) {
  mentesnevjegykent.addEventListener('click', () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Telepítés elfogadva');
        } else {
          console.log('Telepítés elutasítva');
        }
        deferredPrompt = null;
      });
    } else {
      alert('Ez az alkalmazás jelenleg nem telepíthető a böngésző által.');
    }
  });
}


//Megosztas Messengeren

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("shareMessengerBtn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const url = "https://hrvth-kornelia.github.io/Sminktetovalo/";

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Megosztás",
          text: "Nézd meg ezt!",
          url
        });
        return;
      } catch (e) {}
    }

    const encoded = encodeURIComponent(url);
    window.location.href =
      "https://www.facebook.com/sharer/sharer.php?u=" + encoded;
    
  });
});

// 🔧 iOS visszalépés utáni layout javítás
// Megoldja, hogy Instagram / külső link után ne csússzon fel az oldal
// iPhone Safari cache-ből visszatéréskor újrarajzoljuk az oldalt

window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    document.body.style.display = "none";

    setTimeout(() => {
      document.body.style.display = "block";
    }, 50);
  }
});