const themeToggle = document.getElementById("theme-toggle");

const mouseTracker = document.getElementById("mouse-tracker");

themeToggle.addEventListener("click", () => {
  // Inversez le thème actuel
  document.body.classList.toggle("dark-mode");

  // Stockez le thème actuel dans le stockage local
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-mode") ? "dark" : "light"
  );
});

themeToggle.addEventListener("mouseover", () => {
  mouseTracker.style.backgroundColor = "#7DC385";
  mouseTracker.style.width = "10px";
  mouseTracker.style.height = "10px";
});

themeToggle.addEventListener("mouseout", () => {
  mouseTracker.style.backgroundColor = "transparent";
  mouseTracker.style.width = "100px";
  mouseTracker.style.height = "100px";
});

// Au chargement de la page, appliquez le thème stocké
const savedTheme = localStorage.getItem("theme") || "light";
document.body.classList.toggle("dark-mode", savedTheme === "dark");
