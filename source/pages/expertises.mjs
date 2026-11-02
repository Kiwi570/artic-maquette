/* Expertises : les huit chapitres (cinq étapes du cycle, trois transversales), chacun avec « l'esprit » et « la méthode »,
   un bouton qui ouvre la demande avec l'expertise déjà choisie, et un petit anneau dans la marge
   qui suit le chapitre en cours (effet « anneau-sommaire »). */
import { html, brut } from '../../outils/gabarit.mjs';

export const page = { cle: 'expertises', fichier: 'expertises', imagePartage: 'grok/expertises-ouverture-1168.webp' };

const deux = (n) => String(n).padStart(2, '0');

/* Anneau en huit arcs, un par chapitre ; l'arc du chapitre en cours passe au rouge. */
function anneau(n) {
  const r = 46, c = 2 * Math.PI * r, part = c / n, vide = 4;
  return brut(`<svg class="sommaire-anneau" viewBox="0 0 120 120" aria-hidden="true"><g transform="rotate(-90 60 60)">${Array.from({ length: n }, (_, i) => `<circle class="sommaire-arc" data-arc="${i}" cx="60" cy="60" r="${r}" stroke-dasharray="${(part - vide).toFixed(2)} ${(c - part + vide).toFixed(2)}" stroke-dashoffset="${(-i * part).toFixed(2)}"/>`).join('')}</g><text class="sommaire-num" x="60" y="66" text-anchor="middle">01</text></svg>`);
}

export default (c) => {
  const ex = c.donnees.expertises;
  return html`
<section class="page-tete" id="debut">
  <div class="conteneur page-tete-grille">
    <div>
      <p class="surtitre">${c.t('expertises.surtitre')}</p>
      <h1 data-anime="lignes">${c.t('expertises.titre')}</h1>
      <p class="chapeau" data-anime>${c.t('expertises.texte')}</p>
      <p data-anime>${c.lien('contact', { classe: 'bouton bouton--grand', texte: c.t('expertises.action'), attrs: 'data-action-principale data-survol="magnetique"' })}</p>
    </div>
    ${c.media({ nom: 'grok/expertises-ouverture', alt: c.s('expertises.alt'), cadrage: '50% 50%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 46vw', attrs: 'data-fx="parallaxe"' })}
  </div>
</section>

<section class="chapitres" id="chapitres">
  <div class="conteneur chapitres-grille">
    <aside class="sommaire-expertises" data-effet="anneau-sommaire" aria-label="${c.s('expertises.sommaire')}">
      ${anneau(ex.length)}
      <p class="sommaire-courant" aria-hidden="true">${ex[0].nom}</p>
      <ol class="sommaire-liste">${ex.map((e, i) => html`<li><a href="#${e.cle}" data-sommaire-lien="${i}"><span>${deux(i + 1)}</span>${e.nom}</a></li>`)}</ol>
    </aside>
    <div class="chapitres-liste">
      ${ex.map((e, i) => html`<article class="chapitre" id="${e.cle}" data-chapitre="${i}" data-section>
        <header class="chapitre-tete">
          <p class="chapitre-num"><span>${deux(i + 1)}</span> ${e.cycle ? c.t('expertises.cycle') : c.t('expertises.transversale')}</p>
          <h2 data-anime="lignes">${e.nom}</h2>
          ${e.hashtags.length ? html`<p class="hashtags">${e.hashtags.map((h) => `#${h}`).join(' ')}</p>` : ''}
        </header>
        ${c.media({ nom: e.image, alt: e.alt, classe: `chapitre-media${e.image.includes('/cycle-') ? ' chapitre-media--rond' : ''}`, sizes: '(max-width: 760px) 100vw, 52vw', ratio: '16 / 10', attrs: 'data-anime="rideau"' })}
        <div class="chapitre-colonnes">
          <div><h3>${c.t('expertises.esprit')}</h3>${e.esprit.map((x) => html`<p>${x}</p>`)}</div>
          <div><h3>${c.t('expertises.methode')}</h3>${e.methode.map((x) => html`<p>${x}</p>`)}</div>
        </div>
        <p>${c.lien('contact', { params: `expertise=${e.cle}`, classe: 'lien-fleche', texte: html`${c.t('expertises.parler')}<span class="visuellement-cache"> : ${e.nom}</span>` })}</p>
      </article>`)}
    </div>
  </div>
</section>

<section class="fin fin--court" id="fin">
  <div class="conteneur fin-grille">
    ${c.media({ nom: 'grok/legal-confidentialite', alt: c.s('expertises.finAlt'), classe: 'fin-media', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-fx="zoom"' })}
    <div class="fin-texte">
      <h2 class="titre-section" data-anime="lignes">${c.t('expertises.finTitre')}</h2>
      <p data-anime>${c.t('expertises.finTexte')}</p>
      <p class="fin-actions" data-anime>${c.lien('contact', { classe: 'bouton bouton--grand', texte: c.t('accueil.fin.action'), attrs: 'data-survol="magnetique"' })}</p>
    </div>
  </div>
</section>
`;
};
