var appInitialized = false;

document.addEventListener("DOMContentLoaded", () => {
  if (!appInitialized) {
    var nummer = localStorage.getItem("nummer");
    var standort = localStorage.getItem("standort");
    if (nummer && standort && nummer >= 50 && nummer <= 400) {
      document.getElementById("ergebnis").innerHTML =
        "Schließfach " + nummer + " " + standort;
      //location.href = "savedlocker.html";
    }

    appInitialized = true;
  }
});

function speichern() {
  var nummer = document.getElementById("nummer").value;
  var standort = document.getElementById("standort").value;
  if (nummer >= 50 && nummer <= 400) {
    localStorage.setItem("nummer", nummer);
    localStorage.setItem("standort", standort); 
    location.href = "savedLocker.html";
    document.getElementById("ergebnis").innerHTML =
      "Schließfach " + nummer + " " + standort;
  } else {
    alert("Bitte eine Locker-Nummer zwischen 050 und 400 eingeben");
  }
}

function backToStartPage() {
  location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("serviceWorker.js", { scope: "/" })
      .then(() => console.log("service worker registered"))
      .catch((error) => console.warn(error));
  }
});

//const swup = new Swup();

//Day- night mode switch

function updateMode() {
  const modeSelect = document.getElementById("mode-select");
  const mode = modeSelect.value;

  if (mode === "auto") {
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    document.documentElement.classList.toggle("dark", prefersDarkMode);
  } else {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }
}

//from Tailwind Website:

// On page load or when changing themes, best to add inline in `head` to avoid FOUC
if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches) 
) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

// Whenever the user explicitly chooses light mode
localStorage.theme = "light";

// Whenever the user explicitly chooses dark mode
localStorage.theme = "dark";

// Whenever the user explicitly chooses to respect the OS preference
localStorage.removeItem("theme");
