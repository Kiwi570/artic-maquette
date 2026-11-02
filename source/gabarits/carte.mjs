/* Carte du parcours de Michel Grand : lieux réels placés par leur latitude et longitude (projection simple,
   sans fond de carte), graticule, route tracée étape par étape (effet « parcours », site.js).
   Afrique et Asie, sans lieu précis connu, sont des flèches vers le bord de la carte. */
import { brut } from '../../outils/gabarit.mjs';

const LIBELLES = {
  vaud: null,
  suisse: { dx: 16, dy: 26, ancre: 'start', texte: 'Suisse' },
  afrique: { dx: 0, dy: -18, ancre: 'middle' },
  asie: { dx: -14, dy: -16, ancre: 'end' },
  londres: { dx: 12, dy: 5, ancre: 'start' },
  dublin: { dx: -12, dy: 5, ancre: 'end' },
  oslo: { dx: 12, dy: 5, ancre: 'start' },
  monaco: { dx: 12, dy: 18, ancre: 'start' },
  constance: { dx: 12, dy: -8, ancre: 'start' },
  geneve: null,
  lepuy: { dx: -12, dy: 5, ancre: 'end' },
  stjean: { dx: -10, dy: -14, ancre: 'end' },
  santiago: { dx: 12, dy: 32, ancre: 'start', texte: 'Compostelle' },
  finisterre: { dx: 6, dy: 60, ancre: 'start', texte: 'Finisterre' },
  orbe: { dx: -14, dy: -14, ancre: 'end', texte: 'Orbe, 2021' },
};

const PERIODES = {
  vaud: '1988 – 1995', afrique: '1996 – 2001', asie: '1996 – 2001', londres: '2002 – 2007', dublin: '2002 – 2007',
  oslo: '2002 – 2007', monaco: '2008', suisse: '2009 – 2020', constance: '2020', geneve: '2020', lepuy: '2020',
  stjean: '2020', santiago: '2020', finisterre: '2020', orbe: '2021',
};

const echap = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function carteParcours(c, { libelle, classe = '' } = {}) {
  const { cadre, lieux, route } = c.donnees.parcours.carte;
  const W = 1000;
  const k = Math.cos((50 * Math.PI) / 180);
  const H = Math.round(((cadre.nord - cadre.sud) / ((cadre.est - cadre.ouest) * k)) * W);
  const px = (lon) => ((lon - cadre.ouest) / (cadre.est - cadre.ouest)) * W;
  const py = (lat) => ((cadre.nord - lat) / (cadre.nord - cadre.sud)) * H;
  const parCle = Object.fromEntries(lieux.map((l) => [l.cle, { ...l, x: px(l.lon), y: py(l.lat) }]));

  const grille = [];
  for (let lon = -10; lon <= 20; lon += 5) grille.push(`M${px(lon).toFixed(1)} 0V${H}`);
  for (let lat = 40; lat <= 60; lat += 5) grille.push(`M0 ${py(lat).toFixed(1)}H${W}`);

  const segments = [];
  for (let i = 0; i < route.length - 1; i++) {
    const a = parCle[route[i]], b = parCle[route[i + 1]];
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
    const s = (i % 2 ? -1 : 1) * Math.min(0.22, 40 / d + 0.08);
    const cx = mx - (dy / d) * d * s, cy = my + (dx / d) * d * s;
    segments.push(`<path class="carte-seg" data-seg="${i}" data-vers="${b.cle}" d="M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}"/>`);
  }

  const points = lieux.map((l) => {
    const p = parCle[l.cle];
    const lib = LIBELLES[l.cle];
    let forme;
    if (l.direction === 'sud') forme = `<path class="carte-fleche" d="M${p.x - 9} ${p.y - 16} L${p.x + 9} ${p.y - 16} L${p.x} ${p.y - 2} Z"/>`;
    else if (l.direction === 'est') forme = `<path class="carte-fleche" d="M${p.x - 16} ${p.y - 9} L${p.x - 16} ${p.y + 9} L${p.x - 2} ${p.y} Z"/>`;
    else if (l.cle === 'vaud') forme = '';
    else forme = `<circle class="carte-point${l.cle === 'orbe' ? ' carte-point--fin' : ''}" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${l.cle === 'orbe' ? 9 : 6}" data-repere/>`;
    const txt = lib ? `<text class="carte-nom${l.cle === 'orbe' ? ' carte-nom--fin' : ''}" x="${(p.x + lib.dx).toFixed(1)}" y="${(p.y + lib.dy).toFixed(1)}" text-anchor="${lib.ancre}">${echap(lib.texte || l.nom)}</text>` : '';
    return `<g class="carte-lieu" data-lieu="${l.cle}" data-periode="${PERIODES[l.cle] || ''}">${forme}${txt}</g>`;
  }).join('');

  return brut(`<div class="parcours-carte ${classe}" data-effet="parcours">
  <p class="carte-annee" aria-hidden="true"><span class="carte-annee-lib">${c.s('apropos.carteAnnee')}</span><span class="carte-annee-val">${PERIODES[route[0]]}</span></p>
  <svg class="carte-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${echap(libelle)}">
    <rect class="carte-fond" width="${W}" height="${H}" rx="6"/>
    <path class="carte-grille" d="${grille.join('')}"/>
    <g class="carte-route">${segments.join('')}</g>
    <g class="carte-lieux">${points}</g>
  </svg>
  <ol class="visuellement-cache">${route.filter((r, i, t) => t.indexOf(r) === i).map((r) => `<li>${echap(parCle[r].nom)} : ${PERIODES[r]}</li>`).join('')}</ol>
</div>`);
}
