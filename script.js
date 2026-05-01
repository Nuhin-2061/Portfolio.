const navLinks = document.querySelectorAll(".nav-link");
const menuToggle = document.querySelector(".menu-toggle");
const navList = document.querySelector(".nav-links");
const navBackdrop = document.querySelector(".nav-backdrop");
const revealItems = document.querySelectorAll(".reveal");
const typingTarget = document.querySelector(".typing");
const sections = [...document.querySelectorAll("section")];
const header = document.querySelector(".site-header");
const progressBar = document.querySelector(".scroll-progress");
const orbs = document.querySelectorAll(".bg-orb");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isSmallScreen = window.matchMedia("(max-width: 900px)").matches;
const staggerSections = document.querySelectorAll("[data-stagger]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

staggerSections.forEach((section) => {
  const step = Number(section.dataset.staggerStep || 90);
  const staggerItems = [...section.querySelectorAll(".reveal")];
  staggerItems.forEach((item, index) => {
    if (item.dataset.delay) {
      return;
    }
    item.style.setProperty("--reveal-delay", `${index * step}ms`);
  });
});

revealItems.forEach((item) => {
  const delay = item.dataset.delay;
  if (delay) {
    item.style.setProperty("--reveal-delay", `${delay}ms`);
  }
  observer.observe(item);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

function setMenuState(isOpen) {
  navList.classList.toggle("open", isOpen);
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", isOpen);
  document.body.classList.toggle("nav-open", isOpen);
  if (navBackdrop) {
    navBackdrop.classList.toggle("show", isOpen);
  }
}

menuToggle.addEventListener("click", () => {
  const isOpen = !navList.classList.contains("open");
  setMenuState(isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setMenuState(false);
  });
});

document.addEventListener("click", (event) => {
  if (
    navList.classList.contains("open") &&
    !navList.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    setMenuState(false);
  }
});

if (navBackdrop) {
  navBackdrop.addEventListener("click", () => {
    setMenuState(false);
  });
}

let ticking = false;

function handleScroll() {
  const scrollY = window.scrollY;
  header.classList.toggle("scrolled", scrollY > 20);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(handleScroll);
    ticking = true;
  }
});

handleScroll();

let parallaxX = 0;
let parallaxY = 0;
let parallaxTicking = false;

function updateParallax() {
  orbs.forEach((orb) => {
    const speed = Number(orb.dataset.speed || 0.4);
    const offsetX = parallaxX * speed;
    const offsetY = parallaxY * speed;
    orb.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
  });
  parallaxTicking = false;
}

if (!prefersReducedMotion && !isSmallScreen) {
  window.addEventListener("mousemove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 40;
    const y = (event.clientY / window.innerHeight - 0.5) * 40;
    parallaxX = x;
    parallaxY = y;

    if (!parallaxTicking) {
      window.requestAnimationFrame(updateParallax);
      parallaxTicking = true;
    }
  });
}

if (typingTarget) {
  const typingWords = typingTarget.dataset.words.split(",");
  const colorClasses = ["color-0", "color-1", "color-2"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function updateTypingColor() {
    typingTarget.classList.remove(...colorClasses);
    typingTarget.classList.add(colorClasses[wordIndex % colorClasses.length]);
  }

  updateTypingColor();

  function typeLoop() {
    const currentWord = typingWords[wordIndex];
    const displayed = currentWord.substring(0, charIndex);
    typingTarget.textContent = displayed;

    if (!isDeleting && charIndex < currentWord.length) {
      charIndex += 1;
    } else if (isDeleting && charIndex > 0) {
      charIndex -= 1;
    } else {
      isDeleting = !isDeleting;
      if (!isDeleting) {
        wordIndex = (wordIndex + 1) % typingWords.length;
        updateTypingColor();
      }
    }

    const delay = isDeleting ? 90 : 150;
    const pause = !isDeleting && charIndex === currentWord.length ? 1700 : delay;
    const finalDelay = isDeleting && charIndex === 0 ? 800 : pause;
    setTimeout(typeLoop, finalDelay);
  }

  typeLoop();
}
