/**
 * Bitroot Froots - 8-bit Rotating Globe with ASCII Effect
 */

import * as THREE from 'three';
import {
  EffectComposer,
  RenderPass,
  EffectPass,
  Effect,
  BlendFunction
} from 'postprocessing';

// Exact fragment shader from Efecto
const fragmentShader = `
uniform float cellSize;
uniform bool invert;
uniform bool colorMode;
uniform int asciiStyle;
uniform float time;
uniform vec2 resolution;
uniform vec2 mousePos;
uniform float scanlineIntensity;
uniform float scanlineCount;
uniform float targetFPS;
uniform float jitterIntensity;
uniform float jitterSpeed;
uniform bool mouseGlowEnabled;
uniform float mouseGlowRadius;
uniform float mouseGlowIntensity;
uniform float vignetteIntensity;
uniform float vignetteRadius;
uniform int colorPalette;
uniform float curvature;
uniform float aberrationStrength;
uniform float noiseIntensity;
uniform float noiseScale;
uniform float noiseSpeed;
uniform float waveAmplitude;
uniform float waveFrequency;
uniform float waveSpeed;
uniform float glitchIntensity;
uniform float glitchFrequency;
uniform float brightnessAdjust;
uniform float contrastAdjust;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

vec3 applyColorPalette(vec3 color, int palette) {
  if (palette == 1) {
    float lum = dot(color, vec3(0.299, 0.587, 0.114));
    return vec3(0.1, lum * 0.9, 0.1);
  } else if (palette == 2) {
    float lum = dot(color, vec3(0.299, 0.587, 0.114));
    return vec3(lum * 1.0, lum * 0.6, lum * 0.2);
  } else if (palette == 3) {
    float lum = dot(color, vec3(0.299, 0.587, 0.114));
    return vec3(0.0, lum * 0.8, lum);
  } else if (palette == 4) {
    float lum = dot(color, vec3(0.299, 0.587, 0.114));
    return vec3(0.1, 0.2, lum);
  }
  return color;
}

float getChar(float brightness, vec2 p, int style) {
  vec2 grid = floor(p * 4.0);
  float val = 0.0;
  if (style == 0) {
    if (brightness < 0.2) val = (grid.x == 1.0 && grid.y == 1.0) ? 0.3 : 0.0;
    else if (brightness < 0.35) val = (grid.x == 1.0 || grid.x == 2.0) && (grid.y == 1.0 || grid.y == 2.0) ? 1.0 : 0.0;
    else if (brightness < 0.5) val = (grid.y == 1.0 || grid.y == 2.0) ? 1.0 : 0.0;
    else if (brightness < 0.65) val = (grid.y == 0.0 || grid.y == 3.0) ? 1.0 : (grid.y == 1.0 || grid.y == 2.0) ? 0.5 : 0.0;
    else if (brightness < 0.8) val = (grid.x == 0.0 || grid.x == 2.0 || grid.y == 0.0 || grid.y == 2.0) ? 1.0 : 0.3;
    else val = 1.0;
  }
  return val;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 workUV = uv;

  if (curvature > 0.0) {
    vec2 centered = workUV * 2.0 - 1.0;
    centered *= 1.0 + curvature * dot(centered, centered);
    workUV = centered * 0.5 + 0.5;
    if (workUV.x < 0.0 || workUV.x > 1.0 || workUV.y < 0.0 || workUV.y > 1.0) {
      outputColor = vec4(0.0);
      return;
    }
  }

  if (waveAmplitude > 0.0) {
    workUV.x += sin(workUV.y * waveFrequency + time * waveSpeed) * waveAmplitude;
    workUV.y += cos(workUV.x * waveFrequency + time * waveSpeed) * waveAmplitude;
  }

  vec4 sampledColor;
  if (aberrationStrength > 0.0) {
    float offset = aberrationStrength;
    vec2 uvR = workUV + vec2(offset, 0.0);
    vec2 uvG = workUV;
    vec2 uvB = workUV - vec2(offset, 0.0);
    float r = texture(inputBuffer, uvR).r;
    float g = texture(inputBuffer, uvG).g;
    float b = texture(inputBuffer, uvB).b;
    sampledColor = vec4(r, g, b, 1.0);
  } else {
    sampledColor = texture(inputBuffer, workUV);
  }

  sampledColor.rgb = (sampledColor.rgb - 0.5) * contrastAdjust + 0.5 + brightnessAdjust;

  if (noiseIntensity > 0.0) {
    float noiseVal = noise(workUV * noiseScale + time * noiseSpeed);
    sampledColor.rgb += (noiseVal - 0.5) * noiseIntensity;
  }

  vec2 cellCount = resolution / cellSize;
  vec2 cellCoord = floor(uv * cellCount);

  if (jitterIntensity > 0.0) {
    float jitterTime = time * jitterSpeed;
    float jitterX = (random(vec2(cellCoord.y, floor(jitterTime))) - 0.5) * jitterIntensity * 2.0;
    float jitterY = (random(vec2(cellCoord.x, floor(jitterTime + 1000.0))) - 0.5) * jitterIntensity * 2.0;
    cellCoord += vec2(jitterX, jitterY);
  }

  if (glitchIntensity > 0.0 && glitchFrequency > 0.0) {
    float glitchTime = floor(time * glitchFrequency);
    float glitchRand = random(vec2(glitchTime, cellCoord.y));
    if (glitchRand < glitchIntensity) {
      float shift = (random(vec2(glitchTime + 1.0, cellCoord.y)) - 0.5) * 20.0;
      cellCoord.x += shift;
    }
  }

  vec2 cellUV = (cellCoord + 0.5) / cellCount;
  vec4 cellColor = texture(inputBuffer, cellUV);
  float brightness = dot(cellColor.rgb, vec3(0.299, 0.587, 0.114));

  if (invert) brightness = 1.0 - brightness;

  vec2 localUV = fract(uv * cellCount);
  float charValue = getChar(brightness, localUV, asciiStyle);

  vec3 finalColor;
  if (colorMode) {
    finalColor = cellColor.rgb * charValue;
  } else {
    finalColor = vec3(brightness * charValue);
  }

  finalColor = applyColorPalette(finalColor, colorPalette);

  if (mouseGlowEnabled) {
    vec2 pixelPos = uv * resolution;
    float dist = length(pixelPos - mousePos);
    float glow = exp(-dist / mouseGlowRadius) * mouseGlowIntensity;
    finalColor += glow;
  }

  if (scanlineIntensity > 0.0) {
    float scanline = sin(uv.y * scanlineCount * 3.14159) * 0.5 + 0.5;
    finalColor *= 1.0 - (scanline * scanlineIntensity);
  }

  if (vignetteIntensity > 0.0) {
    vec2 centered = uv * 2.0 - 1.0;
    float vignette = 1.0 - dot(centered, centered) / vignetteRadius;
    finalColor *= mix(1.0, vignette, vignetteIntensity);
  }

  outputColor = vec4(finalColor, cellColor.a);
}
`;

// Module-level state
let _time = 0;
let _deltaAccumulator = 0;
let _cellSize = 8;
let _invert = false;
let _colorMode = true;
let _asciiStyle = 0;
let _resolution = new THREE.Vector2(1920, 1080);
let _mousePos = new THREE.Vector2(0, 0);

class AsciiEffectImpl extends Effect {
  constructor(options = {}) {
    const {
      cellSize = 8,
      invert = false,
      color = true,
      style = 0,
      resolution = new THREE.Vector2(1920, 1080),
      mousePos = new THREE.Vector2(0, 0),
      postfx = {}
    } = options;

    super("AsciiEffect", fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ["cellSize", new THREE.Uniform(cellSize)],
        ["invert", new THREE.Uniform(invert)],
        ["colorMode", new THREE.Uniform(color)],
        ["asciiStyle", new THREE.Uniform(style)],
        ["time", new THREE.Uniform(0)],
        ["resolution", new THREE.Uniform(resolution)],
        ["mousePos", new THREE.Uniform(mousePos)],
        ["scanlineIntensity", new THREE.Uniform(postfx.scanlineIntensity || 0)],
        ["scanlineCount", new THREE.Uniform(postfx.scanlineCount || 200)],
        ["targetFPS", new THREE.Uniform(postfx.targetFPS || 0)],
        ["jitterIntensity", new THREE.Uniform(postfx.jitterIntensity || 0)],
        ["jitterSpeed", new THREE.Uniform(postfx.jitterSpeed || 1)],
        ["mouseGlowEnabled", new THREE.Uniform(postfx.mouseGlowEnabled || false)],
        ["mouseGlowRadius", new THREE.Uniform(postfx.mouseGlowRadius || 200)],
        ["mouseGlowIntensity", new THREE.Uniform(postfx.mouseGlowIntensity || 1.5)],
        ["vignetteIntensity", new THREE.Uniform(postfx.vignetteIntensity || 0)],
        ["vignetteRadius", new THREE.Uniform(postfx.vignetteRadius || 0.8)],
        ["colorPalette", new THREE.Uniform(postfx.colorPalette || 0)],
        ["curvature", new THREE.Uniform(postfx.curvature || 0)],
        ["aberrationStrength", new THREE.Uniform(postfx.aberrationStrength || 0)],
        ["noiseIntensity", new THREE.Uniform(postfx.noiseIntensity || 0)],
        ["noiseScale", new THREE.Uniform(postfx.noiseScale || 1)],
        ["noiseSpeed", new THREE.Uniform(postfx.noiseSpeed || 1)],
        ["waveAmplitude", new THREE.Uniform(postfx.waveAmplitude || 0)],
        ["waveFrequency", new THREE.Uniform(postfx.waveFrequency || 10)],
        ["waveSpeed", new THREE.Uniform(postfx.waveSpeed || 1)],
        ["glitchIntensity", new THREE.Uniform(postfx.glitchIntensity || 0)],
        ["glitchFrequency", new THREE.Uniform(postfx.glitchFrequency || 0)],
        ["brightnessAdjust", new THREE.Uniform(postfx.brightnessAdjust || 0)],
        ["contrastAdjust", new THREE.Uniform(postfx.contrastAdjust || 1)],
      ]),
    });

    _cellSize = cellSize;
    _invert = invert;
    _colorMode = color;
    _asciiStyle = style;
    _resolution = resolution;
    _mousePos = mousePos;
  }

  update(renderer, inputBuffer, deltaTime) {
    const targetFPS = this.uniforms.get("targetFPS").value;
    if (targetFPS > 0) {
      const frameDuration = 1 / targetFPS;
      _deltaAccumulator += deltaTime;
      if (_deltaAccumulator >= frameDuration) {
        _time += frameDuration;
        _deltaAccumulator = _deltaAccumulator % frameDuration;
      }
    } else {
      _time += deltaTime;
    }

    this.uniforms.get("time").value = _time;
    this.uniforms.get("cellSize").value = _cellSize;
    this.uniforms.get("invert").value = _invert;
    this.uniforms.get("colorMode").value = _colorMode;
    this.uniforms.get("asciiStyle").value = _asciiStyle;
    this.uniforms.get("resolution").value = _resolution;
    this.uniforms.get("mousePos").value = _mousePos;
  }
}

// 8-bit Globe Scene
class GlobeScene {
  constructor() {
    this.canvas = document.getElementById('ascii-canvas');
    if (!this.canvas) {
      console.error('Canvas not found');
      return;
    }

    this.container = this.canvas.closest('.hero') || this.canvas.parentElement;
    this.init();
  }

  init() {
    const rect = this.container.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || window.innerHeight;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0a);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 4);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      alpha: false,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Clock
    this.clock = new THREE.Clock();

    // Create 8-bit globe
    this.createGlobe();

    // Setup postprocessing
    this.setupPostProcessing(width, height);

    // Events
    window.addEventListener('resize', () => this.onResize());
    this.container.addEventListener('mousemove', (e) => this.onMouseMove(e));

    // Start
    this.animate();
  }

  createGlobe() {
    // Create a sphere for Earth - higher detail for smoother look
    const geometry = new THREE.IcosahedronGeometry(1.2, 4);

    // Custom shader for 8-bit Earth with procedural continents
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        oceanColor: { value: new THREE.Color(0x1a5fb4) },
        oceanDeep: { value: new THREE.Color(0x0d3a6e) },
        landColor: { value: new THREE.Color(0x2ec27e) },
        landDark: { value: new THREE.Color(0x1a7a4c) },
        desertColor: { value: new THREE.Color(0xc4a35a) },
        iceColor: { value: new THREE.Color(0xe8f4f8) },
        atmosphereColor: { value: new THREE.Color(0x63c5ff) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 oceanColor;
        uniform vec3 oceanDeep;
        uniform vec3 landColor;
        uniform vec3 landDark;
        uniform vec3 desertColor;
        uniform vec3 iceColor;
        uniform vec3 atmosphereColor;

        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;

        // Simplex-like noise for continents
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm(vec2 p) {
          float f = 0.0;
          f += 0.5000 * noise(p); p *= 2.02;
          f += 0.2500 * noise(p); p *= 2.03;
          f += 0.1250 * noise(p); p *= 2.01;
          f += 0.0625 * noise(p);
          return f / 0.9375;
        }

        void main() {
          // Convert position to spherical coordinates
          vec3 pos = normalize(vPosition);
          float lat = asin(pos.y);
          float lon = atan(pos.z, pos.x);

          // Create continent mask using noise
          vec2 noiseCoord = vec2(lon * 2.0, lat * 3.0);
          float continentNoise = fbm(noiseCoord + vec2(1.5, 0.8));
          float continentNoise2 = fbm(noiseCoord * 1.5 + vec2(3.2, 1.1));
          float landMask = smoothstep(0.45, 0.55, continentNoise * 0.6 + continentNoise2 * 0.4);

          // Ice caps at poles
          float polarLat = abs(lat);
          float iceMask = smoothstep(1.1, 1.4, polarLat + continentNoise * 0.3);

          // Lighting
          vec3 light = normalize(vec3(1.0, 0.5, 0.8));
          float diff = max(dot(vNormal, light), 0.0);

          // Quantize lighting for 8-bit look (4 levels)
          diff = floor(diff * 4.0 + 0.5) / 4.0;
          diff = max(diff, 0.2); // Minimum brightness

          // Ocean color with depth variation
          float oceanDepth = fbm(noiseCoord * 3.0);
          vec3 ocean = mix(oceanDeep, oceanColor, oceanDepth * 0.5 + diff * 0.5);

          // Land color with terrain variation
          float terrainVar = fbm(noiseCoord * 4.0 + vec2(5.0, 3.0));
          vec3 land = mix(landDark, landColor, terrainVar * 0.5 + diff * 0.5);

          // Add desert regions near equator
          float equatorDist = abs(lat);
          float desertMask = (1.0 - smoothstep(0.0, 0.5, equatorDist)) * smoothstep(0.5, 0.7, continentNoise);
          land = mix(land, desertColor * diff, desertMask * 0.6);

          // Combine ocean and land
          vec3 baseColor = mix(ocean, land, landMask);

          // Apply ice
          vec3 ice = iceColor * (diff * 0.5 + 0.5);
          baseColor = mix(baseColor, ice, iceMask);

          // Quantize colors for 8-bit palette look
          baseColor = floor(baseColor * 8.0 + 0.5) / 8.0;

          // Atmosphere rim glow
          float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
          rim = pow(rim, 3.0);
          baseColor += atmosphereColor * rim * 0.4;

          gl_FragColor = vec4(baseColor, 1.0);
        }
      `,
      side: THREE.FrontSide,
    });

    this.globe = new THREE.Mesh(geometry, material);
    this.scene.add(this.globe);

    // Add subtle wireframe for retro feel
    const wireGeometry = new THREE.IcosahedronGeometry(1.22, 3);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x63c5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    this.wireframe = new THREE.Mesh(wireGeometry, wireMaterial);
    this.scene.add(this.wireframe);

    // Add floating particles (stars)
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 3 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      transparent: true,
      opacity: 0.7,
    });
    this.particles = new THREE.Points(particleGeo, particleMat);
    this.scene.add(this.particles);

    // Ambient light
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambient);
  }

  setupPostProcessing(width, height) {
    _resolution = new THREE.Vector2(width, height);

    this.composer = new EffectComposer(this.renderer);

    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    this.asciiEffect = new AsciiEffectImpl({
      cellSize: 6,
      invert: false,
      color: true,
      style: 0,
      resolution: _resolution,
      mousePos: _mousePos,
      postfx: {
        scanlineIntensity: 0.03,
        scanlineCount: 400,
        targetFPS: 0,
        vignetteIntensity: 0.15,
        vignetteRadius: 1.5,
        colorPalette: 0,
      }
    });

    const effectPass = new EffectPass(this.camera, this.asciiEffect);
    this.composer.addPass(effectPass);
  }

  onResize() {
    const rect = this.container.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);

    _resolution.set(width, height);
  }

  onMouseMove(event) {
    const rect = this.container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = rect.height - (event.clientY - rect.top);
    _mousePos.set(x, y);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = this.clock.getElapsedTime();

    // Rotate globe
    this.globe.rotation.y = time * 0.2;
    this.wireframe.rotation.y = time * 0.2;

    // Slight tilt
    this.globe.rotation.x = Math.sin(time * 0.1) * 0.1 + 0.2;
    this.wireframe.rotation.x = Math.sin(time * 0.1) * 0.1 + 0.2;

    // Update shader time
    this.globe.material.uniforms.time.value = time;

    // Rotate particles slowly
    this.particles.rotation.y = time * 0.02;

    // Render
    this.composer.render();
  }
}

// Initialize
function init() {
  try {
    new GlobeScene();
  } catch (error) {
    console.error('Failed to initialize:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
