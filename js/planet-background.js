/** Random rotating Solar System planet for the portfolio homepage. */
(function () {
  'use strict';

  const planets = [
    { id: 'mercury', tilt: 0.03, stops: [[0, '#514f4d'], [0.2, '#89847c'], [0.45, '#555350'], [0.7, '#a09b92'], [1, '#565451']], surface: 'craters' },
    { id: 'venus', tilt: 177.4, stops: [[0, '#c98e40'], [0.2, '#e5bf76'], [0.42, '#b87937'], [0.68, '#e2b968'], [1, '#bd8039']], surface: 'clouds' },
    { id: 'mars', tilt: 25.19, stops: [[0, '#d5895b'], [0.45, '#b95024'], [1, '#833b24']], surface: 'craters' },
    { id: 'jupiter', tilt: 3.1, rotation: 1, stops: [[0, '#ead3a8'], [0.09, '#b46e3e'], [0.18, '#efd8ad'], [0.28, '#d49a61'], [0.38, '#f1ddba'], [0.48, '#a96038'], [0.59, '#e8c89b'], [0.7, '#c5814e'], [0.8, '#f0d9af'], [0.91, '#b77348'], [1, '#e9d2a9']], surface: 'bands', storm: '#a84e35' },
    { id: 'saturn', tilt: 26.7, rotation: 1, stops: [[0, '#d8c69f'], [0.13, '#b99b6a'], [0.24, '#ead9b1'], [0.37, '#c5aa78'], [0.5, '#eee0bd'], [0.62, '#cbb487'], [0.76, '#e5d2a7'], [0.88, '#bda072'], [1, '#decda6']], surface: 'bands', rings: true },
    { id: 'uranus', tilt: 97.8, rotation: 1, stops: [[0, '#78b9bf'], [0.2, '#a6d4d2'], [0.42, '#68a9b5'], [0.68, '#b4d9d4'], [1, '#78b9bf']], surface: 'soft-bands' },
    { id: 'neptune', tilt: 28.3, rotation: 1, stops: [[0, '#214e9b'], [0.18, '#3678c7'], [0.32, '#173f8a'], [0.5, '#4b91d0'], [0.68, '#1b4d9b'], [0.84, '#3477bd'], [1, '#173f8a']], surface: 'bands', storm: '#75a8d3' }
  ];

  function initPlanetBackground() {
    const canvas = document.getElementById('planet-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    let previousPlanet = null;
    try { previousPlanet = sessionStorage.getItem('portfolio-background-planet'); } catch (_) { /* Storage may be disabled. */ }
    const choices = planets.filter((candidate) => candidate.id !== previousPlanet);
    const planet = choices[Math.floor(Math.random() * choices.length)];
    try { sessionStorage.setItem('portfolio-background-planet', planet.id); } catch (_) { /* Random selection still works without storage. */ }
    canvas.dataset.planet = planet.id;
    document.documentElement.dataset.backgroundPlanet = planet.id;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
    const cameraDist = 8;
    camera.position.set(0, 0, cameraDist);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch (error) {
      console.warn('WebGL is unavailable for the homepage planet background:', error);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const planetGroup = new THREE.Group();
    planetGroup.rotation.z = THREE.MathUtils.degToRad(planet.tilt);
    planetGroup.rotation.x = THREE.MathUtils.degToRad(7);
    scene.add(planetGroup);

    const sphereGeometry = new THREE.SphereGeometry(1, 80, 80);
    const material = new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0.01 });
    const planetMesh = new THREE.Mesh(sphereGeometry, material);
    planetGroup.add(planetMesh);

    function makeTexture() {
      const width = 1024;
      const height = 512;
      const textureCanvas = document.createElement('canvas');
      textureCanvas.width = width;
      textureCanvas.height = height;
      const context = textureCanvas.getContext('2d');
      if (!context) return null;

      let seed = planet.id.split('').reduce((total, character) => total + character.charCodeAt(0), 0) * 7919;
      const random = function () {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
      };

      const base = context.createLinearGradient(0, 0, 0, height);
      planet.stops.forEach(([position, color]) => base.addColorStop(position, color));
      context.fillStyle = base;
      context.fillRect(0, 0, width, height);

      if (planet.surface === 'bands' || planet.surface === 'soft-bands') {
        const bandCount = planet.surface === 'bands' ? 100 : 50;
        for (let i = 0; i < bandCount; i++) {
          const y = random() * height;
          const bandHeight = 1 + random() * (planet.surface === 'bands' ? 10 : 5);
          const opacity = planet.surface === 'bands' ? 0.035 + random() * 0.09 : 0.025 + random() * 0.045;
          context.fillStyle = random() > 0.5
            ? `rgba(255,245,220,${opacity})`
            : `rgba(20,35,60,${opacity})`;
          context.beginPath();
          context.moveTo(0, y);
          context.bezierCurveTo(width * 0.3, y - 8, width * 0.68, y + 9, width, y + (random() - 0.5) * 18);
          context.lineTo(width, y + bandHeight);
          context.bezierCurveTo(width * 0.65, y + bandHeight + 8, width * 0.28, y + bandHeight - 6, 0, y + bandHeight);
          context.closePath();
          context.fill();
        }
      }

      if (planet.surface === 'clouds') {
        for (let i = 0; i < 140; i++) {
          const x = random() * width;
          const y = random() * height;
          const radiusX = 20 + random() * 130;
          const radiusY = 3 + random() * 18;
          context.fillStyle = random() > 0.5 ? 'rgba(255,235,174,0.11)' : 'rgba(126,74,35,0.08)';
          context.beginPath();
          context.ellipse(x, y, radiusX, radiusY, (random() - 0.5) * 0.15, 0, Math.PI * 2);
          context.fill();
        }
      }

      if (planet.surface === 'craters') {
        const count = planet.id === 'mercury' ? 260 : 70;
        for (let i = 0; i < count; i++) {
          const x = random() * width;
          const y = 20 + random() * (height - 40);
          const radius = planet.id === 'mercury' ? 3 + random() * 24 : 5 + random() * 34;
          context.fillStyle = planet.id === 'mercury' ? 'rgba(25,24,23,0.20)' : 'rgba(80,31,20,0.16)';
          context.beginPath();
          context.ellipse(x, y, radius * 1.5, radius * 0.75, random() * 0.25, 0, Math.PI * 2);
          context.fill();
          context.strokeStyle = planet.id === 'mercury' ? 'rgba(225,218,207,0.20)' : 'rgba(255,190,145,0.13)';
          context.lineWidth = 1 + random() * 2;
          context.stroke();
        }
      }

      if (planet.storm) {
        const x = planet.id === 'jupiter' ? width * 0.68 : width * 0.34;
        const y = planet.id === 'jupiter' ? height * 0.57 : height * 0.38;
        context.fillStyle = planet.storm;
        context.beginPath();
        context.ellipse(x, y, 58, 25, -0.12, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = 'rgba(255,235,210,0.24)';
        context.lineWidth = 3;
        context.beginPath();
        context.ellipse(x, y, 42, 15, -0.12, 0, Math.PI * 2);
        context.stroke();
      }

      const texture = new THREE.CanvasTexture(textureCanvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return texture;
    }

    function applyTexture(texture, withBump) {
      material.map = texture;
      if (withBump) {
        material.bumpMap = texture;
        material.bumpScale = 0.018;
      }
      material.needsUpdate = true;
      render();
    }

    if (planet.id === 'mars') {
      new THREE.TextureLoader().load(
        'assets/images/mars.jpg',
        (texture) => applyTexture(texture, true),
        undefined,
        () => applyTexture(makeTexture(), true)
      );
    } else {
      applyTexture(makeTexture(), planet.surface === 'craters');
    }

    if (planet.rings) {
      [
        [1.22, 1.48, '#b9a17a', 0.66],
        [1.50, 1.55, '#705d43', 0.42],
        [1.57, 1.86, '#e0cfaa', 0.70],
        [1.89, 2.18, '#ae966d', 0.58]
      ].forEach(([inner, outer, color, opacity]) => {
        const ringMaterial = new THREE.MeshStandardMaterial({
          color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity,
          roughness: 0.95,
          depthWrite: false
        });
        const ring = new THREE.Mesh(new THREE.RingGeometry(inner, outer, 160), ringMaterial);
        ring.rotation.x = 1.08;
        ring.renderOrder = 1;
        planetGroup.add(ring);
      });
    }

    const sunLight = new THREE.DirectionalLight(0xfff8ee, 1.1);
    sunLight.position.set(-2.8, 2.2, 3.8);
    scene.add(sunLight);
    scene.add(new THREE.AmbientLight(0xfcf7f0, 0.85));
    const rimLight = new THREE.DirectionalLight(0xf0e2d2, 0.3);
    rimLight.position.set(3.5, -2, -1.5);
    scene.add(rimLight);

    function updatePlanetPlacement() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);

      const visibleHeight = 2 * Math.tan((camera.fov * Math.PI / 180) / 2) * cameraDist;
      const visibleWidth = visibleHeight * camera.aspect;
      let targetPixelDiameter;
      if (width >= 1200) targetPixelDiameter = Math.max(920, width * 0.78);
      else if (width >= 768) targetPixelDiameter = Math.max(680, width * 0.82);
      else targetPixelDiameter = Math.max(460, width * 0.96);

      const outerRadius = planet.rings ? 2.18 : 1;
      const radius = (targetPixelDiameter / (2 * height)) * visibleHeight / outerRadius;
      planetGroup.scale.set(radius, radius, radius);
      const halfWidth = visibleWidth / 2;
      const halfHeight = visibleHeight / 2;
      planetGroup.position.x = halfWidth - radius * outerRadius * 0.36;
      planetGroup.position.y = halfHeight - radius * outerRadius * 0.26;
    }

    updatePlanetPlacement();
    const rotationSpeed = (2 * Math.PI / 105) * (planet.rotation || 1);
    const clock = new THREE.Clock();
    let animationId = null;
    let isRunning = false;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function render() { renderer.render(scene, camera); }
    function animate() {
      if (!isRunning) return;
      animationId = requestAnimationFrame(animate);
      planetMesh.rotation.y += rotationSpeed * Math.min(clock.getDelta(), 0.1);
      if (planetMesh.rotation.y >= Math.PI * 2) planetMesh.rotation.y -= Math.PI * 2;
      render();
    }
    function startAnimation() {
      if (motionQuery.matches) { render(); return; }
      if (!isRunning) { isRunning = true; clock.getDelta(); animate(); }
    }
    function stopAnimation() {
      isRunning = false;
      if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
    }

    window.addEventListener('resize', function () { updatePlanetPlacement(); render(); }, { passive: true });
    motionQuery.addEventListener('change', function (event) {
      if (event.matches) { stopAnimation(); render(); } else startAnimation();
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopAnimation(); else startAnimation();
    });
    startAnimation();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPlanetBackground);
  else initPlanetBackground();
})();
