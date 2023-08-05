import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/three.module.js';

// Create a scene
var scene = new THREE.Scene();

// Create a camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 0);

// Create a renderer
var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1); 
document.getElementById('roadview-container').appendChild(renderer.domElement);

// Update renderer size when the window is resized
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Define the road parameters
var roadRadius = 10;
var roadSegments = 360;
var roadWidth = 8; 
var laneWidth = 2; 
var shoulderWidth = (roadWidth - laneWidth * 2) / 2; 

// Define the road points
var roadPoints = [];

for (var i = 0; i <= roadSegments; i++) {
  var angle = (i / roadSegments) * Math.PI * 2;

  // Outer shoulder point
  var x = Math.cos(angle) * (roadRadius + shoulderWidth);
  var z = Math.sin(angle) * (roadRadius + shoulderWidth);
  var point = new THREE.Vector3(x, 0, z);
  roadPoints.push(point);

  // Outer lane point
  x = Math.cos(angle) * (roadRadius + shoulderWidth - laneWidth);
  z = Math.sin(angle) * (roadRadius + shoulderWidth - laneWidth);
  point = new THREE.Vector3(x, 0, z);
  roadPoints.push(point);

  // Inner lane point
  x = Math.cos(angle) * (roadRadius - shoulderWidth + laneWidth);
  z = Math.sin(angle) * (roadRadius - shoulderWidth + laneWidth);
  point = new THREE.Vector3(x, 0, z);
  roadPoints.push(point);

  // Inner shoulder point
  x = Math.cos(angle) * (roadRadius - shoulderWidth);
  z = Math.sin(angle) * (roadRadius - shoulderWidth);
  point = new THREE.Vector3(x, 0, z);
  roadPoints.push(point);
}

// Create the road geometry
var roadGeometry = new THREE.BufferGeometry().setFromPoints(roadPoints);

// Create the road material
var roadMaterial = new THREE.LineDashedMaterial({
  color: 0x000000, 
  linewidth: 1,
  dashSize: 0.1,
  gapSize: 0.1,
});

// Create the road mesh
var road = new THREE.LineSegments(roadGeometry, roadMaterial);
scene.add(road);

// Animation variables
var targetX = Math.cos(Math.PI / 4) * roadRadius;
var targetY = 5 - Math.sin(Math.PI / 4) * 5;
var targetZ = roadRadius + 5 - Math.sin(Math.PI / 4) * 5;
var animationProgress = 0;

// Load the images from the user story folder
var loader = new THREE.TextureLoader();
var texturePromises = [];

var imageNames = [
  "Childhood",
  "Teenager",
  "Highschool",
  "University-1",
  "Marriage",
  "Family life-1",
  "Restart-1",
  "ill-1",
  "Friend-1",
  "Book cover"
];

var images = [];
var imageCount = imageNames.length;

for (var i = 0; i < imageCount; i++) {
  var texturePromise = new Promise((resolve, reject) => {
    loader.load(`../../part 2/User story/${i + 1}/${imageNames[i]}.png`, resolve, undefined, reject);
  });
  texturePromises.push(texturePromise);
}

Promise.all(texturePromises)
  .then((textures) => {
    for (var i = 0; i < imageCount; i++) {
      // Create an image container element
      var imageContainer = document.createElement('div');
      imageContainer.classList.add('image-container');
      imageContainer.style.position = 'absolute';
      imageContainer.style.width = '300px'; 
      imageContainer.style.height = 'auto'; 
      imageContainer.style.transformOrigin = 'center';
      imageContainer.style.transformStyle = 'preserve-3d';
      imageContainer.style.transition = 'transform 0.3s ease-in-out';
      imageContainer.style.opacity = '0'; 

      // Create an image element
      var image = document.createElement('img');
      image.src = textures[i].image.src;
      image.style.width = '100%'; 
      image.style.height = '100%'; 
      image.style.objectFit = 'contain'; 

      // Create a text intro element
      var textIntro = document.createElement('div');
      textIntro.textContent = imageNames[i];
      textIntro.style.position = 'absolute';
      textIntro.style.top = '10px';
      textIntro.style.left = '10px';
      textIntro.style.color = '#ffffff';
      textIntro.style.fontFamily = 'Arial, sans-serif';
      textIntro.style.fontSize = '14px';
      textIntro.style.opacity = '0';
      textIntro.style.transition = 'opacity 0.3s ease-in-out';

      // Add event listener to image container
      imageContainer.addEventListener('click', function () {
        if (this.style.transform === 'scale(1.0)') {
          this.style.transform = 'scale(1.5)';
          textIntro.style.opacity = '1';
        } else {
          this.style.transform = 'scale(1.0)';
          textIntro.style.opacity = '0';
        }
      });

      // Append image and text intro to image container
      imageContainer.appendChild(image);
      imageContainer.appendChild(textIntro);

      // Append image container to the roadview container
      document.getElementById('roadview-container').appendChild(imageContainer);

      images.push(imageContainer); 
    }
  })
  .catch((error) => {
    console.error('Error loading textures:', error);
  });

// Add interactivity with mouse or touch events
var isUserInteracting = false;
var mouse = new THREE.Vector2();

function onPointerDown(event) {
  event.preventDefault();
  isUserInteracting = true;

  if (event.touches) {
    mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
  } else {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }
}

function onPointerMove(event) {
  if (isUserInteracting) {
    if (event.touches) {
      mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    } else {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    // Update the total rotation based on mouse movement
    var currentRotation = Math.atan2(camera.position.x, camera.position.z);
    var previousRotation = Math.atan2(camera.position.x - mouse.x, camera.position.z - mouse.y);

    // Calculate the difference in rotation
    var rotationDelta = previousRotation - currentRotation;
var rotationSpeed = 0.001; 
totalRotation -= rotationDelta * rotationSpeed;


    // Adjust the total rotation angle
    var rotationSensitivity = 0.005; 
var rotationSpeed = 0.01; 

// Update the total rotation based on mouse movement and rotation speed
totalRotation -= rotationDelta * rotationSensitivity * rotationSpeed;


    // Update the image index based on rotation direction
    if (rotationDelta > 0) {
      // Rotating from right to left (anticlockwise)
      imageIndex = (imageIndex + 1) % imageCount;
    } else {
      // Rotating from left to right (clockwise)
      imageIndex = (imageIndex - 1 + imageCount) % imageCount;
    }

    // Reset the image opacity
    for (var i = 0; i < imageCount; i++) {
      if (i === imageIndex) {
        images[i].style.opacity = '1';
      } else {
        images[i].style.opacity = '0';
      }
    }

    clearTimeout(imageTimeout);
    imageTimeout = setTimeout(showNextImage, imageDuration);
  }
}

function onPointerUp() {
  isUserInteracting = false;
}

function onScroll(event) {
  // Update camera position based on scroll
  var delta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
  camera.position.y += delta * 0.1;

  // Check if the viewer has interacted before showing the images
  if (viewerInteracted) {
    clearTimeout(imageTimeout);
    imageTimeout = setTimeout(showNextImage, imageDuration);
  }
}

document.addEventListener('mousedown', onPointerDown, { passive: false });
document.addEventListener('mousemove', onPointerMove, { passive: false });
document.addEventListener('mouseup', onPointerUp, { passive: false });

document.addEventListener('touchstart', onPointerDown, { passive: false });
document.addEventListener('touchmove', onPointerMove, { passive: false });
document.addEventListener('touchend', onPointerUp, { passive: false });

document.addEventListener('wheel', onScroll, { passive: false });

// Animation and Image Visibility
var imageIndex = imageCount - 1;
var imageTimeout = null;
var imageDuration = 10000; 
var viewerInteracted = false; 

// Constants for rotation threshold and total rotation angle
var rotationThreshold = (Math.PI * 2) / (imageCount * 4);
var totalRotation = 0; 

function showNextImage() {
  if (images.length === 0) return; 

  images[imageIndex].style.opacity = '0'; 

  // Calculate the current image index based on total rotation
  var normalizedRotation = totalRotation < 0 ? totalRotation % (-2 * Math.PI) + 2 * Math.PI : totalRotation % (2 * Math.PI);
  imageIndex = Math.floor(normalizedRotation / rotationThreshold);

  images[imageIndex].style.opacity = '1'; 

  if (isUserInteracting) {
    clearTimeout(imageTimeout);
    imageTimeout = setTimeout(showNextImage, getTransitionDuration());
  } else {
    clearTimeout(imageTimeout);
  }
}

function getTransitionDuration() {
  var rotationSpeed = Math.abs(rotationDelta); 

  // Adjust the transition duration based on the rotation speed
  var minDuration = 1000; 
  var maxDuration = 5000; 

  // Calculate the transition duration based on the rotation speed
  var transitionDuration = mapValue(rotationSpeed, 0, Math.PI / 4, maxDuration, minDuration);

  // Adjust the transition duration to ensure a minimum duration for each image
  var minImageDuration = 2000; 
  var imageDuration = imageDuration / imageCount;
  transitionDuration = Math.max(transitionDuration, minImageDuration, imageDuration);

  return transitionDuration;
}

function mapValue(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function rotateToNextImage() {
  if (isUserInteracting) {
    showNextImage();
  }
}

// Disable image visibility initially
function hideImages() {
  for (var i = 0; i < images.length; i++) {
    images[i].style.opacity = '0';
  }
}

hideImages();

// Variables for interactive behavior
var viewerStarted = false;

// Add event listener to detect viewer interaction
document.addEventListener('mousedown', function () {
  viewerStarted = true;
});

document.addEventListener('mousemove', function () {
  if (!viewerInteracted && viewerStarted) {
    viewerInteracted = true;
    startImageTransition();
  }
});

document.addEventListener('mouseup', function () {
  viewerStarted = false;
});

document.addEventListener('touchstart', function () {
  viewerStarted = true;
});

document.addEventListener('touchmove', function () {
  if (!viewerInteracted && viewerStarted) {
    viewerInteracted = true;
    startImageTransition();
  }
});

document.addEventListener('touchend', function () {
  viewerStarted = false;
});

// Start the image transition after viewer interaction
function startImageTransition() {
  clearTimeout(imageTimeout);
  imageTimeout = setTimeout(showNextImage, imageDuration);
}

animate();

// Start the image transition after a delay
setTimeout(function () {
  if (viewerInteracted) {
    startImageTransition();
  }
}, 5000); 

function positionImages() {
  var centerX = targetX;
  var centerY = targetY;
  var centerZ = targetZ;

  var distance = 1000; 
  var offsetY = -125; 
  var offsetX = -115; 

  var lastImageScale = 0.9; 

  for (var i = 0; i < imageCount; i++) {
    var angle = (i / imageCount) * Math.PI * 2;

    var x = Math.cos(angle) * roadRadius + centerX + offsetX;
    var y = centerY + offsetY;
    var z = Math.sin(angle) * roadRadius + centerZ;

    var imageContainer = images[i];
    imageContainer.style.position = 'absolute';
    imageContainer.style.left = `calc(50% + ${x}px - 50px)`; 
    imageContainer.style.zIndex = 1000 - i; 

    if (i === imageCount - 1) {
      // Adjust the position and scale for the last image
      var lastImageOffsetY = -200; 
      imageContainer.style.top = `calc(50% + ${y + lastImageOffsetY}px - 50px)`; 
      imageContainer.style.transform = `translate3d(0, 0, ${distance}px) scale(${lastImageScale})`;
    } else {
      // Keep the position and scale the same for the other images
      var otherImageScale = 2; 
      imageContainer.style.top = `calc(50% + ${y}px - 50px)`; 
      imageContainer.style.transform = `translate3d(0, 0, ${distance}px) scale(${otherImageScale})`;
    }
  }
}

function animate() {
  requestAnimationFrame(animate);

  // Animation
  if (animationProgress < 1) {
    animationProgress += 0.0005; 

    // Interpolate camera position
    camera.position.x = (1 - animationProgress) * 0 + animationProgress * targetX;
    camera.position.y = (1 - animationProgress) * 100 + animationProgress * targetY;
    camera.position.z = (1 - animationProgress) * -200 + animationProgress * targetZ;

    camera.lookAt(scene.position);
  } else {
    // Enable user interaction when animation ends
    if (isUserInteracting) {
      // Rotate the camera based on mouse position
      camera.position.x = Math.sin(mouse.x * Math.PI * 2) * (roadRadius + 1);
      camera.position.z = Math.cos(mouse.x * Math.PI * 2) * (roadRadius + 1);
      camera.lookAt(scene.position);
    } else {
      // Position the images at the center of the annulus
      positionImages();
    }
  }

  setTimeout(function() {
    renderer.render(scene, camera);
  }, 100); 
}

// Remove the automatic image transition
clearTimeout(imageTimeout);

// Start the image transition only after viewer interaction
document.addEventListener('click', function () {
  if (!viewerInteracted) {
    viewerInteracted = true;
    startImageTransition();
  }
});

animate();