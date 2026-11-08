/* =========================================================
   EXPLORE UGANDA — GALLERY SCRIPT
   1. Filter buttons
   2. Lightbox (click a photo to view it large)
   ========================================================= */

const cards = Array.from(document.querySelectorAll(".card"));
const filterButtons = document.querySelectorAll(".filter-btn");

/* ---------- 1. Filters ---------- */
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const filter = button.dataset.filter;

        filterButtons.forEach(function (b) { b.classList.remove("active"); });
        button.classList.add("active");

        cards.forEach(function (card) {
            const categories = card.dataset.category.split(" ");
            const show = filter === "all" || categories.includes(filter);
            card.classList.toggle("is-hidden", !show);
        });
    });
});

/* ---------- 2. Lightbox ---------- */
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbTitle = document.getElementById("lb-title");
const lbLocation = document.getElementById("lb-location");
let currentIndex = 0;
let lastFocused = null;

// only cycle through the photos currently visible (respects the filter)
function visibleCards() {
    return cards.filter(function (card) { return !card.classList.contains("is-hidden"); });
}

function showImage(card) {
    const img = card.querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbTitle.textContent = card.querySelector("h3").textContent;
    lbLocation.textContent = card.querySelector(".location").textContent;
}

function openLightbox(card) {
    lastFocused = card;
    currentIndex = visibleCards().indexOf(card);
    showImage(card);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightbox.querySelector(".lb-close").focus();
}

function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
}

function step(direction) {
    const list = visibleCards();
    currentIndex = (currentIndex + direction + list.length) % list.length;
    showImage(list[currentIndex]);
}

cards.forEach(function (card) {
    // make cards reachable with the keyboard
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "View " + card.querySelector("h3").textContent);

    card.addEventListener("click", function () { openLightbox(card); });
    card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openLightbox(card);
        }
    });
});

lightbox.querySelector(".lb-close").addEventListener("click", closeLightbox);
lightbox.querySelector(".lb-prev").addEventListener("click", function () { step(-1); });
lightbox.querySelector(".lb-next").addEventListener("click", function () { step(1); });

// click on the dark background closes it
lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
});

// keyboard: Esc, left and right arrows
document.addEventListener("keydown", function (e) {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
});
