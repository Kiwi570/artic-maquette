/* Gabarit commun : head, en-tête, menu, pied de page, barre fixe du téléphone, voile, panneau d'ouverture.
   Les conventions data-* sont celles que lisent le socle JavaScript et l'audit (voir le README). */
import { html, brut, texteBrut } from '../../outils/gabarit.mjs';

/* La marque s'écrit avec un point d'exclamation collé : hors du contrôle de typographie française. */
const MARQUE = '<span class="marque" data-typo-ignorer>Artic<span class="marque-point">!</span>Agency</span>';
export const marque = (frag) => brut(texteBrut(frag).replaceAll('Artic!Agency', MARQUE));

const navigation = (c) => c.site.navigation.filter((cle) => c.pages[cle] && (c.pages[cle].langues || c.langues).includes(c.l));
/* Lien externe : nouvel onglet, annoncé aux lecteurs d'écran par une description commune (#nouvel-onglet, en pied de page). */
const externe = (c, url, texte, classe = '') => html`<a href="${url}" target="_blank" rel="noopener" aria-describedby="nouvel-onglet"${classe ? brut(` class="${classe}"`) : ''}>${texte}</a>`;
export { externe };

function tete(c) {
  const p = c.page, cle = p.cle;
  const titre = c.s(`pages.${cle}.titre`), description = c.s(`pages.${cle}.description`);
  const ici = c.abs(c.url(cle));
  const imagePartage = c.abs(`/assets/partage/${p.partage === false ? 'accueil' : cle}-${c.l}.jpg`);
  const structure = c.donnees.structure ? JSON.stringify(c.donnees.structure).replace(/</g, '\\u003c') : '';
  return html`<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${titre}</title>
<meta name="description" content="${description}">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${ici}">
<style>${brut(c.critique.css)}</style>
<script>${brut(c.critique.js)}</script>
<script>(function(){var d=document.documentElement;if(innerWidth<720){d.classList.add('nav-compacte');setTimeout(function(){if(!d.classList.contains('demarre'))d.classList.remove('nav-compacte');},2000);}})();</script>
${(c.site.polices || []).map((f) => html`<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>\n`)}<link rel="stylesheet" href="${c.asset('css/socle.css')}">
<link rel="stylesheet" href="${c.asset('css/site.css')}">
<link rel="modulepreload" href="${c.asset('js/site.js')}">
<link rel="modulepreload" href="${c.asset('js/socle/index.js')}">
<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/vendor/SplitText.min.js" defer></script>
<script type="module" src="${c.asset('js/site.js')}"></script>
<meta name="theme-color" content="${c.site.couleurs.theme || c.site.couleurs.fond}">
<link rel="icon" href="/assets/images/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">
<meta property="og:type" content="${p.article ? 'article' : 'website'}">
<meta property="og:site_name" content="${c.site.nom}">
<meta property="og:locale" content="fr_CH">
<meta property="og:title" content="${titre}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${ici}">
<meta property="og:image" content="${imagePartage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${c.s(`pages.${p.partage === false ? 'accueil' : cle}.partageAlt`)}">
<meta name="twitter:card" content="summary_large_image">
${structure ? html`<script type="application/ld+json">${brut(structure)}</script>` : ''}
</head>`;
}

/* Logo en texte : ARTIC, point rouge, AGENCY. Les lettres sont aussi la cible de l'intro. */
const logo = () => brut('<span class="logo-mot" data-typo-ignorer>ARTIC<span class="logo-point">!</span></span><span class="logo-agence">AGENCY</span>');

function entete(c) {
  const liens = navigation(c).filter((k) => k !== 'accueil' && k !== c.site.actionEntete.page);
  return html`<header data-entete>
  <div class="entete-rangee">
    <a class="entete-logo" href="${c.url('accueil')}" data-libelle="${c.libelle('accueil')}" aria-label="${c.s('commun.accueilLogo')}"${c.page.cle === 'accueil' ? brut(' aria-current="page"') : ''}>${logo()}</a>
    <nav data-nav aria-label="${c.s('commun.navigation')}">
      <ul>${liens.map((k) => html`<li>${c.lien(k, { classe: 'nav-lien' })}</li>`)}</ul>
    </nav>
    <div class="entete-actions">
      ${c.lien(c.site.actionEntete.page, { classe: 'bouton bouton--entete', texte: c.t('commun.actionEntete'), attrs: 'data-survol="magnetique"' })}
      <button type="button" data-menu-bouton aria-controls="menu" aria-expanded="false" data-libelle-ouvrir="${c.s('commun.menu')}" data-libelle-fermer="${c.s('commun.fermer')}"><span class="menu-icone" aria-hidden="true"><span></span><span></span></span><span data-libelle-bouton>${c.t('commun.menu')}</span></button>
    </div>
  </div>
</header>
<div id="menu" data-menu role="dialog" aria-modal="true" aria-label="${c.s('commun.menu')}">
  <div class="menu-grille">
    <ul>${navigation(c).map((k, i) => html`<li style="--i:${i}"><span class="menu-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${c.lien(k, { classe: 'menu-lien' })}</li>`)}</ul>
    <div class="menu-infos">
      <p><a class="bouton bouton--clair" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a></p>
      <p><a href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></p>
      <p>${c.site.contact.rue}<br>${c.site.contact.ville}</p>
      <p><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></p>
    </div>
  </div>
</div>`;
}

function pied(c) {
  return html`<footer class="pied" id="pied">
  <div class="conteneur pied-grille">
    <div>
      <p class="pied-titre">${c.t('commun.contact')}</p>
      <p>${c.site.contact.rue}<br>${c.site.contact.ville}<br>${c.site.contact.region}</p>
      <p><a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a><br><a href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></p>
    </div>
    <nav aria-label="${c.s('commun.sommaire')}">
      <p class="pied-titre">${c.t('commun.sommaire')}</p>
      <ul>${navigation(c).map((k) => html`<li>${c.lien(k)}</li>`)}<li>${c.lien('mentions-legales')}</li></ul>
    </nav>
    <div>
      <p class="pied-titre">${c.t('commun.suivre')}</p>
      <ul>${c.site.reseaux.map((r) => html`<li>${externe(c, r.url, r.nom)}</li>`)}</ul>
    </div>
    <div>
      <p class="pied-titre">${c.t('commun.confort')}</p>
      <ul>
        <li><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></li>
        <li><a href="#haut" data-sans-transition>${c.t('commun.retourHaut')}</a></li>
      </ul>
    </div>
  </div>
  <div class="pied-marque" aria-hidden="true" data-typo-ignorer><span>ARTIC<span class="logo-point">!</span></span><span class="pied-agence">AGENCY</span></div>
  <div class="conteneur pied-bas"><p>${c.t('commun.maquette')}</p><p>© ${marque(html`${c.site.nom}`)} · Orbe</p></div>
  <p id="nouvel-onglet" hidden>${c.t('commun.nouvelOnglet')}</p>
</footer>`;
}

function barre(c) {
  const a = c.site.actionEntete;
  return html`<div data-barre-fixe>
  <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')}</a>
  ${c.lien(a.page, { classe: 'bouton', texte: c.t('commun.actionEntete') })}
</div>`;
}

function voile(c) {
  return html`<div data-voile aria-hidden="true"><div class="voile-contenu"><span class="voile-logo" data-typo-ignorer>ARTIC<span class="logo-point">!</span></span><span data-voile-libelle>${c.libelle(c.page.cle)}</span></div></div>`;
}

/* Panneau d'ouverture : la phrase « l'Art de l'Intelligence Commerciale », dont A, R, T, I et C forment ARTIC.
   Les lettres gardées portent data-garde (0 à 4) ; le mot final sert de cible et reçoit le point. */
function ouverture(c) {
  const phrase = c.s('commun.introPhrase').toLocaleUpperCase('fr');
  const mots = phrase.split(' ');
  let rang = 0;
  const lettres = (mot, gardees) => [...mot].map((ch, i) => (gardees.includes(i)
    ? brut(`<span class="intro-c" data-garde="${rang++}">${ch}</span>`)
    : brut(`<span class="intro-c">${ch === '’' ? '’' : ch}</span>`)));
  /* L’ART : A R T (positions 2 à 4) ; L’INTELLIGENCE : I (2) ; COMMERCIALE : C (0). */
  const gardees = [[2, 3, 4], [], [2], [0]];
  return html`<div class="ouverture-panneau" data-ouverture data-gouttiere="${c.site.couleurs.ouverture}" aria-hidden="true">
  <div class="intro-demi intro-demi--haut"></div>
  <div class="intro-demi intro-demi--bas"></div>
  <p class="intro-phrase" data-typo-ignorer>${mots.map((m, i) => html`<span class="intro-p">${lettres(m, gardees[i] || [])}</span> `)}</p>
  <p class="intro-mot" data-typo-ignorer data-effet="bouchon"><span class="intro-l">A</span><span class="intro-l">R</span><span class="intro-l">T</span><span class="intro-l">I</span><span class="intro-l">C</span><span class="intro-point">!</span></p>
  <span class="intro-onde"></span>
</div>`;
}

export function page(c, contenu) {
  return html`<!doctype html>
<html lang="${c.l}" data-v="${c.v}"${c.site.curseur ? brut(' data-curseur') : ''} data-page="${c.page.cle}">
${tete(c)}
<body id="haut">
${voile(c)}
${ouverture(c)}
<a class="evitement" href="#contenu">${c.t('commun.evitement')}</a>
${entete(c)}
<main id="contenu" tabindex="-1"${c.page.sansAction ? brut(' data-sans-action') : ''}${c.page.sansEffet ? brut(' data-sans-effet') : ''}>
${contenu}
</main>
${pied(c)}
${barre(c)}
</body>
</html>`;
}
