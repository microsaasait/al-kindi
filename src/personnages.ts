// Personnages 3D issus de Fluent Emoji (Microsoft, licence MIT) : la même
// collection que les mascottes de Revigo, en version humaine.
export const PERSO = {
  eleve: '/personnages/eleve.png',
  prof: '/personnages/prof.png',
  profe: '/personnages/profe.png',
  garcon: '/personnages/garcon.png',
  fille: '/personnages/fille.png',
  studieux: '/personnages/studieux.png',
  mainLevee: '/personnages/main-levee.png',
  scientifique: '/personnages/scientifique.png',
  acrobate: '/personnages/acrobate.png',
  fete: '/personnages/fete.png',
  trophee: '/personnages/trophee.png',
  diplome: '/personnages/diplome.png',
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
