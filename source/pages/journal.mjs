/* Journal : article à la une, filtres par saison et recherche (gardés dans l'adresse : ?saison=s02&q=…),
   vingt articles. Seul l'article S02:E06 est construit dans la v1 ; les autres le seront en v2. */
import { html, brut } from '../../outils/gabarit.mjs';

export const page = { cle: 'journal', fichier: 'journal', imagePartage: 'grok/journal-ouverture-1168.webp' };

const date = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('fr-CH', { day: 'numeric', month: 'long', year: 'numeric' });
const normal = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/* Vignette dessinée pour les articles dont l'image actuelle vient d'une banque d'images ou d'un tiers. */
const court = (t, n = 112) => { const x = t.replace(/[.…\s]+$/, ''); if (x.length <= n) return `${x}…`; return `${x.slice(0, n).replace(/\s+\S*$/, '')}…`; };
/* Couverture typographique pour les articles sans image : l'année en grand, trois tons en alternance. */
const vignette = (a, i) => html`<div class="vignette-dessin vignette-dessin--${i % 3}" data-visuel><span class="vignette-ep" aria-hidden="true">${a.episode}</span><span class="vignette-point" aria-hidden="true">!</span><p class="vignette-citation">${court(a.extrait)}</p></div>`;

export default (c) => {
  const J = c.donnees.journal;
  const une = J.articles[0];
  const reste = J.articles.slice(1);
  return html`
<section class="page-tete" id="debut">
  <div class="conteneur page-tete-grille">
    <div>
      <p class="surtitre">${c.t('journal.surtitre')}</p>
      <h1 data-anime="lignes">${c.t('journal.titre')}</h1>
      <p class="chapeau" data-anime>${c.t('journal.texte')}</p>
      <p data-anime>${c.lien(une.page, { classe: 'bouton bouton--grand', texte: c.t('journal.action'), attrs: 'data-action-principale data-survol="magnetique"' })}</p>
    </div>
    ${c.media({ nom: 'grok/journal-ouverture', alt: c.s('journal.alt'), cadrage: '45% 55%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 46vw', attrs: 'data-fx="parallaxe"' })}
  </div>
</section>

<section class="une conteneur" id="une">
  <p class="petit-titre">${c.t('journal.une')}</p>
  <article class="une-carte">
    ${c.media({ nom: une.image, alt: '', classe: 'une-media', sizes: '(max-width: 760px) 100vw, 40vw', ratio: '1 / 1', attrs: 'data-anime="rideau"' })}
    <div>
      <p class="carte-article-meta"><span>${une.episode}</span><span>${date(une.date)} · ${une.lecture} ${c.t('journal.minutes')}</span></p>
      <h2 class="titre-section" data-anime="lignes">${une.titre}</h2>
      <p class="chapeau">${une.extrait}</p>
      ${c.lien(une.page, { classe: 'bouton bouton--contour', texte: c.t('journal.lire'), attrs: 'data-survol="magnetique"' })}
    </div>
  </article>
</section>

<section class="archives conteneur" id="articles" data-journal>
  <div class="archives-outils">
    <div class="filtres" role="group" aria-label="${c.s('journal.filtres')}">
      <button type="button" class="filtre" data-filtre="" aria-pressed="true">${c.t('journal.toutes')}</button>
      ${J.saisons.map((s) => html`<button type="button" class="filtre" data-filtre="${s.cle}" aria-pressed="false">${s.nom}<span class="filtre-sous"> · ${s.sousTitre}</span></button>`)}
    </div>
    <div class="recherche">
      <label for="recherche-journal">${c.t('journal.recherche')}</label>
      <input id="recherche-journal" type="search" name="q" placeholder="${c.s('journal.rechercheIndice')}" autocomplete="off">
    </div>
    <p class="archives-compte" aria-live="polite" data-compte data-un="${c.s('journal.resultat')}" data-plusieurs="${c.s('journal.resultats')}">${c.t('journal.resultats', { n: reste.length })}</p>
  </div>
  <ul class="archives-liste" data-anime="cascade">
    ${reste.map((a, i) => html`<li class="carte-article" data-saison="${a.saison}" data-texte="${normal(`${a.titre} ${a.extrait} ${a.episode}`)}">
      ${a.image ? c.media({ nom: a.image, alt: '', classe: 'carte-article-media', cadrage: '50% 12%', sizes: '(max-width: 760px) 90vw, 30vw', ratio: '4 / 3' }) : vignette(a, i)}
      <p class="carte-article-meta"><span>${a.episode}</span><span>${date(a.date)}</span></p>
      <h3>${a.page ? c.lien(a.page, { texte: a.titre, classe: 'lien-carte' }) : html`<span${a.extraitLangue ? brut(` lang="${a.extraitLangue}"`) : ''}>${a.titre}</span>`}</h3>
      ${a.image ? html`<p class="carte-article-extrait"${a.extraitLangue ? brut(` lang="${a.extraitLangue}"`) : ''}>${a.extrait}</p>` : ''}
      ${a.page ? '' : html`<p class="carte-article-bientot">${c.t('journal.bientot')}</p>`}
      ${a.video ? html`<p class="carte-article-video">${c.t('journal.video')}</p>` : ''}
    </li>`)}
  </ul>
  <p class="archives-vide" data-vide hidden>${c.t('journal.aucun')}</p>
</section>

<section class="fin fin--court" id="fin">
  <div class="conteneur fin-grille">
    ${c.media({ nom: 'grok/fiche-botaniq-ambiance', alt: c.s('journal.finAlt'), classe: 'fin-media', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-fx="zoom"' })}
    <div class="fin-texte">
      <h2 class="titre-section" data-anime="lignes">${c.t('article.finTitre')}</h2>
      <p data-anime>${c.t('article.finTexte')}</p>
      <p class="fin-actions" data-anime>${c.lien('contact', { classe: 'bouton bouton--grand', texte: c.t('accueil.fin.action'), attrs: 'data-survol="magnetique"' })}</p>
    </div>
  </div>
</section>
`;
};
