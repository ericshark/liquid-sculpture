/**
 * WebGL2 Stable-Fluids Solver (ported from Chromasonic's fluid.ts & shaders.ts)
 * Re-engineered for FORMA's monochrome obsidian, alabaster, and liquid-silver theme.
 */

export interface FluidSettings {
  curl: number;
  velocityDissipation: number;
  densityDissipation: number;
  pressure: number;
  splatRadius: number;
  bloom: number;
  rays: number;
  paper: boolean;
}

interface Target {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
}

interface PingPong {
  read: Target;
  write: Target;
  swap(): void;
}

type Uniforms = Record<string, WebGLUniformLocation | null>;

const baseVertex = /* glsl */ `#version 300 es
precision highp float;
in vec2 aPosition;
uniform vec2 texelSize;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const header = /* glsl */ `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 outColor;
`;

const clearShader = `${header}
uniform sampler2D uTexture;
uniform float value;
void main() { outColor = value * texture(uTexture, vUv); }`;

const splatShader = `${header}
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
void main() {
  vec2 p = vUv - point;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  outColor = vec4(texture(uTarget, vUv).xyz + splat, 1.0);
}`;

const radialShader = `${header}
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec2 point;
uniform float radius;
uniform float strength;
void main() {
  vec2 p = vUv - point;
  p.x *= aspectRatio;
  float d = length(p);
  float ring = exp(-pow(d - radius, 2.0) / (radius * radius * 0.18));
  vec2 push = d > 1e-4 ? p / d : vec2(0.0);
  push.x /= aspectRatio;
  outColor = vec4(texture(uTarget, vUv).xy + push * ring * strength, 0.0, 1.0);
}`;

const advectionShader = `${header}
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;
void main() {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  outColor = texture(uSource, coord) / (1.0 + dissipation * dt);
}`;

const divergenceShader = `${header}
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x;
  if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y;
  if (vB.y < 0.0) B = -C.y;
  outColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`;

const curlShader = `${header}
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  outColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`;

const vorticityShader = `${header}
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
void main() {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 velocity = texture(uVelocity, vUv).xy + force * dt;
  outColor = vec4(clamp(velocity, -1000.0, 1000.0), 0.0, 1.0);
}`;

const pressureShader = `${header}
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  outColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
}`;

const gradientSubtractShader = `${header}
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  outColor = vec4(velocity, 0.0, 1.0);
}`;

const bloomPrefilterShader = `${header}
uniform sampler2D uTexture;
uniform float threshold;
void main() {
  vec3 c = texture(uTexture, vUv).rgb;
  float brightness = max(c.r, max(c.g, c.b));
  float soft = clamp(brightness - threshold + 0.2, 0.0, 0.4);
  soft = soft * soft / 1.6;
  float contribution = max(soft, brightness - threshold) / max(brightness, 0.0001);
  outColor = vec4(c * contribution, 1.0);
}`;

const blurShader = `${header}
uniform sampler2D uTexture;
uniform vec2 direction;
void main() {
  vec3 sum = texture(uTexture, vUv).rgb * 0.2270270270;
  sum += texture(uTexture, vUv + direction * 1.3846153846).rgb * 0.3162162162;
  sum += texture(uTexture, vUv - direction * 1.3846153846).rgb * 0.3162162162;
  sum += texture(uTexture, vUv + direction * 3.2307692308).rgb * 0.0702702703;
  sum += texture(uTexture, vUv - direction * 3.2307692308).rgb * 0.0702702703;
  outColor = vec4(sum, 1.0);
}`;

const displayShader = `${header}
uniform sampler2D uTexture;
uniform sampler2D uBloom;
uniform float aspectRatio;
uniform float bloomIntensity;
uniform float rays;
uniform float segments;
uniform float paper;
uniform float time;

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

vec2 kaleidoscope(vec2 uv) {
  vec2 p = uv - 0.5;
  p.x *= aspectRatio;
  float r = length(p);
  float wedge = 6.2831853 / segments;
  float a = mod(atan(p.y, p.x) + time * 0.05, wedge);
  a = abs(a - wedge * 0.5);
  p = r * vec2(cos(a), sin(a));
  p.x /= aspectRatio;
  return clamp(p + 0.5, 0.0, 1.0);
}

void main() {
  vec2 uv = segments > 1.5 ? kaleidoscope(vUv) : vUv;
  vec3 dye = texture(uTexture, uv).rgb;
  vec3 bloom = texture(uBloom, uv).rgb;

  vec3 shafts = vec3(0.0);
  if (rays > 0.0) {
    vec2 step = (uv - 0.5) * 0.045;
    vec2 p = uv;
    float decay = 1.0;
    for (int i = 0; i < 10; i++) {
      p -= step;
      shafts += texture(uBloom, p).rgb * decay;
      decay *= 0.86;
    }
    shafts *= rays * 0.12;
  }

  vec3 light = dye + bloom * bloomIntensity + shafts;
  // Desaturate slightly toward a cool metallic silver/platinum tone
  float luma = dot(light, vec3(0.2126, 0.7152, 0.0722));
  vec3 metallic = mix(vec3(luma) * vec3(0.95, 0.97, 1.02), light, 0.35);

  vec3 color;
  if (paper > 0.5) {
    // Light theme: graphite and pewter smoke ribbons on cool alabaster (#f5f6f8)
    vec3 sheet = vec3(0.961, 0.965, 0.973);
    float coverage = 1.0 - exp(-max(metallic.r, max(metallic.g, metallic.b)) * 1.45);
    vec3 graphite = vec3(0.08, 0.09, 0.12);
    color = mix(sheet, graphite, coverage * 0.82);
  } else {
    // Dark theme: luminous silver & pearl smoke over deep obsidian (#07080a)
    vec3 obsidian = vec3(0.027, 0.031, 0.039);
    vec3 mapped = 1.0 - exp(-metallic * 1.3);
    color = obsidian + mapped * (1.0 - obsidian);
    color = pow(color, vec3(1.0 / 1.08));
  }
  color += (hash(gl_FragCoord.xy + time) - 0.5) / 255.0;
  outColor = vec4(color, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    throw new Error(gl.getShaderInfoLog(shader) ?? "compile failed");
  return shader;
}

class Program {
  readonly program: WebGLProgram;
  readonly uniforms: Uniforms = {};

  constructor(
    private gl: WebGL2RenderingContext,
    vertex: WebGLShader,
    fragmentSource: string,
  ) {
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram()!;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.bindAttribLocation(program, 0, "aPosition");
    gl.linkProgram(program);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(program) ?? "link failed");
    this.program = program;
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < count; i++) {
      const name = gl.getActiveUniform(program, i)!.name;
      this.uniforms[name] = gl.getUniformLocation(program, name);
    }
  }

  use() {
    this.gl.useProgram(this.program);
    return this.uniforms;
  }
}

export function isSoftwareRenderer() {
  if (typeof window === "undefined") return false;
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    const info = gl?.getExtension("WEBGL_debug_renderer_info");
    const renderer =
      gl && info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return /swiftshader|llvmpipe|software|softpipe/i.test(renderer);
  } catch {
    return false;
  }
}

export class Fluid {
  private gl: WebGL2RenderingContext;
  private programs: Record<string, Program>;
  private quad: WebGLBuffer | null;
  private indices: WebGLBuffer | null;
  private velocity!: PingPong;
  private dye!: PingPong;
  private pressureTargets!: PingPong;
  private divergence!: Target;
  private curlTarget!: Target;
  private bloomA!: Target;
  private bloomB!: Target;
  private simRes: number;
  private dyeRes: number;
  private iterations: number;
  private destroyed = false;

  settings: FluidSettings = {
    curl: 24,
    velocityDissipation: 0.26,
    densityDissipation: 0.72,
    pressure: 0.8,
    splatRadius: 0.28,
    bloom: 0.95,
    rays: 0.85,
    paper: false,
  };
  segments = 1;
  frames = 0;
  splats = 0;
  time = 0;

  private constructor(
    readonly canvas: HTMLCanvasElement,
    gl: WebGL2RenderingContext,
    lowPower: boolean,
  ) {
    this.gl = gl;
    this.simRes = lowPower ? 64 : 128;
    this.dyeRes = lowPower ? 384 : 1024;
    this.iterations = lowPower ? 12 : 22;
    const vertex = compile(gl, gl.VERTEX_SHADER, baseVertex);
    this.programs = {
      clear: new Program(gl, vertex, clearShader),
      splat: new Program(gl, vertex, splatShader),
      radial: new Program(gl, vertex, radialShader),
      advection: new Program(gl, vertex, advectionShader),
      divergence: new Program(gl, vertex, divergenceShader),
      curl: new Program(gl, vertex, curlShader),
      vorticity: new Program(gl, vertex, vorticityShader),
      pressure: new Program(gl, vertex, pressureShader),
      gradient: new Program(gl, vertex, gradientSubtractShader),
      prefilter: new Program(gl, vertex, bloomPrefilterShader),
      blur: new Program(gl, vertex, blurShader),
      display: new Program(gl, vertex, displayShader),
    };
    gl.deleteShader(vertex);

    this.quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW,
    );
    this.indices = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      gl.STATIC_DRAW,
    );
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    this.resize();
  }

  static create(canvas: HTMLCanvasElement, lowPower: boolean): Fluid | null {
    try {
      const gl = canvas.getContext("webgl2", {
        alpha: false,
        depth: false,
        stencil: false,
        antialias: false,
        preserveDrawingBuffer: false,
      });
      if (!gl || !gl.getExtension("EXT_color_buffer_float")) return null;
      return new Fluid(canvas, gl, lowPower);
    } catch (error) {
      console.warn("Fluid simulation unavailable:", error);
      return null;
    }
  }

  private resolution(base: number) {
    const w = Math.max(1, this.gl.drawingBufferWidth);
    const h = Math.max(1, this.gl.drawingBufferHeight);
    const aspect = w / h;
    const min = Math.round(base);
    const max = Math.round(base * (aspect < 1 ? 1 / aspect : aspect));
    return aspect > 1
      ? { width: max, height: min }
      : { width: min, height: max };
  }

  private target(
    width: number,
    height: number,
    internal: number,
    format: number,
  ): Target {
    const gl = this.gl;
    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      internal,
      width,
      height,
      0,
      format,
      gl.HALF_FLOAT,
      null,
    );
    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    );
    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { texture, fbo, width, height };
  }

  private pingPong(
    width: number,
    height: number,
    internal: number,
    format: number,
  ): PingPong {
    const pair = {
      read: this.target(width, height, internal, format),
      write: this.target(width, height, internal, format),
      swap() {
        [pair.read, pair.write] = [pair.write, pair.read];
      },
    };
    return pair;
  }

  private deleteTargets() {
    const gl = this.gl;
    const singleTargets = [
      this.divergence,
      this.curlTarget,
      this.bloomA,
      this.bloomB,
      this.velocity?.read,
      this.velocity?.write,
      this.dye?.read,
      this.dye?.write,
      this.pressureTargets?.read,
      this.pressureTargets?.write,
    ];
    for (const t of singleTargets) {
      if (!t) continue;
      gl.deleteTexture(t.texture);
      gl.deleteFramebuffer(t.fbo);
    }
  }

  resize() {
    if (this.destroyed) return;
    const gl = this.gl;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(this.canvas.clientWidth * dpr));
    const height = Math.max(1, Math.floor(this.canvas.clientHeight * dpr));
    if (
      width === this.canvas.width &&
      height === this.canvas.height &&
      this.velocity
    )
      return;
    this.deleteTargets();
    this.canvas.width = width;
    this.canvas.height = height;
    const sim = this.resolution(this.simRes);
    const dye = this.resolution(this.dyeRes);
    const bloom = this.resolution(this.dyeRes / 4);
    this.velocity = this.pingPong(sim.width, sim.height, gl.RG16F, gl.RG);
    this.pressureTargets = this.pingPong(
      sim.width,
      sim.height,
      gl.R16F,
      gl.RED,
    );
    this.divergence = this.target(sim.width, sim.height, gl.R16F, gl.RED);
    this.curlTarget = this.target(sim.width, sim.height, gl.R16F, gl.RED);
    this.dye = this.pingPong(dye.width, dye.height, gl.RGBA16F, gl.RGBA);
    this.bloomA = this.target(bloom.width, bloom.height, gl.RGBA16F, gl.RGBA);
    this.bloomB = this.target(bloom.width, bloom.height, gl.RGBA16F, gl.RGBA);
  }

  clear() {
    if (this.destroyed) return;
    const gl = this.gl;
    for (const t of [
      this.velocity.read,
      this.velocity.write,
      this.dye.read,
      this.dye.write,
      this.pressureTargets.read,
      this.pressureTargets.write,
    ]) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
      gl.viewport(0, 0, t.width, t.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  private bindTexture(unit: number, texture: WebGLTexture) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    return unit;
  }

  private draw(target: Target | null) {
    const gl = this.gl;
    if (target) {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    } else {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }

  private texel(target: Target, u: Uniforms) {
    this.gl.uniform2f(u.texelSize, 1 / target.width, 1 / target.height);
  }

  private get aspect() {
    return this.canvas.width / Math.max(1, this.canvas.height);
  }

  /** Adds velocity (in pixels per second) and dye at a point in 0..1 UV space. */
  splat(
    x: number,
    y: number,
    dx: number,
    dy: number,
    color: [number, number, number],
    radiusScale = 1,
  ) {
    if (this.destroyed) return;
    const gl = this.gl;
    const u = this.programs.splat.use();
    const radius =
      (this.settings.splatRadius / 100) *
      radiusScale *
      Math.max(this.aspect, 1);
    gl.uniform1i(u.uTarget, this.bindTexture(0, this.velocity.read.texture));
    gl.uniform1f(u.aspectRatio, this.aspect);
    gl.uniform2f(u.point, x, y);
    gl.uniform3f(u.color, dx, dy, 0);
    gl.uniform1f(u.radius, radius);
    this.texel(this.velocity.read, u);
    this.draw(this.velocity.write);
    this.velocity.swap();

    gl.uniform1i(u.uTarget, this.bindTexture(0, this.dye.read.texture));
    gl.uniform3f(u.color, color[0], color[1], color[2]);
    this.texel(this.dye.read, u);
    this.draw(this.dye.write);
    this.dye.swap();
    this.splats++;
  }

  /** An expanding radial ring of velocity. */
  pulse(x: number, y: number, strength: number, radius = 0.14) {
    if (this.destroyed) return;
    const gl = this.gl;
    const u = this.programs.radial.use();
    gl.uniform1i(u.uTarget, this.bindTexture(0, this.velocity.read.texture));
    gl.uniform1f(u.aspectRatio, this.aspect);
    gl.uniform2f(u.point, x, y);
    gl.uniform1f(u.radius, radius);
    gl.uniform1f(u.strength, strength);
    this.texel(this.velocity.read, u);
    this.draw(this.velocity.write);
    this.velocity.swap();
  }

  step(rawDt: number, energy = 0) {
    if (this.destroyed) return;
    const gl = this.gl;
    const dt = Math.min(rawDt, 1 / 30);
    const s = this.settings;
    this.time += dt;
    gl.disable(gl.BLEND);
    const v = this.velocity;

    let u = this.programs.curl.use();
    this.texel(v.read, u);
    gl.uniform1i(u.uVelocity, this.bindTexture(0, v.read.texture));
    this.draw(this.curlTarget);

    u = this.programs.vorticity.use();
    this.texel(v.read, u);
    gl.uniform1i(u.uVelocity, this.bindTexture(0, v.read.texture));
    gl.uniform1i(u.uCurl, this.bindTexture(1, this.curlTarget.texture));
    gl.uniform1f(u.curl, s.curl * (1 + energy * 0.6));
    gl.uniform1f(u.dt, dt);
    this.draw(v.write);
    v.swap();

    u = this.programs.divergence.use();
    this.texel(v.read, u);
    gl.uniform1i(u.uVelocity, this.bindTexture(0, v.read.texture));
    this.draw(this.divergence);

    u = this.programs.clear.use();
    gl.uniform1i(
      u.uTexture,
      this.bindTexture(0, this.pressureTargets.read.texture),
    );
    gl.uniform1f(u.value, s.pressure);
    this.draw(this.pressureTargets.write);
    this.pressureTargets.swap();

    u = this.programs.pressure.use();
    this.texel(v.read, u);
    gl.uniform1i(u.uDivergence, this.bindTexture(0, this.divergence.texture));
    for (let i = 0; i < this.iterations; i++) {
      gl.uniform1i(
        u.uPressure,
        this.bindTexture(1, this.pressureTargets.read.texture),
      );
      this.draw(this.pressureTargets.write);
      this.pressureTargets.swap();
    }

    u = this.programs.gradient.use();
    this.texel(v.read, u);
    gl.uniform1i(
      u.uPressure,
      this.bindTexture(0, this.pressureTargets.read.texture),
    );
    gl.uniform1i(u.uVelocity, this.bindTexture(1, v.read.texture));
    this.draw(v.write);
    v.swap();

    u = this.programs.advection.use();
    this.texel(v.read, u);
    gl.uniform1i(u.uVelocity, this.bindTexture(0, v.read.texture));
    gl.uniform1i(u.uSource, this.bindTexture(0, v.read.texture));
    gl.uniform1f(u.dt, dt);
    gl.uniform1f(u.dissipation, s.velocityDissipation);
    this.draw(v.write);
    v.swap();

    gl.uniform1i(u.uVelocity, this.bindTexture(0, v.read.texture));
    gl.uniform1i(u.uSource, this.bindTexture(1, this.dye.read.texture));
    gl.uniform1f(u.dissipation, s.densityDissipation);
    this.draw(this.dye.write);
    this.dye.swap();
  }

  render(energy = 0) {
    if (this.destroyed) return;
    const gl = this.gl;
    let u = this.programs.prefilter.use();
    gl.uniform1i(u.uTexture, this.bindTexture(0, this.dye.read.texture));
    gl.uniform1f(u.threshold, 0.52);
    this.draw(this.bloomA);
    u = this.programs.blur.use();
    for (let pass = 0; pass < 2; pass++) {
      gl.uniform1i(u.uTexture, this.bindTexture(0, this.bloomA.texture));
      gl.uniform2f(u.direction, (1.6 + pass) / this.bloomA.width, 0);
      this.draw(this.bloomB);
      gl.uniform1i(u.uTexture, this.bindTexture(0, this.bloomB.texture));
      gl.uniform2f(u.direction, 0, (1.6 + pass) / this.bloomA.height);
      this.draw(this.bloomA);
    }

    u = this.programs.display.use();
    gl.uniform1i(u.uTexture, this.bindTexture(0, this.dye.read.texture));
    gl.uniform1i(u.uBloom, this.bindTexture(1, this.bloomA.texture));
    gl.uniform1f(u.aspectRatio, this.aspect);
    gl.uniform1f(u.bloomIntensity, this.settings.bloom * (0.75 + energy * 1.4));
    gl.uniform1f(u.rays, this.settings.rays);
    gl.uniform1f(u.segments, this.segments);
    gl.uniform1f(u.paper, this.settings.paper ? 1 : 0);
    gl.uniform1f(u.time, this.time);
    this.draw(null);
    this.frames++;
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    const gl = this.gl;
    this.deleteTargets();
    if (this.quad) gl.deleteBuffer(this.quad);
    if (this.indices) gl.deleteBuffer(this.indices);
    for (const p of Object.values(this.programs)) {
      gl.deleteProgram(p.program);
    }
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}
