"use client";

/* Signature element, v2. Cardon ribs as a living bar field:
   WebGL quads driven by per-bar spring physics. Ambient breeze
   keeps it moving; the cursor lifts bars toward it; hover warms
   the color toward clay. Static DOM bars render for SSR, no-WebGL,
   and reduced-motion visitors. */

import { useEffect, useRef, useState } from "react";

const BARS = 72;
const SLOT_FILL = 0.62;

function heightFor(i: number) {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const r = a - Math.floor(a);
  const ridge = 0.35 + 0.3 * Math.sin((i / BARS) * Math.PI * 2.2 + 0.8);
  return 0.22 + ridge * 0.5 + r * 0.26;
}

const VERT = `
attribute vec2 a_pos;
attribute vec2 a_meta;
varying float v_y;
varying float v_glow;
void main() {
  v_y = a_meta.x;
  v_glow = a_meta.y;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
varying float v_y;
varying float v_glow;
uniform float u_time;
uniform vec3 u_color;
uniform vec3 u_hot;
float noise(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}
void main() {
  vec3 col = mix(u_color, u_hot, v_glow * 0.55);
  float alpha = 0.26 + 0.22 * v_glow;
  alpha *= 0.7 + 0.3 * (1.0 - v_y);
  float n = noise(floor(gl_FragCoord.xy * 0.5) + floor(u_time * 2.0));
  alpha += (n - 0.5) * 0.05;
  gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
}`;

export default function RibFieldGL() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl =
      canvas.getContext("webgl", { alpha: true, antialias: true }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const aPos = gl.getAttribLocation(prog, "a_pos");
    const aMeta = gl.getAttribLocation(prog, "a_meta");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uColor = gl.getUniformLocation(prog, "u_color");
    const uHot = gl.getUniformLocation(prog, "u_hot");

    gl.uniform3f(uColor, 0.278, 0.341, 0.235); // cardon green
    gl.uniform3f(uHot, 0.765, 0.286, 0.106); // clay
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const posBuf = gl.createBuffer();
    const metaBuf = gl.createBuffer();
    const positions = new Float32Array(BARS * 6 * 2);
    const metas = new Float32Array(BARS * 6 * 2);

    const base = new Float32Array(BARS);
    const pos = new Float32Array(BARS);
    const vel = new Float32Array(BARS);
    const glow = new Float32Array(BARS);
    for (let i = 0; i < BARS; i++) {
      base[i] = heightFor(i);
      pos[i] = 0; // grow in on load
    }

    const cursor = { x: 0.5, active: false };
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      cursor.x = (e.clientX - r.left) / r.width;
      cursor.active = true;
    };
    const onLeave = () => {
      cursor.active = false;
    };
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = Math.max(1, Math.round(wrap.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(wrap.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    let visible = true;
    const io = new IntersectionObserver((es) => {
      visible = es[0]?.isIntersecting ?? true;
    });
    io.observe(wrap);

    let raf = 0;
    let last = performance.now();
    const start = last;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) {
        last = now;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;
      const t = (now - start) / 1000;

      for (let i = 0; i < BARS; i++) {
        const ambient =
          0.05 * Math.sin(t * 0.9 + i * 0.37) +
          0.03 * Math.sin(t * 0.23 + i * 1.71);
        let lift = 0;
        if (cursor.active) {
          const bx = (i + 0.5) / BARS;
          const d = Math.abs(cursor.x - bx);
          lift = Math.max(0, 1 - d * 6);
        }
        glow[i] += (lift - glow[i]) * Math.min(1, dt * 10);
        const target = Math.min(base[i] + ambient + lift * 0.38, 1.15);
        vel[i] += (target - pos[i]) * 120 * dt;
        vel[i] *= Math.exp(-11 * dt);
        pos[i] += vel[i] * dt;
      }

      for (let i = 0; i < BARS; i++) {
        const slot = 2 / BARS;
        const x0 = -1 + slot * (i + (1 - SLOT_FILL) / 2);
        const x1 = x0 + slot * SLOT_FILL;
        const y0 = -1;
        const y1 = -1 + Math.max(0.005, pos[i]) * 2;
        const o = i * 12;
        // two triangles
        positions[o] = x0; positions[o + 1] = y0;
        positions[o + 2] = x1; positions[o + 3] = y0;
        positions[o + 4] = x0; positions[o + 5] = y1;
        positions[o + 6] = x0; positions[o + 7] = y1;
        positions[o + 8] = x1; positions[o + 9] = y0;
        positions[o + 10] = x1; positions[o + 11] = y1;
        const g = glow[i];
        metas[o] = 0; metas[o + 1] = g;
        metas[o + 2] = 0; metas[o + 3] = g;
        metas[o + 4] = 1; metas[o + 5] = g;
        metas[o + 6] = 1; metas[o + 7] = g;
        metas[o + 8] = 0; metas[o + 9] = g;
        metas[o + 10] = 1; metas[o + 11] = g;
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, t);

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, metaBuf);
      gl.bufferData(gl.ARRAY_BUFFER, metas, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aMeta);
      gl.vertexAttribPointer(aMeta, 2, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.TRIANGLES, 0, BARS * 6);
    };

    setLive(true);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative h-full w-full" aria-hidden="true">
      {/* static fallback: SSR paint, no-WebGL, reduced motion */}
      <div
        className={`absolute inset-0 flex items-end gap-[3px] transition-opacity duration-500 sm:gap-1 ${
          live ? "opacity-0" : "opacity-100"
        }`}
      >
        {Array.from({ length: BARS }, (_, i) => (
          <div
            key={i}
            className="flex-1 bg-cardon/25"
            style={{ height: `${heightFor(i) * 100}%` }}
          />
        ))}
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
