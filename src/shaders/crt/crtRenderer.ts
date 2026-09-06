import { CRT_SCREENS, CRT_STYLES, type CrtStyle, type CrtVariant } from "./crtScreens";
import { CRT_FRAGMENT_SHADER, CRT_VERTEX_SHADER } from "./crtShaders";

export const CRT_VARIANTS = ["terminal", "cinematic", "blue-screen", "nintendo"] as const;

export type Segment = { t: string; c: "p" | "d" | "a" | "h" };
export const segment = (text: string, color: Segment["c"] = "p"): Segment => ({ t: text, c: color });
const dots = (count: number) => "·".repeat(count);

export const DEFAULT_LOG: Segment[][] = [
  [segment("ZION MAINFRAME  v9.1.1"), segment("   (c) 2199 Nebuchadnezzar", "d")], [segment("CONSTRUCT Broadcast  Rev M  S/N NX-0101-0011", "d")], [],
  [segment("Hacking Matrix grid nodes "), segment(`${dots(14)} `, "d"), segment("OK", "a")], [segment("Neural Jack  0x000-0x0FF "), segment(`${dots(11)} `, "d"), segment("ONLINE "), segment("OK", "a")], [segment("Pinging agent signatures "), segment(`${dots(6)} `, "d"), segment("3 found")],
  [segment("nav0  OPERATOR UPLINK SECURE ", "d"), segment(`${dots(6)} `, "d"), segment("READY", "a")], [segment("vis0  CODE RAIN DECRYPT 256bit ", "d"), segment("READY", "a")], [segment("net0  HARDLINE CONNECTION MAX ", "d"), segment(`${dots(4)} `, "d"), segment("LINK", "a")], [segment("red0  RED PILL EXTRACTION ", "d"), segment(`${dots(4)} `, "d"), segment("READY", "a")],
  [segment("Mounting /dev/mind -> ROOT: "), segment(`${dots(6)} `, "d"), segment("OK", "a")], [segment("Loading weapon training program "), segment(`${dots(4)} `, "d"), segment("OK", "a")], [segment("Starting [ jmp spd str wpn ] "), segment(`${dots(4)} `, "d"), segment("OK", "a")], [segment("Locating the Oracle sector "), segment(`${dots(6)} `, "d"), segment("99.9%")], [],
  [segment("SYSTEM ANOMALY  "), segment("detected.", "h")], [segment("subject Thomas A. Anderson   status asleep ", "d"), segment("z", "d"), segment("Z", "d")], [], [segment("wake up: ")],
];

export type CrtOptions = {
  variant: CrtVariant;
  speed: number;
  typeSpeed: number;
  motion: number;
  brightness: number;
  opacity: number;
  hue: number;
  saturation: number;
  getLog?: () => Segment[][];
};

export const CRT_DEFAULTS: CrtOptions = { variant: "terminal", speed: 1, typeSpeed: 1, motion: 1, brightness: 1, opacity: 1, hue: 0, saturation: 1 };
export const crtStyle = (variant: CrtVariant): CrtStyle => CRT_STYLES[variant] ?? CRT_STYLES.terminal;

const COLORS = { p: { fill: "#8df0b4", glow: "rgba(28,236,132,0.95)" }, d: { fill: "#4f9a76", glow: "rgba(28,236,132,0.45)" }, a: { fill: "#ffba5e", glow: "rgba(255,150,52,0.95)" }, h: { fill: "#eafff3", glow: "rgba(120,255,190,0.95)" } };
const lineLength = (line: Segment[]) => line.reduce((total, item) => total + item.t.length, 0);
const MAX_BUFFER_WIDTH = 1920, MIN_BUFFER_WIDTH = 640, MAX_BUFFER_PIXELS = 2_400_000;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create CRT shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "CRT shader compilation failed");
  return shader;
}

export function createCrtRenderer(host: HTMLElement, canvas: HTMLCanvasElement, getOptions: () => CrtOptions) {
  let isContextLost = false;
  const handleContextLost = (e: Event) => {
    e.preventDefault();
    isContextLost = true;
  };
  const handleContextRestored = () => {
    isContextLost = false;
  };
  canvas.addEventListener("webglcontextlost", handleContextLost);
  canvas.addEventListener("webglcontextrestored", handleContextRestored);

  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, depth: false, premultipliedAlpha: false });
  if (!gl) throw new Error("CRT requires WebGL");

  const textCanvas = document.createElement("canvas");
  const textContext = textCanvas.getContext("2d");
  if (!textContext) throw new Error("CRT text canvas unavailable");

  let vertex: WebGLShader | null = null;
  let fragment: WebGLShader | null = null;
  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  let texture: WebGLTexture | null = null;

  try {
    vertex = compile(gl, gl.VERTEX_SHADER, CRT_VERTEX_SHADER);
    fragment = compile(gl, gl.FRAGMENT_SHADER, CRT_FRAGMENT_SHADER);
    program = gl.createProgram();
    if (!program) throw new Error("Unable to create CRT program");
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "CRT link failed");
    gl.useProgram(program);

    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  } catch (err) {
    console.error("CRT WebGL Init Error:", err);
  }

  const uniform = (name: string) => (program && gl ? gl.getUniformLocation(program, name) : null);
  const uTexture = uniform("uTex"), uResolution = uniform("uRes"), uTime = uniform("uTime"), uMotion = uniform("uMotion"), uCurve = uniform("uCurve"), uScan = uniform("uScan"), uScanDepth = uniform("uScanDepth"), uTriad = uniform("uTriad"), uGrille = uniform("uGrille"), uChroma = uniform("uChroma"), uBar = uniform("uBar"), uFlicker = uniform("uFlicker"), uGrain = uniform("uGrain"), uNoise = uniform("uNoise"), uVignette = uniform("uVignette"), uMono = uniform("uMono"), uGain = uniform("uGain"), uHalo = uniform("uHalo"), uSheen = uniform("uSheen"), uRoom = uniform("uRoom");

  if (program && gl && uTexture) {
    gl.useProgram(program);
    gl.uniform1i(uTexture, 0);
  }

  let width = 1, height = 1, cssWidth = 1, cssHeight = 1, fontSize = 14, lineHeight = 20, startY = 0, charWidth = 8, caretX = 0, caretY = 0, typed = 0, done = false, textDirty = true, lastTextAt = 0, lastReveal = -1, lastBlink = -1, variant: CrtVariant = "terminal", style = crtStyle(variant);
  const startedAt = performance.now();
  let currentLogSnapshot = DEFAULT_LOG;

  const applyStyle = () => {
    if (!gl || !program || isContextLost) return;
    gl.useProgram(program);
    gl.uniform2f(uCurve, style.curve[0], style.curve[1]);
    gl.uniform1f(uScanDepth, style.scanDepth);
    gl.uniform1f(uGrille, style.grille);
    gl.uniform1f(uChroma, style.chroma);
    gl.uniform1f(uBar, style.bar);
    gl.uniform1f(uFlicker, style.flicker);
    gl.uniform1f(uGrain, style.grain);
    gl.uniform1f(uNoise, style.noise);
    gl.uniform1f(uVignette, style.vignette);
    gl.uniform1f(uMono, style.mono);
    gl.uniform1f(uGain, style.gain);
    gl.uniform1f(uHalo, style.halo);
    gl.uniform3f(uSheen, style.sheen[0], style.sheen[1], style.sheen[2]);
    gl.uniform3f(uRoom, style.room[0], style.room[1], style.room[2]);
    const filter = style.filtering === "nearest" ? gl.NEAREST : gl.LINEAR;
    if (texture) {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    }
  };

  const layout = (log: Segment[][]) => {
    const lines = Math.max(log.length, 1);
    const maxChars = Math.min(80, Math.max(...log.map(lineLength), 50));
    startY = height * 0.08;
    lineHeight = Math.max(12, (height * 0.84) / Math.max(lines, 12));
    fontSize = Math.max(10, Math.min(lineHeight * 0.8, (width * 0.90) / (maxChars * 0.62)));
    textContext.font = `600 ${fontSize.toFixed(2)}px ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace`;
    charWidth = textContext.measureText("M").width || fontSize * 0.6;
  };

  const setStyle = (key: Segment["c"], glow: boolean) => {
    const color = COLORS[key] || COLORS.p;
    textContext.fillStyle = color.fill;
    textContext.shadowColor = glow ? color.glow : "transparent";
    textContext.shadowBlur = glow ? fontSize * 0.38 : 0;
  };

  const drawScreen = (reveal: number, log: Segment[][]) => {
    const maxChars = Math.min(80, Math.max(...log.map(lineLength), 50));
    textContext.setTransform(1, 0, 0, 1, 0, 0);
    textContext.fillStyle = "#03100a";
    textContext.fillRect(0, 0, width, height);
    textContext.textAlign = "left";
    textContext.textBaseline = "top";
    textContext.font = `600 ${fontSize.toFixed(2)}px ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace`;

    let remaining = reveal;
    let y = startY;
    const startX = Math.max(12, Math.floor((width - maxChars * charWidth) / 2));
    caretX = startX;
    caretY = startY;

    for (const line of log) {
      const length = lineLength(line);
      const visible = reveal === Infinity ? Infinity : Math.min(remaining, length);
      let x = startX;
      let drawn = 0;

      for (const item of line) {
        let text = item.t;
        if (visible !== Infinity) {
          const left = visible - drawn;
          if (left <= 0) break;
          if (left < text.length) text = text.slice(0, left);
        }
        if (text.length) {
          setStyle(item.c, true);
          textContext.fillText(text, x, y);
          setStyle(item.c, false);
          textContext.fillText(text, x, y);
          x += charWidth * text.length;
        }
        drawn += item.t.length;
        if (visible !== Infinity && drawn >= visible) break;
      }

      caretX = x;
      caretY = y;
      if (visible !== Infinity) remaining -= visible;
      y += lineHeight;
      if (visible !== Infinity && remaining <= 0) break;
    }
  };

  const drawCursor = () => {
    textContext.shadowColor = COLORS.p.glow;
    textContext.shadowBlur = fontSize * 0.42;
    textContext.fillStyle = "#bdf8d2";
    textContext.fillRect(caretX, caretY + fontSize * 0.06, Math.max(charWidth * 0.92, 4), fontSize * 0.96);
    textContext.shadowBlur = 0;
    textContext.fillRect(caretX, caretY + fontSize * 0.06, Math.max(charWidth * 0.92, 4), fontSize * 0.96);
  };

  const uploadTexture = () => {
    if (!gl || !texture || isContextLost) return;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    textDirty = false;
  };

  const resize = () => {
    if (!gl || isContextLost) return;
    const bounds = host.getBoundingClientRect();
    cssWidth = Math.max(1, bounds.width);
    cssHeight = Math.max(1, bounds.height);
    const density = Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio || 1, 2);
    let nextWidth = Math.max(MIN_BUFFER_WIDTH, Math.round(Math.min(cssWidth * density, MAX_BUFFER_WIDTH)));
    let nextHeight = Math.max(1, Math.round((nextWidth * cssHeight) / cssWidth));

    if (nextWidth * nextHeight > MAX_BUFFER_PIXELS) {
      const fit = Math.sqrt(MAX_BUFFER_PIXELS / (nextWidth * nextHeight));
      nextWidth = Math.round(nextWidth * fit);
      nextHeight = Math.round(nextHeight * fit);
    }

    const surface = style.surface;
    const screenWidth = surface.mode === "fixed" ? surface.width : surface.mode === "cap" ? Math.min(nextWidth, surface.width) : nextWidth;
    const screenHeight = surface.mode === "fixed" ? surface.height : Math.max(1, Math.round((screenWidth * nextHeight) / nextWidth));

    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
    }

    if (textCanvas.width !== screenWidth || textCanvas.height !== screenHeight) {
      textCanvas.width = screenWidth;
      textCanvas.height = screenHeight;
      width = screenWidth;
      height = screenHeight;
      const opts = getOptions();
      const activeLog = opts.getLog ? opts.getLog() : DEFAULT_LOG;
      layout(activeLog);
      lastReveal = -1;
      lastBlink = -1;
      lastTextAt = 0;
      textDirty = true;
    }

    if (program) {
      gl.useProgram(program);
      gl.viewport(0, 0, nextWidth, nextHeight);
      gl.uniform2f(uResolution, nextWidth, nextHeight);
      gl.uniform1f(uScan, Math.max(120, Math.min(cssHeight * style.scanDensity, 900)));
      gl.uniform1f(uTriad, Math.max(2, (style.triadCss * nextWidth) / cssWidth));
    }
  };

  const maybeRedrawText = (now: number, activeLog: Segment[][], isDynamic: boolean) => {
    const reveal = isDynamic || done ? Infinity : Math.floor(typed);
    const blink = Math.floor((now - startedAt) / 420) % 2 === 0 ? 1 : 0;
    const logChanged = currentLogSnapshot !== activeLog;

    if (logChanged) {
      currentLogSnapshot = activeLog;
      layout(activeLog);
      textDirty = true;
    }

    const due = !done && !isDynamic ? now - lastTextAt > 42 : blink !== lastBlink;
    if (reveal === lastReveal && blink === lastBlink && !due && !textDirty && !logChanged) return;

    drawScreen(reveal, activeLog);
    if (blink) drawCursor();
    lastTextAt = now;
    lastReveal = reveal;
    lastBlink = blink;
    textDirty = true;
  };

  applyStyle();

  return {
    resize,
    render(now: number) {
      if (isContextLost || !gl || !program) return;
      const options = getOptions();
      const requested = CRT_STYLES[options.variant] ? options.variant : "terminal";

      if (requested !== variant) {
        variant = requested;
        style = crtStyle(variant);
        applyStyle();
        typed = 0;
        done = false;
        lastReveal = -1;
        lastBlink = -1;
        lastTextAt = 0;
        resize();
      }

      const seconds = (now - startedAt) * 0.001 * options.speed;
      const isDynamic = typeof options.getLog === "function";
      const activeLog = isDynamic ? options.getLog!() : DEFAULT_LOG;

      if (variant === "terminal") {
        if (!isDynamic && !done) {
          const totalChars = activeLog.reduce((total, line) => total + lineLength(line), 0);
          typed += 4.4 * options.typeSpeed;
          if (typed >= totalChars) {
            typed = totalChars;
            done = true;
          }
        }
        maybeRedrawText(now, activeLog, isDynamic);
      } else if (now - lastTextAt >= style.redrawMs || textDirty) {
        CRT_SCREENS[variant](textContext, width, height, seconds);
        lastTextAt = now;
        textDirty = true;
      }

      if (textDirty) uploadTexture();

      gl.useProgram(program);
      gl.uniform1f(uTime, seconds);
      gl.uniform1f(uMotion, options.motion);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      if (gl) {
        if (buffer) gl.deleteBuffer(buffer);
        if (texture) gl.deleteTexture(texture);
        if (program) gl.deleteProgram(program);
        if (vertex) gl.deleteShader(vertex);
        if (fragment) gl.deleteShader(fragment);
      }
    },
  };
}
