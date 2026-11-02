/* Projets : les quatre projets en détail (étiquettes qui se balancent, images qui se resserrent),
   les autres réalisations de michelgrand.ch et les projets en cours (à actualiser). */
import { html, brut } from '../../outils/gabarit.mjs';

export const page = { cle: 'projets', fichier: 'projets', imagePartage: 'grok/projets-ouverture-1168.webp' };

const deux = (n) => String(n).padStart(2, '0');
/* Monogramme dessiné en code pour les réalisations sans photo utilisable (les visuels actuels viennent de banques d'images). */
const monogramme = (nom, i) => {
  const lettres = nom.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase();
  return brut(`<div class="monogramme monogramme--${i % 3}" data-visuel role="img" aria-label="${nom}"><span>${lettres}</span><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44"/><circle cx="50" cy="50" r="30"/></svg></div>`);
};

export default (c) => {
  const P = c.donnees.projets;
  return html`
<section class="page-tete" id="debut">
  <div class="conteneur page-tete-grille">
    <div>
      <p class="surtitre">${c.t('projets.surtitre')}</p>
      <h1 data-anime="lignes">${c.t('projets.titre')}</h1>
      <p class="chapeau" data-anime>${c.t('projets.texte')}</p>
      <p data-anime>${c.lien('contact', { classe: 'bouton bouton--grand', texte: c.t('projets.action'), attrs: 'data-action-principale data-survol="magnetique"' })}</p>
    </div>
    ${c.media({ nom: 'grok/projets-ouverture', alt: c.s('projets.alt'), cadrage: '60% 60%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 46vw', attrs: 'data-fx="parallaxe"' })}
  </div>
</section>

<section class="projets-liste conteneur" id="principaux">
  <h2 class="petit-titre">${c.t('projets.principaux')}</h2>
  ${P.principaux.map((p, i) => html`<article class="projet-ligne${i % 2 ? ' projet-ligne--inverse' : ''}" id="${p.cle}" data-section>
    <div class="projet-ligne-visuel">
      ${c.media({ nom: p.image, alt: p.alt, cadrage: p.cadrage, classe: 'projet-ligne-media', sizes: '(max-width: 760px) 100vw, 50vw', ratio: '4 / 3', attrs: 'data-fx="zoom" data-fx-force="12"' })}
      <div class="etiquette" data-effet="etiquette" data-superpose aria-hidden="true"><span class="etiquette-fil"></span><span class="etiquette-carte"><span class="etiquette-secteur">${p.secteur}</span><strong>${p.etiquette}</strong></span></div>
    </div>
    <div class="projet-ligne-texte">
      <p class="carte-projet-num">${deux(i + 1)} · ${p.secteur}</p>
      <h3 data-anime="lignes">${p.nom}</h3>
      <p class="carte-projet-accroche">${p.accroche}</p>
      <p>${p.resume}</p>
      ${p.etiquette === 'Concept' ? html`<p class="note-statut">${c.t('projets.statutNote')}</p>` : ''}
      ${p.page ? c.lien(p.page, { classe: 'bouton bouton--contour', texte: html`${c.t('projets.fiche')}<span class="visuellement-cache"> : ${p.nom}</span>`, attrs: 'data-survol="magnetique"' }) : html`<p class="carte-projet-bientot">${c.t('projets.bientot')}</p>`}
    </div>
  </article>`)}
</section>

<section class="autres" id="autres" data-sans-visuel>
  <div class="conteneur">
    <div class="autres-tete">
      <h2 class="titre-section" data-anime="lignes">${c.t('projets.autres')}</h2>
      <p>${c.t('projets.autresTexte')}</p>
    </div>
    <ul class="autres-liste" data-anime="cascade">
      ${P.autres.map((a, i) => html`<li class="autre">
        <p class="autre-num" aria-hidden="true">${deux(i + 1)}</p>
        <p class="carte-projet-num">${a.secteur} · ${a.etiquette}</p>
        <h3>${a.nom}</h3>
        <p>${a.texte}</p>
      </li>`)}
    </ul>
  </div>
</section>

<section class="en-cours conteneur" id="en-cours">
  <div class="autres-tete">
    <h2 class="titre-section" data-anime="lignes">${c.t('projets.enCours')}</h2>
    <p class="note-statut">${c.t('projets.enCoursNote')}</p>
  </div>
  <ol class="en-cours-liste" data-anime="cascade">
    ${P.enCours.map((e, i) => html`<li><span class="en-cours-num" data-visuel aria-hidden="true">${deux(i + 1)}</span><div><h3>${e.nom}</h3><p>${e.texte}</p></div></li>`)}
  </ol>
</section>

<section class="fin fin--court" id="fin">
  <div class="conteneur fin-grille">
    ${c.media({ nom: 'grok/fiche-vers-ambiance', alt: c.s('projets.finAlt'), classe: 'fin-media', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-fx="zoom"' })}
    <div class="fin-texte">
      <h2 class="titre-section" data-anime="lignes">${c.t('projets.finTitre')}</h2>
      <p data-anime>${c.t('projets.finTexte')}</p>
      <p class="fin-actions" data-anime>${c.lien('contact', { classe: 'bouton bouton--grand', texte: c.t('accueil.fin.action'), attrs: 'data-survol="magnetique"' })}</p>
    </div>
  </div>
</section>
`;
};
