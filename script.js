let nombreMystere;
let essais = 0;
const maxEssais = 6;

function chargerNombre() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "nombre.json", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      nombreMystere = data.secret;
    } else {
      document.getElementById("message").textContent = "Erreur lors du chargement du nombre.";
    }
  };
  xhr.send();
}

function verifier() {
  const entree = document.getElementById("guessInput").value;
  const nombre = parseInt(entree);

  if (isNaN(nombre)) {
    document.getElementById("message").textContent = "Veuillez entrer un nombre valide.";
    return;
  }

  essais++;
  const tentativesRestantes = maxEssais - essais;
  let message = "";

  if (nombre === nombreMystere) {
    message = "🎉 Bravo ! Tu as trouvé en " + essais + " essais.";
    document.getElementById("verifierBtn").disabled = true;
    document.getElementById("rejouerBtn").style.display = "inline-block";

    const best = localStorage.getItem("bestScore");
    if (!best || essais < parseInt(best)) {
      localStorage.setItem("bestScore", essais);
      document.getElementById("bestScore").textContent = "Meilleur score : " + essais + " essais";
    }
  } else {
    const ecart = Math.abs(nombreMystere - nombre);
    if (ecart <= 3) {
      message = "🔥 Tu es TRÈS proche, ";
    } else if (ecart <= 10) {
      message = "✨ Tu es proche, ";
    }

    if (nombre < nombreMystere) {
      message += "le nombre est plus grand.";
    } else {
      message += "le nombre est plus petit.";
    }

    if (tentativesRestantes === 0) {
      message += " ❌ Tu as utilisé tes 6 essais. Le nombre était " + nombreMystere + ".";
      document.getElementById("verifierBtn").disabled = true;
      document.getElementById("rejouerBtn").style.display = "inline-block";
    }
  }

  document.getElementById("message").textContent = message;
  document.getElementById("tentativesRestantes").textContent =
    tentativesRestantes > 0
      ? "Il te reste " + tentativesRestantes + " tentative" + (tentativesRestantes > 1 ? "s" : "")
      : "Aucune tentative restante.";
}

function rejouer() {
  essais = 0;
  document.getElementById("guessInput").value = "";
  document.getElementById("message").textContent = "";
  document.getElementById("verifierBtn").disabled = false;
  document.getElementById("rejouerBtn").style.display = "none";
  document.getElementById("tentativesRestantes").textContent = "Il te reste 6 tentatives";
  chargerNombre();
}

window.onload = function () {
  chargerNombre(); // Charger le nombre dès le chargement
  const best = localStorage.getItem("bestScore");
  if (best) {
    document.getElementById("bestScore").textContent = "Meilleur score : " + best + " essais";
  }
};
