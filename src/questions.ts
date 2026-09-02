// ---------------------------------------------------------------------------
// Banque de 100 questions, niveau brevet des collèges.
// Le quiz en tire 10 au hasard à chaque partie : deux parties ne se
// ressemblent jamais, et un élève peut revenir sans retomber sur les mêmes.
// Chaque question porte une explication courte, à valeur pédagogique.
// ---------------------------------------------------------------------------

export interface Question {
  theme: string;
  question: string;
  answers: string[];
  correct: number;
  explanation: string;
}

export const QUESTION_BANK: Question[] = [
  // --- Mathématiques ---------------------------------------------------------
  { theme: 'Maths', question: 'Combien font 7 × 8 ?', answers: ['54', '56', '58', '64'], correct: 1, explanation: '56. Astuce : 7 × 8 = 7 × 4 × 2 = 28 × 2.' },
  { theme: 'Maths', question: 'Combien de côtés a un hexagone ?', answers: ['5', '6', '7', '8'], correct: 1, explanation: 'Six. « Hexa » veut dire six en grec, comme dans hexagone, le surnom de la France.' },
  { theme: 'Maths', question: 'Quelle est la racine carrée de 144 ?', answers: ['11', '12', '13', '14'], correct: 1, explanation: '12, car 12 × 12 = 144.' },
  { theme: 'Maths', question: 'Combien vaut 25 % de 80 ?', answers: ['15', '20', '25', '30'], correct: 1, explanation: '20. Prendre 25 %, c’est diviser par 4.' },
  { theme: 'Maths', question: 'Dans un triangle, combien vaut la somme des angles ?', answers: ['90°', '180°', '270°', '360°'], correct: 1, explanation: '180°. C’est vrai pour absolument tous les triangles.' },
  { theme: 'Maths', question: 'Le théorème de Pythagore concerne quel type de triangle ?', answers: ['Équilatéral', 'Isocèle', 'Rectangle', 'Quelconque'], correct: 2, explanation: 'Le triangle rectangle : le carré de l’hypoténuse égale la somme des carrés des deux autres côtés.' },
  { theme: 'Maths', question: 'Quel est le PGCD de 12 et 18 ?', answers: ['2', '3', '6', '9'], correct: 2, explanation: '6. Les diviseurs communs sont 1, 2, 3 et 6 ; le plus grand est 6.' },
  { theme: 'Maths', question: 'Combien font (-5) + 12 ?', answers: ['-17', '7', '17', '-7'], correct: 1, explanation: '7. On avance de 12 en partant de -5.' },
  { theme: 'Maths', question: 'Quelle est l’aire d’un rectangle de 6 cm sur 4 cm ?', answers: ['10 cm²', '20 cm²', '24 cm²', '48 cm²'], correct: 2, explanation: '24 cm². Aire du rectangle = longueur × largeur.' },
  { theme: 'Maths', question: 'Que vaut 2⁵ ?', answers: ['10', '16', '25', '32'], correct: 3, explanation: '32 : 2 × 2 × 2 × 2 × 2.' },
  { theme: 'Maths', question: 'Un angle droit mesure combien de degrés ?', answers: ['45°', '90°', '180°', '360°'], correct: 1, explanation: '90°, celui qu’on repère avec l’équerre.' },
  { theme: 'Maths', question: 'Quelle fraction est égale à 0,5 ?', answers: ['1/3', '1/2', '2/3', '3/4'], correct: 1, explanation: '1/2. Une moitié, soit 50 %.' },
  { theme: 'Maths', question: 'Combien de minutes y a-t-il dans 2 h 15 ?', answers: ['125', '135', '145', '215'], correct: 1, explanation: '135 minutes : 120 + 15.' },
  { theme: 'Maths', question: 'La médiane de 3, 5, 7, 9, 11 est :', answers: ['5', '7', '8', '9'], correct: 1, explanation: '7 : la valeur du milieu quand les nombres sont rangés dans l’ordre.' },
  { theme: 'Maths', question: 'Le nombre 17 est :', answers: ['Pair', 'Premier', 'Un carré parfait', 'Divisible par 3'], correct: 1, explanation: 'Premier : il n’est divisible que par 1 et par lui-même.' },

  // --- Français --------------------------------------------------------------
  { theme: 'Français', question: 'Qui a écrit Les Misérables ?', answers: ['Émile Zola', 'Gustave Flaubert', 'Victor Hugo', 'Molière'], correct: 2, explanation: 'Victor Hugo, en 1862. C’est aussi lui qui a écrit Notre-Dame de Paris.' },
  { theme: 'Français', question: 'Quel est le pluriel de « cheval » ?', answers: ['Chevals', 'Chevaux', 'Chevales', 'Chevaus'], correct: 1, explanation: 'Chevaux. Les mots en -al font souvent leur pluriel en -aux.' },
  { theme: 'Français', question: 'Dans « Je mange une pomme », quelle est la fonction de « une pomme » ?', answers: ['Sujet', 'Complément d’objet direct', 'Attribut', 'Complément circonstanciel'], correct: 1, explanation: 'COD : il répond à la question « je mange quoi ? ».' },
  { theme: 'Français', question: 'Un synonyme de « rapide » est :', answers: ['Lent', 'Véloce', 'Lourd', 'Calme'], correct: 1, explanation: 'Véloce. Un synonyme a le même sens, un antonyme le sens contraire.' },
  { theme: 'Français', question: 'Qui a écrit Le Petit Prince ?', answers: ['Jules Verne', 'Antoine de Saint-Exupéry', 'Albert Camus', 'Marcel Pagnol'], correct: 1, explanation: 'Antoine de Saint-Exupéry, en 1943. Il était aussi pilote.' },
  { theme: 'Français', question: 'Quel temps utilise-t-on dans « je mangerai » ?', answers: ['Imparfait', 'Passé simple', 'Futur simple', 'Conditionnel'], correct: 2, explanation: 'Le futur simple. Le conditionnel donnerait « je mangerais ».' },
  { theme: 'Français', question: 'Une métaphore, c’est :', answers: ['Une exagération', 'Une comparaison sans mot de comparaison', 'Une répétition', 'Une question sans réponse'], correct: 1, explanation: 'Une comparaison implicite : « cet homme est un lion », sans « comme ».' },
  { theme: 'Français', question: 'Molière écrivait surtout :', answers: ['Des romans', 'Des pièces de théâtre', 'Des poèmes épiques', 'Des essais'], correct: 1, explanation: 'Du théâtre, et surtout des comédies comme L’Avare ou Le Malade imaginaire.' },
  { theme: 'Français', question: 'Quel mot est un adverbe ?', answers: ['Rapide', 'Rapidement', 'Rapidité', 'Rapides'], correct: 1, explanation: 'Rapidement. Les adverbes en -ment modifient le verbe.' },
  { theme: 'Français', question: 'On écrit « ils sont allés » : pourquoi « allés » prend-il un s ?', answers: ['Par habitude', 'Il s’accorde avec le sujet', 'C’est une faute', 'Parce que le verbe est long'], correct: 1, explanation: 'Avec l’auxiliaire être, le participe passé s’accorde avec le sujet.' },
  { theme: 'Français', question: 'Un texte argumentatif sert à :', answers: ['Raconter une histoire', 'Convaincre', 'Décrire un lieu', 'Donner une recette'], correct: 1, explanation: 'À convaincre : il défend une thèse avec des arguments et des exemples.' },
  { theme: 'Français', question: 'Que veut dire « éphémère » ?', answers: ['Qui dure très longtemps', 'Qui ne dure pas', 'Qui est très grand', 'Qui est invisible'], correct: 1, explanation: 'Qui dure peu de temps. Le contraire serait « durable ».' },

  // --- Histoire --------------------------------------------------------------
  { theme: 'Histoire', question: 'En quelle année a eu lieu la prise de la Bastille ?', answers: ['1715', '1789', '1815', '1848'], correct: 1, explanation: 'Le 14 juillet 1789, au début de la Révolution française.' },
  { theme: 'Histoire', question: 'Qui était Jules César ?', answers: ['Un pharaon', 'Un général et homme d’État romain', 'Un roi de France', 'Un philosophe grec'], correct: 1, explanation: 'Un général romain, assassiné en 44 avant notre ère.' },
  { theme: 'Histoire', question: 'Quand a débuté la Première Guerre mondiale ?', answers: ['1912', '1914', '1918', '1939'], correct: 1, explanation: 'En 1914. Elle s’achève par l’armistice du 11 novembre 1918.' },
  { theme: 'Histoire', question: 'Quel mur est tombé en 1989 ?', answers: ['Le mur d’Hadrien', 'Le mur de Berlin', 'La Grande Muraille', 'Le mur des Lamentations'], correct: 1, explanation: 'Le mur de Berlin, qui séparait la ville en deux depuis 1961.' },
  { theme: 'Histoire', question: 'Qui a écrit la Déclaration des droits de l’homme et du citoyen de 1789 ?', answers: ['Le roi seul', 'L’Assemblée nationale constituante', 'Napoléon', 'Le pape'], correct: 1, explanation: 'L’Assemblée nationale constituante, en août 1789.' },
  { theme: 'Histoire', question: 'Napoléon Bonaparte est vaincu définitivement à :', answers: ['Austerlitz', 'Waterloo', 'Iéna', 'Marengo'], correct: 1, explanation: 'À Waterloo, en 1815, face aux Britanniques et aux Prussiens.' },
  { theme: 'Histoire', question: 'Que commémore le 8 mai 1945 ?', answers: ['Le début de la guerre', 'La fin de la Seconde Guerre mondiale en Europe', 'La libération de Paris', 'L’armistice de 1918'], correct: 1, explanation: 'La capitulation de l’Allemagne nazie, donc la fin de la guerre en Europe.' },
  { theme: 'Histoire', question: 'La Ve République française est née en :', answers: ['1946', '1958', '1968', '1981'], correct: 1, explanation: 'En 1958, avec la Constitution voulue par Charles de Gaulle.' },
  { theme: 'Histoire', question: 'Les hiéroglyphes ont été déchiffrés par :', answers: ['Champollion', 'Pasteur', 'Lavoisier', 'Cuvier'], correct: 0, explanation: 'Jean-François Champollion, en 1822, grâce à la pierre de Rosette.' },
  { theme: 'Histoire', question: 'Qui a été la première femme à obtenir un prix Nobel ?', answers: ['Marie Curie', 'Simone Veil', 'Rosa Parks', 'Ada Lovelace'], correct: 0, explanation: 'Marie Curie, en 1903 en physique, puis en 1911 en chimie.' },
  { theme: 'Histoire', question: 'Le Moyen Âge se termine traditionnellement en :', answers: ['476', '1000', '1492', '1789'], correct: 2, explanation: 'Vers 1492, avec l’arrivée de Christophe Colomb en Amérique.' },
  { theme: 'Histoire', question: 'Qui a dit « J’accuse… ! » pour défendre le capitaine Dreyfus ?', answers: ['Victor Hugo', 'Émile Zola', 'Jean Jaurès', 'Georges Clemenceau'], correct: 1, explanation: 'Émile Zola, dans une lettre ouverte publiée en 1898.' },

  // --- Géographie ------------------------------------------------------------
  { theme: 'Géographie', question: 'Quelle est la capitale de l’Italie ?', answers: ['Rome', 'Milan', 'Naples', 'Turin'], correct: 0, explanation: 'Rome. Milan est la capitale économique, mais le gouvernement siège à Rome.' },
  { theme: 'Géographie', question: 'Quel est le plus grand océan du monde ?', answers: ['Atlantique', 'Indien', 'Pacifique', 'Arctique'], correct: 2, explanation: 'Le Pacifique : à lui seul, il couvre environ un tiers de la surface du globe.' },
  { theme: 'Géographie', question: 'Dans quel pays se trouvent les pyramides de Gizeh ?', answers: ['Le Mexique', 'L’Égypte', 'Le Soudan', 'La Grèce'], correct: 1, explanation: 'En Égypte, près du Caire. Elles ont plus de 4 500 ans.' },
  { theme: 'Géographie', question: 'Quel est le plus long fleuve de France ?', answers: ['La Seine', 'La Loire', 'Le Rhône', 'La Garonne'], correct: 1, explanation: 'La Loire, environ 1 000 km.' },
  { theme: 'Géographie', question: 'Le mont Blanc culmine à environ :', answers: ['2 800 m', '3 400 m', '4 800 m', '6 200 m'], correct: 2, explanation: 'Environ 4 800 m : c’est le plus haut sommet des Alpes.' },
  { theme: 'Géographie', question: 'Quelle mer borde Roquebrune-sur-Argens ?', answers: ['La mer du Nord', 'La Méditerranée', 'La Manche', 'La mer Baltique'], correct: 1, explanation: 'La Méditerranée. La commune se trouve dans le Var, en région PACA.' },
  { theme: 'Géographie', question: 'Combien de continents compte-t-on habituellement ?', answers: ['4', '5 ou 6 selon les pays', '9', '12'], correct: 1, explanation: 'Cela dépend des conventions : la France en enseigne souvent 6, d’autres pays 5 ou 7.' },
  { theme: 'Géographie', question: 'Quel pays a la plus grande population du monde ?', answers: ['La Chine', 'L’Inde', 'Les États-Unis', 'Le Brésil'], correct: 1, explanation: 'L’Inde a dépassé la Chine en 2023, avec plus de 1,4 milliard d’habitants.' },
  { theme: 'Géographie', question: 'Le Sahara est :', answers: ['Une forêt', 'Un désert', 'Une chaîne de montagnes', 'Un fleuve'], correct: 1, explanation: 'Le plus grand désert chaud du monde, en Afrique du Nord.' },
  { theme: 'Géographie', question: 'Quelle est la capitale de l’Australie ?', answers: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], correct: 2, explanation: 'Canberra. Sydney est la plus grande ville, mais pas la capitale.' },
  { theme: 'Géographie', question: 'L’équateur sépare la Terre en :', answers: ['Est et ouest', 'Nord et sud', 'Chaud et froid', 'Terre et mer'], correct: 1, explanation: 'En hémisphère nord et hémisphère sud.' },
  { theme: 'Géographie', question: 'Quel pays est traversé par le Nil ?', answers: ['Le Maroc', 'L’Égypte', 'L’Algérie', 'La Tunisie'], correct: 1, explanation: 'L’Égypte, entre autres : le Nil traverse onze pays africains.' },

  // --- Sciences de la vie et de la Terre -------------------------------------
  { theme: 'SVT', question: 'Quel gaz les plantes absorbent-elles pour fabriquer leur énergie ?', answers: ['L’oxygène', 'L’azote', 'Le dioxyde de carbone', 'L’hydrogène'], correct: 2, explanation: 'Le dioxyde de carbone. Elles rejettent l’oxygène : c’est la photosynthèse.' },
  { theme: 'SVT', question: 'Combien d’os compte un squelette humain adulte ?', answers: ['106', '206', '306', '406'], correct: 1, explanation: '206 environ. Un bébé en a davantage : certains fusionnent en grandissant.' },
  { theme: 'SVT', question: 'Où se trouve l’ADN dans une cellule ?', answers: ['Dans la membrane', 'Dans le noyau', 'Dans le cytoplasme uniquement', 'À l’extérieur'], correct: 1, explanation: 'Principalement dans le noyau, sous forme de chromosomes.' },
  { theme: 'SVT', question: 'Quel organe pompe le sang dans le corps ?', answers: ['Le foie', 'Le cœur', 'Les poumons', 'Les reins'], correct: 1, explanation: 'Le cœur : environ 100 000 battements par jour.' },
  { theme: 'SVT', question: 'Les globules rouges servent à :', answers: ['Digérer', 'Transporter l’oxygène', 'Fabriquer des os', 'Produire de l’énergie'], correct: 1, explanation: 'À transporter l’oxygène grâce à l’hémoglobine, qui leur donne leur couleur.' },
  { theme: 'SVT', question: 'Combien de chromosomes possède l’être humain ?', answers: ['23', '46', '64', '92'], correct: 1, explanation: '46, soit 23 paires. Une moitié vient de chaque parent.' },
  { theme: 'SVT', question: 'Un séisme est provoqué par :', answers: ['Le vent', 'Le mouvement des plaques tectoniques', 'La pluie', 'La Lune'], correct: 1, explanation: 'Le déplacement brutal des plaques de la croûte terrestre.' },
  { theme: 'SVT', question: 'Quel est le plus grand organe du corps humain ?', answers: ['Le foie', 'La peau', 'Le cerveau', 'L’intestin'], correct: 1, explanation: 'La peau : environ 2 m² chez un adulte.' },

  // --- Physique-chimie -------------------------------------------------------
  { theme: 'Physique', question: 'Quelle planète est la plus proche du Soleil ?', answers: ['Vénus', 'Mars', 'La Terre', 'Mercure'], correct: 3, explanation: 'Mercure. Vénus vient juste après, et c’est elle la plus chaude.' },
  { theme: 'Physique', question: 'Quelle est la formule chimique de l’eau ?', answers: ['CO₂', 'H₂O', 'O₂', 'NaCl'], correct: 1, explanation: 'H₂O : deux atomes d’hydrogène et un d’oxygène.' },
  { theme: 'Physique', question: 'À quelle température l’eau bout-elle au niveau de la mer ?', answers: ['50 °C', '90 °C', '100 °C', '120 °C'], correct: 2, explanation: '100 °C. En altitude, elle bout à température plus basse.' },
  { theme: 'Physique', question: 'Que mesure-t-on en ampères ?', answers: ['La tension', 'L’intensité du courant', 'La résistance', 'La puissance'], correct: 1, explanation: 'L’intensité. La tension se mesure en volts, la résistance en ohms.' },
  { theme: 'Physique', question: 'La lumière du Soleil met environ combien de temps à nous parvenir ?', answers: ['8 secondes', '8 minutes', '8 heures', '8 jours'], correct: 1, explanation: 'Environ 8 minutes, à 300 000 km par seconde.' },
  { theme: 'Physique', question: 'Quel est le symbole chimique de l’or ?', answers: ['Or', 'Au', 'Ag', 'Fe'], correct: 1, explanation: 'Au, du latin aurum. Ag, c’est l’argent, et Fe le fer.' },
  { theme: 'Physique', question: 'Un mélange d’eau et d’huile est :', answers: ['Homogène', 'Hétérogène', 'Un corps pur', 'Une solution'], correct: 1, explanation: 'Hétérogène : on distingue les deux liquides à l’œil nu.' },
  { theme: 'Physique', question: 'Qu’est-ce qui fait tomber les objets vers le sol ?', answers: ['Le vent', 'La gravité', 'Le magnétisme', 'La pression'], correct: 1, explanation: 'La gravité, décrite par Newton puis par Einstein.' },
  { theme: 'Physique', question: 'Combien y a-t-il de planètes dans le système solaire ?', answers: ['7', '8', '9', '10'], correct: 1, explanation: 'Huit depuis 2006 : Pluton a été reclassée en planète naine.' },
  { theme: 'Physique', question: 'Le son se propage-t-il dans le vide ?', answers: ['Oui, très vite', 'Non, il lui faut un milieu matériel', 'Seulement la nuit', 'Uniquement dans l’espace'], correct: 1, explanation: 'Non : le son a besoin d’air, d’eau ou d’un solide pour se propager.' },

  // --- Éducation civique -----------------------------------------------------
  { theme: 'EMC', question: 'Quelle est la devise de la République française ?', answers: ['Paix, Travail, Patrie', 'Liberté, Égalité, Fraternité', 'Unité, Force, Justice', 'Honneur et Patrie'], correct: 1, explanation: 'Liberté, Égalité, Fraternité, inscrite sur les frontons des mairies.' },
  { theme: 'EMC', question: 'À quel âge devient-on majeur en France ?', answers: ['16 ans', '18 ans', '20 ans', '21 ans'], correct: 1, explanation: '18 ans depuis 1974. Avant, c’était 21 ans.' },
  { theme: 'EMC', question: 'La laïcité, c’est :', answers: ['Interdire les religions', 'La neutralité de l’État et la liberté de croire ou non', 'Une religion officielle', 'Une loi européenne'], correct: 1, explanation: 'La neutralité de l’État, qui garantit à chacun la liberté de croire ou de ne pas croire.' },
  { theme: 'EMC', question: 'Qui vote les lois en France ?', answers: ['Le président seul', 'Le Parlement', 'Le Conseil constitutionnel', 'Les maires'], correct: 1, explanation: 'Le Parlement : l’Assemblée nationale et le Sénat.' },
  { theme: 'EMC', question: 'Combien de temps dure le mandat du président de la République ?', answers: ['3 ans', '5 ans', '7 ans', '10 ans'], correct: 1, explanation: '5 ans depuis 2002. C’était 7 ans auparavant.' },
  { theme: 'EMC', question: 'L’ONU a été créée en :', answers: ['1919', '1945', '1957', '1989'], correct: 1, explanation: 'En 1945, au lendemain de la Seconde Guerre mondiale.' },
  { theme: 'EMC', question: 'Combien d’États composent l’Union européenne aujourd’hui ?', answers: ['15', '21', '27', '32'], correct: 2, explanation: '27, depuis le départ du Royaume-Uni en 2020.' },
  { theme: 'EMC', question: 'Le droit de vote des femmes en France date de :', answers: ['1848', '1918', '1944', '1968'], correct: 2, explanation: '1944 : elles votent pour la première fois en 1945.' },

  // --- Arts et culture -------------------------------------------------------
  { theme: 'Arts', question: 'Qui a peint La Joconde ?', answers: ['Michel-Ange', 'Léonard de Vinci', 'Raphaël', 'Botticelli'], correct: 1, explanation: 'Léonard de Vinci. Le tableau est exposé au Louvre.' },
  { theme: 'Arts', question: 'Combien de touches compte un piano classique ?', answers: ['61', '76', '88', '97'], correct: 2, explanation: '88 touches : 52 blanches et 36 noires.' },
  { theme: 'Arts', question: 'Van Gogh est connu pour son tableau :', answers: ['Le Cri', 'La Nuit étoilée', 'Guernica', 'Le Baiser'], correct: 1, explanation: 'La Nuit étoilée, peinte en 1889.' },
  { theme: 'Arts', question: 'La tour Eiffel a été construite pour :', answers: ['Un concours d’architecture', 'L’Exposition universelle de 1889', 'La guerre', 'Les Jeux olympiques'], correct: 1, explanation: 'L’Exposition universelle de 1889, pour le centenaire de la Révolution.' },
  { theme: 'Arts', question: 'Quel instrument possède des cordes frottées avec un archet ?', answers: ['La flûte', 'Le violon', 'La trompette', 'La batterie'], correct: 1, explanation: 'Le violon, comme l’alto, le violoncelle et la contrebasse.' },
  { theme: 'Arts', question: 'Le Louvre se trouve dans quelle ville ?', answers: ['Lyon', 'Paris', 'Marseille', 'Bordeaux'], correct: 1, explanation: 'À Paris. C’est le musée le plus visité du monde.' },

  // --- Langues et monde ------------------------------------------------------
  { theme: 'Langues', question: 'Que signifie « library » en anglais ?', answers: ['Librairie', 'Bibliothèque', 'Liberté', 'Livraison'], correct: 1, explanation: 'Bibliothèque. La librairie se dit « bookshop » : c’est un faux ami classique.' },
  { theme: 'Langues', question: 'Quelle langue est la plus parlée dans le monde comme langue maternelle ?', answers: ['L’anglais', 'Le mandarin', 'L’espagnol', 'L’arabe'], correct: 1, explanation: 'Le mandarin. L’anglais domine comme langue seconde.' },
  { theme: 'Langues', question: 'Dans quelle langue le mot « algèbre » a-t-il été formé ?', answers: ['Le latin', 'L’arabe', 'Le grec', 'Le sanskrit'], correct: 1, explanation: 'De l’arabe « al-jabr ». Beaucoup de mots scientifiques suivent ce chemin.' },
  { theme: 'Langues', question: 'Que veut dire « Guten Tag » en allemand ?', answers: ['Bonne nuit', 'Bonjour', 'Merci', 'Au revoir'], correct: 1, explanation: 'Bonjour, littéralement « bon jour ».' },

  // --- Sciences et savoirs, clin d'œil au nom --------------------------------
  { theme: 'Le saviez-vous', question: 'Al-Kindi, le savant du IXᵉ siècle, était surtout :', answers: ['Navigateur', 'Philosophe et mathématicien', 'Roi', 'Peintre'], correct: 1, explanation: 'Philosophe, mathématicien et médecin. C’est lui qui a donné son nom à l’association.' },
  { theme: 'Le saviez-vous', question: 'Al-Kindi est considéré comme un pionnier de :', answers: ['La cryptographie', 'La navigation', 'La peinture à l’huile', 'L’imprimerie'], correct: 0, explanation: 'De la cryptographie : il a décrit l’analyse des fréquences pour déchiffrer les messages codés.' },
  { theme: 'Le saviez-vous', question: 'Le chiffre zéro nous vient principalement :', answers: ['De Rome', 'De l’Inde, via le monde arabe', 'De Grèce', 'De Scandinavie'], correct: 1, explanation: 'D’Inde, transmis à l’Europe par les mathématiciens arabes.' },
  { theme: 'Le saviez-vous', question: 'Combien de temps met la Terre pour faire un tour du Soleil ?', answers: ['24 heures', '1 mois', '365 jours environ', '10 ans'], correct: 2, explanation: 'Environ 365,25 jours : d’où les années bissextiles.' },
  { theme: 'Le saviez-vous', question: 'Quel animal est le plus grand du monde ?', answers: ['L’éléphant d’Afrique', 'La baleine bleue', 'La girafe', 'Le requin blanc'], correct: 1, explanation: 'La baleine bleue : jusqu’à 30 mètres de long.' },
  { theme: 'Le saviez-vous', question: 'Internet a été rendu public au grand nombre grâce au Web inventé par :', answers: ['Bill Gates', 'Tim Berners-Lee', 'Steve Jobs', 'Alan Turing'], correct: 1, explanation: 'Tim Berners-Lee, au CERN, en 1989.' },
  { theme: 'Le saviez-vous', question: 'Combien de cœurs possède une pieuvre ?', answers: ['1', '2', '3', '4'], correct: 2, explanation: 'Trois : deux pour les branchies, un pour le reste du corps.' },
  { theme: 'Le saviez-vous', question: 'Quel est l’aliment qui ne se périme pratiquement jamais ?', answers: ['Le lait', 'Le miel', 'Le pain', 'Le fromage'], correct: 1, explanation: 'Le miel. On en a retrouvé de comestible dans des tombes égyptiennes.' },
  { theme: 'Le saviez-vous', question: 'Combien de fuseaux horaires la France compte-t-elle en tout ?', answers: ['1', '5', '12', '19'], correct: 2, explanation: '12, en comptant les territoires d’outre-mer : un record mondial.' },
  { theme: 'Le saviez-vous', question: 'Que mesure l’échelle de Richter ?', answers: ['Le vent', 'La magnitude des séismes', 'La pluie', 'La température'], correct: 1, explanation: 'La magnitude des tremblements de terre, donc l’énergie libérée.' },
  { theme: 'Le saviez-vous', question: 'Les Jeux olympiques modernes ont été relancés par :', answers: ['Pierre de Coubertin', 'Jules Ferry', 'Léon Blum', 'Jean Jaurès'], correct: 0, explanation: 'Pierre de Coubertin, en 1896 à Athènes.' },
  { theme: 'Le saviez-vous', question: 'Un octet est composé de combien de bits ?', answers: ['4', '8', '16', '32'], correct: 1, explanation: 'Huit bits. C’est l’unité de base de la mémoire informatique.' },
  { theme: 'Le saviez-vous', question: 'Quelle est la vitesse de la lumière, environ ?', answers: ['3 000 km/s', '30 000 km/s', '300 000 km/s', '3 millions de km/s'], correct: 2, explanation: '300 000 km par seconde : rien ne va plus vite.' },
  { theme: 'Le saviez-vous', question: 'Le mot « robot » vient d’une pièce de théâtre écrite en :', answers: ['Anglais', 'Tchèque', 'Japonais', 'Russe'], correct: 1, explanation: 'En tchèque, par Karel Čapek en 1920 : « robota » veut dire travail forcé.' },
  { theme: 'Le saviez-vous', question: 'Combien de dents a un adulte, dents de sagesse comprises ?', answers: ['28', '30', '32', '36'], correct: 2, explanation: '32, dont 4 dents de sagesse qui n’apparaissent pas chez tout le monde.' },
];

export const CHEERS = ['Bravo !', 'Exactement !', 'Tu gères !', 'Impeccable !', 'Bien joué !', 'Du premier coup !'];

export const MISSES = [
  'Presque !',
  'Pas cette fois, mais maintenant tu le sais.',
  'Raté : on retient celle-là.',
  'C’était piégeux, retiens l’explication.',
];

/** Nombre de questions posées par partie. */
export const ROUND_SIZE = 10;

/** Score à atteindre pour faire tourner la roue. */
export const WIN_THRESHOLD = 8;

/** Tire au hasard `count` questions distinctes de la banque. */
export const drawQuestions = (count = ROUND_SIZE): Question[] => {
  const pool = [...QUESTION_BANK];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
};

/** Message final selon le score, jamais décourageant. */
export const scoreMessage = (score: number, total: number): { title: string; text: string } => {
  const ratio = score / total;
  if (ratio === 1) return { title: 'Sans faute !', text: 'Dix sur dix. Chapeau : tu peux viser plus dur.' };
  if (ratio >= 0.7)
    return { title: 'Beau score !', text: 'Tu as de bonnes bases. Les questions ratées, c’est juste de la révision.' };
  if (ratio >= 0.4)
    return { title: 'Pas mal du tout', text: 'Il y a du niveau et des trous à combler : exactement ce qu’on travaille ensemble.' };
  return { title: 'On a du travail, et alors ?', text: 'Personne ne naît en sachant. C’est précisément pour ça que l’association existe.' };
};
