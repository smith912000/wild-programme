/* The WILD mark in three dimensions: two indigo rings of the vesica and the gold
   aperture between them, lit from inside, with a seeded field of stars behind.
   A pure function of time: render(t, tiltX, tiltY) paints frame t, so the same code
   drives the landing hero (live) and the intro films (rendered frame by frame).
   Needs an import map for "three" and "three/addons/" (see index.html). */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const INDIGO = 0x6349b8, INDIGO_2 = 0x8a6fe0, GOLD = 0xe9c766, BG = 0x050309;

export function createMark(canvas, opts = {}) {
  const dpr = Math.min(opts.dpr || window.devicePixelRatio || 1, 2);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: !!opts.film });
  renderer.setPixelRatio(dpr);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.setClearColor(BG, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  const Z = opts.distance || 9;
  camera.position.set(0, 0, Z);

  // the rings: polished indigo, lit by a soft key and by the aperture itself
  const mark = new THREE.Group();
  scene.add(mark);
  const ringMat = new THREE.MeshPhysicalMaterial({ color: INDIGO, metalness: 0.55, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.2, emissive: INDIGO, emissiveIntensity: 0.12 });
  const ringGeo = new THREE.TorusGeometry(1.36, 0.075, 48, 240);
  const top = new THREE.Mesh(ringGeo, ringMat), bottom = new THREE.Mesh(ringGeo, ringMat);
  top.position.y = 0.64; bottom.position.y = -0.64;
  mark.add(top, bottom);

  // the aperture: a short gold rod that carries the bloom
  const slitMat = new THREE.MeshBasicMaterial({ color: GOLD });
  slitMat.color.multiplyScalar(2.2); // above 1 so only the slit blooms
  const slit = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.62, 8, 24), slitMat);
  mark.add(slit);
  const inner = new THREE.PointLight(GOLD, 6, 6, 1.6);
  mark.add(inner);

  scene.add(new THREE.HemisphereLight(INDIGO_2, BG, 0.6));
  const key = new THREE.DirectionalLight(0xf4f1ed, 1.4);
  key.position.set(-3, 4, 5);
  scene.add(key);

  // stars: seeded, so every visit and every render shows the same sky
  let seed = 20261014;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const N = opts.stars ?? 500, pos = new Float32Array(N * 3), tw = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const r = 6 + rnd() * 14, a = rnd() * Math.PI * 2, z = -4 - rnd() * 18;
    pos.set([Math.cos(a) * r, Math.sin(a) * r * 0.7, z], i * 3);
    tw[i] = rnd() * 6.28;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xf4f1ed, size: 0.045, transparent: true, opacity: 0.7, depthWrite: false });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.9, 0.55, 0.92);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  function resize(w, h) {
    renderer.setSize(w, h, false);
    composer.setPixelRatio(dpr);
    composer.setSize(w, h);
    camera.aspect = w / h;
    // keep the mark the same visual size on tall screens
    camera.fov = w < h ? 32 * Math.min(1.6, h / w * 0.75) : 32;
    camera.updateProjectionMatrix();
  }

  // with opts.loop (seconds), every rate is rounded to whole cycles so the film loops seamlessly
  const L = opts.loop, rate = r => L ? Math.max(1, Math.round(r * L / (2 * Math.PI))) * 2 * Math.PI / L : r;
  const SWAY = rate(0.35), BREATH = rate(0.5), PULSE = rate(1.1), ROLL = rate(0.21), TWINKLE = rate(0.7);

  // t in seconds. tiltX/tiltY in -1..1 (pointer lean, already sprung by the caller).
  function render(t, tiltX = 0, tiltY = 0) {
    const turn = Math.sin(t * SWAY) * 0.55;           // slow sway, never a full spin
    mark.rotation.set(0.12 + tiltY * 0.18, turn + tiltX * 0.25, Math.sin(t * ROLL) * 0.04);
    top.rotation.y = Math.sin(t * BREATH) * 0.08;      // the rings breathe against each other
    bottom.rotation.y = -top.rotation.y;
    const pulse = 0.5 + 0.5 * Math.sin(t * PULSE);
    inner.intensity = 4 + pulse * 3;
    bloom.strength = 0.75 + pulse * 0.3;
    stars.rotation.z = L ? Math.sin(t * SWAY) * 0.03 : t * 0.01;
    starMat.opacity = 0.55 + 0.15 * Math.sin(t * TWINKLE);
    camera.position.set(tiltX * 0.3, tiltY * 0.2, Z);
    camera.lookAt(0, 0, 0);
    composer.render();
  }

  return { render, resize, renderer };
}
