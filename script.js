const navLinks = document.querySelectorAll(".nav-link");
const menuToggle = document.querySelector(".menu-toggle");
const navList = document.querySelector(".nav-links");
const revealItems = document.querySelectorAll(".reveal");
const typingTarget = document.querySelector(".typing");
const sections = [...document.querySelectorAll("section")];
const header = document.querySelector(".site-header");
const progressBar = document.querySelector(".scroll-progress");

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

revealItems.forEach((item) => observer.observe(item));

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

menuToggle.addEventListener("click", () => {
  const isOpen = navList.classList.toggle("open");
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navList.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", (event) => {
  if (!navList.contains(event.target) && !menuToggle.contains(event.target)) {
    navList.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

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

if (typingTarget) {
  const typingWords = typingTarget.dataset.words.split(",");
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

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
      }
    }

    const delay = isDeleting ? 60 : 90;
    const pause = !isDeleting && charIndex === currentWord.length ? 1200 : delay;
    const finalDelay = isDeleting && charIndex === 0 ? 500 : pause;
    setTimeout(typeLoop, finalDelay);
  }

  typeLoop();
}
