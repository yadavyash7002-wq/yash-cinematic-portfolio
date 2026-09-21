import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/* =========================
   SCENE
========================= */

const canvas = document.getElementById("three-canvas");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 1.8, 7);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

/* =========================
   LIGHTING
========================= */

scene.add(
  new THREE.AmbientLight(0xffffff, 0.45)
);

const redLight = new THREE.PointLight(
  0xff2020,
  30,
  18
);

redLight.position.set(3, 4, 3);
scene.add(redLight);

const redBackLight = new THREE.PointLight(
  0x550000,
  20,
  15
);

redBackLight.position.set(-4, 2, -4);
scene.add(redBackLight);

/* =========================
   FLOOR
========================= */

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 30),
  new THREE.MeshStandardMaterial({
    color: 0x050505,
    metalness: 0.8,
    roughness: 0.35
  })
);

floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.55;
floor.receiveShadow = true;

scene.add(floor);

/* =========================
   RED RING
========================= */

const ring = new THREE.Mesh(
  new THREE.TorusGeometry(2.5, 0.025, 16, 100),
  new THREE.MeshBasicMaterial({
    color: 0xff2020
  })
);

ring.position.set(1.7, 3.2, -2.5);
ring.rotation.x = Math.PI / 2;

scene.add(ring);

/* =========================
   PARTICLES
========================= */

const count = 1000;

const positions = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i += 3) {
  positions[i] = (Math.random() - 0.5) * 24;
  positions[i + 1] = (Math.random() - 0.5) * 14;
  positions[i + 2] = (Math.random() - 0.5) * 18;
}

const particleGeometry = new THREE.BufferGeometry();

particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const particleMaterial = new THREE.PointsMaterial({
  color: 0xff3333,
  size: 0.025,
  transparent: true,
  opacity: 0.7
});

const particles = new THREE.Points(
  particleGeometry,
  particleMaterial
);

scene.add(particles);

/* =========================
   CHARACTER
========================= */

let character = null;
let mixer = null;
let clock = new THREE.Clock();

const loader = new GLTFLoader();

loader.load(
  "https://threejs.org/examples/models/gltf/Soldier.glb",

  (gltf) => {

    character = gltf.scene;

    character.scale.set(
      1.8,
      1.8,
      1.8
    );

    character.position.set(
      1.0,
      -1.55,
      0
    );

    character.rotation.y = Math.PI;

    character.traverse((object) => {

      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }

    });

    scene.add(character);

    /* Animation system */

    if (gltf.animations.length) {

      mixer = new THREE.AnimationMixer(character);

      const idle = THREE.AnimationClip.findByName(
        gltf.animations,
        "Idle"
      );

      const walk = THREE.AnimationClip.findByName(
        gltf.animations,
        "Walk"
      );

      const run = THREE.AnimationClip.findByName(
        gltf.animations,
        "Run"
      );

      if (walk) {
        mixer
          .clipAction(walk)
          .play();
      } else {
        mixer
          .clipAction(gltf.animations[0])
          .play();
      }

    }

  },

  undefined,

  (error) => {
    console.error(
      "Character loading failed:",
      error
    );
  }
);

/* =========================
   MOUSE
========================= */

let mouseX = 0;
let mouseY = 0;

window.addEventListener(
  "mousemove",
  (event) => {

    mouseX =
      (event.clientX / window.innerWidth) - 0.5;

    mouseY =
      (event.clientY / window.innerHeight) - 0.5;

  }
);

/* =========================
   SCROLL
========================= */

let scrollProgress = 0;

window.addEventListener(
  "scroll",
  () => {

    scrollProgress =
      window.scrollY /
      window.innerHeight;

  }
);

/* =========================
   ANIMATION LOOP
========================= */

function animate() {

  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  if (mixer) {
    mixer.update(delta);
  }

  if (character) {

    /* subtle breathing / movement */

    character.position.y =
      -1.55 +
      Math.sin(time * 2) * 0.01;

    /* mouse interaction */

    character.rotation.y =
      Math.PI +
      mouseX * 0.25;

    /* scroll movement */

    character.position.x =
      1 -
      scrollProgress * 0.8;

  }

  ring.rotation.z =
    time * 0.3;

  particles.rotation.y =
    time * 0.012;

  /* cinematic camera */

  camera.position.x +=
    (mouseX * 0.6 -
      camera.position.x) * 0.025;

  camera.position.y +=
    (1.8 -
      mouseY * 0.35 -
      camera.position.y) * 0.025;

  camera.position.z =
    7 -
    scrollProgress * 1.3;

  renderer.render(
    scene,
    camera
  );
}

animate();

/* =========================
   RESIZE
========================= */

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);========================= */

const ambientLight = new THREE.AmbientLight(
  0xffffff,
  0.35
);

scene.add(ambientLight);

const redLight = new THREE.PointLight(
  0xff1111,
  18,
  18
);

redLight.position.set(3, 3, 3);

scene.add(redLight);

const redLight2 = new THREE.PointLight(
  0x660000,
  12,
  15
);

redLight2.position.set(-4, 1, -3);

scene.add(redLight2);

/* =========================
   FLOOR
========================= */

const floorGeometry =
  new THREE.PlaneGeometry(30, 30);

const floorMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x050505,
    metalness: 0.8,
    roughness: 0.35
  });

const floor =
  new THREE.Mesh(
    floorGeometry,
    floorMaterial
  );

floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.5;

floor.receiveShadow = true;

scene.add(floor);

/* =========================
   GRID
========================= */

const grid = new THREE.GridHelper(
  30,
  30,
  0x330000,
  0x160000
);

grid.position.y = -1.48;

scene.add(grid);

/* =========================
   FLOATING CUBES
========================= */

const objects = [];

const cubeGeometry =
  new THREE.BoxGeometry(
    0.35,
    0.35,
    0.35
  );

for (let i = 0; i < 45; i++) {

  const material =
    new THREE.MeshStandardMaterial({
      color:
        Math.random() > 0.75
          ? 0xff2020
          : 0x222222,

      emissive:
        Math.random() > 0.75
          ? 0x550000
          : 0x000000,

      metalness: 0.8,
      roughness: 0.3
    });

  const cube =
    new THREE.Mesh(
      cubeGeometry,
      material
    );

  cube.position.set(
    (Math.random() - 0.5) * 16,
    (Math.random() - 0.5) * 8,
    (Math.random() - 0.5) * 12
  );

  cube.rotation.set(
    Math.random(),
    Math.random(),
    Math.random()
  );

  scene.add(cube);

  objects.push(cube);
}

/* =========================
   FUTURISTIC RINGS
========================= */

const ringGeometry =
  new THREE.TorusGeometry(
    2.2,
    0.025,
    16,
    100
  );

const ringMaterial =
  new THREE.MeshBasicMaterial({
    color: 0xff2020
  });

const ring =
  new THREE.Mesh(
    ringGeometry,
    ringMaterial
  );

ring.position.set(
  3,
  1,
  -3
);

ring.rotation.x = Math.PI / 2;

scene.add(ring);

/* =========================
   PARTICLES
========================= */

const particleCount = 1200;

const particleGeometry =
  new THREE.BufferGeometry();

const particlePositions =
  new Float32Array(
    particleCount * 3
  );

for (let i = 0; i < particleCount * 3; i += 3) {

  particlePositions[i] =
    (Math.random() - 0.5) * 25;

  particlePositions[i + 1] =
    (Math.random() - 0.5) * 15;

  particlePositions[i + 2] =
    (Math.random() - 0.5) * 20;
}

particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(
    particlePositions,
    3
  )
);

const particleMaterial =
  new THREE.PointsMaterial({
    color: 0xff3333,
    size: 0.025,
    transparent: true,
    opacity: 0.8
  });

const particles =
  new THREE.Points(
    particleGeometry,
    particleMaterial
  );

scene.add(particles);

/* =========================
   MOUSE MOVEMENT
========================= */

let mouseX = 0;
let mouseY = 0;

window.addEventListener(
  "mousemove",
  (event) => {

    mouseX =
      (event.clientX /
        window.innerWidth -
        0.5);

    mouseY =
      (event.clientY /
        window.innerHeight -
        0.5);

  }
);

/* =========================
   SCROLL CAMERA
========================= */

let scrollY = 0;

window.addEventListener(
  "scroll",
  () => {

    scrollY =
      window.scrollY /
      window.innerHeight;

  }
);

/* =========================
   ANIMATION
========================= */

const clock = new THREE.Clock();

function animate() {

  requestAnimationFrame(
    animate
  );

  const time =
    clock.getElapsedTime();

  /* Floating objects */

  objects.forEach(
    (object, index) => {

      object.rotation.x += 0.002;

      object.rotation.y += 0.003;

      object.position.y +=
        Math.sin(
          time + index
        ) * 0.0008;

    }
  );

  /* Ring */

  ring.rotation.z =
    time * 0.25;

  ring.rotation.y =
    time * 0.15;

  /* Particles */

  particles.rotation.y =
    time * 0.015;

  /* Camera mouse movement */

  camera.position.x +=
    (mouseX * 0.8 -
      camera.position.x) * 0.025;

  camera.position.y +=
    (1.5 -
      mouseY * 0.5 -
      camera.position.y) * 0.025;

  /* Scroll camera */

  camera.position.z =
    8 - scrollY * 1.2;

  camera.rotation.y =
    -mouseX * 0.08;

  renderer.render(
    scene,
    camera
  );
}

animate();

/* =========================
   RESIZE
========================= */

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);    orb.style.filter =
      `brightness(${1 + scrollY * 0.0003})`;

    orb.style.transform =
      `translateY(${scrollY * 0.08}px)
       rotate(${rotation}deg)`;
  }

  // Reveal cards
  document.querySelectorAll(".card").forEach((card) => {

    const rect = card.getBoundingClientRect();

    if (rect.top < window.innerHeight * 0.85) {
      card.style.opacity = "1";
      card.style.transform = "translateX(0)";
    }
  });

});

// Card initial state
document.querySelectorAll(".card").forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateX(-40px)";
  card.style.transition =
    "opacity 0.8s ease, transform 0.8s ease";
});

// Smooth navigation
document.querySelectorAll("nav a").forEach((link) => {

  link.addEventListener("click", (event) => {

    const target = document.querySelector(
      link.getAttribute("href")
    );

    if (target) {
      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth"
      });
    }

  });

});

// Hero entrance
window.addEventListener("load", () => {

  const title = document.querySelector(".hero h1");
  const small = document.querySelector(".hero .small");
  const paragraph = document.querySelector(".hero p");

  if (small) {
    small.style.opacity = "0";
    small.style.transform = "translateY(20px)";

    setTimeout(() => {
      small.style.transition = "1s";
      small.style.opacity = "1";
      small.style.transform = "translateY(0)";
    }, 300);
  }

  if (title) {
    title.style.opacity = "0";
    title.style.transform = "translateY(50px)";

    setTimeout(() => {
      title.style.transition =
        "1.2s cubic-bezier(.2,.8,.2,1)";
      title.style.opacity = "1";
      title.style.transform = "translateY(0)";
    }, 500);
  }

  if (paragraph) {
    paragraph.style.opacity = "0";

    setTimeout(() => {
      paragraph.style.transition = "1s";
      paragraph.style.opacity = "1";
    }, 900);
  }

});

// Mobile touch support
document.addEventListener("touchmove", () => {
  document.body.classList.add("touching");
});

// Console
console.log(
  "YASH. — Cinematic Portfolio initialized."
);
