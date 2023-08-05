// Get the button and images container elements
const button = document.querySelector("button");
const imagesContainer = document.querySelector(".images");

// Toggle class on button click
button.addEventListener("click", () => {
  imagesContainer.classList.toggle("show-all");
});

// Add waving effect to the images
const images = document.querySelectorAll(".img");

images.forEach((image) => {
  image.addEventListener("mouseover", () => {
    image.classList.add("waving");
  });

  image.addEventListener("mouseout", () => {
    image.classList.remove("waving");
  });
});