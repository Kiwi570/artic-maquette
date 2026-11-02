/* Parcours propres à Artic!Agency : filtres et recherche du journal, visionneuse de la fiche distriBOtion,
   demande en quatre étapes du contact. Chaque problème s'ajoute au rapport (R.echec / R.regarder). */
export default async function ({ contexte, attendrePret, attendre, BASE, R, T }) {
  for (const taille of ['390×844', '1366×768']) {
    const { ctx, page } = await contexte({ taille: T(taille) });
    try {
      /* ---------- Journal ---------- */
      const etatJournal = () => page.evaluate(() => {
        const cartes = [...document.querySelectorAll('.archives-liste > li')];
        const vis = cartes.filter((c) => getComputedStyle(c).display !== 'none');
        return {
          visibles: vis.length,
          saisons: [...new Set(vis.map((c) => c.dataset.saison))],
          textes: vis.map((c) => c.dataset.texte),
          compte: document.querySelector('[data-compte]').textContent,
          vide: !document.querySelector('[data-vide]').hidden,
          presse: document.querySelector('[data-filtre][aria-pressed="true"]')?.dataset.filtre,
          adresse: location.search,
        };
      });
      await page.goto(BASE + '/journal?saison=s01', { waitUntil: 'load' });
      await attendrePret(page);
      let e = await etatJournal();
      if (e.presse !== 's01' || e.saisons.some((s) => s !== 's01') || !e.visibles) R.echec('journal', `filtre ?saison=s01 mal appliqué (${e.visibles} articles, saisons ${e.saisons.join(',')})`, { page: '/journal', taille });
      if (!e.compte.includes(String(e.visibles))) R.echec('journal', `compteur « ${e.compte} » pour ${e.visibles} articles visibles`, { page: '/journal', taille });
      await page.click('[data-filtre=""]');
      await page.fill('#recherche-journal', 'Bières');
      await attendre(500);
      e = await etatJournal();
      if (!e.visibles || e.textes.some((t) => !t.includes('biere'))) R.echec('journal', `recherche « Bières » (accent, majuscule, pluriel) : ${e.visibles} résultat(s)`, { page: '/journal', taille });
      if (!/q=Bi%C3%A8res|q=Bi%E8res|q=Bières/.test(decodeURIComponent(e.adresse)) && !e.adresse.includes('q=')) R.echec('journal', 'la recherche n’est pas gardée dans l’adresse', { page: '/journal', taille });
      if (!e.compte.includes(String(e.visibles))) R.echec('journal', `compteur « ${e.compte} » pour ${e.visibles} articles visibles`, { page: '/journal', taille });
      await page.fill('#recherche-journal', 'zzzqqq');
      await attendre(500);
      e = await etatJournal();
      if (e.visibles || !e.vide) R.echec('journal', 'aucun message quand la recherche ne trouve rien', { page: '/journal', taille });
      await page.goto(BASE + '/journal?q=verre', { waitUntil: 'load' });
      await attendrePret(page);
      e = await etatJournal();
      if (!e.visibles || e.textes.some((t) => !t.includes('verre')) || (await page.inputValue('#recherche-journal')) !== 'verre') R.echec('journal', 'lien profond ?q=verre mal appliqué', { page: '/journal', taille });

      /* ---------- Visionneuse ---------- */
      const etatVis = () => page.evaluate(() => {
        const f = document.querySelector('[data-visionneuse-fenetre]');
        return {
          ouverte: !f.hidden && getComputedStyle(f).display !== 'none',
          focusDedans: f.contains(document.activeElement),
          legende: f.querySelector('figcaption').textContent,
          image: f.querySelector('img').currentSrc || f.querySelector('img').src,
          hash: location.hash,
          bloque: document.documentElement.classList.contains('defilement-bloque'),
          actif: document.activeElement && document.activeElement.id,
        };
      });
      await page.goto(BASE + '/projets/distribotion', { waitUntil: 'load' });
      await attendrePret(page);
      await page.locator('[data-visionneuse="0"]').scrollIntoViewIfNeeded();
      await attendre(400);
      await page.click('[data-visionneuse="0"]');
      await attendre(500);
      let v = await etatVis();
      if (!v.ouverte || !v.focusDedans || v.hash !== '#photo-1' || !v.bloque) R.echec('visionneuse', `ouverture : ouverte ${v.ouverte}, focus dedans ${v.focusDedans}, adresse ${v.hash}, page bloquée ${v.bloque}`, { page: '/projets/distribotion', taille });
      await page.keyboard.press('ArrowRight');
      await attendre(400);
      v = await etatVis();
      if (!v.legende.includes('2') || v.hash !== '#photo-2') R.echec('visionneuse', `flèche droite : légende « ${v.legende} », adresse ${v.hash}`, { page: '/projets/distribotion', taille });
      for (let i = 0; i < 4; i++) await page.keyboard.press('Tab');
      v = await etatVis();
      if (!v.focusDedans) R.echec('visionneuse', 'le focus sort de la visionneuse avec Tab', { page: '/projets/distribotion', taille });
      await page.keyboard.press('Escape');
      await attendre(400);
      v = await etatVis();
      if (v.ouverte || v.bloque || v.actif !== 'photo-2') R.echec('visionneuse', `Échap : ouverte ${v.ouverte}, page bloquée ${v.bloque}, focus sur ${v.actif || 'rien'} (attendu : photo-2)`, { page: '/projets/distribotion', taille });
      await page.goto(BASE + '/projets/distribotion#photo-4', { waitUntil: 'load' });
      await attendrePret(page);
      await attendre(500);
      v = await etatVis();
      if (!v.ouverte || !v.legende.includes('4')) R.echec('visionneuse', `lien profond #photo-4 : ouverte ${v.ouverte}, légende « ${v.legende} »`, { page: '/projets/distribotion', taille });

      /* ---------- Demande en quatre étapes ---------- */
      const etape = () => page.evaluate(() => [...document.querySelectorAll('[data-etape]')].filter((f) => !f.hidden).map((f) => f.dataset.etape).join(','));
      await page.goto(BASE + '/contact?expertise=gestion', { waitUntil: 'load' });
      await attendrePret(page);
      const pre = await page.evaluate(() => ({ coche: document.querySelector('input[name="expertise"][value="gestion"]').checked, recap: document.querySelector('[data-recap-champ="expertise"]').textContent }));
      if (!pre.coche || !/Gestion/.test(pre.recap)) R.echec('demande', `?expertise=gestion : case cochée ${pre.coche}, récapitulatif « ${pre.recap} »`, { page: '/contact', taille });
      await page.goto(BASE + '/contact', { waitUntil: 'load' });
      await attendrePret(page);
      await page.locator('#demande').scrollIntoViewIfNeeded();
      await page.click('[data-etape="1"] [data-suivant]');
      await attendre(300);
      const err = await page.textContent('[data-erreur-expertise]');
      if ((await etape()) !== '1' || !err.trim()) R.echec('demande', 'étape 1 franchie sans expertise choisie, ou sans message', { page: '/contact', taille });
      await page.check('input[name="expertise"][value="transition"]');
      await page.click('[data-etape="1"] [data-suivant]');
      await attendre(600);
      if ((await etape()) !== '2') R.echec('demande', 'l’étape 2 ne s’affiche pas', { page: '/contact', taille });
      await page.click('[data-etape="2"] [data-suivant]');
      await attendre(300);
      if ((await etape()) !== '2') R.echec('demande', 'étape 2 franchie sans description du projet', { page: '/contact', taille });
      await page.fill('#f-projet', 'Reprise d’un restaurant de 60 couverts à Yverdon.');
      await page.click('[data-etape="2"] [data-suivant]');
      await attendre(600);
      await page.check('input[name="debut"][value="c2"]');
      await page.click('[data-etape="3"] [data-suivant]');
      await attendre(600);
      if ((await etape()) !== '4') R.echec('demande', 'l’étape 4 ne s’affiche pas', { page: '/contact', taille });
      await page.fill('#f-prenom', 'Claire');
      await page.fill('#f-nom', 'Martin');
      await page.fill('#f-email', 'claire@exemple.ch');
      const recap = await page.evaluate(() => [...document.querySelectorAll('[data-recap-champ]')].map((d) => d.textContent).join(' | '));
      if (!/Transition/.test(recap) || !/Yverdon/.test(recap) || !/trois mois/.test(recap) || !/Claire Martin/.test(recap)) R.echec('demande', `récapitulatif incomplet : ${recap}`, { page: '/contact', taille });
      await page.click('[data-etape="4"] [type="submit"]');
      await attendre(400);
      const fin = await page.evaluate(() => { const m = document.querySelector('[data-message-envoi]'); return !m.hidden && m.textContent.length > 10; });
      if (!fin) R.echec('demande', 'pas de message après l’envoi simulé', { page: '/contact', taille });
    } catch (err) {
      R.echec('parcours projet', `${taille} : ${err.message.split('\n')[0]}`, {});
    } finally { await ctx.close(); }
  }
}
