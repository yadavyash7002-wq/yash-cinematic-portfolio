// ===============================
// YASH — CINEMATIC PORTFOLIO
// ===============================

const orb = document.querySelector(".orb");
const hero = document.querySelector(".hero");

// Mouse movement
document.addEventListener("mousemove", (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 2;
  const y = (event.clientY / window.innerHeight - 0.5) * 2;

  if (orb) {
    orb.style.transform =
      `translate(${x * 18}px, ${y * 18}px)`;
  }

  document.body.style.setProperty(
    "--mouse-x",
    `${event.clientX}px`
  );

  document.body.style.setProperty(
    "--mouse-y",
    `${event.clientY}px`
  );
});

// Scroll effect
window.addEventListener("scroll", () => {

  const scrollY = window.scrollY;

  if (orb) {
    const rotation = scrollY * 0.08;

    orb.style.filter =
      `brightness(${1 + scrollY * 0.0003})`;

    orb.style.transform =
      `translateY(${scrollY * 0.08}px)
       rotate(${rotation}deg)`;
  }

  // Reveal cards
  document.querySelectorAll(".card").forEach((card) => {

    const rect = card.getBoundingClientRect();

    if (rect.top < window.innerHeight * 0.85) {
      card.style.opacity = "1";
      card.style.transform = "translateX(0)";
    }
  });

});

// Card initial state
document.querySelectorAll(".card").forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateX(-40px)";
  card.style.transition =
    "opacity 0.8s ease, transform 0.8s ease";
});

// Smooth navigation
document.querySelectorAll("nav a").forEach((link) => {

  link.addEventListener("click", (event) => {

    const target = document.querySelector(
      link.getAttribute("href")
    );

    if (target) {
      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth"
      });
    }

  });

});

// Hero entrance
window.addEventListener("load", () => {

  const title = document.querySelector(".hero h1");
  const small = document.querySelector(".hero .small");
  const paragraph = document.querySelector(".hero p");

  if (small) {
    small.style.opacity = "0";
    small.style.transform = "translateY(20px)";

    setTimeout(() => {
      small.style.transition = "1s";
      small.style.opacity = "1";
      small.style.transform = "translateY(0)";
    }, 300);
  }

  if (title) {
    title.style.opacity = "0";
    title.style.transform = "translateY(50px)";

    setTimeout(() => {
      title.style.transition =
        "1.2s cubic-bezier(.2,.8,.2,1)";
      title.style.opacity = "1";
      title.style.transform = "translateY(0)";
    }, 500);
  }

  if (paragraph) {
    paragraph.style.opacity = "0";

    setTimeout(() => {
      paragraph.style.transition = "1s";
      paragraph.style.opacity = "1";
    }, 900);
  }

});

// Mobile touch support
document.addEventListener("touchmove", () => {
  document.body.classList.add("touching");
});

// Console
console.log(
  "YASH. — Cinematic Portfolio initialized."
);
