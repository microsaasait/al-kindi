import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Connexion Supabase.
// La clé « publishable » est publique par conception : elle finit forcément
// dans le bundle d'une application front, et elle ne donne aucun droit par
// elle-même. Tout est verrouillé par les règles RLS de la base : avec cette
// clé on peut UNIQUEMENT enregistrer une participation au jeu. Lire la liste
// des participants ou lancer un tirage exige un compte connecté.
// Elle passe malgré tout par l'environnement pour qu'aucune chaîne ressemblant
// à une clé ne vive dans le dépôt. Aucune clé de service ne doit jamais
// atterrir ici : elle contournerait toutes les règles ci-dessus.
// ---------------------------------------------------------------------------
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

/** Faux si la configuration manque : le jeu se désactive au lieu de planter. */
export const supabaseReady = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

export const supabase = createClient(SUPABASE_URL ?? 'http://localhost', SUPABASE_PUBLISHABLE_KEY ?? 'absent', {
  auth: { persistSession: true, autoRefreshToken: true },
});

/** Mois courant au format 'YYYY-MM' : c'est la clé du tirage mensuel. */
export const currentPeriod = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

/** '2026-09' -> 'septembre 2026' */
export const periodLabel = (period: string): string => {
  const [year, month] = period.split('-').map(Number);
  const label = new Date(year, month - 1, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  return label;
};

export interface Participant {
  id: string;
  created_at: string;
  period: string;
  first_name: string;
  contact: string;
  contact_kind: 'email' | 'phone';
  school_level: string | null;
  score: number;
  parental_ok: boolean;
}

export interface Draw {
  id: string;
  period: string;
  drawn_at: string;
  winner_id: string | null;
  winner_name: string;
  winner_contact: string;
  entrants: number;
  prize: string;
  claimed: boolean;
  notes: string | null;
}
