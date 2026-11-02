/* Accueil d'Artic!Agency : ouverture, manifeste (encre), le Cycle (anneau), projets (galerie et étiquettes),
   méthode (tableau d'audit), parcours (carte), confiance (logos, cartes-menu), journal, appel final (point-final).
   Chaque section a au moins un effet au défilement, visible aussi sur téléphone. */
import { html, brut, typo } from '../../outils/gabarit.mjs';
import { marque } from '../gabarits/commun.mjs';

export const page = { cle: 'accueil', fichier: 'index', imagePartage: 'grok/accueil-ouverture-1168.webp' };

const deux = (n) => String(n).padStart(2, '0');
const echap = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const date = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('fr-CH', { day: 'numeric', month: 'long', year: 'numeric' });

/* Texte découpé en mots à l'avance (aucune découpe en JavaScript) ; « profit éthique » est le mot-clé souligné. */
function encre(texte) {
  const mots = typo(texte).split(' ');
  const out = [];
  for (let i = 0; i < mots.length; i++) {
    if (mots[i] === 'profit' && (mots[i + 1] || '').startsWith('éthique')) {
      out.push(`<span class="mot-cle"><span class="mot">profit</span> <span class="mot">${echap(mots[i + 1])}</span></span>`);
      i++;
    } else out.push(`<span class="mot">${echap(mots[i])}</span>`);
  }
  return brut(out.join(' '));
}

/* Anneau du cycle : 120 graduations, 5 étapes (une tous les 72°), arc parcouru en rouge. */
function anneau(etapes) {
  const cx = 350, cy = 350, r = 262;
  const graduations = Array.from({ length: 120 }, (_, i) => {
    const a = (i / 120) * Math.PI * 2, long = i % 24 === 0 ? 22 : i % 6 === 0 ? 12 : 6;
    const x1 = cx + Math.sin(a) * (r + 14), y1 = cy - Math.cos(a) * (r + 14);
    const x2 = cx + Math.sin(a) * (r + 14 + long), y2 = cy - Math.cos(a) * (r + 14 + long);
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
  }).join('');
  const noeuds = etapes.map((e, i) => {
    const a = (i / 5) * Math.PI * 2;
    const x = cx + Math.sin(a) * r, y = cy - Math.cos(a) * r;
    const lx = cx + Math.sin(a) * (r + 62), ly = cy - Math.cos(a) * (r + 62);
    return `<g class="cycle-noeud" data-noeud="${i}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9"/><g class="cycle-libelle" data-x="${lx.toFixed(1)}" data-y="${ly.toFixed(1)}"><text x="${lx.toFixed(1)}" y="${(ly + 2).toFixed(1)}" text-anchor="middle" dominant-baseline="middle"><tspan class="cycle-libelle-num">${deux(i + 1)}</tspan> ${echap(e.nom)}</text></g></g>`;
  }).join('');
  return brut(`<svg class="cycle-svg" viewBox="0 0 700 700" aria-hidden="true">
  <g class="cycle-tourne">
    <g class="cycle-graduations">${graduations}</g>
    <circle class="cycle-cercle" cx="${cx}" cy="${cy}" r="${r}"/>
    <circle class="cycle-arc" cx="${cx}" cy="${cy}" r="${r}" pathLength="1" transform="rotate(-90 ${cx} ${cy})"/>
    ${noeuds}
  </g>
  <path class="cycle-repere" d="M${cx - 10} ${cy - r - 47} L${cx + 10} ${cy - r - 47} L${cx} ${cy - r - 32} Z"/>
</svg>`);
}

export default (c) => {
  const ex = c.donnees.expertises;
  const cycle = ex.filter((e) => e.cycle);
  const transversales = ex.filter((e) => !e.cycle);
  const projets = c.donnees.projets.principaux;
  const titre = typo(c.s('accueil.hero.titre'));
  const [l1, l2] = [titre.split(' Commerciale')[0], 'en Hospitalité'];
  return html`
<section class="hero" id="debut">
  <div class="hero-texte">
    <p class="surtitre hero-sur" data-anime="gsap">${c.t('accueil.hero.surtitre')}</p>
    <h1 class="hero-titre" data-superpose>
      <span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${l1}</span></span>
      <span class="ligne-masque"><span class="hero-ligne" data-anime="gsap"><em>Commerciale</em></span></span>
      <span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${l2}<span class="titre-point" aria-hidden="true">${brut('\u202f!')}</span></span></span>
    </h1>
    <p class="hero-intro" data-anime="gsap">${c.t('accueil.hero.texte')}</p>
    <p class="hero-actions" data-anime="gsap">
      ${c.lien('contact', { classe: 'bouton bouton--grand', texte: c.t('accueil.hero.action'), attrs: 'data-action-principale data-survol="magnetique"' })}
      <span class="hero-info" data-info-cle>${c.t('accueil.hero.info')}</span>
    </p>
  </div>
  ${c.media({ nom: 'grok/accueil-ouverture', alt: c.s('accueil.hero.alt'), cadrage: '50% 50%', priorite: true, classe: 'hero-media', sizes: '(max-width: 760px) 100vw, 52vw', attrs: 'data-fx="onde"' })}
  <a class="hero-defiler" href="#manifeste" aria-label="${c.s('accueil.hero.defiler')}" data-sans-transition><span aria-hidden="true"></span></a>
</section>

<section class="manifeste" id="manifeste">
  <div class="conteneur manifeste-grille">
    <div class="manifeste-texte">
      <h2 class="titre-section" data-anime="lignes">${c.t('accueil.manifeste.titre')}</h2>
      <p class="encre" data-effet="encre">${encre(c.s('accueil.manifeste.texte'))}</p>
    </div>
    ${c.media({ nom: 'grok/accueil-manifeste-lin', alt: c.s('accueil.manifeste.alt'), classe: 'manifeste-media', sizes: '(max-width: 760px) 100vw, 30vw', attrs: 'data-fx="parallaxe" data-fx-force="12"' })}
  </div>
  <div class="conteneur piliers">
    <h3 class="petit-titre">${c.t('accueil.manifeste.piliers')}</h3>
    <ol class="piliers-liste" data-anime="cascade">
      ${[1, 2, 3].map((n) => html`<li><span class="pilier-num">${deux(n)}</span><h4>${c.t(`accueil.manifeste.p${n}Titre`)}</h4><p>${c.t(`accueil.manifeste.p${n}Texte`)}</p></li>`)}
    </ol>
  </div>
</section>

<section class="cycle" id="cycle">
  <div class="conteneur cycle-tete">
    <p class="surtitre">${c.t('accueil.cycle.surtitre')}</p>
    <h2 class="titre-section" data-anime="lignes">${c.t('accueil.cycle.titre')}</h2>
    <p class="chapeau" data-anime>${c.t('accueil.cycle.texte')}</p>
  </div>
  <div class="conteneur cycle-corps">
    <div class="cycle-scene" data-effet="cycle">
      <div class="cycle-cadre">
        ${anneau(cycle)}
        <div class="cycle-disque">
          ${cycle.map((e, i) => c.media({ nom: e.image, alt: e.alt, classe: `cycle-image${i === 0 ? ' est-active' : ''}`, sizes: '(max-width: 760px) 60vw, 34vw', attrs: `data-etape-image="${i}"` }))}
          <canvas class="cycle-canvas" aria-hidden="true"></canvas>
        </div>
      </div>
      <p class="cycle-compteur" aria-hidden="true"><span class="cycle-num">01</span><span class="cycle-total"> / 05</span></p>
    </div>
    <ol class="cycle-etapes" aria-label="${c.s('accueil.cycle.region')}">
      ${cycle.map((e, i) => html`<li class="cycle-etape" id="cycle-${e.cle}" data-etape="${i}">
        <p class="cycle-etape-num">${c.t('accueil.cycle.etape')} ${deux(i + 1)} ${c.t('accueil.cycle.sur')} 05</p>
        <h3>${e.nom}</h3>
        <p class="hashtags">${e.hashtags.map((h) => `#${h}`).join(' ')}</p>
        <p class="cycle-accroche">${e.accroche}</p>
        ${c.lien('expertises', { ancre: e.cle, classe: 'lien-fleche', texte: html`${c.t('accueil.cycle.detail')}<span class="visuellement-cache"> : ${e.nom}</span>` })}
      </li>`)}
    </ol>
  </div>
  <div class="conteneur transversales">
    <h3 class="petit-titre">${c.t('accueil.cycle.transversales')}</h3>
    <ul class="transversales-liste" data-anime="cascade">
      ${transversales.map((e) => html`<li class="carte-expertise">
        ${c.media({ nom: e.image, alt: e.alt, classe: 'carte-expertise-media', sizes: '150px', ratio: '4 / 3' })}
        <div>
          <h4>${e.nom}</h4>
          <p>${e.accroche}</p>
          ${c.lien('expertises', { ancre: e.cle, classe: 'lien-fleche', texte: html`${c.t('accueil.cycle.detail')}<span class="visuellement-cache"> : ${e.nom}</span>` })}
        </div>
      </li>`)}
    </ul>
    <p class="transversales-tout">${c.lien('expertises', { classe: 'bouton bouton--contour', texte: c.t('accueil.cycle.toutes'), attrs: 'data-survol="magnetique"' })}</p>
  </div>
</section>

<section class="projets ecran epingle" id="projets" data-entete-cache data-fx="galerie">
  <div class="conteneur galerie-tete">
    <div>
      <p class="surtitre">${c.t('accueil.projets.surtitre')}</p>
      <h2 class="titre-section" data-anime="lignes">${c.t('accueil.projets.titre')}</h2>
    </div>
    <p class="galerie-texte">${c.t('accueil.projets.texte')}</p>
  </div>
  <div class="piste galerie-piste" data-galerie tabindex="0" role="region" aria-label="${c.s('accueil.projets.region')}">
    ${projets.map((p, i) => html`<article class="carte-projet" id="projet-${p.cle}">
      <div class="carte-projet-visuel">
        ${c.media({ nom: p.image, alt: p.alt, cadrage: p.cadrage, classe: 'carte-projet-media', sizes: '(max-width: 760px) 80vw, 32vw' })}
        <div class="etiquette" data-effet="etiquette" data-superpose aria-hidden="true"><span class="etiquette-fil"></span><span class="etiquette-carte"><span class="etiquette-secteur">${p.secteur}</span><strong>${p.etiquette}</strong></span></div>
      </div>
      <p class="carte-projet-num">${deux(i + 1)}</p>
      <h3>${p.nom}</h3>
      <p class="carte-projet-accroche">${p.accroche}</p>
      ${p.page ? c.lien(p.page, { classe: 'lien-fleche', texte: html`${c.t('accueil.projets.fiche')}<span class="visuellement-cache"> : ${p.nom}</span>` }) : html`<p class="carte-projet-bientot">${c.t('accueil.projets.bientot')}</p>`}
    </article>`)}
    <article class="carte-projet carte-projet--autres" id="projet-autres">
      <div class="carte-projet-visuel">
        ${c.media({ nom: 'grok/accueil-autres-realisations', alt: c.s('accueil.projets.autresAlt'), classe: 'carte-projet-media', sizes: '(max-width: 760px) 80vw, 32vw' })}
      </div>
      <p class="carte-projet-num">+</p>
      <h3>${c.t('accueil.projets.autresTitre')}</h3>
      <p class="carte-projet-accroche">${c.t('accueil.projets.autresTexte')}</p>
      ${c.lien('projets', { classe: 'lien-fleche', texte: c.t('accueil.projets.tous') })}
    </article>
  </div>
  <div class="galerie-pied conteneur"><div class="galerie-progres" aria-hidden="true"><span></span></div><p class="galerie-glisser">${c.t('accueil.projets.glisser')}</p></div>
</section>

<section class="methode" id="methode">
  <div class="conteneur methode-grille">
    <div class="methode-texte">
      <p class="surtitre">${c.t('accueil.methode.surtitre')}</p>
      <h2 class="titre-section" data-anime="lignes">${c.t('accueil.methode.titre')}</h2>
      <p class="chapeau" data-anime>${c.t('accueil.methode.texte')}</p>
      <h3 class="petit-titre">${c.t('accueil.methode.outils')}</h3>
      <ol class="outils-liste" data-anime="cascade">
        ${[1, 2, 3].map((n) => html`<li><span class="pilier-num">${deux(n)}</span><h4>${c.t(`accueil.methode.o${n}Titre`)}</h4><p>${c.t(`accueil.methode.o${n}`)}</p></li>`)}
      </ol>
    </div>
    <div class="methode-visuel">
      ${c.media({ nom: 'grok/accueil-methode', alt: c.s('accueil.methode.alt'), classe: 'methode-media', sizes: '(max-width: 760px) 100vw, 46vw', attrs: 'data-fx="zoom" data-fx-force="14"' })}
      <div class="tableau" data-effet="audit" data-superpose data-visuel role="img" aria-label="${c.s('accueil.methode.tableau')} (${c.s('commun.demo')})">
        <p class="tableau-tete"><span>${c.t('accueil.methode.tableau')}</span><span class="tableau-demo">${c.t('commun.demo')}</span></p>
        <ul class="tableau-kpi">
          ${[[1, 31], [2, 34], [3, 92], [4, 78]].map(([n, v]) => html`<li><svg viewBox="0 0 80 80" aria-hidden="true"><circle class="jauge-fond" cx="40" cy="40" r="32"/><circle class="jauge" cx="40" cy="40" r="32" pathLength="100" data-valeur="${v}" style="--v:${v}" transform="rotate(-90 40 40)"/></svg><strong class="jauge-valeur" data-cible="${v}">${`${v}\u202f%`}</strong><span>${c.t(`accueil.methode.kpi${n}`)}</span></li>`)}
        </ul>
        <div class="tableau-courbe">
          <span class="tableau-legende">${c.t('accueil.methode.courbe')}</span>
          <svg viewBox="0 0 400 110" preserveAspectRatio="none" aria-hidden="true">
            <path class="courbe-grille" d="M0 27.5H400M0 55H400M0 82.5H400"/>
            <path class="courbe-aire" d="M0 92 C40 88 60 70 100 72 S170 52 200 58 S270 30 300 34 S370 14 400 10 V110 H0 Z"/>
            <path class="courbe" pathLength="1" d="M0 92 C40 88 60 70 100 72 S170 52 200 58 S270 30 300 34 S370 14 400 10"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</section>
<div class="ruban-section" aria-label="${c.s('accueil.methode.pourquoi')}" role="region">
  <p class="ruban-titre">${marque(c.t('accueil.methode.pourquoi'))}</p>
  <div class="ruban" id="ruban-engagements" data-boucle-css data-ruban><p>${c.t('accueil.methode.engagements')} <span aria-hidden="true">${c.t('accueil.methode.engagements')}</span></p></div>
  <button type="button" class="ruban-pause" data-pause-pour="ruban-engagements" data-libelle-pause="${c.s('commun.pause')}" data-libelle-lecture="${c.s('commun.lecture')}"><span data-libelle-bouton>${c.t('commun.pause')}</span></button>
</div>

<section class="portrait" id="portrait">
  <div class="conteneur portrait-grille">
    ${c.media({ nom: 'portraits/michel-grand', alt: c.s('accueil.parcours.portraitAlt'), cadrage: '50% 30%', classe: 'portrait-media', sizes: '(max-width: 760px) 70vw, 26vw', attrs: 'data-anime="rideau"' })}
    <div class="portrait-texte">
      <p class="surtitre">${c.t('accueil.parcours.surtitre')}</p>
      <h2 class="titre-section" data-anime="lignes">${c.t('accueil.parcours.titre')}</h2>
      <p class="chapeau" data-anime>${marque(c.t('accueil.parcours.texte'))}</p>
      <ol class="portrait-jalons" data-anime="cascade">
        ${c.donnees.parcours.etapes.filter((e, i) => [0, 2, 4, 5, 8, 11].includes(i)).map((e) => html`<li><span class="jalon-date">${e.periode}</span><strong>${marque(html`${e.titre}`)}</strong></li>`)}
      </ol>
      <p>${c.lien('a-propos', { ancre: 'parcours', classe: 'lien-fleche', texte: c.t('accueil.parcours.lien') })}</p>
    </div>
  </div>
</section>

<section class="confiance" id="confiance">
  <div class="conteneur confiance-tete">
    <div>
      <p class="surtitre">${c.t('accueil.confiance.surtitre')}</p>
      <h2 class="titre-section" data-anime="lignes">${c.t('accueil.confiance.titre')}</h2>
    </div>
    ${c.media({ nom: 'grok/accueil-confiance-verres', alt: c.s('accueil.confiance.alt'), classe: 'confiance-media', sizes: '(max-width: 760px) 100vw, 44vw', attrs: 'data-fx="parallaxe"' })}
  </div>
  <div class="logos-section">
    <div class="logos-ruban" id="ruban-logos" data-boucle-css data-ruban role="region" aria-label="${c.s('accueil.confiance.logos')}">
      <ul class="logos-liste">${c.donnees.logos.clients.map((l) => html`<li><img src="/assets/images/${l.logo}.webp" alt="${l.nom}" width="160" height="64" loading="lazy" decoding="async"></li>`)}</ul>
      <ul class="logos-liste" aria-hidden="true">${c.donnees.logos.clients.map((l) => html`<li><img src="/assets/images/${l.logo}.webp" alt="" width="160" height="64" loading="lazy" decoding="async"></li>`)}</ul>
    </div>
    <button type="button" class="ruban-pause" data-pause-pour="ruban-logos" data-libelle-pause="${c.s('commun.pause')}" data-libelle-lecture="${c.s('commun.lecture')}"><span data-libelle-bouton>${c.t('commun.pause')}</span></button>
  </div>
  <div class="conteneur temoignages">
    <h3 class="petit-titre">${c.t('accueil.confiance.temoignages')}</h3>
    <ul class="temoignages-liste" data-effet="cartes-menu">
      ${c.donnees.temoignages.map((t, i) => html`<li class="temoignage" style="--r:${[-4, 3, -2, 5][i]}deg">
        <figure>
          <blockquote>
            <p class="temoignage-extrait">${`« ${t.extrait} »`}</p>
            <details class="temoignage-suite"><summary>${c.t('accueil.confiance.lire')}<span class="visuellement-cache"> : ${t.nom}</span></summary>${t.texte.map((x) => html`<p>${x}</p>`)}</details>
          </blockquote>
          <figcaption><strong>${t.nom}</strong><span>${t.fonction}</span></figcaption>
        </figure>
      </li>`)}
    </ul>
  </div>
</section>

<section class="fin" id="fin">
  <div class="conteneur fin-grille">
    ${c.media({ nom: 'grok/accueil-contact', alt: c.s('accueil.fin.alt'), classe: 'fin-media', sizes: '(max-width: 760px) 100vw, 44vw', attrs: 'data-anime="rideau"' })}
    <div class="fin-texte">
      <svg class="point-final" viewBox="0 0 60 220" aria-hidden="true" data-effet="point-final"><path class="point-final-barre" d="M30 8 L30 148" pathLength="1"/><circle class="point-final-point" cx="30" cy="196" r="16"/></svg>
      <h2 class="titre-section" data-anime="lignes">${c.t('accueil.fin.titre')}</h2>
      <p data-anime>${c.t('accueil.fin.texte')}</p>
      <p class="fin-actions" data-anime>
        ${c.lien('contact', { classe: 'bouton bouton--grand', texte: c.t('accueil.fin.action'), attrs: 'data-survol="magnetique"' })}
        <a class="lien-fleche" href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a>
        <a class="lien-fleche" href="mailto:${c.site.contact.email}">${c.site.contact.email}</a>
      </p>
    </div>
  </div>
</section>
`;
};
