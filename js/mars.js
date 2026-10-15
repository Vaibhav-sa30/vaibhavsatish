/**
 * Realistic 3D Mars Planet
 * Light-theme editorial aesthetic for Vaibhav Satish Portfolio
 * 
 * Features:
 * - Real 3D WebGL sphere rendering with equirectangular NASA Mars surface texture
 * - Natural 25.19° axial tilt with continuous, smooth planetary rotation (~105s per revolution)
 * - True astronomical spherical geometry with zero flat clipping edges
 * - Soft directional and ambient lighting tuned for #faf9f6 light theme
 * - Dynamically scaled (420px - 540px desktop, responsive on smaller screens)
 * - Anchored in top-right corner partially extending beyond viewport edges
 * - Respects prefers-reduced-motion and pauses when tab is hidden
 * - Zero impact on layout interactions (pointer-events: none)
 */

(function () {
  'use strict';

  function initMars() {
    const canvas = document.getElementById('mars-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // Three.js Scene
    const scene = new THREE.Scene();

    // Telephoto Perspective Camera
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
    const cameraDist = 8.0;
    camera.position.set(0, 0, cameraDist);

    // WebGL Renderer with full alpha transparency
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.warn('WebGL not available for 3D Mars:', e);
      return;
    }

    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    // Group for Mars position and axial tilt
    const marsGroup = new THREE.Group();
    // Mars axial tilt: 25.19 degrees
    marsGroup.rotation.z = THREE.MathUtils.degToRad(25.19);
    // Subtle tilt toward viewer so northern polar cap and surface features are prominent
    marsGroup.rotation.x = THREE.MathUtils.degToRad(7);
    scene.add(marsGroup);

    // High polygon count sphere geometry for clean round curvature
    const geometry = new THREE.SphereGeometry(1.0, 64, 64);

    // Matte planetary material preserving authentic texture details
    const material = new THREE.MeshStandardMaterial({
      roughness: 0.92,
      metalness: 0.02
    });

    // Fallback procedural texture in case of local file:// CORS restrictions
    function createProceduralMarsTexture() {
      const cvs = document.createElement('canvas');
      cvs.width = 1024;
      cvs.height = 512;
      const ctx = cvs.getContext('2d');
      if (!ctx) return null;

      // Base Martian red-orange surface gradient
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#f2ede5'); // North polar ice cap
      grad.addColorStop(0.12, '#cf6230');
      grad.addColorStop(0.48, '#bd4e22');
      grad.addColorStop(0.85, '#a43d18');
      grad.addColorStop(1, '#f2ede5'); // South polar ice cap
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // Dark albedo markings (Syrtis Major, Sinus Sabaeus, Acidalia)
      ctx.fillStyle = 'rgba(56, 24, 15, 0.45)';
      for (let i = 0; i < 48; i++) {
        const x = (Math.sin(i * 77) * 0.5 + 0.5) * 1024;
        const y = 130 + (Math.cos(i * 29) * 0.5 + 0.5) * 240;
        const rx = 35 + (Math.sin(i * 13) * 0.5 + 0.5) * 95;
        const ry = 18 + (Math.cos(i * 47) * 0.5 + 0.5) * 48;
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, i * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }

      // Highlands and dust banding
      ctx.fillStyle = 'rgba(230, 135, 72, 0.2)';
      for (let y = 90; y < 430; y += 14) {
        ctx.fillRect(0, y, 1024, 5);
      }

      const canvasTex = new THREE.CanvasTexture(cvs);
      canvasTex.wrapS = THREE.RepeatWrapping;
      canvasTex.wrapT = THREE.ClampToEdgeWrapping;
      return canvasTex;
    }

    // Load NASA Mars surface texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      'assets/images/mars.jpg',
      function (texture) {
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.generateMipmaps = true;
        material.map = texture;
        material.bumpMap = texture;
        material.bumpScale = 0.025;
        material.needsUpdate = true;
        render();
      },
      undefined,
      function (err) {
        console.warn('Could not load mars.jpg directly, using high-quality procedural texture fallback:', err);
        const fallback = createProceduralMarsTexture();
        if (fallback) {
          material.map = fallback;
          material.bumpMap = fallback;
          material.bumpScale = 0.02;
          material.needsUpdate = true;
          render();
        }
      }
    );

    const marsMesh = new THREE.Mesh(geometry, material);
    marsGroup.add(marsMesh);

    // Directional sunlight - soft, diffused illumination from upper-left
    const sunLight = new THREE.DirectionalLight(0xfff8ee, 1.10);
    sunLight.position.set(-2.8, 2.2, 3.8);
    scene.add(sunLight);

    // Warm ambient light tuned to harmonize with editorial light theme (#faf9f6)
    // Ensures shadows remain soft, airy, and translucent without overexposure
    const ambientLight = new THREE.AmbientLight(0xfcf7f0, 0.85);
    scene.add(ambientLight);

    // Subtle back rim fill light for realistic planetary limb definition
    const rimLight = new THREE.DirectionalLight(0xf0e2d2, 0.30);
    rimLight.position.set(3.5, -2.0, -1.5);
    scene.add(rimLight);

    // Layout and positioning function:
    // Dynamically scales Mars so it covers approximately half the screen width
    function updatePlanetPlacement() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Update camera aspect
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);

      // Frustum height at object distance (z = 0)
      const vFovRad = (camera.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(vFovRad / 2) * cameraDist;
      const visibleWidth = visibleHeight * camera.aspect;

      // Target pixel diameter:
      // Mars covers approximately half the screen width from the right viewport edge
      let targetPixelDiameter;
      if (width >= 1200) {
        targetPixelDiameter = Math.max(920, width * 0.78);
      } else if (width >= 768) {
        targetPixelDiameter = Math.max(680, width * 0.82);
      } else {
        targetPixelDiameter = Math.max(460, width * 0.96);
      }

      // Convert target pixel diameter to 3D sphere radius (scale)
      const targetRadius3D = (targetPixelDiameter / (2 * height)) * visibleHeight;
      marsGroup.scale.set(targetRadius3D, targetRadius3D, targetRadius3D);

      // Top-right coordinates in 3D space
      const halfWidth = visibleWidth / 2;
      const halfHeight = visibleHeight / 2;

      // Anchor Mars in the top-right corner such that the visible disc
      // reaches approximately half the screen width (near the central axis)
      const edgeOffsetX = 0.36; // center distance from right viewport boundary
      const edgeOffsetY = 0.26; // center distance from top viewport boundary
      marsGroup.position.x = halfWidth - targetRadius3D * edgeOffsetX;
      marsGroup.position.y = halfHeight - targetRadius3D * edgeOffsetY;
    }

    // Call once initially
    updatePlanetPlacement();

    // Rotation parameters: 1 full revolution (2*PI) every 105 seconds
    const rotationSpeed = (2 * Math.PI) / 105;
    const clock = new THREE.Clock();

    let animationId = null;
    let isRunning = false;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function render() {
      renderer.render(scene, camera);
    }

    function animate() {
      if (!isRunning) return;
      animationId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      // Cap delta to prevent huge jumps if tab was throttled or unfocused
      const safeDelta = Math.min(delta, 0.1);

      // Rotate planet smoothly around its polar axis
      marsMesh.rotation.y += rotationSpeed * safeDelta;

      // Keep rotation value bounded within [0, 2PI)
      if (marsMesh.rotation.y >= Math.PI * 2) {
        marsMesh.rotation.y -= Math.PI * 2;
      }

      render();
    }

    function startAnimation() {
      if (motionQuery.matches) {
        // Respect reduced motion - render single static frame without rotation
        render();
        return;
      }
      if (!isRunning) {
        isRunning = true;
        clock.getDelta(); // reset delta timer
        animate();
      }
    }

    function stopAnimation() {
      isRunning = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }

    // Responsive resize handler
    window.addEventListener('resize', function () {
      updatePlanetPlacement();
      render();
    }, { passive: true });

    // Accessibility: listen for reduced motion preference changes
    motionQuery.addEventListener('change', function (e) {
      if (e.matches) {
        stopAnimation();
        render();
      } else {
        startAnimation();
      }
    });

    // Performance: pause rendering when tab is hidden to save CPU/GPU cycles
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    });

    startAnimation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMars);
  } else {
    initMars();
  }
})();
