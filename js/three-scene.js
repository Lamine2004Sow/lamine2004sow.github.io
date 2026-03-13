import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { lerp, isMobile, getMousePosition } from './utils.js';

/* ============================================
   HERO NEURAL NETWORK SCENE
   ============================================ */

const COLORS = {
  accent: 0x00ff88,
  accentDim: 0x00cc6a,
  blue: 0x00b4d8,
  bg: 0x0a0a0a,
  node: 0x00ff88,
  connection: 0x00ff88,
  particle: 0x00ffaa,
};

class NeuralNetworkScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.clock = new THREE.Clock();
    this.nodes = [];
    this.connections = [];
    this.isDestroyed = false;
    this.mobile = isMobile();

    this._init();
  }

  _init() {
    this._createScene();
    this._createCamera();
    this._createRenderer();
    this._createLights();
    this._createNeuralNetwork();
    this._createBackgroundParticles();
    if (!this.mobile) this._createPostProcessing();
    this._addEventListeners();
    this._animate();
  }

  _createScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(COLORS.bg, 0.035);
  }

  _createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      60,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      200
    );
    this.camera.position.set(0, 0, 30);
  }

  _createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: !this.mobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
  }

  _createLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.15);
    this.scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xffffff, 0.5);
    dir.position.set(10, 10, 10);
    this.scene.add(dir);

    const point1 = new THREE.PointLight(COLORS.accent, 2, 60);
    point1.position.set(-15, 10, 5);
    this.scene.add(point1);

    const point2 = new THREE.PointLight(COLORS.blue, 1.5, 50);
    point2.position.set(15, -10, 5);
    this.scene.add(point2);
  }

  _createNeuralNetwork() {
    const layers = this.mobile ? [4, 6, 8, 6, 4] : [6, 10, 14, 10, 6];
    const layerSpacing = 7;
    const nodeSpacing = 3.5;

    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: COLORS.node,
      emissive: COLORS.node,
      emissiveIntensity: 0.8,
      metalness: 0.3,
      roughness: 0.4,
    });

    const nodeGeometry = new THREE.IcosahedronGeometry(0.25, 2);

    this.nodeGroup = new THREE.Group();

    layers.forEach((count, layerIdx) => {
      const x = (layerIdx - (layers.length - 1) / 2) * layerSpacing;
      for (let i = 0; i < count; i++) {
        const y = (i - (count - 1) / 2) * nodeSpacing;
        const z = (Math.random() - 0.5) * 4;
        const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
        mesh.position.set(x, y, z);
        mesh.userData = {
          baseY: y,
          baseZ: z,
          layer: layerIdx,
          index: i,
          phase: Math.random() * Math.PI * 2,
          speed: 0.3 + Math.random() * 0.5,
        };
        this.nodes.push(mesh);
        this.nodeGroup.add(mesh);
      }
    });

    this.scene.add(this.nodeGroup);

    this._createConnections(layers);
    this._createDataParticles();
  }

  _createConnections(layers) {
    const positions = [];
    const colors = [];
    const color = new THREE.Color(COLORS.connection);

    let offset = 0;
    for (let l = 0; l < layers.length - 1; l++) {
      const currentLayerNodes = this.nodes.filter((n) => n.userData.layer === l);
      const nextLayerNodes = this.nodes.filter((n) => n.userData.layer === l + 1);

      for (const cNode of currentLayerNodes) {
        const connectionCount = this.mobile ? 2 : 3;
        const targets = [...nextLayerNodes]
          .sort(() => Math.random() - 0.5)
          .slice(0, connectionCount);

        for (const nNode of targets) {
          positions.push(
            cNode.position.x, cNode.position.y, cNode.position.z,
            nNode.position.x, nNode.position.y, nNode.position.z
          );
          colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
          this.connections.push({
            from: cNode.position.clone(),
            to: nNode.position.clone(),
          });
        }
      }
      offset += layers[l];
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });

    this.connectionMesh = new THREE.LineSegments(geometry, material);
    this.scene.add(this.connectionMesh);
  }

  _createDataParticles() {
    const count = this.mobile ? 60 : 150;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    this.dataParticlesData = [];

    for (let i = 0; i < count; i++) {
      const conn = this.connections[Math.floor(Math.random() * this.connections.length)];
      const t = Math.random();
      positions[i * 3] = lerp(conn.from.x, conn.to.x, t);
      positions[i * 3 + 1] = lerp(conn.from.y, conn.to.y, t);
      positions[i * 3 + 2] = lerp(conn.from.z, conn.to.z, t);
      sizes[i] = 1.5 + Math.random() * 2;

      this.dataParticlesData.push({
        connection: conn,
        t,
        speed: 0.002 + Math.random() * 0.006,
      });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      color: COLORS.particle,
      size: 0.15,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    this.dataParticles = new THREE.Points(geometry, material);
    this.scene.add(this.dataParticles);
  }

  _createBackgroundParticles() {
    const count = this.mobile ? 200 : 600;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.06,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    this.bgParticles = new THREE.Points(geometry, material);
    this.scene.add(this.bgParticles);
  }

  _createPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.canvas.clientWidth, this.canvas.clientHeight),
      1.2,
      0.4,
      0.2
    );
    this.composer.addPass(bloomPass);
    this.bloomPass = bloomPass;
  }

  _addEventListeners() {
    this._onMouseMove = (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    this._onResize = () => {
      const w = this.canvas.clientWidth;
      const h = this.canvas.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      if (this.composer) {
        this.composer.setSize(w, h);
      }
    };

    window.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('resize', this._onResize);
  }

  _animate() {
    if (this.isDestroyed) return;

    const time = this.clock.getElapsedTime();

    this.mouse.x = lerp(this.mouse.x, this.mouse.targetX, 0.05);
    this.mouse.y = lerp(this.mouse.y, this.mouse.targetY, 0.05);

    if (this.nodeGroup) {
      this.nodeGroup.rotation.y = time * 0.08 + this.mouse.x * 0.3;
      this.nodeGroup.rotation.x = this.mouse.y * 0.15;
    }

    for (const node of this.nodes) {
      const { baseY, baseZ, phase, speed } = node.userData;
      node.position.y = baseY + Math.sin(time * speed + phase) * 0.3;
      node.position.z = baseZ + Math.cos(time * speed * 0.7 + phase) * 0.2;

      const pulse = 0.5 + Math.sin(time * 2 + phase) * 0.3;
      node.material.emissiveIntensity = pulse;
    }

    if (this.connectionMesh) {
      this.connectionMesh.rotation.y = this.nodeGroup.rotation.y;
      this.connectionMesh.rotation.x = this.nodeGroup.rotation.x;
    }

    const dpPos = this.dataParticles.geometry.attributes.position;
    for (let i = 0; i < this.dataParticlesData.length; i++) {
      const p = this.dataParticlesData[i];
      p.t += p.speed;
      if (p.t > 1) {
        p.t = 0;
        const conn = this.connections[Math.floor(Math.random() * this.connections.length)];
        p.connection = conn;
      }
      dpPos.array[i * 3] = lerp(p.connection.from.x, p.connection.to.x, p.t);
      dpPos.array[i * 3 + 1] = lerp(p.connection.from.y, p.connection.to.y, p.t);
      dpPos.array[i * 3 + 2] = lerp(p.connection.from.z, p.connection.to.z, p.t);
    }
    dpPos.needsUpdate = true;
    this.dataParticles.rotation.y = this.nodeGroup.rotation.y;
    this.dataParticles.rotation.x = this.nodeGroup.rotation.x;

    if (this.bgParticles) {
      this.bgParticles.rotation.y = time * 0.02;
      this.bgParticles.rotation.x = time * 0.01;
    }

    if (this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }

    this.rafId = requestAnimationFrame(() => this._animate());
  }

  destroy() {
    this.isDestroyed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('resize', this._onResize);

    this.scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    });

    this.renderer.dispose();
    if (this.composer) this.composer.dispose();
  }
}

/* ============================================
   ROBOT 3D MODEL (about section)
   ============================================ */

class RobotScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();
    this.isDestroyed = false;
    this.model = null;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    this._init();
  }

  _init() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      50,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      100
    );
    this.camera.position.set(2, 1, 7);
    this.camera.lookAt(1.5, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xffffff, 1.5);
    dir.position.set(5, 5, 5);
    this.scene.add(dir);

    const accent = new THREE.PointLight(COLORS.accent, 2, 20);
    accent.position.set(-3, 2, 3);
    this.scene.add(accent);

    const blue = new THREE.PointLight(COLORS.blue, 1.5, 20);
    blue.position.set(3, -1, 2);
    this.scene.add(blue);

    this._loadModel();
    this._addEventListeners();
    this._animate();
  }

  _loadModel() {
    const loader = new GLTFLoader();

    loader.load(
      '/assets/robot-3d/robot_playground.glb',
      (gltf) => {
        this.model = gltf.scene;
        const box = new THREE.Box3().setFromObject(this.model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 6 / maxDim;
        this.model.scale.setScalar(scale);
        this.model.position.sub(center.multiplyScalar(scale));
        this.model.position.x += 2;
        this.model.position.y -= 0.5;

        this.scene.add(this.model);
      },
    );
  }

  _addEventListeners() {
    this._onMouseMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      this.mouse.targetX = (e.clientX - cx) / rect.width;
      this.mouse.targetY = (e.clientY - cy) / rect.height;
    };

    this._onResize = () => {
      const w = this.canvas.clientWidth;
      const h = this.canvas.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };

    window.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('resize', this._onResize);
  }

  _animate() {
    if (this.isDestroyed) return;

    const time = this.clock.getElapsedTime();

    this.mouse.x = lerp(this.mouse.x, this.mouse.targetX, 0.05);
    this.mouse.y = lerp(this.mouse.y, this.mouse.targetY, 0.05);

    if (this.model) {
      this.model.rotation.y = time * 0.3 + this.mouse.x * 0.5;
      this.model.position.y = -0.3 + Math.sin(time * 0.8) * 0.1;
    }

    this.renderer.render(this.scene, this.camera);
    this.rafId = requestAnimationFrame(() => this._animate());
  }

  destroy() {
    this.isDestroyed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('resize', this._onResize);
    this.scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    });
    this.renderer.dispose();
  }
}

/* ============================================
   CONTACT PARTICLES SCENE
   ============================================ */

class ContactParticleScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();
    this.isDestroyed = false;
    this._init();
  }

  _init() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      60,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      100
    );
    this.camera.position.z = 20;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      alpha: true,
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const count = isMobile() ? 100 : 300;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: COLORS.accent,
      size: 0.08,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);

    this._onResize = () => {
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    };
    window.addEventListener('resize', this._onResize);

    this._animate();
  }

  _animate() {
    if (this.isDestroyed) return;
    const t = this.clock.getElapsedTime();
    this.particles.rotation.y = t * 0.03;
    this.particles.rotation.x = t * 0.01;
    this.renderer.render(this.scene, this.camera);
    this.rafId = requestAnimationFrame(() => this._animate());
  }

  destroy() {
    this.isDestroyed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this._onResize);
    this.scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    });
    this.renderer.dispose();
  }
}

export { NeuralNetworkScene, RobotScene, ContactParticleScene };
