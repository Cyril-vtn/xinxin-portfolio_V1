const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-mode") ? "dark" : "light"
  );
});

// Au chargement de la page, appliquez le thème stocké
const savedTheme = localStorage.getItem("theme") || "light";
document.body.classList.toggle("dark-mode", savedTheme === "dark");
