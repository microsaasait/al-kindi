// Personnages 3D issus de Fluent Emoji (Microsoft, licence MIT) : la même
// collection que les mascottes de Revigo, en version humaine.
export const PERSO = {
  eleve: '/personnages/eleve.webp',
  prof: '/personnages/prof.webp',
  profe: '/personnages/profe.webp',
  garcon: '/personnages/garcon.webp',
  fille: '/personnages/fille.webp',
  studieux: '/personnages/studieux.webp',
  mainLevee: '/personnages/main-levee.webp',
  scientifique: '/personnages/scientifique.webp',
  acrobate: '/personnages/acrobate.webp',
  fete: '/personnages/fete.webp',
  trophee: '/personnages/trophee.webp',
  diplome: '/personnages/diplome.webp',
  cadeau: '/personnages/cadeau.webp',
  manette: '/personnages/manette.webp',
} as const;

export type PersoKey = keyof typeof PERSO;

/** Le personnage qui accompagne chaque thème de question. */
export const PERSO_PAR_THEME: Record<string, PersoKey> = {
  Maths: 'studieux',
  Français: 'eleve',
  Histoire: 'prof',
  Géographie: 'garcon',
  SVT: 'scientifique',
  Physique: 'scientifique',
  EMC: 'profe',
  Arts: 'fille',
  Langues: 'mainLevee',
  'Le saviez-vous': 'diplome',
};
