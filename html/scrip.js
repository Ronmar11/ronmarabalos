const menuButton = document.getElementById("menuButton");
const hiddenNav = document.getElementById("hiddenNav");
const loader = navcontainer.querySelector(".loader");

menuButton.addEventListener("click", (e) => {
  e.stopPropagation(); 
  hiddenNav.classList.toggle("active");
  if (hiddenNav.classList.contains("active")) {
    loader.style.display = "none";
  } else {
    loader.style.display = "block";
  }
  loader.style.display = hiddenNav.classList.contains("active") ? "none" : "block";
});

document.addEventListener("click", (e) => {
  if (!menuButton.contains(e.target)) {
    hiddenNav.classList.remove("active");
    loader.style.display = "block"; // show loader again
  }
});
