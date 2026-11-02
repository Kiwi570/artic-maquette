/* Effets propres à Artic!Agency. Le socle gère l'ouverture, les transitions, l'en-tête, le menu, le mode calme,
   les boucles, les mesures et la bibliothèque d'effets (lignes, mots, cascade, rideau, parallaxe, zoom, trace,
   galerie, onde, magnétique, incline). Ici, seulement les effets du plan d'animation :
   bouchon (intro), encre, cycle, etiquette, audit, parcours, cartes-menu, point-final, anneau-sommaire, tirage,
   fil-du-temps, eventail, fil-rouge, plan ; et les outils des pages : visionneuse, filtres du journal, demande en étapes. */
import { demarrer, boucle, etat, rafraichir, bloquerDefilement, debloquerDefilement, suivre, lacher } from './socle/index.js?v=1';
import { initDisque } from './cycle-disque.js?v=1';

const gsap = window.gsap;
const ST = () => window.ScrollTrigger;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const statique = () => etat.calme || etat.arrivee === 'retour' || document.documentElement.classList.contains('secours') || !gsap || !ST();
const finals = [];
const deux = (n) => String(n).padStart(2, '0');

/* ---------- Encre : le manifeste passe du gris à l'encre au fil de la lecture (jamais en arrière) ---------- */
function encre() {
  const p = $('.encre');
  if (!p) return;
  const mots = $$('.mot', p);
  const cle = $('.mot-cle', p);
  const idxCle = cle ? mots.indexOf(cle.querySelector('.mot')) : -1;
  let fait = 0;
  const jusqua = (n) => {
    for (; fait < Math.min(n, mots.length); fait++) mots[fait].classList.add('lu');
    if (cle && fait > idxCle + 1) cle.classList.add('souligne');
  };
  const final = () => { jusqua(mots.length); if (cle) cle.classList.add('souligne'); };
  finals.push(final);
  if (statique()) return final();
  ST().create({ trigger: p, start: 'top 85%', end: 'bottom 52%', onUpdate: (st) => jusqua(Math.ceil(st.progress * (mots.length + 2))), onLeave: final });
}

/* ---------- Le Cycle : l'anneau tourne d'un cinquième de tour par étape ---------- */
function cycle() {
  const scene = $('.cycle-scene');
  if (!scene) return;
  const tourne = $('.cycle-tourne', scene), arc = $('.cycle-arc', scene), num = $('.cycle-num', scene);
  const noeuds = $$('.cycle-noeud', scene), libelles = $$('.cycle-libelle', scene);
  const etapes = $$('.cycle-etape');
  const disque = initDisque($('.cycle-disque', scene), { calme: etat.calme });
  let actif = -1;
  const activer = (i) => {
    if (i === actif) return;
    const prec = actif;
    actif = i;
    noeuds.forEach((n, k) => { n.classList.toggle('est-active', k === i); n.classList.toggle('est-passe', k < i); });
    etapes.forEach((e, k) => e.classList.toggle('est-active', k === i));
    num.textContent = deux(i + 1);
    disque.aller(i, prec);
  };
  /* Libellés : écartés vers l'extérieur quand ils passent sur les côtés, pour ne jamais couvrir leur pastille. */
  const bases = libelles.map((l) => Math.atan2(+l.dataset.x - 350, 350 - +l.dataset.y));
  const larg = libelles.map(() => 0);
  const poser = (p) => {
    const r = -72 * p;
    tourne.setAttribute('transform', `rotate(${r.toFixed(2)} 350 350)`);
    libelles.forEach((l, k) => {
      if (!larg[k]) { try { larg[k] = l.getBBox().width; } catch { larg[k] = 0; } }
      const tx = Math.sin(bases[k] + (r * Math.PI) / 180) * Math.max(0, larg[k] / 2 - 26);
      l.setAttribute('transform', `rotate(${(-r).toFixed(2)} ${l.dataset.x} ${l.dataset.y}) translate(${tx.toFixed(1)} 0)`);
    });
    arc.style.setProperty('--arc', (p / 5 + 0.0001).toFixed(4));
    activer(Math.min(4, Math.max(0, Math.round(p))));
  };
  poser(0);
  if (statique()) {
    /* Sans animation : l'étape au centre de l'écran est affichée directement. */
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) poser(+e.target.dataset.etape); }), { rootMargin: '-45% 0px -45% 0px' });
    etapes.forEach((e) => io.observe(e));
    return;
  }
  const liste = $('.cycle-etapes');
  const proxy = { p: 0 };
  gsap.to(proxy, {
    p: 4, ease: 'none',
    onUpdate: () => poser(proxy.p),
    scrollTrigger: {
      trigger: liste, scrub: 0.6, invalidateOnRefresh: true,
      start: () => `top+=${etapes[0].offsetHeight / 2} 50%`,
      end: () => `bottom-=${etapes[etapes.length - 1].offsetHeight / 2} 50%`,
    },
  });
}

/* ---------- Étiquettes des projets : elles se balancent selon la vitesse du défilement ---------- */
function etiquettes() {
  const section = $('.projets') || $('.projets-liste');
  const els = $$('.etiquette');
  if (!section || !els.length || etat.calme) return;
  const piste = $('.galerie-piste', section);
  let y0 = window.scrollY, x0 = piste ? piste.scrollLeft : 0, vitesse = 0;
  const etats = els.map((el, i) => ({ el, a: 0, w: 0, phase: i * 1.9 }));
  finals.push(() => etats.forEach((s) => { s.a = 0; s.w = 0; s.el.style.transform = ''; }));
  boucle(section, (dt, t) => {
    if (!dt) return;
    const y = window.scrollY, x = piste ? piste.scrollLeft : 0;
    const d = (y - y0) + (x - x0);
    y0 = y; x0 = x;
    vitesse += (d / dt - vitesse) * Math.min(1, dt * 10);
    etats.forEach((s) => {
      const brise = Math.sin(t * 1.25 + s.phase) * 1.1;
      const acc = -36 * (s.a - brise) - 4.2 * s.w + vitesse * 0.055;
      s.w += acc * dt;
      s.a = Math.max(-18, Math.min(18, s.a + s.w * dt));
      s.el.style.transform = `rotate(${s.a.toFixed(2)}deg)`;
    });
  });
}

/* ---------- Tableau d'audit : jauges, chiffres et courbe (données illustratives) ---------- */
function audit() {
  const t = $('.tableau');
  if (!t) return;
  const jauges = $$('.jauge', t), valeurs = $$('.jauge-valeur', t), courbe = $('.courbe', t), aire = $('.courbe-aire', t);
  const ecrire = (el, v) => { el.textContent = `${Math.round(v)} %`; };
  const final = () => {
    jauges.forEach((j) => { j.style.strokeDasharray = `${j.dataset.valeur} 100`; });
    valeurs.forEach((v) => ecrire(v, +v.dataset.cible));
    if (courbe) { courbe.style.strokeDasharray = ''; courbe.style.strokeDashoffset = ''; }
    if (aire) aire.style.opacity = '';
  };
  finals.push(final);
  if (statique()) return final();
  gsap.set(courbe, { strokeDasharray: '1 1.2', strokeDashoffset: 1.1 });
  gsap.set(aire, { opacity: 0 });
  valeurs.forEach((v) => ecrire(v, 0));
  const tl = gsap.timeline({ paused: true, onComplete: final });
  jauges.forEach((j, i) => {
    const o = { v: 0 };
    tl.to(o, { v: +j.dataset.valeur, duration: 1.3, ease: 'power3.out', onUpdate: () => { j.style.strokeDasharray = `${o.v.toFixed(1)} 100`; ecrire(valeurs[i], o.v); } }, i * 0.12);
  });
  tl.to(courbe, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }, 0.2).to(aire, { opacity: 1, duration: 0.8 }, 1);
  ST().create({ trigger: t, start: 'top 80%', once: true, onEnter: () => tl.play() });
}

/* ---------- Carte du parcours : la route se trace, les lieux s'allument, la période défile ---------- */
function parcours() {
  const carte = $('.parcours-carte');
  if (!carte) return;
  const segs = $$('.carte-seg', carte);
  const lieux = new Map($$('.carte-lieu', carte).map((g) => [g.dataset.lieu, g]));
  const val = $('.carte-annee-val', carte);
  const longueurs = segs.map((s) => s.getTotalLength());
  const total = longueurs.reduce((a, b) => a + b, 0) || 1;
  const premier = lieux.get('vaud');
  if (premier) premier.classList.add('atteint');
  let max = -1;
  const poser = (p) => {
    if (p <= max) return;
    max = p;
    let reste = p * total;
    segs.forEach((s, i) => {
      const L = longueurs[i];
      const f = Math.min(1, Math.max(0, reste / L));
      reste -= L;
      s.style.strokeDasharray = `${L.toFixed(1)} ${(L + 4).toFixed(1)}`;
      s.style.strokeDashoffset = ((1 - f) * L + (f > 0 ? 0 : 2)).toFixed(1);
      if (f > 0.97) {
        const g = lieux.get(s.dataset.vers);
        if (g && !g.classList.contains('atteint')) { g.classList.add('atteint'); if (g.dataset.periode) val.textContent = g.dataset.periode; }
      }
    });
  };
  const final = () => { max = -1; poser(1); };
  finals.push(final);
  if (statique()) return final();
  poser(0);
  const proxy = { p: 0 };
  gsap.to(proxy, { p: 1, ease: 'none', onUpdate: () => poser(proxy.p), scrollTrigger: { trigger: carte, start: 'top 72%', end: 'bottom 48%', scrub: 0.5 } });
}

/* ---------- Témoignages : les cartes sont distribuées sur la table comme des cartes de menu ---------- */
function cartesMenu() {
  const liste = $('.temoignages-liste');
  if (!liste) return;
  const cartes = $$('.temoignage', liste);
  const final = () => gsap && gsap.set(cartes, { clearProps: 'transform' });
  finals.push(final);
  if (statique()) return;
  liste.style.position = 'relative';
  let mx = 0;
  const rot = [-7, 5, -4, 8];
  const tl = gsap.timeline({ paused: true });
  tl.fromTo(cartes, {
    x: (i, el) => liste.offsetWidth / 2 - (el.offsetLeft + el.offsetWidth / 2),
    y: (i, el) => Math.min(liste.offsetHeight / 2, window.innerHeight * 0.3) - (el.offsetTop + el.offsetHeight / 2),
    rotation: (i) => rot[i % 4], scale: 0.9,
  }, { x: 0, y: 0, rotation: 0, scale: 1, ease: 'power2.out', duration: 1, stagger: 0.12 });
  ST().create({
    trigger: liste, start: 'top 88%', end: 'top 30%',
    onUpdate: (st) => { mx = Math.max(mx, st.progress); tl.progress(mx); },
    onRefresh: () => { const p = mx; tl.invalidate(); tl.progress(p); },
  });
}

/* ---------- Point final : le « ! » se trace, son point tombe et rebondit ---------- */
function pointFinal() {
  const svg = $('.point-final');
  if (!svg) return;
  const final = () => svg.classList.add('joue');
  finals.push(final);
  if (statique()) return final();
  const barre = $('.point-final-barre', svg), point = $('.point-final-point', svg);
  ST().create({
    trigger: svg, start: 'top 88%', once: true,
    onEnter: () => {
      gsap.timeline({ onComplete: () => { final(); gsap.set([barre, point], { clearProps: 'all' }); } })
        .fromTo(barre, { strokeDashoffset: 1.1 }, { strokeDashoffset: 0, duration: 0.75, ease: 'power2.inOut' })
        .fromTo(point, { y: -150, opacity: 1 }, { y: 0, duration: 0.7, ease: 'bounce.out' }, 0.55)
        .to(point, { scaleY: 0.78, scaleX: 1.16, svgOrigin: '30 212', duration: 0.07 }, 0.8)
        .to(point, { scaleY: 1, scaleX: 1, svgOrigin: '30 212', duration: 0.22, ease: 'power2.out' });
    },
  });
}

/* ---------- Anneau-sommaire (Expertises) : le chapitre lu s'allume, l'anneau tourne d'un huitième ---------- */
function anneauSommaire() {
  const aside = $('[data-effet="anneau-sommaire"]');
  if (!aside) return;
  const chapitres = $$('[data-chapitre]');
  const liens = $$('[data-sommaire-lien]', aside), arcs = $$('.sommaire-arc', aside);
  const g = $('.sommaire-anneau > g', aside), num = $('.sommaire-num', aside), courant = $('.sommaire-courant', aside);
  const noms = liens.map((a) => [...a.childNodes].filter((n) => n.nodeType === 3 || !n.matches('span')).map((n) => n.textContent).join('').trim());
  let actif = -1, premier = true;
  const poser = (i) => {
    if (i === actif) return;
    actif = i;
    liens.forEach((a, k) => { if (k === i) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
    arcs.forEach((a, k) => { a.classList.toggle('est-actif', k === i); a.classList.toggle('est-passe', k < i); });
    if (g) {
      if (premier) { g.style.transition = 'none'; requestAnimationFrame(() => requestAnimationFrame(() => { g.style.transition = ''; })); premier = false; }
      g.style.transform = `rotate(${-110 - i * 45}deg)`;
    }
    if (num) num.textContent = deux(i + 1);
    if (courant) courant.textContent = noms[i] || '';
  };
  let prevu = 0;
  const mesurer = () => {
    prevu = 0;
    const ligne = window.innerHeight * 0.42;
    let i = 0;
    chapitres.forEach((c, k) => { if (c.getBoundingClientRect().top < ligne) i = k; });
    poser(i);
  };
  addEventListener('scroll', () => { if (!prevu) prevu = requestAnimationFrame(mesurer); }, { passive: true });
  addEventListener('resize', mesurer);
  mesurer();
}

/* ---------- Tirage (distriBOtion) : le verre se remplit par le fond au fil des étapes ---------- */
function tirage() {
  const bloc = $('[data-effet="tirage"]');
  if (!bloc) return;
  const verre = $('.verre', bloc), annee = $('.tirage-annee', bloc);
  const etapes = $$('.tirage-etape');
  const bulles = $$('.verre-bulles circle', bloc).map((b, i) => ({ b, y: +b.getAttribute('cy'), v: 22 + i * 7 }));
  const VIDE = 300, PLEIN = 20;
  let niveau = PLEIN, max = 0;
  const remplir = (f) => {
    if (f < max) return;
    max = f;
    niveau = VIDE - f * (VIDE - PLEIN);
    verre.style.setProperty('--niveau', `${niveau.toFixed(1)}px`);
  };
  /* L'année suit l'étape lue, dans tous les modes (simple changement de texte). */
  let an = annee.textContent, prevu = 0;
  const lire = () => {
    prevu = 0;
    const ligne = window.innerHeight * (window.innerWidth < 761 ? 0.32 : 0.55);
    let a = etapes[0] ? etapes[0].dataset.annee : an;
    etapes.forEach((e) => { if (e.getBoundingClientRect().top < ligne) a = e.dataset.annee; });
    if (a === an) return;
    an = a;
    annee.textContent = a;
    if (!statique()) gsap.fromTo(annee, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
  };
  addEventListener('scroll', () => { if (!prevu) prevu = requestAnimationFrame(lire); }, { passive: true });
  lire();
  const final = () => { max = 0; remplir(1); };
  finals.push(final);
  if (statique()) return final();
  remplir(0);
  ST().create({ trigger: '.tirage-etapes', start: 'top 75%', end: 'bottom 65%', onUpdate: (st) => remplir(st.progress) });
  /* Bulles : elles montent dans le liquide, jamais au-dessus. */
  boucle(bloc.closest('section') || bloc, (dt) => {
    if (!dt) return;
    bulles.forEach((o) => {
      o.y -= o.v * dt;
      if (o.y < niveau + 8) o.y = 288;
      o.b.setAttribute('cy', o.y.toFixed(1));
      o.b.style.opacity = niveau > 280 ? 0 : 1;
    });
  });
}

/* ---------- Fil du temps (À propos) : le fil rouge descend et allume chaque étape (jamais en arrière) ---------- */
function filDuTemps() {
  const corps = $('[data-effet="fil-du-temps"]');
  if (!corps) return;
  const fil = $('.frise-fil > span', corps), etapes = $$('.frise-etape', corps);
  let max = 0, reperes = [];
  const mesurer = () => {
    const h = corps.offsetHeight || 1, top = corps.getBoundingClientRect().top;
    reperes = etapes.map((e) => (e.getBoundingClientRect().top - top + 25) / h);
  };
  const poser = (p) => {
    if (p < max) return;
    max = p;
    fil.style.transform = `scaleY(${p.toFixed(4)})`;
    etapes.forEach((e, i) => { if (reperes[i] <= p + 0.002) e.classList.add('atteinte'); });
  };
  const final = () => { fil.style.transform = 'none'; etapes.forEach((e) => e.classList.add('atteinte')); max = 1; };
  finals.push(final);
  if (statique()) return final();
  mesurer();
  poser(0);
  ST().create({ trigger: corps, start: 'top 62%', end: 'bottom 62%', onUpdate: (st) => poser(st.progress), onRefresh: mesurer });
}

/* ---------- Éventail (À propos) : les coupures de presse s'ouvrent comme une main de cartes ---------- */
function eventail() {
  const ul = $('[data-effet="eventail"]');
  if (!ul) return;
  let max = 0;
  const final = () => { ul.style.setProperty('--ouvert', 1); max = 1; };
  finals.push(final);
  if (statique()) return final();
  ST().create({
    trigger: ul, start: 'top 85%', end: 'center 50%',
    onUpdate: (st) => { const p = gsap.parseEase('power2.out')(st.progress); if (p > max) { max = p; ul.style.setProperty('--ouvert', p.toFixed(3)); } },
    onLeave: final,
  });
}

/* ---------- Plan (Contact) : Orbe pulse trois fois quand le plan paraît ---------- */
function plan() {
  const fig = $('[data-effet="plan"]');
  if (!fig) return;
  const final = () => fig.classList.add('joue');
  if (!('IntersectionObserver' in window)) return final();
  const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { final(); io.disconnect(); } }, { threshold: 0.4 });
  io.observe(fig);
}

/* ---------- Visionneuse (distriBOtion) : chaque photo a son lien (#photo-3), flèches, clavier, glisser ---------- */
function visionneuse() {
  const fen = $('[data-visionneuse-fenetre]');
  if (!fen) return;
  const vignettes = $$('[data-visionneuse]');
  const legende = $('figcaption', fen);
  let img = null; /* créée à la première ouverture : aucune image vide dans la page */
  const fermerB = $('[data-visionneuse-fermer]', fen), prec = $('[data-visionneuse-prec]', fen), suiv = $('[data-visionneuse-suiv]', fen);
  const motImage = fen.dataset.texteImage || 'Image';
  const sources = vignettes.map((a) => {
    const i = $('img', a);
    const liste = (i.getAttribute('srcset') || '').split(',').map((x) => x.trim().split(/\s+/)).filter((x) => x[0]);
    liste.sort((x, y) => parseInt(y[1], 10) - parseInt(x[1], 10));
    return { src: liste[0] ? liste[0][0] : i.src, alt: i.alt };
  });
  let courant = -1, origine = null;
  const montrer = (i) => {
    courant = (i + sources.length) % sources.length;
    const s = sources[courant];
    if (!img) { img = document.createElement('img'); img.decoding = 'async'; legende.before(img); }
    img.alt = s.alt; img.src = s.src;
    legende.textContent = `${motImage} ${courant + 1} / ${sources.length}`;
    history.replaceState(null, '', `#photo-${courant + 1}`);
    if (!statique()) gsap.fromTo(img, { opacity: 0, scale: 0.985 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' });
  };
  const ouvrir = (i, depuis) => {
    origine = depuis || vignettes[i];
    fen.hidden = false;
    bloquerDefilement('visionneuse');
    suivre(fen);
    montrer(i);
    if (!statique()) gsap.fromTo(fen, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out' });
    fermerB.focus();
  };
  const fermer = () => {
    if (fen.hidden) return;
    fen.hidden = true;
    debloquerDefilement('visionneuse');
    lacher(fen);
    history.replaceState(null, '', location.pathname + location.search);
    const retour = vignettes[courant] || origine;
    courant = -1;
    if (retour) retour.focus({ preventScroll: false });
  };
  vignettes.forEach((a, i) => a.addEventListener('click', (e) => { e.preventDefault(); ouvrir(i, a); }));
  prec.addEventListener('click', () => montrer(courant - 1));
  suiv.addEventListener('click', () => montrer(courant + 1));
  fermerB.addEventListener('click', fermer);
  fen.addEventListener('click', (e) => { if (e.target === fen) fermer(); });
  fen.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); fermer(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); montrer(courant - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); montrer(courant + 1); }
    else if (e.key === 'Tab') {
      const f = [prec, suiv, fermerB];
      const k = f.indexOf(document.activeElement);
      if (e.shiftKey && k <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && k === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
  let x0 = null;
  fen.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
  fen.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) montrer(courant + (dx < 0 ? 1 : -1));
  });
  const depuisAdresse = () => {
    const m = /^#photo-(\d+)$/.exec(location.hash);
    if (m && +m[1] >= 1 && +m[1] <= sources.length) ouvrir(+m[1] - 1);
  };
  depuisAdresse();
  addEventListener('hashchange', depuisAdresse);
}

/* ---------- Journal : filtre par saison et recherche (sans accents, sans majuscules, singulier ou pluriel) ---------- */
function journal() {
  const bloc = $('[data-journal]');
  if (!bloc) return;
  const filtres = $$('[data-filtre]', bloc), champ = $('#recherche-journal', bloc);
  const cartes = $$('.archives-liste > li', bloc), compte = $('[data-compte]', bloc), vide = $('[data-vide]', bloc);
  const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’‘]/g, "'").replace(/[«»"“”]/g, ' ');
  const racine = (m) => (m.length > 3 ? m.replace(/(es|s|x)$/, '') : m);
  const textes = cartes.map((c) => norm(c.dataset.texte || c.textContent));
  const params = new URLSearchParams(location.search);
  let saison = params.get('saison') || '';
  if (!filtres.some((f) => f.dataset.filtre === saison)) saison = '';
  champ.value = params.get('q') || '';
  const appliquer = (premier) => {
    const mots = norm(champ.value).split(/[^a-z0-9']+/).filter((m) => m.length > 1).map(racine);
    let n = 0;
    filtres.forEach((f) => f.setAttribute('aria-pressed', String(f.dataset.filtre === saison)));
    cartes.forEach((c, i) => {
      const ok = (!saison || c.dataset.saison === saison) && mots.every((m) => textes[i].includes(m));
      const etait = !c.classList.contains('masque');
      c.classList.toggle('masque', !ok);
      if (ok) {
        n++;
        if (!premier && !etait && !statique()) gsap.fromTo(c, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', delay: Math.min(n, 8) * 0.03, clearProps: 'transform' });
      }
    });
    compte.textContent = n <= 1 ? compte.dataset.un.replace('1', String(n)) : compte.dataset.plusieurs.replace('{n}', String(n));
    vide.hidden = n > 0;
    if (!premier) {
      const p = new URLSearchParams(location.search);
      if (saison) p.set('saison', saison); else p.delete('saison');
      if (champ.value.trim()) p.set('q', champ.value.trim()); else p.delete('q');
      const q = p.toString();
      history.replaceState(null, '', location.pathname + (q ? `?${q}` : '') + location.hash);
      rafraichir();
    }
  };
  filtres.forEach((f) => f.addEventListener('click', () => { saison = f.dataset.filtre; appliquer(false); }));
  let minuterie = 0;
  champ.addEventListener('input', () => { clearTimeout(minuterie); minuterie = setTimeout(() => appliquer(false), 160); });
  champ.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); clearTimeout(minuterie); appliquer(false); } });
  appliquer(true);
  if (saison || champ.value) rafraichir();
}

/* ---------- Demande en quatre étapes (Contact) : une question à la fois, récapitulatif en direct ---------- */
function demande() {
  const f = $('[data-etapes]');
  if (!f) return;
  const etapes = $$('[data-etape]', f), reperes = $$('[data-repere-etape]'), fil = $('.fil-rouge');
  const recap = (k) => $(`[data-recap-champ="${k}"]`);
  const erreurEx = $('[data-erreur-expertise]', f), projet = $('#f-projet', f);
  let n = 1, atteinte = 1;
  const params = new URLSearchParams(location.search);
  const voulue = params.get('expertise');
  if (voulue) $$('input[name="expertise"]', f).forEach((c) => { if (c.value === voulue) c.checked = true; });

  const coupe = (t, l) => (t.length > l ? `${t.slice(0, l).trim()}…` : t);
  const majRecap = () => {
    const ex = $$('input[name="expertise"]:checked', f).map((c) => c.nextElementSibling.textContent.trim());
    recap('expertise').textContent = ex.length ? ex.join(', ') : '—';
    recap('projet').textContent = projet.value.trim() ? coupe(projet.value.trim(), 140) : '—';
    const d = $('input[name="debut"]:checked', f);
    recap('debut').textContent = d && atteinte >= 3 ? d.nextElementSibling.textContent.trim() : '—';
    const v = (id) => ($(`#${id}`, f).value || '').trim();
    const qui = [[v('f-prenom'), v('f-nom')].filter(Boolean).join(' '), v('f-email'), v('f-entreprise')].filter(Boolean);
    recap('coordonnees').textContent = qui.length ? qui.join(' · ') : '—';
  };
  const marquer = () => {
    reperes.forEach((r) => {
      const k = +r.dataset.repereEtape;
      r.classList.toggle('active', k === n);
      r.classList.toggle('faite', k < n);
    });
    if (fil) fil.style.setProperty('--fil', ((n - 1) / 3).toFixed(3));
  };
  const valide = () => {
    if (n === 1) {
      const ok = $$('input[name="expertise"]:checked', f).length > 0;
      erreurEx.textContent = ok ? '' : erreurEx.dataset.texte;
      if (!ok) $('input[name="expertise"]', f).focus();
      return ok;
    }
    if (n === 2) {
      const ok = projet.value.trim().length > 0;
      let p = $('#erreur-f-projet', f);
      if (!p) {
        p = document.createElement('p');
        p.id = 'erreur-f-projet'; p.className = 'champ-erreur'; p.setAttribute('aria-live', 'polite');
        projet.closest('.champ').appendChild(p);
        projet.setAttribute('aria-describedby', p.id);
      }
      p.textContent = ok ? '' : projet.dataset.erreur;
      if (ok) projet.removeAttribute('aria-invalid'); else { projet.setAttribute('aria-invalid', 'true'); projet.focus(); }
      return ok;
    }
    return true;
  };
  const aller = (k) => {
    const h0 = f.offsetHeight;
    etapes.forEach((e) => { e.hidden = +e.dataset.etape !== k; });
    n = k;
    atteinte = Math.max(atteinte, k);
    majRecap();
    marquer();
    const champ = $('input:not([type="hidden"]), textarea', etapes[k - 1]);
    if (champ) champ.focus({ preventScroll: true });
    const haut = f.getBoundingClientRect().top;
    if (haut < 80) window.scrollBy({ top: haut - 120, behavior: statique() ? 'instant' : 'smooth' });
    if (!statique()) {
      const h1 = f.offsetHeight;
      gsap.fromTo(f, { height: h0 }, { height: h1, duration: 0.45, ease: 'power2.inOut', clearProps: 'height', onComplete: rafraichir });
      gsap.fromTo(etapes[k - 1], { opacity: 0, x: 18 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out', clearProps: 'all' });
    } else rafraichir();
  };
  f.addEventListener('click', (e) => {
    if (e.target.closest('[data-suivant]')) { if (valide()) aller(n + 1); }
    else if (e.target.closest('[data-precedent]')) aller(n - 1);
  });
  f.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && n < 4 && e.target.tagName === 'INPUT') { e.preventDefault(); if (valide()) aller(n + 1); }
  });
  f.addEventListener('input', () => { majRecap(); if (n === 1 && erreurEx.textContent && $$('input[name="expertise"]:checked', f).length) erreurEx.textContent = ''; });
  f.addEventListener('change', majRecap);
  majRecap();
  marquer();
}

/* ---------- Article : la version anglaise reste ouverte au rechargement si elle l'était ---------- */
function anglais() {
  const d = $('.article-anglais');
  if (!d) return;
  try { if (sessionStorage.getItem('artic:anglais') === '1') d.open = true; } catch {}
  d.addEventListener('toggle', () => { try { sessionStorage.setItem('artic:anglais', d.open ? '1' : '0'); } catch {} });
}

/* ---------- Intro « bouchon » ---------- */
function intro() {
  const panneau = $('[data-ouverture]');
  if (!gsap || !panneau || getComputedStyle(panneau).display === 'none') return null;
  const phrase = $('.intro-phrase', panneau), mot = $('.intro-mot', panneau);
  const garde = $$('.intro-c[data-garde]', panneau).sort((a, b) => a.dataset.garde - b.dataset.garde);
  const autres = $$('.intro-c:not([data-garde])', panneau);
  const cibles = $$('.intro-l', mot), point = $('.intro-point', mot), onde = $('.intro-onde', panneau);
  const haut = $('.intro-demi--haut', panneau), bas = $('.intro-demi--bas', panneau);
  const logo = $('.entete-logo .logo-mot');

  /* Mesures prises une fois, avant de jouer (polices chargées). */
  const rg = garde.map((el) => el.getBoundingClientRect());
  const rc = cibles.map((el) => el.getBoundingClientRect());
  const ech = parseFloat(getComputedStyle(mot).fontSize) / parseFloat(getComputedStyle(phrase).fontSize);
  const rp = point.getBoundingClientRect();
  const gauche = rc[0].left, droite = rp.right, dessus = rc[0].top, dessous = rc[0].bottom;
  const coupe = dessous - (dessous - dessus) * 0.2;
  panneau.style.setProperty('--coupe', `${coupe.toFixed(1)}px`);
  onde.style.left = `${(rp.left + rp.width / 2).toFixed(1)}px`;
  onde.style.top = `${(dessous - (dessous - dessus) * 0.22).toFixed(1)}px`;
  const rl = logo ? logo.getBoundingClientRect() : null;
  const s2 = rl ? rl.height / (dessous - dessus) : 0.1;

  const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
  tl.to(autres, { yPercent: -70, opacity: 0, duration: 0.45, ease: 'power2.in', stagger: { each: 0.01, from: 'random' } }, 0.25)
    .to(garde, {
      x: (i) => rc[i].left - rg[i].left, y: (i) => rc[i].top - rg[i].top, scale: ech,
      transformOrigin: '0 0', duration: 0.62, ease: 'power3.inOut',
    }, 0.58)
    .set(mot, { visibility: 'visible' }, 1.2)
    .set(phrase, { visibility: 'hidden' }, 1.2)
    .fromTo(point, { y: () => -(rp.bottom + 40), opacity: 1 }, { y: 0, duration: 0.5, ease: 'bounce.out' }, 1.08)
    .to(point, { scaleY: 0.8, scaleX: 1.14, transformOrigin: '50% 100%', duration: 0.07 }, 1.3)
    .to(point, { scaleY: 1, scaleX: 1, duration: 0.2, ease: 'power2.out' }, 1.37)
    .fromTo(onde, { scale: 0.3, opacity: 0.9 }, { scale: 9, opacity: 0, duration: 0.7, ease: 'power2.out', immediateRender: false }, 1.31)
    .set(panneau, { backgroundColor: 'transparent', '--bord': 1 }, 1.62)
    .to(haut, { yPercent: -100, duration: 0.7 }, 1.62)
    .to(bas, { yPercent: 100, duration: 0.7 }, 1.62)
    .to(panneau, { '--bord': 0, duration: 0.2, ease: 'none' }, 1.98);
  if (rl) {
    tl.to(mot, {
      x: rl.left - gauche * s2, y: rl.top - dessus * s2, scale: s2, transformOrigin: '0 0', duration: 0.7,
    }, 1.62);
  }
  /* Accueil : le titre monte ligne à ligne pendant que la nappe s'ouvre. */
  if ($('.hero-ligne')) {
    tl.call(() => {}, null, 1.78);
    tl.eventCallback('onComplete', () => { const h = $('.hero'); if (h) h.classList.add('hero-pose'); });
    tl.fromTo('.hero-ligne', { yPercent: 115, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 0.75, stagger: 0.09, ease: 'power3.out' }, 1.78)
      .fromTo('.hero-sur, .hero-intro, .hero-actions', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: 'power2.out' }, 1.95);
  }
  return tl;
}

function heroArrivee() {
  if (!gsap || !$('.hero-ligne')) return;
  gsap.fromTo('.hero-ligne', { yPercent: 115, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.09, ease: 'power3.out', delay: 0.12, onComplete: () => $('.hero').classList.add('hero-pose') });
  gsap.fromTo('.hero-sur, .hero-intro, .hero-actions', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, delay: 0.3 });
}

demarrer({
  preparer() {
    [encre, cycle, etiquettes, audit, parcours, cartesMenu, pointFinal, anneauSommaire, tirage, filDuTemps, eventail, plan, visionneuse, journal, demande, anglais].forEach((f) => {
      try { f(); } catch (err) { console.error('[site]', f.name, err); }
    });
  },
  jouer: intro,
  etatFinal() {
    finals.forEach((f) => { try { f(); } catch (err) { console.error('[site] final', err); } });
    if (gsap) gsap.set('.hero-ligne, .hero-sur, .hero-intro, .hero-actions', { clearProps: 'transform,opacity' });
    const h = $('.hero'); if (h) h.classList.add('hero-pose');
  },
  arrivee: heroArrivee,
});
