// Initialize variables for target and current scroll position, and easing factor
let target = 0;
let current = 0;
let ease = 0.09;

// Obtenez la largeur de la fenêtre
let windowWidth = window.innerWidth;

// Calculez la hauteur en conservant le ratio de 16/9
let videoHeight = (windowWidth * 9) / 16;

// Appliquez la largeur et la hauteur à l'élément vidéo
let videoElements = document.querySelectorAll(".slide");
console.log(videoElements);
videoElements.forEach((videoElement) => {
  videoElement.style.width = windowWidth + "px";
  videoElement.style.height = videoHeight + "px";
});

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
let slideWidth;

// Calculate the maximum scrollable width
let maxScroll;

// Get the length of the entire scrollable area
let scrollLength;

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
  const videoContainer = slide.querySelector(".slide_content");
  const img = slide.querySelector("img");
  const video = slide.querySelector("video");
  const title = slide.querySelector(".slide_title");
  const overlay = slide.querySelector(".overlay");
  const button = slide.querySelector(".slide_button");
  const closeBtn = document.getElementById("close-fullscreen");

  if (button) {
    button.addEventListener("mouseover", () => {
      // Change mouse tracker style on mouseover
      // Change mouse tracker style on mouseover
      mouseTracker.style.backgroundColor = "#7DC385";
      mouseTracker.style.width = "10px";
      mouseTracker.style.height = "10px";
    });
    button.addEventListener("mouseout", () => {
      // Revert mouse tracker style on mouseout
      mouseTracker.style.backgroundColor = "transparent";
      mouseTracker.style.width = "100px";
      mouseTracker.style.height = "100px";
    });

    button.addEventListener("click", () => {
      // Create a new video element
      const fullscreenVideo = document.createElement("video");

      // Set the poster of the video
      fullscreenVideo.poster = `/images/${video.title}.png`; // Replace with the path to your poster

      // Set the video controls
      fullscreenVideo.controls = true;
      fullscreenVideo.controlsList = "nodownload";

      closeBtn.style.display = "block";
      closeBtn.addEventListener("click", function () {
        if (fullscreenVideo && document.body.contains(fullscreenVideo)) {
          document.body.removeChild(fullscreenVideo);
          closeBtn.style.display = "none";
        }
      });

      // Set the source of the video
      fullscreenVideo.src = `/videos/${video.title}_final.mp4`; // Replace with the path to your video
      // Set the video to play in fullscreen
      fullscreenVideo.style.position = "fixed";
      fullscreenVideo.style.width = "100%";
      fullscreenVideo.style.height = "100%";
      fullscreenVideo.style.left = "0";
      fullscreenVideo.style.top = "0";
      fullscreenVideo.style.zIndex = "2000";
      fullscreenVideo.style.cursor = "default";

      // Append the video to the body
      document.body.appendChild(fullscreenVideo);

      // When the video ends, remove it from the body
      fullscreenVideo.addEventListener("ended", () => {
        closeBtn.style.display = "none";
        document.body.removeChild(fullscreenVideo);
      });
    });
  }

  if (video) {
    videoContainer.addEventListener("mouseover", () => {
      // Change mouse tracker style on mouseover
      mouseTracker.style.scale = "1.5";
      mouseTracker.style.borderWidth = "1.5px";
      mouseTracker.style.borderColor = "#7DC385";
      video.play();
      title.style.opacity = "0";
      video.volume = 0.4;
      overlay.style.background = "rgba(0, 0, 0, 0.0)";
    });
    videoContainer.addEventListener("mouseleave", () => {
      // Revert mouse tracker style on mouseout
      mouseTracker.style.scale = "1";
      mouseTracker.style.borderWidth = "1px";
      mouseTracker.style.borderColor = "var(--text-color)";
      video.pause();
      video.load();
      video.currentTime = 0;
      title.style.opacity = "0.8";
      overlay.style.background = "rgba(0, 0, 0, 0.2)";
    });
    return;
  }
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

    // Calculate distance from center
    const centerPosition = (rect.left + rect.right) / 2;
    const distanceFromCenter = centerPosition - window.innerWidth / 2;

    // Calculate scale and position
    let scale, offsetX;
    if (distanceFromCenter > 0) {
      scale = Math.min(1.2, 1 + distanceFromCenter / (window.innerWidth * 3)); // Termine la mise à l'échelle plus tard
      offsetX = (scale - 1) * 500; // Déplacez le slide vers la droite
    } else {
      scale = Math.max(
        0.5,
        1 - Math.abs(distanceFromCenter) / (window.innerWidth * 2) // Termine la mise à l'échelle plus tôt
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
  windowWidth = window.innerWidth / 1.5;
  videoHeight = (windowWidth * 9) / 16;
  const videoElements = document.querySelectorAll(".slide");

  // Calculez la largeur en fonction de la largeur de la fenêtre
  slideWidth = document.querySelector(".slider-wrapper").offsetWidth;
  maxScroll = slideWidth - window.innerWidth;
  speed = 0.4;

  scrollLength = slideWidth - window.innerWidth;

  // Réappliquez la largeur et la hauteur
  videoElements.forEach((videoElement) => {
    videoElement.style.width = windowWidth + "px";
    videoElement.style.height = videoHeight + "px";
  });
}

// Call calculateMaxScroll once at page load
document.addEventListener("DOMContentLoaded", calculateMaxScroll);
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
