/* Article S02:E06 : modèle d'article du journal. Barre de lecture, image révélée, citation mise en valeur,
   version anglaise de l'auteur (repliée), autres épisodes de la saison. */
import { html, brut } from '../../outils/gabarit.mjs';

export const page = { cle: 'article-s02e06', fichier: 'journal/s02-e06-parler-fort-agir-en-silence', imagePartage: 'journal/s02e06-1024.webp', article: true };

const date = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('fr-CH', { day: 'numeric', month: 'long', year: 'numeric' });

export default (c) => {
  const J = c.donnees.journal;
  const a = J.articles.find((x) => x.cle === 's02e06');
  const A = J.s02e06;
  const autres = J.articles.filter((x) => x.saison === 's02' && x.cle !== 's02e06').slice(0, 3);
  const blocs = [];
  let liste = [];
  A.corps.forEach((b) => {
    if (b.t === 'li') { liste.push(b.x); return; }
    if (liste.length) { blocs.push(html`<ul class="article-liste">${liste.map((x) => html`<li>${x}</li>`)}</ul>`); liste = []; }
    if (b.t === 'h2') blocs.push(html`<h2>${b.x}</h2>`);
    else if (b.t === 'citation') blocs.push(html`<blockquote class="article-citation" data-anime="mots"><p>${b.x}</p></blockquote>`);
    else blocs.push(html`<p>${b.x}</p>`);
  });
  if (liste.length) blocs.push(html`<ul class="article-liste">${liste.map((x) => html`<li>${x}</li>`)}</ul>`);
  return html`
<div data-barre-lecture aria-hidden="true"></div>
<section class="article-tete" id="debut">
  <div class="conteneur article-tete-grille">
    <div>
      <p class="article-retour">${c.lien('journal', { classe: 'lien-fleche lien-fleche--retour', texte: c.t('article.retour') })}</p>
      <p class="carte-article-meta"><span>${a.episode} · ${c.t('article.serie')}</span><span>${date(a.date)} · ${a.lecture} ${c.t('article.lecture')}</span></p>
      <h1 data-anime="lignes">${a.titre}</h1>
      <p class="chapeau" data-anime>${A.chapeau}</p>
      <p class="article-auteur" data-anime>${c.t('article.par')}</p>
      <p data-anime><a class="bouton" href="#texte" data-action-principale>${c.t('article.lire')}</a></p>
    </div>
    ${c.media({ nom: a.image, alt: c.s('article.couvertureAlt'), classe: 'article-media', priorite: true, sizes: '(max-width: 760px) 100vw, 40vw', ratio: '1 / 1', attrs: 'data-anime="rideau"' })}
  </div>
</section>

<section class="article-corps conteneur" id="texte" data-sans-visuel>
  <div class="article-texte">
    ${blocs}
    <p class="hashtags" aria-label="${c.s('article.partage')}">${A.hashtags.map((h) => `#${h}`).join(' ')}</p>
    <details class="article-anglais" lang="en">
      <summary>${brut(`<span lang="fr">${c.s('article.anglais')}</span>`)}</summary>
      <h2>${A.anglais.titre}</h2>
      ${A.anglais.corps.map((x) => html`<p>${x}</p>`)}
    </details>
  </div>
</section>

<section class="article-suite conteneur" id="saison">
  <h2 class="titre-section" data-anime="lignes">${c.t('article.recents')}</h2>
  <ul class="articles-liste" data-anime="cascade" tabindex="0" aria-label="${c.s('article.recents')}">
    ${autres.map((x) => html`<li class="carte-article">
      ${c.media({ nom: x.image, alt: '', classe: 'carte-article-media', sizes: '(max-width: 760px) 90vw, 30vw', ratio: '4 / 3' })}
      <p class="carte-article-meta"><span>${x.episode}</span><span>${date(x.date)}</span></p>
      <h3>${x.titre}</h3>
      <p class="carte-article-bientot">${c.t('journal.bientot')}</p>
    </li>`)}
  </ul>
</section>

<section class="fin fin--court" id="fin">
  <div class="conteneur fin-grille">
    ${c.media({ nom: 'grok/legal-conditions', alt: c.s('article.finAlt'), classe: 'fin-media', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-fx="zoom"' })}
    <div class="fin-texte">
      <h2 class="titre-section" data-anime="lignes">${c.t('article.finTitre')}</h2>
      <p data-anime>${c.t('article.finTexte')}</p>
      <p class="fin-actions" data-anime>${c.lien('contact', { classe: 'bouton bouton--grand', texte: c.t('accueil.fin.action'), attrs: 'data-survol="magnetique"' })}</p>
    </div>
  </div>
</section>
`;
};
