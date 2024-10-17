const myModal = document.getElementById("myModal");
const myInput = document.getElementById("myInput");

myModal.addEventListener("shown.bs.modal", () => {
  myInput.focus();
});

const starField = document.querySelector(".star-field");

function createStar() {
  const star = document.createElement("div");
  star.classList.add("star");

  // Random size
  const size = Math.random() * 3 + 1; // Star size between 1px and 4px
  star.style.width = `${1}px`;
  star.style.height = `${4}px`;

  // Random position
  star.style.top = `${Math.random() * 100}vh`;
  star.style.left = `${Math.random() * 100}vw`;

  // Random animation duration
  const duration = Math.random() * 2 + 1; // Duration between 1s and 3s
  star.style.animationDuration = `${duration}s`;

  starField.appendChild(star);
}

// Create multiple stars
for (let i = 0; i < 100; i++) {
  createStar();
}
