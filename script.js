const POSTER_DURATION = 10000; // 10 saat
const POSTER_LIST_URL = `posters.json?v=${Date.now()}`;

let posters = [];
let currentIndex = 0;
let timer = null;

const posterEl = document.getElementById("poster");
const fallbackEl = document.getElementById("fallback");
const counterEl = document.getElementById("posterCounter");

function updateClock() {
  const now = new Date();

  document.getElementById("clock").textContent =
    now.toLocaleTimeString("en-MY", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });

  document.getElementById("date").textContent =
    now.toLocaleDateString("ms-MY", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
}

setInterval(updateClock, 1000);
updateClock();

async function loadPosterList() {
  try {
    const response = await fetch(POSTER_LIST_URL, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("posters.json mesti dalam bentuk array.");
    }

    posters = data.filter(item =>
      typeof item === "string" && item.trim() !== ""
    );

    if (posters.length === 0) {
      showFallback();
      return;
    }

    currentIndex = 0;
    showNextValidPoster();
  } catch (error) {
    console.error("Gagal membaca posters.json:", error);
    showFallback();
  }
}

function showFallback() {
  clearTimeout(timer);
  posterEl.style.display = "none";
  counterEl.style.display = "none";
  fallbackEl.style.display = "flex";
}

function showNextValidPoster(attempts = 0) {
  if (posters.length === 0 || attempts >= posters.length) {
    showFallback();
    return;
  }

  const indexToShow = currentIndex;
  const src = posters[indexToShow];

  const testImage = new Image();

  testImage.onload = () => {
    fallbackEl.style.display = "none";
    posterEl.style.display = "block";

    posterEl.classList.remove("fade-in");
    posterEl.classList.add("fade-out");

    setTimeout(() => {
      posterEl.src = `${src}?v=${Date.now()}`;
      posterEl.classList.remove("fade-out");
      posterEl.classList.add("fade-in");
    }, 180);

    counterEl.textContent = `${indexToShow + 1} / ${posters.length}`;
    counterEl.style.display = posters.length > 1 ? "block" : "none";

    currentIndex = (indexToShow + 1) % posters.length;

    clearTimeout(timer);
    timer = setTimeout(() => showNextValidPoster(), POSTER_DURATION);
  };

  testImage.onerror = () => {
    console.warn(`Poster tidak dijumpai, skip: ${src}`);
    currentIndex = (indexToShow + 1) % posters.length;
    showNextValidPoster(attempts + 1);
  };

  testImage.src = `${src}?v=${Date.now()}`;
}

loadPosterList();
