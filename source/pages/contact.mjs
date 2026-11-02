/* Contact : demande en quatre étapes (expertise, projet, calendrier, coordonnées), préremplie par l'adresse
   (?expertise=conception), récapitulatif en direct, fil rouge qui relie les étapes (effet « fil-rouge »),
   coordonnées sélectionnables et plan d'Orbe dessiné d'après les coordonnées réelles. Envoi simulé. */
import { html, brut } from '../../outils/gabarit.mjs';
import { externe } from '../gabarits/commun.mjs';

export const page = { cle: 'contact', fichier: 'contact', imagePartage: 'grok/contact-ouverture-1168.webp' };

/* Plan : villes placées par leur latitude et longitude réelles (projection simple). */
function plan(c) {
  const villes = [
    { cle: 'orbe', lat: 46.7253, lon: 6.5314, fin: true },
    { cle: 'yverdon', lat: 46.7785, lon: 6.6412 },
    { cle: 'lausanne', lat: 46.5197, lon: 6.6323 },
    { cle: 'geneve', lat: 46.2044, lon: 6.1432 },
  ];
  const o = 5.95, e = 7.0, n = 46.9, s = 46.1, W = 600, k = Math.cos((46.5 * Math.PI) / 180);
  const H = Math.round(((n - s) / ((e - o) * k)) * W);
  const x = (lon) => ((lon - o) / (e - o)) * W, y = (lat) => ((n - lat) / (n - s)) * H;
  const lignes = [];
  for (let la = 46.2; la <= 46.85; la += 0.1) lignes.push(`M0 ${y(la).toFixed(1)}H${W}`);
  for (let lo = 6.0; lo <= 7.0; lo += 0.1) lignes.push(`M${x(lo).toFixed(1)} 0V${H}`);
  /* Contours simplifiés du Léman et du lac de Neuchâtel, d'après les coordonnées des localités riveraines. */
  const lacs = [
    [[46.205, 6.152], [46.262, 6.17], [46.31, 6.2], [46.38, 6.238], [46.418, 6.28], [46.455, 6.335], [46.483, 6.4], [46.508, 6.497], [46.518, 6.56], [46.506, 6.628], [46.493, 6.7], [46.462, 6.84], [46.432, 6.9], [46.396, 6.927], [46.385, 6.86], [46.385, 6.8], [46.403, 6.7], [46.403, 6.59], [46.38, 6.5], [46.374, 6.42], [46.36, 6.33], [46.33, 6.27], [46.27, 6.215], [46.215, 6.165]],
    [[46.778, 6.643], [46.81, 6.655], [46.85, 6.72], [46.895, 6.79], [46.95, 6.86], [47.0, 6.95], [47.0, 7.05], [46.96, 6.98], [46.9, 6.89], [46.86, 6.83], [46.82, 6.75], [46.79, 6.68]],
  ].map((l) => `M${l.map(([la, lo]) => `${x(lo).toFixed(1)} ${y(la).toFixed(1)}`).join('L')}Z`).join('');
  const points = villes.map((v) => {
    const px = x(v.lon), py = y(v.lat);
    const gauche = v.cle === 'orbe' || v.cle === 'yverdon';
    const anc = gauche ? 'end' : 'start';
    const dx = gauche ? -16 : 14, dy = v.cle === 'yverdon' ? -8 : 6;
    return `<g class="plan-ville${v.fin ? ' plan-ville--orbe' : ''}"><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${v.fin ? 9 : 5}"/>${v.fin ? `<circle class="plan-onde" cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="9"/>` : ''}<text x="${(px + dx).toFixed(1)}" y="${(py + dy).toFixed(1)}" text-anchor="${anc}">${c.s('contact.' + v.cle)}</text></g>`;
  }).join('');
  return brut(`<svg class="plan" viewBox="0 0 ${W} ${H}" role="img" aria-label="${c.s('contact.carte')}"><rect class="plan-fond" width="${W}" height="${H}" rx="6"/><path class="plan-grille" d="${lignes.join('')}"/><path class="plan-lac" d="${lacs}"/>${points}</svg>`);
}

export default (c) => {
  const ex = c.donnees.expertises;
  const etapes = [1, 2, 3, 4];
  return html`
<section class="page-tete page-tete--contact" id="debut">
  <div class="conteneur page-tete-grille">
    <div>
      <p class="surtitre">${c.t('contact.surtitre')}</p>
      <h1 data-anime="lignes">${c.t('contact.titre')}</h1>
      <p class="chapeau" data-anime>${c.t('contact.texte')}</p>
      <p data-anime><a class="bouton bouton--grand" href="#demande" data-action-principale>${c.t('contact.action')}</a></p>
      <p class="contact-info" data-info-cle data-anime><a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a> · <a href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></p>
    </div>
    ${c.media({ nom: 'grok/contact-ouverture', alt: c.s('contact.alt'), cadrage: '45% 55%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 46vw', attrs: 'data-fx="parallaxe"' })}
  </div>
</section>

<section class="demande" id="demande" data-masque-barre data-sans-visuel>
  <div class="conteneur demande-grille">
    <div class="demande-col">
      <h2 class="titre-section" data-anime="lignes">${c.t('contact.formTitre')}</h2>
      <p class="demande-deroule" data-anime>${c.t('contact.deroule')}</p>
      <ol class="etapes-reperes" data-effet="fil-rouge" aria-hidden="true">
        <li class="fil-rouge"><svg viewBox="0 0 4 100" preserveAspectRatio="none"><path d="M2 0 V100" pathLength="1"/></svg></li>
        ${etapes.map((n) => html`<li class="etape-repere" data-repere-etape="${n}"><span>${n}</span><em class="etape-nom">${c.t(`contact.etape${n}`)}</em></li>`)}
      </ol>
      <form class="formulaire-etapes" data-formulaire data-etapes action="#" novalidate>
        <fieldset class="etape-champs" data-etape="1">
          <legend>${c.t('contact.etape')} 1 ${c.t('contact.sur')} 4 · ${c.t('contact.q1')}</legend>
          <p class="etape-aide" id="aide-expertise">${c.t('contact.choixExpertise')}</p>
          <div class="choix-grille" role="group" aria-describedby="aide-expertise">
            ${ex.map((e) => html`<label class="choix"><input type="checkbox" name="expertise" value="${e.cle}"><span>${e.nom}</span></label>`)}
          </div>
          <p class="champ-erreur" id="erreur-expertise" data-erreur-expertise data-texte="${c.s('contact.aucuneExpertise')}" aria-live="polite"></p>
          <p class="etape-boutons"><button type="button" class="bouton" data-suivant>${c.t('contact.suivant')}</button></p>
        </fieldset>
        <fieldset class="etape-champs" data-etape="2" hidden>
          <legend>${c.t('contact.etape')} 2 ${c.t('contact.sur')} 4 · ${c.t('contact.q2')}</legend>
          <div class="champ"><label for="f-projet">${c.t('contact.decrire')}</label><textarea id="f-projet" name="projet" rows="6" required data-erreur="${c.s('contact.projetVide')}" placeholder="${c.s('contact.q2Indice')}"></textarea></div>
          <p class="etape-boutons"><button type="button" class="bouton bouton--contour" data-precedent>${c.t('contact.precedent')}</button><button type="button" class="bouton" data-suivant>${c.t('contact.suivant')}</button></p>
        </fieldset>
        <fieldset class="etape-champs" data-etape="3" hidden>
          <legend>${c.t('contact.etape')} 3 ${c.t('contact.sur')} 4 · ${c.t('contact.q3')}</legend>
          <div class="choix-grille choix-grille--quatre">
            ${[1, 2, 3, 4].map((n) => html`<label class="choix"><input type="radio" name="debut" value="c${n}"${n === 4 ? brut(' checked') : ''}><span>${c.t(`contact.c${n}`)}</span></label>`)}
          </div>
          <p class="etape-boutons"><button type="button" class="bouton bouton--contour" data-precedent>${c.t('contact.precedent')}</button><button type="button" class="bouton" data-suivant>${c.t('contact.suivant')}</button></p>
        </fieldset>
        <fieldset class="etape-champs" data-etape="4" hidden>
          <legend>${c.t('contact.etape')} 4 ${c.t('contact.sur')} 4 · ${c.t('contact.etape4')}</legend>
          <div class="champs-deux">
            <div class="champ"><label for="f-prenom">${c.t('contact.prenom')}</label><input id="f-prenom" name="prenom" autocomplete="given-name" required></div>
            <div class="champ"><label for="f-nom">${c.t('contact.nom')}</label><input id="f-nom" name="nom" autocomplete="family-name" required></div>
          </div>
          <div class="champ"><label for="f-email">${c.t('contact.email')}</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
          <div class="champs-deux">
            <div class="champ"><label for="f-tel">${c.t('contact.tel')}</label><input id="f-tel" name="tel" type="tel" autocomplete="tel"></div>
            <div class="champ"><label for="f-entreprise">${c.t('contact.entreprise')}</label><input id="f-entreprise" name="entreprise" autocomplete="organization"></div>
          </div>
          <p class="mention-donnees">${c.tb('contact.donnees')}</p>
          <p class="etape-boutons"><button type="button" class="bouton bouton--contour" data-precedent>${c.t('contact.precedent')}</button><button type="submit" class="bouton">${c.t('contact.envoyer')}</button></p>
          <p data-message-envoi data-texte="${c.s('contact.simule')}" role="status" tabindex="-1" hidden></p>
        </fieldset>
      </form>
    </div>
    <aside class="recap" aria-live="polite">
      <h2 class="petit-titre">${c.t('contact.recap')}</h2>
      <dl class="recap-liste" data-recap data-vide="${c.s('contact.recapVide')}">
        <div><dt>${c.t('contact.etape1')}</dt><dd data-recap-champ="expertise">—</dd></div>
        <div><dt>${c.t('contact.etape2')}</dt><dd data-recap-champ="projet">—</dd></div>
        <div><dt>${c.t('contact.etape3')}</dt><dd data-recap-champ="debut">—</dd></div>
        <div><dt>${c.t('contact.etape4')}</dt><dd data-recap-champ="coordonnees">—</dd></div>
      </dl>
    </aside>
  </div>
</section>

<section class="coordonnees" id="coordonnees">
  <div class="conteneur coordonnees-grille">
    <div>
      <h2 class="titre-section" data-anime="lignes">${c.t('contact.infos')}</h2>
      <dl class="coordonnees-liste" data-anime="cascade">
        <div><dt>${c.t('contact.adresse')}</dt><dd>${c.site.contact.rue}<br>${c.site.contact.ville}<br>${c.site.contact.region}</dd></div>
        <div><dt>${c.t('contact.telephone')}</dt><dd><a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a></dd></div>
        <div><dt>${c.t('contact.email')}</dt><dd><a href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></dd></div>
        <div><dt>${c.t('commun.aCompleter')}</dt><dd>${c.t('contact.horaires')}</dd></div>
      </dl>
      <p>${externe(c, 'https://www.google.com/maps/search/?api=1&query=46.7252773,6.5313855', c.t('contact.itineraire'), 'lien-fleche')}</p>
    </div>
    <figure class="plan-cadre" data-effet="plan">
      ${plan(c)}
      <figcaption>${c.t('contact.coordonnees')}</figcaption>
    </figure>
  </div>
</section>
`;
};
