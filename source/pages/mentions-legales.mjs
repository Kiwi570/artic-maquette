/* Mentions légales : fiche à compléter, éditeur, hébergeur, crédits, confidentialité (nLPD), droit applicable.
   Barre de lecture et sommaire qui suit la lecture. sansEffet : page de texte. */
import { html } from '../../outils/gabarit.mjs';
import { marque } from '../gabarits/commun.mjs';

export const page = { cle: 'mentions-legales', fichier: 'mentions-legales', imagePartage: 'grok/legal-mentions-1168.webp', sansAction: true, sansEffet: true };

const sections = ['fiche', 'editeur', 'hebergeur', 'credits', 'confidentialite', 'droit'];

export default (c) => html`
<div data-barre-lecture aria-hidden="true"></div>
<section class="page-tete page-tete--court" id="debut">
  <div class="conteneur page-tete-grille">
    <div>
      <h1>${c.t('mentions.titre')}</h1>
      <nav data-sommaire aria-label="${c.s('commun.sommaire')}"><ul>${sections.map((s) => html`<li><a href="#${s}">${c.t(`mentions.${s}.titre`)}</a></li>`)}</ul></nav>
    </div>
    ${c.media({ nom: 'grok/legal-mentions', alt: c.s('mentions.alt'), priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 40vw' })}
  </div>
</section>
<div class="texte-long conteneur" data-sans-visuel>
  ${sections.map((s) => html`<section id="${s}" class="${s === 'fiche' ? 'fiche-completer' : ''}"><h2>${c.t(`mentions.${s}.titre`)}</h2><p>${marque(c.t(`mentions.${s}.texte`))}</p></section>`)}
</div>
`;
