// Initialize variables for target and current scroll position, and easing factor
let target = 0;
let current = 0;
let ease = 0.075;

// Get DOM elements
const slider = document.querySelector(".slider");
const sliderWrapper = document.querySelector(".slider-wrapper");
const slides = document.querySelectorAll(".slide");
const mouseTracker = document.querySelector("#mouse-tracker");
const dot = document.querySelector("#dot");
const progressBar = document.getElementById("progress-bar");

// Get the number of slides
const numSlides = slides.length;

// Set the width of each slide (including margins)
const slideWidth = 500 + 100; // 400px width + 100px gap

// Calculate the maximum scrollable width
let maxScroll = numSlides * slideWidth - window.innerWidth;

// Get the length of the entire scrollable area
const scrollLength =
  window.innerWidth <= 768
    ? (numSlides * slideWidth - window.innerWidth) / 2
    : numSlides * slideWidth - window.innerWidth;

// Initialize mouse position and tracking speed
let mouse = { x: 0, y: 0 };
let pos = { x: 0, y: 0 };
let speed = 0.1;

// Linear interpolation function
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

// Add mouseover and mouseout event listeners to each image
slides.forEach((slide) => {
  const img = slide.querySelector("img");
  img.addEventListener("mouseover", () => {
    // Change mouse tracker style on mouseover
    mouseTracker.style.scale = "1.5";
    mouseTracker.style.borderWidth = "1.5px";
    mouseTracker.style.borderColor = "#7DC385";
  });
  img.addEventListener("mouseout", () => {
    // Revert mouse tracker style on mouseout
    mouseTracker.style.scale = "1";
    mouseTracker.style.borderWidth = "1px";
    mouseTracker.style.borderColor = "var(--text-color)";
  });
});

// Function to update scale and position of slides
function updateScaleAndPosition() {
  slides.forEach((slide) => {
    // Calculate slide position and scale
    const rect = slide.getBoundingClientRect();
    const centerPosition = (rect.left + rect.right) / 2;
    const distanceFromCenter = centerPosition - window.innerWidth / 2;
    let scale, offsetX;
    if (distanceFromCenter > 0) {
      scale = Math.min(1.75, 1 + distanceFromCenter / window.innerWidth);
      offsetX = (scale - 1) * 300;
    } else {
      scale = Math.max(
        0.5,
        1 - Math.abs(distanceFromCenter) / window.innerWidth
      );
      offsetX = 0;
    }

    // Set slide scale and position
    gsap.set(slide, { scale: scale, x: offsetX });
  });
}

// Function to update scroll position and mouse tracker position
function update() {
  current = lerp(current, target, ease);
  pos.x = lerp(pos.x, mouse.x, speed);
  pos.y = lerp(pos.y, mouse.y, speed);

  // Update slider wrapper position
  gsap.set(".slider-wrapper", {
    x: -current,
  });

  // Update mouse tracker position
  mouseTracker.style.left = `${pos.x}px`;
  mouseTracker.style.top = `${pos.y}px`;

  // Update slide scale and position
  updateScaleAndPosition();

  // Request next animation frame
  requestAnimationFrame(update);

  progressBar.style.width = `${(current / scrollLength) * 100}%`;
}

// Function to calculate maxScroll
function calculateMaxScroll() {
  if (window.innerWidth <= 768) {
    maxScroll = (numSlides * slideWidth - window.innerWidth) / 2;
    speed = 0.4;
  } else {
    maxScroll = numSlides * slideWidth - window.innerWidth;
    speed = 0.1;
  }
}

// Call calculateMaxScroll once at page load
calculateMaxScroll();

// Call calculateMaxScroll on window resize
window.addEventListener("resize", calculateMaxScroll);

window.addEventListener("wheel", (e) => {
  target += e.deltaY;
  target = Math.max(0, target);
  target = Math.min(maxScroll, target);
});

window.addEventListener("mousemove", (e) => {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
});

// Hide mouse tracker when mouse leaves the window
window.addEventListener("mouseout", () => {
  mouseTracker.style.display = "none";
});

// Show mouse tracker when mouse enters the window
window.addEventListener("mouseover", () => {
  mouseTracker.style.display = "block";
});

// Start the animation
update();

// Add strike-through effect
const socials = document.querySelectorAll(".social a");

socials.forEach((social) => {
  social.addEventListener("mouseover", () => {
    social.classList.remove("strike-through-out");
    social.classList.add("strike-through");
    // Change mouse tracker style on mouseover
    mouseTracker.style.backgroundColor = "#7DC385";
    mouseTracker.style.width = "10px";
    mouseTracker.style.height = "10px";
  });
  social.addEventListener("mouseout", () => {
    social.classList.remove("strike-through");
    social.classList.add("strike-through-out");
    // Revert mouse tracker style on mouseout
    mouseTracker.style.backgroundColor = "transparent";
    mouseTracker.style.width = "100px";
    mouseTracker.style.height = "100px";
    social.addEventListener(
      "animationend",
      () => {
        if (social.classList.contains("strike-through-out")) {
          social.classList.remove("strike-through-out");
        }
      },
      { once: true }
    );
  });
});

let isTouching = false;
let startTouchY;

window.addEventListener("touchstart", (e) => {
  startTouchY = e.touches[0].clientY;
  isTouching = true;
});

window.addEventListener("touchmove", (e) => {
  if (!isTouching) return;
  const currentY = e.touches[0].clientY;
  const diffY = startTouchY - currentY;
  startTouchY = currentY;
  target += diffY;
  target = Math.max(0, target);
  target = Math.min(maxScroll, target);
});

window.addEventListener("touchend", () => {
  isTouching = false;
});

window.onload = function () {
  // Sélectionnez tous les éléments <span> dans le préloader
  const letters = document.querySelectorAll("#preloader-inner span");

  // Utilisez gsap pour animer chaque lettre
  letters.forEach((letter, i) => {
    gsap.fromTo(
      letter,
      { y: "200%" }, // Commencez du bas
      {
        y: "50%", // Terminez à la position d'origine
        delay: i * 0.2 + 1, // Chaque lettre est retardée de 0.2s par rapport à la précédente
        ease: "power3.out", // Utilisez une fonction d'atténuation pour un mouvement plus naturel
      }
    );
  });

  // Après que toutes les lettres soient apparues, faites glisser la div vers le bas
  gsap.to("#preloader", {
    y: "100%",
    ease: "power2.inOut",
    delay: letters.length * 0.2 + 3, // Commencez à glisser 1s après que la dernière lettre soit apparue
  });
};

// Mouse tracker
document.addEventListener("mousemove", function (e) {
  dot.style.left = e.pageX + "px";
  dot.style.top = e.pageY + "px";
});
