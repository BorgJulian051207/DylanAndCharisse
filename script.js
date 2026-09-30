// ===== ENVELOPE INTRO ANIMATION =====
const envelope = document.getElementById("envelope");
const envelopeWrap = document.getElementById("envelope-wrap");
const envelopeIntro = document.getElementById("envelope-intro");
const envelopeHint = document.getElementById("envelope-hint");
const envelopeEyebrow = document.getElementById("envelope-eyebrow");
const envelopeFlash = document.getElementById("envelope-flash");

function openEnvelope() {
  if (!envelope || envelope.classList.contains("opened")) return;

  envelope.classList.add("opened");
  if (envelopeHint) envelopeHint.classList.add("hidden");
  if (envelopeEyebrow) envelopeEyebrow.classList.add("hidden");

  setTimeout(() => {
    if (envelopeWrap) envelopeWrap.classList.add("zoom");
    if (envelopeFlash) envelopeFlash.classList.add("show");
  }, 1150);

  setTimeout(() => {
    if (envelopeIntro) envelopeIntro.classList.add("hidden");
    document.body.classList.remove("locked");
    setTimeout(() => {
      if (envelopeFlash) envelopeFlash.classList.remove("show");
    }, 400);
  }, 1750);
}

if (envelopeIntro) {
  envelopeIntro.addEventListener("click", openEnvelope);
  envelopeIntro.addEventListener("touchend", openEnvelope, { passive: true });
}

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById("nav-toggle");
const navInner = document.querySelector(".nav-inner");
if (navToggle && navInner) {
  navToggle.addEventListener("click", () => {
    const open = navInner.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", open);
  });

  document.addEventListener("click", (e) => {
    if (!navInner.contains(e.target)) {
      navInner.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  navInner.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navInner.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ===== PLAY BUTTON: opens the save-the-date video with sound,
const playBtn = document.getElementById("play-video");
const videoLightbox = document.getElementById("video-lightbox");
const videoLightboxPlayer = document.getElementById("video-lightbox-player");
const videoLightboxClose = document.getElementById("video-lightbox-close");

function openVideoLightbox() {
  if (!videoLightbox || !videoLightboxPlayer) return;
  videoLightbox.classList.add("show");
  videoLightboxPlayer.muted = false;
  videoLightboxPlayer.currentTime = 0;
  videoLightboxPlayer.play().catch(() => {
  });
}

function closeVideoLightbox() {
  if (!videoLightbox || !videoLightboxPlayer) return;
  videoLightbox.classList.remove("show");
  videoLightboxPlayer.pause();
}

if (playBtn) playBtn.addEventListener("click", openVideoLightbox);
if (videoLightboxClose) videoLightboxClose.addEventListener("click", closeVideoLightbox);
if (videoLightbox) {
  videoLightbox.addEventListener("click", (e) => {
    if (e.target === videoLightbox) closeVideoLightbox();
  });
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeVideoLightbox();
});

// ===== RSVP: "HOW MANY GUESTS" COUNTER =====
const guestMinus = document.getElementById("guest-minus");
const guestPlus = document.getElementById("guest-plus");
const guestCountEl = document.getElementById("guest-count");
const guestCountInput = document.getElementById("guest-count-input");

const MIN_GUESTS = 1;
const MAX_GUESTS = 10;
let guestCount = 1;

function updateGuestCount(next) {
  guestCount = Math.min(MAX_GUESTS, Math.max(MIN_GUESTS, next));
  if (guestCountEl) guestCountEl.textContent = guestCount;
  if (guestCountInput) guestCountInput.value = guestCount;
}

if (guestMinus) guestMinus.addEventListener("click", () => updateGuestCount(guestCount - 1));
if (guestPlus) guestPlus.addEventListener("click", () => updateGuestCount(guestCount + 1));

// ===== RSVP: ADD ANOTHER GUEST NAME FIELD =====
const guestNamesWrap = document.getElementById("guest-names");
const addGuestBtn = document.getElementById("add-guest-btn");
const MAX_GUEST_FIELDS = 10;

if (addGuestBtn && guestNamesWrap) {
  addGuestBtn.addEventListener("click", () => {
    const existing = guestNamesWrap.querySelectorAll("input").length;
    if (existing >= MAX_GUEST_FIELDS) return;

    const next = existing + 1;
    const input = document.createElement("input");
    input.type = "text";
    input.name = `guest_name_${next}`;
    input.placeholder = `Guest ${next} full name`;
    guestNamesWrap.appendChild(input);

    if (existing + 1 >= MAX_GUEST_FIELDS) {
      addGuestBtn.disabled = true;
      addGuestBtn.style.opacity = "0.5";
      addGuestBtn.style.cursor = "not-allowed";
    }
  });
}

// ===== ADD TO CALENDAR (downloads a .ics file) =====
const calendarBtn = document.getElementById("add-to-calendar");
if (calendarBtn) {
  calendarBtn.addEventListener("click", () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "SUMMARY:Charisse & Dylan's Wedding",
      "DTSTART:20270619T180000",
      "DTEND:20270620T020000",
      "LOCATION:Westin Dragonara, St. Julian's",
      "DESCRIPTION:Ceremony at The Sunken Garden, reception at Reef Club.",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "charisse-and-dylan-wedding.ics";
    link.click();
    URL.revokeObjectURL(url);
  });
}

// ===== COUNTDOWN TIMER =====
const weddingDate = new Date("2027-06-19T18:00:00").getTime();

function pad(num) {
  return String(num).padStart(2, "0");
}

function updateCountdown() {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance < 0) {
    document.getElementById("countdown").innerHTML = "The big day is here!";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("cd-days").textContent = pad(days);
  document.getElementById("cd-hours").textContent = pad(hours);
  document.getElementById("cd-minutes").textContent = pad(minutes);
  document.getElementById("cd-seconds").textContent = pad(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== RSVP FORM (optional confirmation message) =====
const form = document.getElementById("rsvp-form");
if (form) {
  form.addEventListener("submit", () => {
    const button = form.querySelector("button");
    button.textContent = "Sending...";
  });
}
