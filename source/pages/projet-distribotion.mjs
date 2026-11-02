/* Fiche projet distriBOtion.CH : l'aventure, les marques, la frise des produits avec le verre qui se remplit
   par le fond comme une tireuse inversée (effet « tirage »), le showroom, les références et la galerie
   des installations réelles, avec visionneuse (chaque photo a son propre lien : #photo-3). */
import { html, brut } from '../../outils/gabarit.mjs';
import { externe } from '../gabarits/commun.mjs';

export const page = { cle: 'projet-distribotion', fichier: 'projets/distribotion', imagePartage: 'projets/distribotion-photo-1280.webp' };

/* Verre dessiné en SVG : le liquide (rect découpé par la forme du verre) monte selon le défilement. */
const verre = brut(`<svg class="verre" viewBox="0 0 160 320" aria-hidden="true">
  <defs><clipPath id="verre-forme"><path d="M28 18 H132 L118 270 Q117 292 96 294 H64 Q43 292 42 270 Z"/></clipPath></defs>
  <g clip-path="url(#verre-forme)">
    <rect class="verre-liquide" x="0" y="0" width="160" height="320"/>
    <rect class="verre-mousse" x="0" y="0" width="160" height="16"/>
    <g class="verre-bulles"><circle cx="70" cy="250" r="2.4"/><circle cx="92" cy="226" r="1.8"/><circle cx="80" cy="190" r="2.1"/><circle cx="102" cy="262" r="1.6"/><circle cx="62" cy="210" r="1.5"/></g>
  </g>
  <path class="verre-contour" d="M28 18 H132 L118 270 Q117 292 96 294 H64 Q43 292 42 270 Z"/>
  <path class="verre-reflet" d="M46 40 L54 250"/>
  <path class="verre-pied" d="M58 306 H102"/>
</svg>`);

export default (c) => {
  const d = c.donnees.projets.distribotion;
  const episodes = Object.fromEntries(c.donnees.journal.articles.filter((a) => a.video).map((a) => [a.cle, a]));
  return html`
<section class="page-tete page-tete--fiche" id="debut">
  <div class="conteneur page-tete-grille">
    <div>
      <p class="surtitre">${c.t('distribotion.surtitre')}</p>
      <h1 data-anime="lignes">${c.t('distribotion.titre')}</h1>
      <p class="fiche-accroche" data-anime>${c.donnees.projets.principaux[0].accroche}</p>
      <p data-anime>${c.lien('contact', { params: 'expertise=conception', classe: 'bouton bouton--grand', texte: c.t('distribotion.action'), attrs: 'data-action-principale data-survol="magnetique"' })}</p>
    </div>
    ${c.media({ nom: 'projets/distribotion-photo', alt: c.donnees.projets.principaux[0].alt, cadrage: '50% 55%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 46vw', attrs: 'data-fx="parallaxe"' })}
  </div>
</section>

<section class="fiche-aventure conteneur" id="aventure">
  <div class="fiche-aventure-texte">
    <h2 class="titre-section" data-anime="lignes">${c.t('distribotion.aventure')}</h2>
    ${d.intro.map((x) => html`<p data-anime>${x}</p>`)}
    <h3 class="petit-titre">${c.t('distribotion.marques')}</h3>
    <ul class="marques" data-anime="cascade">${d.marques.map((m) => html`<li><img src="/assets/images/${m.logo}.webp" alt="${m.nom}" height="40" loading="lazy" decoding="async"></li>`)}</ul>
  </div>
  ${c.media({ nom: 'projets/distribotion-produits', alt: c.s('distribotion.produitsAlt'), classe: 'fiche-aventure-media', sizes: '(max-width: 760px) 100vw, 44vw', attrs: 'data-anime="rideau"', cadrage: '50% 50%' })}
</section>

<section class="tirage" id="produits">
  <div class="conteneur">
    <div class="tirage-tete">
      <h2 class="titre-section" data-anime="lignes">${c.t('distribotion.produits')}</h2>
      <p>${c.t('distribotion.produitsTexte')}</p>
    </div>
    <div class="tirage-grille">
      <div class="tirage-verre" data-effet="tirage">${verre}<p class="tirage-annee" aria-hidden="true">${d.frise[0].annee}</p></div>
      <ol class="tirage-etapes">
        ${d.frise.map((f, i) => {
          const ep = f.episode ? episodes[f.episode] : null;
          return html`<li class="tirage-etape" data-etape="${i}" data-annee="${f.annee}">
            ${c.media({ nom: f.image, alt: f.titre, classe: 'tirage-media', sizes: '(max-width: 760px) 90vw, 30vw', ratio: '16 / 9', attrs: 'data-fx="zoom" data-fx-force="10"' })}
            <div>
              <p class="tirage-etape-annee">${f.annee}</p>
              <h3>${f.titre}</h3>
              <p>${f.texte}</p>
              ${ep ? html`<p>${externe(c, `https://www.youtube.com/watch?v=${ep.video}`, c.t('distribotion.episode'), 'lien-fleche')}</p>` : ''}
            </div>
          </li>`;
        })}
      </ol>
    </div>
  </div>
</section>

<section class="fiche-showroom conteneur" id="showroom">
  ${c.media({ nom: 'grok/fiche-distribotion-cave', alt: c.s('distribotion.showroomAlt'), classe: 'fiche-showroom-media', sizes: '(max-width: 760px) 100vw, 36vw', attrs: 'data-fx="parallaxe"' })}
  <div>
    <h2 class="titre-section" data-anime="lignes">${c.t('distribotion.showroom')}</h2>
    <p class="chapeau" data-anime>${d.showroom}</p>
  </div>
</section>

<section class="references" id="references">
  <div class="conteneur references-grille">
    <div>
      <h2 class="titre-section" data-anime="lignes">${c.t('distribotion.references')}</h2>
      <p class="chapeau" data-anime>${c.t('distribotion.referencesTexte')}</p>
      ${c.media({ nom: 'grok/fiche-distribotion-salon', alt: c.s('distribotion.referencesAlt'), classe: 'references-media', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-fx="zoom"' })}
    </div>
    <dl class="references-liste" data-anime="cascade">
      ${d.references.map((r) => html`<div><dt>${r.groupe}</dt><dd>${r.noms.join(' · ')}</dd></div>`)}
    </dl>
  </div>
</section>

<section class="galerie-fiche conteneur" id="galerie">
  <div class="autres-tete">
    <h2 class="titre-section" data-anime="lignes">${c.t('distribotion.galerie')}</h2>
    <p><span class="texte-souris">${c.t('distribotion.galerieSouris')}</span><span class="texte-toucher">${c.t('distribotion.galerieTexte')}</span></p>
  </div>
  <ul class="galerie-grille" data-anime="cascade">
    ${d.galerie.map((g, i) => html`<li><a class="galerie-vignette" href="#photo-${i + 1}" id="photo-${i + 1}" data-sans-transition data-visionneuse="${i}" aria-label="${c.s('distribotion.ouvrir', { n: i + 1 })}">${c.media({ nom: g, alt: c.s('distribotion.installation', { n: i + 1 }), classe: 'galerie-vignette-media', sizes: '(max-width: 760px) 45vw, 22vw', ratio: '1 / 1' })}</a></li>`)}
  </ul>
  <div class="visionneuse" data-visionneuse-fenetre data-recouvrement role="dialog" aria-modal="true" aria-label="${c.s('distribotion.visionneuse')}" data-texte-image="${c.s('distribotion.image')}" hidden>
    <figure class="visionneuse-cadre"><figcaption class="visionneuse-legende" aria-live="polite"></figcaption></figure>
    <button type="button" class="visionneuse-bouton visionneuse-prec" data-visionneuse-prec aria-label="${c.s('distribotion.precedente')}">←</button>
    <button type="button" class="visionneuse-bouton visionneuse-suiv" data-visionneuse-suiv aria-label="${c.s('distribotion.suivante')}">→</button>
    <button type="button" class="visionneuse-bouton visionneuse-fermer" data-visionneuse-fermer aria-label="${c.s('distribotion.fermer')}">×</button>
  </div>
</section>

<section class="fin fin--court" id="fin">
  <div class="conteneur fin-grille">
    ${c.media({ nom: 'projets/distribotion-vignette', alt: c.s('distribotion.vignetteAlt'), classe: 'fin-media', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-fx="zoom"' })}
    <div class="fin-texte">
      <h2 class="titre-section" data-anime="lignes">${c.t('distribotion.finTitre')}</h2>
      <p data-anime>${c.t('distribotion.finTexte')}</p>
      <p class="fin-actions" data-anime>
        ${c.lien('contact', { params: 'expertise=conception', classe: 'bouton bouton--grand', texte: c.t('accueil.fin.action'), attrs: 'data-survol="magnetique"' })}
        ${c.lien('projets', { classe: 'lien-fleche', texte: c.t('distribotion.retour') })}
      </p>
    </div>
  </div>
</section>
`;
};
