import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/three.module.js';

// Create a scene
var scene = new THREE.Scene();

// Create a camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 500, 0);
camera.lookAt(scene.position);

// Create a renderer
var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1);
document.getElementById('overview-container').appendChild(renderer.domElement);

// Define the road parameters
var roadRadius = 200;
var roadSegments = 360;
var laneWidth = 20;
var shoulderWidth = 20;

// Define the road points
var roadPoints = [];

for (var i = 0; i <= roadSegments; i++) {
  var angle = (i / roadSegments) * Math.PI * 2;

  // Outer shoulder point
  var x = Math.cos(angle) * (roadRadius + shoulderWidth);
  var y = Math.sin(angle) * (roadRadius + shoulderWidth);
  var point = new THREE.Vector3(x, 0, y);
  roadPoints.push(point);

  // Outer lane point
  x = Math.cos(angle) * (roadRadius + shoulderWidth - laneWidth);
  y = Math.sin(angle) * (roadRadius + shoulderWidth - laneWidth);
  point = new THREE.Vector3(x, 0, y);
  roadPoints.push(point);

  // Inner lane point
  x = Math.cos(angle) * (roadRadius - shoulderWidth + laneWidth);
  y = Math.sin(angle) * (roadRadius - shoulderWidth + laneWidth);
  point = new THREE.Vector3(x, 0, y);
  roadPoints.push(point);

  // Inner shoulder point
  x = Math.cos(angle) * (roadRadius - shoulderWidth);
  y = Math.sin(angle) * (roadRadius - shoulderWidth);
  point = new THREE.Vector3(x, 0, y);
  roadPoints.push(point);
}

// Create the road geometry
var roadGeometry = new THREE.BufferGeometry().setFromPoints(roadPoints);

// Create the road material
var roadMaterial = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 });

// Create the road mesh
var road = new THREE.Line(roadGeometry, roadMaterial);
scene.add(road);

// Fade in the road
var roadOpacityTween = new TWEEN.Tween(roadMaterial)
  .to({ opacity: 1 }, 4000)
  .onUpdate(function () {
    roadMaterial.needsUpdate = true;
  });

// Define the image parameters
var imageCount = 10;
var imageRadius = roadRadius + 50;

// Load the images
var loader = new THREE.TextureLoader();
var imagePromises = [];

var imageNames = [
  'Childhood.png',
  'Teenager.png',
  'Highschool.png',
  'University-1.png',
  'Marriage.png',
  'Family life-1.png',
  'Restart-1.png',
  'ill-1.png',
  'Friend-1.png',
  'Book cover.png'
];

for (var i = 0; i < imageCount; i++) {
  var imagePromise = new Promise((resolve, reject) => {
    loader.load(`../../part 2/User story/${i + 1}/${imageNames[i]}`, resolve, undefined, reject);
  });
  imagePromises.push(imagePromise);
}

Promise.all(imagePromises)
  .then((textures) => {
    for (var i = 0; i < imageCount; i++) {
      var angle = (i / imageCount) * Math.PI * 2;

      // Calculate image position on the circle
      var x = Math.cos(angle) * imageRadius;
      var y = Math.sin(angle) * imageRadius;

      // Create a container for dot and image
      var container = document.createElement('div');
      container.classList.add('dot-container');

      // Create a waving dot element
      var dot = document.createElement('div');
      dot.classList.add('waving-dot');
      dot.style.left = `calc(50% + ${x}px)`;
      dot.style.top = `calc(50% + ${y}px)`;

      // Create a new scope for the event listeners
      (function (index) {
        // Add mouseover event listener to the dot
        dot.addEventListener('mouseover', function (event) {
          showHoverImage(index, event);
        });

        // Add mouseout event listener to the dot
        dot.addEventListener('mouseout', function () {
          hideHoverImage();
        });

        // Add click event listener to the dot
        dot.addEventListener('click', function () {
          showImage(index);
        });
      })(i);

      // Append the dot to the container
      container.appendChild(dot);

      // Append the container to the overview container
      document.getElementById('overview-container').appendChild(container);

      // Create an image container element
      var imageContainer = document.createElement('div');
      imageContainer.classList.add('image-container');

      // Create an image element
      var image = document.createElement('img');
      image.src = `../../part 2/User story/${i + 1}/${imageNames[i]}`;

      // Append the image to the image container
      imageContainer.appendChild(image);

      // Append the image container to the overview container
      document.getElementById('overview-container').appendChild(imageContainer);
    }

    // Start the road fade-in animation after the dots have been created
    roadOpacityTween.start();
  })
  .catch((error) => {
    console.error('Error loading images:', error);
  });

// Function to show the hover image and text
function showHoverImage(index, event) {
  // Get the hover container and image elements
  var hoverContainer = document.getElementById('hover-container');
  var hoverImage = document.getElementById('hover-image');

  // Set the source of the hover image to the image corresponding to the index
  hoverImage.src = `../../part 2/User story/${index + 1}/${imageNames[index]}`;

  // Add a load event listener to the hover image
  hoverImage.addEventListener('load', function () {
    // Set the position of the hover container to the position of the mouse cursor
    // Subtract half the width and height of the image to center the image on the cursor
    hoverContainer.style.left = `${event.clientX - hoverImage.offsetWidth / 2}px`;
    hoverContainer.style.top = `${event.clientY - hoverImage.offsetHeight / 2}px`;

    // Show the hover container
    hoverContainer.style.display = 'block';
  });
}

// Function to hide the hover image and text
function hideHoverImage() {
  // Get the hover container element
  var hoverContainer = document.getElementById('hover-container');

  // Hide the hover container
  hoverContainer.style.display = 'none';
}

// Function to show the image with text
function showImage(index) {
  // Get the corresponding image container by index
  var imageContainers = document.getElementsByClassName('image-container');
  var imageContainer = imageContainers[index];

  // Hide all image containers
  for (var i = 0; i < imageContainers.length; i++) {
    imageContainers[i].classList.remove('show');
  }

  // Show the selected image container
  imageContainer.classList.add('show');
}

// Manual rotation of the road
var rotationSpeed = 0.001;

function animate() {
  requestAnimationFrame(animate);

  // Rotate the road
  road.rotation.y += rotationSpeed;

  // Update tween animations
  TWEEN.update();

  renderer.render(scene, camera);
}

animate();