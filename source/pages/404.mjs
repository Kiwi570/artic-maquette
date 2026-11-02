/* Page 404 : « Cette table n'a pas été dressée ». */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: '404', fichier: '404', imagePartage: 'grok/404-table-1168.webp', partage: false };

export default (c) => html`
<section class="introuvable" id="debut">
  ${c.media({ nom: 'grok/404-table', alt: c.s('introuvable.alt'), priorite: true, classe: 'introuvable-media', sizes: '100vw', attrs: 'data-fx="zoom" data-fx-force="10"' })}
  <div class="conteneur introuvable-texte" data-superpose>
    <p class="surtitre">${c.t('introuvable.surtitre')}</p>
    <h1 data-anime="lignes">${c.t('introuvable.titre')}</h1>
    <p data-anime>${c.t('introuvable.texte')}</p>
    <p class="introuvable-actions" data-anime>
      ${c.lien('accueil', { classe: 'bouton bouton--grand', texte: c.t('introuvable.retour'), attrs: 'data-action-principale data-survol="magnetique"' })}
      ${c.lien('contact', { classe: 'lien-fleche', texte: c.t('introuvable.contact') })}
    </p>
  </div>
</section>
`;
