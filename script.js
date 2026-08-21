/* =========================================================
   TVETMARA DIGITAL SIGNAGE V1.5
   ========================================================= */

const POSTER_DURATION = 10000;

const POSTER_LIST_URL =
  `posters.json?v=${Date.now()}`;

const TICKER_LIST_URL =
  `ticker.json?v=${Date.now()}`;


let posters = [];
let currentIndex = 0;
let timer = null;


/* =========================================================
   ELEMENTS
   ========================================================= */

const posterEl =
  document.getElementById("poster");

const posterBackgroundEl =
  document.getElementById("posterBackground");

const fallbackEl =
  document.getElementById("fallback");

const counterEl =
  document.getElementById("posterCounter");

const tickerEl =
  document.getElementById("ticker");


/* =========================================================
   CLOCK
   ========================================================= */

function updateClock() {

  const now = new Date();

  document.getElementById("clock").textContent =
    now.toLocaleTimeString(
      "en-MY",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }
    );

  document.getElementById("date").textContent =
    now.toLocaleDateString(
      "ms-MY",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );
}

setInterval(updateClock, 1000);
updateClock();


/* =========================================================
   LOAD POSTER LIST
   ========================================================= */

async function loadPosterList() {

  try {

    const response =
      await fetch(
        POSTER_LIST_URL,
        {
          cache: "no-store"
        }
      );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data =
      await response.json();

    if (!Array.isArray(data)) {
      throw new Error(
        "posters.json mesti dalam bentuk array."
      );
    }

    posters =
      data.filter(
        item =>
          typeof item === "string"
          &&
          item.trim() !== ""
      );

    if (posters.length === 0) {
      showFallback();
      return;
    }

    currentIndex = 0;

    showNextValidPoster();

  }

  catch (error) {

    console.error(
      "Gagal membaca posters.json:",
      error
    );

    showFallback();
  }
}


/* =========================================================
   FALLBACK
   ========================================================= */

function showFallback() {

  clearTimeout(timer);

  posterEl.style.display =
    "none";

  posterBackgroundEl.style.opacity =
    "0";

  counterEl.style.display =
    "none";

  fallbackEl.style.display =
    "flex";
}


/* =========================================================
   SHOW NEXT POSTER
   ========================================================= */

function showNextValidPoster(
  attempts = 0
) {

  if (
    posters.length === 0
    ||
    attempts >= posters.length
  ) {

    showFallback();
    return;
  }

  const indexToShow =
    currentIndex;

  const src =
    posters[indexToShow];

  const testImage =
    new Image();


  testImage.onload = () => {

    fallbackEl.style.display =
      "none";

    posterEl.style.display =
      "block";


    posterBackgroundEl.style.backgroundImage =
      `url("${src}?v=${Date.now()}")`;

    posterBackgroundEl.style.opacity =
      "0.72";


    posterEl.classList.remove(
      "fade-in"
    );

    posterEl.classList.add(
      "fade-out"
    );


    setTimeout(
      () => {

        posterEl.src =
          `${src}?v=${Date.now()}`;

        posterEl.classList.remove(
          "fade-out"
        );

        posterEl.classList.add(
          "fade-in"
        );

      },
      180
    );


    counterEl.textContent =
      `${indexToShow + 1} / ${posters.length}`;

    counterEl.style.display =
      posters.length > 1
        ? "block"
        : "none";


    currentIndex =
      (indexToShow + 1)
      %
      posters.length;


    clearTimeout(timer);

    timer =
      setTimeout(
        () =>
          showNextValidPoster(),
        POSTER_DURATION
      );
  };


  testImage.onerror = () => {

    console.warn(
      `Poster tidak dijumpai. Skip: ${src}`
    );

    currentIndex =
      (indexToShow + 1)
      %
      posters.length;

    showNextValidPoster(
      attempts + 1
    );
  };


  testImage.src =
    `${src}?v=${Date.now()}`;
}


/* =========================================================
   LOAD TICKER
   ========================================================= */

async function loadTicker() {

  try {

    const response =
      await fetch(
        TICKER_LIST_URL,
        {
          cache: "no-store"
        }
      );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data =
      await response.json();

    if (!Array.isArray(data)) {
      throw new Error(
        "ticker.json mesti dalam bentuk array."
      );
    }


    const validTickerItems =
      data.filter(
        item =>
          typeof item === "string"
          &&
          item.trim() !== ""
      );


    if (validTickerItems.length === 0) {

      tickerEl.textContent =
        "Tiada maklumat terkini buat masa ini.";

      return;
    }


    tickerEl.textContent =
      validTickerItems.join(
        "   •   "
      )
      +
      "   •   ";

  }

  catch (error) {

    console.error(
      "Gagal membaca ticker.json:",
      error
    );

    tickerEl.textContent =
      "Selamat datang ke TVETMARA Petaling Jaya.";
  }
}


/* =========================================================
   START SYSTEM
   ========================================================= */

loadPosterList();

loadTicker();
