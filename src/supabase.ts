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

export interface Message {
  id: string;
  created_at: string;
  kind: 'inscription' | 'benevolat' | 'autre';
  name: string;
  contact: string;
  contact_kind: 'email' | 'phone';
  detail: string | null;
  message: string;
  handled: boolean;
}

/** Échappe une valeur pour un CSV : guillemets doublés, champ toujours quoté. */
const csvCell = (value: unknown): string => `"${String(value ?? '').replace(/"/g, '""')}"`;

/**
 * Déclenche le téléchargement d'un CSV lisible par Excel et par Numbers.
 * Le point-virgule est le séparateur attendu par Excel en configuration française,
 * et le BOM évite que les accents s'affichent en charabia.
 */
export const downloadCsv = (filename: string, headers: string[], rows: unknown[][]): void => {
  const content = [headers, ...rows].map((row) => row.map(csvCell).join(';')).join('\r\n');
  const blob = new Blob([`﻿${content}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/** '2026-09-02T21:00:00Z' -> '02/09/2026 23:00' */
export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
