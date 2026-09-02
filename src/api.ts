// ---------------------------------------------------------------------------
// Écritures publiques (formulaire de contact, participation au jeu).
// On tape directement l'API REST plutôt que de charger la bibliothèque
// Supabase : un simple POST suffit, et le visiteur n'a pas à télécharger
// 120 Ko de code dont seul le tableau de bord a besoin.
// La clé est publique par conception et ne permet que d'écrire : tout le reste
// est verrouillé par les règles RLS de la base.
// ---------------------------------------------------------------------------
const URL_BASE = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const CLE_PUBLIQUE = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const apiPrete = Boolean(URL_BASE && CLE_PUBLIQUE);

/** Code d'erreur Postgres d'un doublon (contrainte d'unicité). */
export const DOUBLON = '23505';

interface Echec {
  code?: string;
  message: string;
}

/** Insère une ligne dans une table. Renvoie null si tout s'est bien passé. */
export const inserer = async (table: string, ligne: Record<string, unknown>): Promise<Echec | null> => {
  if (!apiPrete) return { message: 'Configuration absente' };

  try {
    const reponse = await fetch(`${URL_BASE}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        apikey: CLE_PUBLIQUE as string,
        Authorization: `Bearer ${CLE_PUBLIQUE}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(ligne),
    });

    if (reponse.ok) return null;

    const detail = await reponse.json().catch(() => ({}));
    return { code: detail.code, message: detail.message ?? `Erreur ${reponse.status}` };
  } catch {
    return { message: 'Réseau indisponible' };
  }
};

/** Mois courant au format 'YYYY-MM' : c'est la clé du tirage mensuel. */
export const moisCourant = (): string => {
  const maintenant = new Date();
  return `${maintenant.getFullYear()}-${String(maintenant.getMonth() + 1).padStart(2, '0')}`;
};

/** '2026-09' -> 'septembre 2026' */
export const moisEnClair = (periode: string): string => {
  const [annee, mois] = periode.split('-').map(Number);
  return new Date(annee, mois - 1, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
};
