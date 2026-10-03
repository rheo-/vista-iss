import * as THREE from "three";
import "./style.css";

const canvas = document.querySelector("#earth");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020617);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 0, 3);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// Earth
const geometry = new THREE.SphereGeometry(1, 64, 64);

const textureLoader = new THREE.TextureLoader();

const earthTexture = textureLoader.load("/textures/earth.jpg");

earthTexture.colorSpace = THREE.SRGBColorSpace;

const material = new THREE.MeshStandardMaterial({
  map: earthTexture,
  roughness: 1,
});

const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

let isDragging = false;
let previousX = 0;
let previousY = 0;

// Mouse drag
canvas.addEventListener("pointerdown", (event) => {
  isDragging = true;
  previousX = event.clientX;
  previousY = event.clientY;

  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", (event) => {
  if (!isDragging) return;

  const deltaX = event.clientX - previousX;
  const deltaY = event.clientY - previousY;

  earth.rotation.y += deltaX * 0.005;
  earth.rotation.x += deltaY * 0.005;

  // Prevent the globe from flipping completely upside down
  earth.rotation.x = THREE.MathUtils.clamp(
    earth.rotation.x,
    -Math.PI / 2,
    Math.PI / 2
  );

  previousX = event.clientX;
  previousY = event.clientY;
});

canvas.addEventListener("pointerup", (event) => {
  isDragging = false;
  canvas.releasePointerCapture(event.pointerId);
});

canvas.addEventListener("pointercancel", () => {
  isDragging = false;
});

// Zoom
canvas.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();

    camera.position.z += event.deltaY * 0.002;

    camera.position.z = THREE.MathUtils.clamp(
      camera.position.z,
      1.5,
      6
    );
  },
  { passive: false }
);

// Animation
function animate() {
  requestAnimationFrame(animate);

  if (!isDragging) {
    earth.rotation.y += 0.001;
  }

  renderer.render(scene, camera);
}

animate();