"use client";

import { useEffect, useRef } from "react";

const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;

  varying vec2 v_uv;
  uniform sampler2D u_texture;
  uniform vec2 u_resolution;
  uniform vec2 u_imageResolution;
  uniform vec2 u_mouse;
  uniform vec2 u_previousMouse;
  uniform float u_time;
  uniform float u_intensity;

  vec2 coverUv(vec2 uv) {
    float scale = max(u_resolution.x / u_imageResolution.x, u_resolution.y / u_imageResolution.y);
    vec2 rendered = u_imageResolution * scale;
    vec2 offset = (rendered - u_resolution) * 0.5;
    return (uv * u_resolution + offset) / rendered;
  }

  vec2 rippleAt(vec2 point, vec2 center, float phase, float strength) {
    vec2 delta = point - center;
    delta.x *= u_resolution.x / u_resolution.y;
    float distanceToMouse = length(delta);
    vec2 direction = normalize(delta + vec2(0.0001));
    float envelope = exp(-distanceToMouse * 6.4);
    float wave = sin(distanceToMouse * 92.0 - u_time * 7.0 + phase);
    float secondaryWave = sin(distanceToMouse * 39.0 - u_time * 3.2 + phase * 0.7);
    float displacement = (wave * 0.72 + secondaryWave * 0.28) * envelope * strength;
    direction.x /= u_resolution.x / u_resolution.y;
    return direction * displacement;
  }

  void main() {
    vec2 mouse = vec2(u_mouse.x, 1.0 - u_mouse.y);
    vec2 previousMouse = vec2(u_previousMouse.x, 1.0 - u_previousMouse.y);
    vec2 displacement = rippleAt(v_uv, mouse, 0.0, 0.038 * u_intensity);
    displacement += rippleAt(v_uv, previousMouse, 2.1, 0.018 * u_intensity);

    float liquidNoise = sin((v_uv.x + v_uv.y) * 34.0 + u_time * 1.8)
      * cos((v_uv.y - v_uv.x) * 27.0 - u_time * 1.3);
    float mouseDistance = distance(
      vec2((v_uv.x - mouse.x) * u_resolution.x / u_resolution.y, v_uv.y - mouse.y),
      vec2(0.0)
    );
    displacement += vec2(liquidNoise, -liquidNoise) * exp(-mouseDistance * 5.6) * 0.0065 * u_intensity;

    vec2 uv = coverUv(v_uv + displacement);
    vec2 chroma = displacement * 0.42;
    float red = texture2D(u_texture, uv + chroma).r;
    float green = texture2D(u_texture, uv).g;
    float blue = texture2D(u_texture, uv - chroma).b;
    gl_FragColor = vec4(red, green, blue, 1.0);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function HeroRipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement;
    if (!canvas || !hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const imageResolutionLocation = gl.getUniformLocation(program, "u_imageResolution");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");
    const previousMouseLocation = gl.getUniformLocation(program, "u_previousMouse");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const intensityLocation = gl.getUniformLocation(program, "u_intensity");

    let frame = 0;
    let disposed = false;
    let ready = false;
    let intensity = 0;
    const mouse = { x: 0.5, y: 0.5 };
    const target = { x: 0.5, y: 0.5 };
    const previous = { x: 0.5, y: 0.5 };

    const resize = () => {
      const bounds = hero.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio));
      canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect();
      previous.x = target.x;
      previous.y = target.y;
      target.x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
      target.y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
      intensity = 1;
    };

    const onPointerLeave = () => {
      intensity = Math.min(intensity, 0.55);
    };

    const start = performance.now();
    const render = (now: number) => {
      if (disposed) return;
      mouse.x += (target.x - mouse.x) * 0.16;
      mouse.y += (target.y - mouse.y) * 0.16;
      previous.x += (mouse.x - previous.x) * 0.035;
      previous.y += (mouse.y - previous.y) * 0.035;
      intensity *= 0.972;

      if (ready) {
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform2f(mouseLocation, mouse.x, mouse.y);
        gl.uniform2f(previousMouseLocation, previous.x, previous.y);
        gl.uniform1f(timeLocation, (now - start) / 1000);
        gl.uniform1f(intensityLocation, Math.max(0, intensity));
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      frame = requestAnimationFrame(render);
    };

    const image = new Image();
    image.onload = () => {
      if (disposed) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.uniform2f(imageResolutionLocation, image.naturalWidth, image.naturalHeight);
      ready = true;
      canvas.dataset.ready = "true";
    };
    image.src = "/rocky-cover-clean.png";

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hero);
    hero.addEventListener("pointermove", onPointerMove);
    hero.addEventListener("pointerleave", onPointerLeave);
    frame = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-ripple" aria-hidden="true" />;
}
