/* Disque du Cycle : passage d'une étape à l'autre.
   Version de base (sans WebGL, mode calme) : la nouvelle photo s'ouvre en cercle (clip-path, CSS).
   Avec WebGL : la nouvelle photo se dilate depuis le centre avec un front irrégulier liseré de rouge,
   l'ancienne recule légèrement. Le canvas n'est dessiné que pendant le passage (environ 1 s),
   puis il disparaît : au repos, c'est la vraie photo qui est affichée, nette. */

const VS = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;v.y=1.-v.y;gl_Position=vec4(p,0.,1.);}';
const FS = `precision mediump float;
uniform sampler2D ta,tb;uniform float pr,tm;uniform vec2 sa,sb;varying vec2 v;
float h(vec2 q){return fract(sin(dot(q,vec2(12.9898,78.233)))*43758.5453);}
float n(vec2 q){vec2 i=floor(q),f=fract(q);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
void main(){
  vec2 c=v-.5;float d=length(c)*2.;
  if(d>1.02){gl_FragColor=vec4(0.);return;}
  float b=n(v*6.+tm*.35)*.55+n(v*13.-tm*.2)*.3;
  float f=pr*1.9-.35;
  float e=d+b*.32-f;
  float m=1.-smoothstep(-.1,0.,e);
  float tw=m*(1.-m)*.5;
  vec2 ua=.5+(c+vec2(-c.y,c.x)*tw*.12)*(1.-.06*pr)/sa;
  vec2 ub=.5+c*(1.-.14*(1.-pr))/sb;
  vec4 A=texture2D(ta,ua),B=texture2D(tb,ub);
  vec3 col=mix(A.rgb,B.rgb,m);
  float lis=(1.-smoothstep(0.,.035,abs(e+.05)))*step(.02,pr)*step(pr,.98);
  col=mix(col,vec3(.91,.27,.17),lis);
  gl_FragColor=vec4(col,1.);
}`;

function compiler(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}

export function initDisque(el, { calme = false } = {}) {
  const images = [...el.querySelectorAll('.cycle-image')];
  const canvas = el.querySelector('.cycle-canvas');
  const css = (i, prec) => images.forEach((f, k) => {
    f.classList.toggle('est-active', k === i);
    f.classList.toggle('est-precedente', k === prec && prec !== i);
  });
  const base = { aller: css, pret: Promise.resolve() };
  if (calme || !canvas) return base;

  let gl = null, prog = null, u = {};
  try {
    gl = canvas.getContext('webgl', { premultipliedAlpha: false, antialias: false, alpha: true });
    if (!gl) return base;
    prog = gl.createProgram();
    gl.attachShader(prog, compiler(gl, gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compiler(gl, gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('lien');
    gl.useProgram(prog);
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    ['ta', 'tb', 'pr', 'tm', 'sa', 'sb'].forEach((k) => { u[k] = gl.getUniformLocation(prog, k); });
    gl.uniform1i(u.ta, 0);
    gl.uniform1i(u.tb, 1);
  } catch (err) {
    console.warn('[cycle] WebGL indisponible', err);
    return base;
  }

  /* Taille du canvas mesurée au chargement et au redimensionnement, jamais pendant le défilement. */
  const dpr = () => Math.min(window.devicePixelRatio || 1, window.innerWidth < 761 ? 1 : 1.25);
  const dimensionner = () => {
    const r = el.getBoundingClientRect();
    const w = Math.max(2, Math.round(r.width * dpr()));
    if (canvas.width !== w) { canvas.width = w; canvas.height = w; }
  };
  dimensionner();
  new ResizeObserver(dimensionner).observe(el);

  /* Textures : chargées depuis la photo déjà décodée de chaque étape. */
  const textures = images.map(() => null);
  const echelles = images.map(() => [1, 1]);
  const charger = (k) => {
    if (textures[k]) return Promise.resolve(true);
    const img = images[k].querySelector('img');
    if (!img) return Promise.resolve(false);
    const pret = img.complete && img.naturalWidth ? Promise.resolve() : new Promise((ok, ko) => { img.addEventListener('load', ok, { once: true }); img.addEventListener('error', ko, { once: true }); });
    return pret.then(() => (img.decode ? img.decode().catch(() => {}) : null)).then(() => {
      const t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      const ratio = img.naturalWidth / img.naturalHeight;
      echelles[k] = ratio >= 1 ? [ratio, 1] : [1, 1 / ratio];
      textures[k] = t;
      return true;
    }).catch(() => false);
  };
  /* Les textures se préparent quand le cycle approche de l'écran. */
  const io = new IntersectionObserver((es) => {
    if (es.some((e) => e.isIntersecting)) { images.forEach((_, k) => charger(k)); io.disconnect(); }
  }, { rootMargin: '600px' });
  io.observe(el);

  let raf = 0, enCours = null;
  const dessiner = (a, b, p, t) => {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, textures[a]);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, textures[b]);
    gl.uniform2fv(u.sa, echelles[a]);
    gl.uniform2fv(u.sb, echelles[b]);
    gl.uniform1f(u.pr, p);
    gl.uniform1f(u.tm, t);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  function aller(i, prec) {
    css(i, prec);
    if (prec == null || prec < 0 || prec === i || document.hidden) return;
    if (!textures[i] || !textures[prec]) { charger(i); return; }
    cancelAnimationFrame(raf);
    const debut = performance.now(), duree = 1050;
    enCours = { i, prec };
    canvas.classList.add('actif');
    const pas = (t) => {
      const x = Math.min(1, (t - debut) / duree);
      const p = x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
      dessiner(enCours.prec, enCours.i, p, t / 1000);
      if (x < 1) raf = requestAnimationFrame(pas);
      else { raf = 0; canvas.classList.remove('actif'); enCours = null; }
    };
    raf = requestAnimationFrame(pas);
  }

  return { aller, pret: Promise.resolve() };
}
