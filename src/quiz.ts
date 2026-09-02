// ---------------------------------------------------------------------------
// Mini-jeu de culture générale : 10 questions niveau collège.
// Chaque question porte une explication courte — on ne dit jamais « faux »
// sans apprendre quelque chose au passage.
// ---------------------------------------------------------------------------

export interface Question {
  theme: string;
  question: string;
  answers: string[];
  correct: number;
  explanation: string;
}

export const QUESTIONS: Question[] = [
  {
    theme: 'Géographie',
    question: "Quelle est la capitale de l'Italie ?",
    answers: ['Rome', 'Milan', 'Naples', 'Turin'],
    correct: 0,
    explanation: "Rome. Milan est la capitale économique, mais le gouvernement siège à Rome.",
  },
  {
    theme: 'Mathématiques',
    question: 'Combien de côtés a un hexagone ?',
    answers: ['5', '6', '7', '8'],
    correct: 1,
    explanation: "Six. « Hexa » veut dire six en grec — comme dans hexagone, le surnom de la France.",
  },
  {
    theme: 'Français',
    question: 'Qui a écrit Les Misérables ?',
    answers: ['Émile Zola', 'Gustave Flaubert', 'Victor Hugo', 'Molière'],
    correct: 2,
    explanation: "Victor Hugo, publié en 1862. C'est aussi lui qui a écrit Notre-Dame de Paris.",
  },
  {
    theme: 'Sciences',
    question: 'Quelle planète est la plus proche du Soleil ?',
    answers: ['Vénus', 'Mars', 'La Terre', 'Mercure'],
    correct: 3,
    explanation: "Mercure. Vénus vient juste après — et c'est elle la plus chaude, à cause de son atmosphère.",
  },
  {
    theme: 'Calcul mental',
    question: 'Combien font 7 × 8 ?',
    answers: ['54', '56', '58', '64'],
    correct: 1,
    explanation: "56. Astuce : 7 × 8 = 7 × 4 × 2 = 28 × 2 = 56.",
  },
  {
    theme: 'Histoire',
    question: 'Dans quel pays se trouvent les pyramides de Gizeh ?',
    answers: ['Le Mexique', "L'Égypte", 'Le Soudan', 'La Grèce'],
    correct: 1,
    explanation: "En Égypte, près du Caire. Elles ont plus de 4 500 ans.",
  },
  {
    theme: 'Sciences',
    question: 'Quel gaz les plantes absorbent-elles pour fabriquer leur énergie ?',
    answers: ["L'oxygène", "L'azote", 'Le dioxyde de carbone', "L'hydrogène"],
    correct: 2,
    explanation: "Le dioxyde de carbone. Elles rejettent l'oxygène : c'est la photosynthèse.",
  },
  {
    theme: 'Histoire',
    question: 'En quelle année a eu lieu la prise de la Bastille ?',
    answers: ['1715', '1789', '1815', '1848'],
    correct: 1,
    explanation: "Le 14 juillet 1789, au début de la Révolution française.",
  },
  {
    theme: 'Géographie',
    question: 'Quel est le plus grand océan du monde ?',
    answers: ["L'océan Atlantique", "L'océan Indien", 'Le Pacifique', "L'océan Arctique"],
    correct: 2,
    explanation: "Le Pacifique. À lui seul, il couvre environ un tiers de la surface de la Terre.",
  },
  {
    theme: 'Le saviez-vous',
    question: "Al-Kindi, le savant du IXᵉ siècle, était surtout connu comme…",
    answers: ['Navigateur', 'Philosophe et mathématicien', 'Roi', 'Peintre'],
    correct: 1,
    explanation: "Philosophe, mathématicien et médecin — c'est lui qui a donné son nom à l'association.",
  },
];

export const CHEERS = ['Bravo !', 'Exactement !', 'Tu gères !', 'Impeccable !', 'Bien joué !'];

export const MISSES = [
  'Presque !',
  "Pas cette fois — mais maintenant tu le sais.",
  'Raté, on retient celle-là.',
];

/** Message final selon le score, jamais décourageant. */
export const scoreMessage = (score: number, total: number): { title: string; text: string } => {
  const ratio = score / total;
  if (ratio === 1) return { title: 'Sans faute !', text: 'Dix sur dix. Chapeau — tu peux viser plus dur.' };
  if (ratio >= 0.7)
    return { title: 'Beau score !', text: "Tu as de bonnes bases. Les questions ratées, c'est juste de la révision." };
  if (ratio >= 0.4)
    return { title: 'Pas mal du tout', text: "Il y a du niveau et des trous à combler — exactement ce qu'on travaille ensemble." };
  return { title: 'On a du travail — et alors ?', text: "Personne ne naît en sachant. C'est précisément pour ça que l'association existe." };
};
