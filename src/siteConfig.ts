// ---------------------------------------------------------------------------
// AL KINDI : configuration du site (un seul endroit à modifier).
// Règle : rien n'est inventé ici. Un champ vide n'est pas affiché sur la page
// plutôt que de montrer une fausse coordonnée.
// ---------------------------------------------------------------------------

// URL de production. À remplacer le jour où l'association pose son domaine
// (le répercuter aussi dans index.html, public/robots.txt et public/sitemap.xml).
export const SITE_URL = 'https://al-kindi-seven.vercel.app';

// Coordonnées. Seule la ville est connue : elle figure sur le logo.
// Les demandes du formulaire arrivent dans l'espace association, pas par mail.
export const CONTACT = {
  city: 'Roquebrune-sur-Argens',
  addressLine: '', // adresse du local, si l'association en a un
};

export const DEFAULT_OG_IMAGE = '/media/og-image.jpg';
