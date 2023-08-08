const toggleBtn = document.getElementById("themeBtn");
const html = document.documentElement;

const currentTheme = localStorage.getItem("theme");
if (currentTheme) {
  html.classList.add(currentTheme);
}

toggleBtn.addEventListener("click", () => {
  if (html.classList.contains("dark-mode")) {
    html.classList.replace("dark-mode", "light-mode");
    localStorage.setItem("theme", "light-mode");
  } else {
    html.classList.replace("light-mode", "dark-mode");
    localStorage.setItem("theme", "dark-mode");
  }
});
