/* À propos : Michel Grand. Portrait, credo, carte du parcours (effet « parcours »), frise des douze étapes
   avec une ligne qui se trace (effet « fil-du-temps »), outils, milieux, valeurs, entreprises formatrices
   et coupures de presse qui s'ouvrent en éventail (effet « eventail »). */
import { html } from '../../outils/gabarit.mjs';
import { marque } from '../gabarits/commun.mjs';
import { carteParcours } from '../gabarits/carte.mjs';

export const page = { cle: 'a-propos', fichier: 'a-propos', imagePartage: 'portraits/michel-orbe-1280.webp' };

export default (c) => {
  const P = c.donnees.parcours;
  return html`
<section class="page-tete page-tete--portrait" id="debut">
  <div class="conteneur page-tete-grille">
    <div>
      <p class="surtitre">${c.t('apropos.surtitre')}</p>
      <h1 data-anime="lignes">${c.t('apropos.titre')}</h1>
      <p class="credo" data-anime>${c.t('apropos.credo')}</p>
      <p class="chapeau" data-anime>${c.t('apropos.texte')}</p>
      <p data-anime>${c.lien('contact', { classe: 'bouton bouton--grand', texte: c.t('apropos.action'), attrs: 'data-action-principale data-survol="magnetique"' })}</p>
    </div>
    ${c.media({ nom: 'portraits/michel-orbe', alt: c.s('apropos.portraitAlt'), cadrage: '42% 35%', cadrageMobile: '42% 30%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 46vw', attrs: 'data-anime="rideau"' })}
  </div>
</section>

<section class="parcours" id="carte">
  <div class="conteneur parcours-grille">
    ${carteParcours(c, { libelle: c.s('apropos.carte') })}
    <div class="parcours-texte">
      <h2 class="titre-section" data-anime="lignes">${c.t('apropos.carteTitre')}</h2>
      <p class="chapeau" data-anime>${c.t('apropos.carteTexte')}</p>
    </div>
  </div>
</section>

<section class="frise" id="parcours">
  <div class="conteneur">
    <div class="autres-tete">
      <h2 class="titre-section" data-anime="lignes">${c.t('apropos.parcours')}</h2>
      <p>${marque(c.t('apropos.parcoursTexte'))}</p>
    </div>
    <div class="frise-corps" data-effet="fil-du-temps">
      <span class="frise-fil" aria-hidden="true"><span></span></span>
      <ol class="frise-liste">
        ${P.etapes.map((e, i) => html`<li class="frise-etape${i % 2 ? ' frise-etape--droite' : ''}">
          <span class="frise-point" aria-hidden="true"></span>
          ${c.media({ nom: e.image, alt: e.titre, classe: 'frise-media', sizes: '(max-width: 760px) 34vw, 14vw', ratio: '3 / 4' })}
          <div class="frise-texte">
            <p class="frise-periode">${e.periode}</p>
            <h3>${marque(html`${e.titre}`)}</h3>
            <p>${e.texte}</p>
          </div>
        </li>`)}
      </ol>
    </div>
  </div>
</section>

<section class="outils" id="outils">
  <div class="conteneur outils-grille">
    <div>
      <h2 class="titre-section" data-anime="lignes">${c.t('apropos.outils')}</h2>
      <p class="chapeau" data-anime>${c.t('apropos.outilsTexte')}</p>
      ${c.media({ nom: 'grok/apropos-outils', alt: c.s('apropos.outilsAlt'), classe: 'outils-media', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-fx="parallaxe"' })}
    </div>
    <ol class="outils-liste outils-liste--longue" data-anime="cascade">
      ${P.outils.map((o, i) => html`<li><span class="pilier-num">${String(i + 1).padStart(2, '0')}</span><h3>${o.titre}</h3><p>${o.texte}</p></li>`)}
    </ol>
  </div>
</section>

<section class="milieux conteneur" id="milieux">
  <h2 class="titre-section" data-anime="lignes">${c.t('apropos.milieux')}</h2>
  <ul class="milieux-liste" data-anime="cascade">
    ${P.milieux.map((m) => html`<li>${c.media({ nom: m.image, alt: m.alt, classe: 'milieu-media', sizes: '(max-width: 760px) 45vw, 22vw', ratio: '1 / 1', attrs: 'data-fx="zoom" data-fx-force="10"' })}<p>${m.nom}</p></li>`)}
  </ul>
</section>

<section class="valeurs" id="valeurs">
  <div class="conteneur">
    <h2 class="titre-section" data-anime="lignes">${c.t('apropos.valeurs')}</h2>
    <p data-anime>${c.t('apropos.valeursTexte')}</p>
    <ul class="valeurs-liste" data-anime="cascade" data-visuel>${P.valeurs.map((v) => html`<li>#${v}</li>`)}</ul>
  </div>
</section>

<section class="formateurs conteneur" id="formateurs" data-sans-visuel>
  <h2 class="titre-section" data-anime="lignes">${c.t('apropos.formateurs')}</h2>
  <ul class="formateurs-liste" data-anime="cascade" data-visuel>${c.donnees.logos.formateurs.map((l) => html`<li><img src="/assets/images/${l.logo}.webp" alt="${l.nom}" height="44" loading="lazy" decoding="async"></li>`)}</ul>
</section>

<section class="presse" id="presse">
  <div class="conteneur presse-grille">
    <div>
      <h2 class="titre-section" data-anime="lignes">${c.t('apropos.presse')}</h2>
      <p data-anime>${c.t('apropos.presseTexte')}</p>
      <ul class="presse-logos" data-anime="cascade">${c.donnees.logos.presse.map((l) => html`<li><img src="/assets/images/${l.logo}.webp" alt="${l.nom}" height="28" loading="lazy" decoding="async"></li>`)}</ul>
    </div>
    <ul class="eventail" data-effet="eventail" aria-label="${c.s('apropos.presse')}">
      ${[1, 2, 3, 4, 5, 6, 7, 8].map((n, i) => html`<li style="--k:${i - 3.5}">${c.media({ nom: `presse/coupure-${String(n).padStart(2, '0')}`, alt: `${c.s('apropos.coupure')} ${n}`, classe: 'coupure', sizes: '(max-width: 760px) 40vw, 14vw', ratio: '3 / 4', cadrage: '50% 15%' })}</li>`)}
    </ul>
  </div>
</section>

<section class="fin fin--court" id="fin">
  <div class="conteneur fin-grille">
    ${c.media({ nom: 'portraits/michel-grand', alt: c.s('apropos.portraitAlt'), cadrage: '50% 28%', classe: 'fin-media', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-fx="zoom"' })}
    <div class="fin-texte">
      <h2 class="titre-section" data-anime="lignes">${c.t('apropos.finTitre')}</h2>
      <p data-anime>${c.t('apropos.finTexte')}</p>
      <p class="fin-actions" data-anime>${c.lien('contact', { classe: 'bouton bouton--grand', texte: c.t('accueil.fin.action'), attrs: 'data-survol="magnetique"' })}</p>
    </div>
  </div>
</section>
`;
};
