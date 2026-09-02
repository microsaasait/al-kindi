// ---------------------------------------------------------------------------
// AL KINDI : configuration du site (un seul endroit à modifier).
// ⚠️ Les valeurs marquées TODO viennent de l'association — à confirmer avec
// Eddy avant la mise en ligne définitive (elles apparaissent telles quelles
// sur la page et dans le schema.org).
// ---------------------------------------------------------------------------

export const SITE_URL = 'https://al-kindi-seven.vercel.app'; // TODO remplacer par le domaine définitif de l'association (et le répercuter dans index.html, robots.txt et sitemap.xml)

export const CONTACT = {
  email: 'contact@association-alkindi.fr', // TODO email réel
  phone: '', // TODO téléphone réel — laissé vide : le bloc ne s'affiche pas tant qu'il n'est pas rempli
  phoneHref: '',
  city: 'Roquebrune-sur-Argens',
  postalCode: '83520',
  region: 'Var',
  addressLine: '', // TODO adresse du local si l'association en a un
};

export const HOURS = {
  // TODO créneaux réels. Tant que la liste est vide, la section affiche
  // un message d'attente plutôt qu'un horaire inventé.
  slots: [] as { day: string; time: string; detail: string }[],
};

export const DEFAULT_OG_IMAGE = '/media/og-image.jpg';
