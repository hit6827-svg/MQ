import { Track, Exercise, TrackSlug } from '../types/math.ts';
import { TRACKS, CURATED_EXERCISES } from './curatedExercises.ts';
import { Language } from '../i18n/translations.ts';

const TRACK_FR_MAP: Record<
  TrackSlug,
  { title: string; subtitle: string; description: string }
> = {
  numbers_structures: {
    title: 'Nombres et Structures',
    subtitle: 'Récurrence, sous-espaces linéaires, valeurs propres & algèbres modulaires',
    description:
      'Construisez la maîtrise déductive des identités discrètes, des espaces vectoriels, des congruences modulaires et des décompositions matricielles.',
  },
  analysis_vectors: {
    title: 'Analyse et Vecteurs',
    subtitle: 'Continuité, intégration, géométrie euclidienne & séries convergentes',
    description:
      'Démontrez des inégalités analytiques, des intégrales exactes, des projections orthogonales et des extrema sous contrainte.',
  },
};

type ExerciseTranslation = Pick<
  Exercise,
  'title' | 'topicTag' | 'latexStatement' | 'theoremContext' | 'solvingSequences'
>;

const EXERCISE_FR_MAP: Record<string, ExerciseTranslation> = {
  ns_basic_induction_squares: {
    title: 'Somme des carrés par récurrence',
    topicTag: 'Preuve discrète · Récurrence',
    latexStatement: `Démontrer par récurrence que pour tout entier $n \\ge 1$ :
$$\\sum_{k=1}^{n} k^2 = 1^2 + 2^2 + \\cdots + n^2 = \\frac{n(n+1)(2n+1)}{6}$$`,
    theoremContext: 'Principe de récurrence mathématique',
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Vérifier l’initialisation (n = 1)',
        latexContent: `$$\\text{Membre gauche} = \\sum_{k=1}^{1} k^2 = 1^2 = 1, \\qquad \\text{Membre droit} = \\frac{1(1+1)(2(1)+1)}{6} = 1$$`,
        explanation: 'Les deux membres valent $1$ pour $n = 1$, ce qui établit $P(1)$.',
        keyRule: 'Initialisation $P(1)$',
      },
      {
        stepNumber: 2,
        title: 'Poser l’hypothèse de récurrence',
        latexContent: `$$\\text{Supposons pour un entier } m \\ge 1 \\text{ fixé que } \\sum_{k=1}^{m} k^2 = \\frac{m(m+1)(2m+1)}{6}$$`,
        explanation:
          'On suppose $P(m)$ vraie afin de démontrer que $P(m+1)$ en découle.',
        keyRule: 'Hypothèse de récurrence $P(m)$',
      },
      {
        stepNumber: 3,
        title: 'Développer la somme au rang m + 1',
        latexContent: `$$\\sum_{k=1}^{m+1} k^2 = \\frac{m(m+1)(2m+1)}{6} + (m+1)^2 = \\frac{(m+1)(2m^2 + 7m + 6)}{6}$$`,
        explanation:
          'En mettant $(m+1)/6$ en facteur, on obtient le trinôme $2m^2 + 7m + 6$.',
        keyRule: 'Factorisation algébrique',
      },
      {
        stepNumber: 4,
        title: 'Factoriser et conclure P(m + 1)',
        latexContent: `$$2m^2 + 7m + 6 = (m+2)(2m+3) \\implies \\sum_{k=1}^{m+1} k^2 = \\frac{(m+1)(m+2)(2m+3)}{6} \\quad \\blacksquare$$`,
        explanation:
          'La formule obtenue correspond exactement à l’énoncé au rang $m+1$. Par récurrence, l’identité est vraie pour tout $n \\ge 1$.',
        keyRule: 'Hérédité et conclusion',
      },
    ],
  },

  ns_basic_kernel_subspace: {
    title: 'Sous-espace noyau & base du noyau matriciel',
    topicTag: 'Algèbre linéaire · Sous-espaces',
    latexStatement: `Soit $T : V \\to W$ une application linéaire entre espaces vectoriels réels.
(a) Démontrer rigoureusement que $\\ker(T) = \\{\\mathbf{v} \\in V : T(\\mathbf{v}) = \\mathbf{0}_W\\}$ est un sous-espace vectoriel de $V$.
(b) Déterminer une base de $\\ker(A)$ pour $A = \\begin{pmatrix} 1 & -2 & 3 \\\\ 2 & -4 & 6 \\end{pmatrix}$.`,
    theoremContext: 'Caractérisation des sous-espaces & linéarité',
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Prouver que le vecteur nul appartient au noyau',
        latexContent: `$$T(\\mathbf{0}_V) = T(0 \\cdot \\mathbf{0}_V) = 0 \\cdot T(\\mathbf{0}_V) = \\mathbf{0}_W \\implies \\mathbf{0}_V \\in \\ker(T)$$`,
        explanation:
          'Toute application linéaire envoie le vecteur nul sur le vecteur nul ; $\\ker(T)$ est donc non vide.',
        keyRule: 'Axiome 1 : appartenance de $\\mathbf{0}_V$',
      },
      {
        stepNumber: 2,
        title: 'Prouver la stabilité par combinaisons linéaires',
        latexContent: `$$\\forall \\mathbf{u}, \\mathbf{v} \\in \\ker(T), \\; c \\in \\mathbb{R} : \\quad T(\\mathbf{u} + \\mathbf{v}) = \\mathbf{0}_W, \\quad T(c\\mathbf{u}) = c\\mathbf{0}_W = \\mathbf{0}_W$$`,
        explanation:
          'Par linéarité de $T$, $\\ker(T)$ est stable par addition et par multiplication scalaire.',
        keyRule: 'Stabilité linéaire',
      },
      {
        stepNumber: 3,
        title: 'Échelonner la matrice A',
        latexContent: `$$\\begin{pmatrix} 1 & -2 & 3 \\\\ 2 & -4 & 6 \\end{pmatrix} \\xrightarrow{R_2 \\leftarrow R_2 - 2R_1} \\begin{pmatrix} 1 & -2 & 3 \\\\ 0 & 0 & 0 \\end{pmatrix} \\implies x_1 = 2x_2 - 3x_3$$`,
        explanation:
          'Le rang vaut $1$ ; il y a une variable principale $x_1$ et deux variables libres $x_2, x_3$.',
        keyRule: 'Pivot de Gauss',
      },
      {
        stepNumber: 4,
        title: 'Extraire une base libre et génératrice',
        latexContent: `$$\\begin{pmatrix} x_1 \\\\ x_2 \\\\ x_3 \\end{pmatrix} = x_2 \\begin{pmatrix} 2 \\\\ 1 \\\\ 0 \\end{pmatrix} + x_3 \\begin{pmatrix} -3 \\\\ 0 \\\\ 1 \\end{pmatrix} \\implies \\mathcal{B}_{\\ker(A)} = \\left\\{\\begin{pmatrix}2\\\\1\\\\0\\end{pmatrix}, \\begin{pmatrix}-3\\\\0\\\\1\\end{pmatrix}\\right\\}$$`,
        explanation:
          'Les deux vecteurs sont linéairement indépendants et engendrent $\\ker(A)$, en accord avec le théorème du rang ($\\dim\\ker A = 3 - 1 = 2$).',
        keyRule: 'Théorème du rang',
      },
    ],
  },

  ns_basic_symmetric_eigen: {
    title: 'Orthogonalité spectrale d’une matrice symétrique',
    topicTag: 'Algèbre linéaire · Valeurs propres',
    latexStatement: `Soit la matrice symétrique réelle $A = \\begin{pmatrix} 4 & 2 \\\\ 2 & 1 \\end{pmatrix}$.
Déterminer les valeurs propres $\\lambda_1 > \\lambda_2$, calculer les vecteurs propres unitaires associés $\\mathbf{v}_1, \\mathbf{v}_2$ et vérifier explicitement que $\\langle \\mathbf{v}_1, \\mathbf{v}_2 \\rangle = 0$.`,
    theoremContext: 'Théorème spectral réel ($A = A^T$)',
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Résoudre le polynôme caractéristique',
        latexContent: `$$\\det(A - \\lambda I) = (4 - \\lambda)(1 - \\lambda) - 4 = \\lambda(\\lambda - 5) = 0 \\implies \\lambda_1 = 5, \\; \\lambda_2 = 0$$`,
        explanation:
          'La trace vaut $5$ et le déterminant $0$, confirmant les racines $\\lambda_1 = 5$ et $\\lambda_2 = 0$.',
        keyRule: 'Polynôme caractéristique',
      },
      {
        stepNumber: 2,
        title: 'Déterminer le vecteur propre unitaire pour λ₁ = 5',
        latexContent: `$$(A - 5I)\\mathbf{x} = \\mathbf{0} \\implies x = 2y \\implies \\mathbf{v}_1 = \\frac{1}{\\sqrt{5}}\\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix}$$`,
        explanation:
          'Le sous-espace propre est engendré par $(2,1)^T$, que l’on divise par sa norme $\\sqrt{5}$.',
        keyRule: 'Normalisation de $\\ker(A - 5I)$',
      },
      {
        stepNumber: 3,
        title: 'Déterminer le vecteur propre unitaire pour λ₂ = 0',
        latexContent: `$$A\\mathbf{x} = \\mathbf{0} \\implies 2x + y = 0 \\implies \\mathbf{v}_2 = \\frac{1}{\\sqrt{5}}\\begin{pmatrix} -1 \\\\ 2 \\end{pmatrix}$$`,
        explanation:
          'Le noyau est engendré par $(-1, 2)^T$, ce qui donne le vecteur normé $\\mathbf{v}_2$.',
        keyRule: 'Sous-espace propre $\\ker(A)$',
      },
      {
        stepNumber: 4,
        title: 'Vérifier le produit scalaire nul',
        latexContent: `$$\\langle \\mathbf{v}_1, \\mathbf{v}_2 \\rangle = \\frac{1}{5}\\big((2)(-1) + (1)(2)\\big) = 0 \\quad \\blacksquare$$`,
        explanation:
          'Pour une matrice symétrique réelle, deux valeurs propres distinctes engendrent des sous-espaces propres orthogonaux.',
        keyRule: 'Orthogonalité des sous-espaces propres',
      },
    ],
  },

  ns_adv_modular_inverse: {
    title: 'Inversion modulaire constructive via Bézout',
    topicTag: 'Structures modulaires · Arithmétique',
    latexStatement: `Démontrer que la congruence $17x \\equiv 5 \\pmod{29}$ possède une unique solution $x \\in \\{0, 1, \\dots, 28\\}$ et la construire rigoureusement par l’algorithme d’Euclide étendu.`,
    theoremContext: 'Identité de Bézout & corps $\\mathbb{Z}/29\\mathbb{Z}$',
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Prouver l’inversibilité par l’algorithme d’Euclide',
        latexContent: `$$29 = 17 \\cdot 1 + 12, \\quad 17 = 12 \\cdot 1 + 5, \\quad 12 = 5 \\cdot 2 + 2, \\quad 5 = 2 \\cdot 2 + 1$$`,
        explanation:
          'Le dernier reste non nul est $1$, donc $\\operatorname{pgcd}(17, 29) = 1$ et $17$ est inversible modulo $29$.',
        keyRule: 'Critère d’inversibilité modulaire',
      },
      {
        stepNumber: 2,
        title: 'Construire les coefficients de Bézout',
        latexContent: `$$1 = 5(17) - 7(12) = 5(17) - 7(29 - 17) = 12(17) - 7(29)$$`,
        explanation:
          'La remontée des égalités exprime $1$ comme combinaison entière $12 \\cdot 17 - 7 \\cdot 29 = 1$.',
        keyRule: 'Identité de Bézout',
      },
      {
        stepNumber: 3,
        title: 'Extraire l’inverse unique modulo 29',
        latexContent: `$$12 \\cdot 17 \\equiv 1 \\pmod{29} \\implies 17^{-1} \\equiv 12 \\pmod{29}$$`,
        explanation:
          'Modulo $29$, le multiple de $29$ s’annule et $12$ est l’unique inverse de $17$.',
        keyRule: 'Unicité de l’inverse dans un corps fini',
      },
      {
        stepNumber: 4,
        title: 'Résoudre et vérifier la congruence',
        latexContent: `$$x \\equiv 12 \\cdot 5 = 60 \\equiv 2 \\pmod{29}, \\quad 17 \\cdot 2 = 34 \\equiv 5 \\pmod{29} \\quad \\blacksquare$$`,
        explanation:
          'La multiplication par $12$ isole $x = 2$, vérifié directement dans la congruence initiale.',
        keyRule: 'Vérification canonique',
      },
    ],
  },

  ns_adv_crt_system: {
    title: 'Démonstration constructive du théorème des restes chinois',
    topicTag: 'Structures algébriques · TRC',
    latexStatement: `Soit le système de congruences simultanées :
$$\\begin{cases} x \\equiv 2 \\pmod{3} \\\\ x \\equiv 3 \\pmod{5} \\\\ x \\equiv 2 \\pmod{7} \\end{cases}$$
Démontrer l’existence et l’unicité d’une solution modulo $105$ et construire le plus petit entier positif ou nul $x$.`,
    theoremContext: 'Isomorphisme d’anneaux du théorème des restes chinois',
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Prouver l’unicité et calculer les produits partiels',
        latexContent: `$$M = 3 \\times 5 \\times 7 = 105, \\quad M_1 = 35, \\quad M_2 = 21, \\quad M_3 = 15$$`,
        explanation:
          'Comme $3, 5, 7$ sont deux à deux premiers entre eux, toute différence de deux solutions est divisible par $105$.',
        keyRule: 'Unicité par coprimalité deux à deux',
      },
      {
        stepNumber: 2,
        title: 'Calculer les inverses locaux',
        latexContent: `$$35y_1 \\equiv 1 \\pmod{3} \\Rightarrow y_1 = 2; \\quad 21y_2 \\equiv 1 \\pmod{5} \\Rightarrow y_2 = 1; \\quad 15y_3 \\equiv 1 \\pmod{7} \\Rightarrow y_3 = 1$$`,
        explanation:
          'Chaque produit $e_i = M_i y_i$ vaut $1$ modulo $m_i$ et $0$ modulo les autres modules.',
        keyRule: 'Idempotents orthogonaux',
      },
      {
        stepNumber: 3,
        title: 'Former la superposition linéaire',
        latexContent: `$$x_0 = 2(35)(2) + 3(21)(1) + 2(15)(1) = 140 + 63 + 30 = 233$$`,
        explanation:
          'La combinaison satisfait simultanément les trois congruences.',
        keyRule: 'Formule constructive du TRC',
      },
      {
        stepNumber: 4,
        title: 'Réduire modulo 105 et contrôler',
        latexContent: `$$233 = 2 \\times 105 + 23 \\implies x = 23 \\quad \\blacksquare$$`,
        explanation:
          'On vérifie bien $23 \\equiv 2 \\pmod{3}$, $23 \\equiv 3 \\pmod{5}$ et $23 \\equiv 2 \\pmod{7}$.',
        keyRule: 'Représentant canonique modulo 105',
      },
    ],
  },

  ns_adv_jordan_nilpotent: {
    title: 'Décomposition nilpotente & puissance matricielle par récurrence',
    topicTag: 'Algèbres matricielles · Jordan',
    latexStatement: `Soit $A = \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$.
À l’aide de la décomposition $A = I + N$ et de la nilpotence de $N$, démontrer que pour tout $n \\ge 1$, $A^n = \\begin{pmatrix} 1 & 2n \\\\ 0 & 1 \\end{pmatrix}$, puis en déduire $A^{10}$.`,
    theoremContext: 'Binôme de Newton matriciel & nilpotence',
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Écrire A = I + N et justifier la commutation',
        latexContent: `$$A = I + N, \\quad N = \\begin{pmatrix} 0 & 2 \\\\ 0 & 0 \\end{pmatrix}, \\quad IN = NI$$`,
        explanation:
          'Comme $I$ commute avec $N$, le développement du binôme de Newton s’applique à $(I+N)^n$.',
        keyRule: 'Commutation $IN = NI$',
      },
      {
        stepNumber: 2,
        title: 'Prouver la nilpotence d’indice 2',
        latexContent: `$$N^2 = \\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix} = \\mathbf{0} \\implies N^k = \\mathbf{0} \\quad \\forall k \\ge 2$$`,
        explanation:
          'Toutes les puissances de $N$ d’exposant supérieur ou égal à $2$ sont nulles.',
        keyRule: 'Nilpotence $N^2 = \\mathbf{0}$',
      },
      {
        stepNumber: 3,
        title: 'Tronquer la somme binomiale',
        latexContent: `$$A^n = \\sum_{k=0}^{n} \\binom{n}{k} N^k = I + nN$$`,
        explanation: 'Seuls les deux premiers termes subsistent.',
        keyRule: 'Troncature exacte à l’ordre 1',
      },
      {
        stepNumber: 4,
        title: 'Conclure pour tout n et pour n = 10',
        latexContent: `$$A^n = \\begin{pmatrix} 1 & 2n \\\\ 0 & 1 \\end{pmatrix}, \\qquad A^{10} = \\begin{pmatrix} 1 & 20 \\\\ 0 & 1 \\end{pmatrix} \\quad \\blacksquare$$`,
        explanation:
          'En remplaçant $n = 10$, on obtient directement $A^{10}$.',
        keyRule: 'Puissance d’un bloc de Jordan',
      },
    ],
  },

  av_basic_mvt_lipschitz: {
    title: 'Inégalité lipschitzienne du sinus par le TAF',
    topicTag: 'Calcul différentiel · Accroissements finis',
    latexStatement: `À l’aide du théorème des accroissements finis, démontrer que pour tous réels $a, b \\in \\mathbb{R}$ :
$$|\\sin b - \\sin a| \\le |b - a|$$`,
    theoremContext: 'Théorème des accroissements finis',
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Traiter le cas a = b',
        latexContent: `$$a = b \\implies |\\sin b - \\sin a| = 0 \\le |b - a|$$`,
        explanation:
          'L’inégalité est immédiate lorsque $a = b$. On suppose désormais $a < b$ sans perte de généralité.',
        keyRule: 'Disjonction de cas & symétrie',
      },
      {
        stepNumber: 2,
        title: 'Vérifier les hypothèses du théorème',
        latexContent: `$$f(x) = \\sin x \\text{ est continue sur } [a,b] \\text{ et dérivable sur } (a,b), \\; f'(x) = \\cos x$$`,
        explanation:
          'La fonction sinus est dérivable partout sur $\\mathbb{R}$, donc les hypothèses sont satisfaites.',
        keyRule: 'Régularité de $\\sin x$',
      },
      {
        stepNumber: 3,
        title: 'Appliquer le théorème des accroissements finis',
        latexContent: `$$\\exists c \\in (a, b) \\text{ tel que } \\frac{\\sin b - \\sin a}{b - a} = \\cos c$$`,
        explanation:
          'Le taux d’accroissement égale la dérivée en au moins un point intérieur $c$.',
        keyRule: 'Égalité des accroissements finis',
      },
      {
        stepNumber: 4,
        title: 'Majorer par |cos c| ≤ 1',
        latexContent: `$$|\\sin b - \\sin a| = |\\cos c|\\,|b - a| \\le |b - a| \\quad \\blacksquare$$`,
        explanation:
          'Comme $|\\cos c| \\le 1$ pour tout réel $c$, l’inégalité est démontrée.',
        keyRule: 'Borne $|\\cos c| \\le 1$',
      },
    ],
  },

  av_basic_cyclic_ibp: {
    title: 'Intégration par parties cyclique & vérification',
    topicTag: 'Analyse · Primitives',
    latexStatement: `Établir puis vérifier par dérivation l’expression fermée de la primitive :
$$J = \\int e^{2x} \\cos(3x) \\, dx$$`,
    theoremContext: 'Intégration par parties & théorème fondamental de l’analyse',
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Première intégration par parties',
        latexContent: `$$u = \\cos(3x), \\; dv = e^{2x}dx \\implies J = \\frac{1}{2}e^{2x}\\cos(3x) + \\frac{3}{2}\\int e^{2x}\\sin(3x)\\,dx$$`,
        explanation:
          'En dérivant le facteur trigonométrique, on fait apparaître l’intégrale auxiliaire en $\\sin(3x)$.',
        keyRule: 'Intégration par parties',
      },
      {
        stepNumber: 2,
        title: 'Seconde intégration par parties',
        latexContent: `$$\\int e^{2x}\\sin(3x)\\,dx = \\frac{1}{2}e^{2x}\\sin(3x) - \\frac{3}{2}J$$`,
        explanation:
          'Une deuxième intégration par parties dans le même sens ramène l’intégrale initiale $J$.',
        keyRule: 'Boucle algébrique cohérente',
      },
      {
        stepNumber: 3,
        title: 'Isoler J algébriquement',
        latexContent: `$$\\frac{13}{4}J = \\frac{e^{2x}}{4}\\big(2\\cos(3x) + 3\\sin(3x)\\big) \\implies J = \\frac{e^{2x}}{13}\\big(2\\cos(3x) + 3\\sin(3x)\\big) + C$$`,
        explanation:
          'On résout l’équation linéaire en $J$ pour obtenir la formule fermée.',
        keyRule: 'Résolution linéaire en $J$',
      },
      {
        stepNumber: 4,
        title: 'Vérifier par dérivation directe',
        latexContent: `$$\\frac{d}{dx}\\left[\\frac{e^{2x}}{13}(2\\cos 3x + 3\\sin 3x)\\right] = e^{2x}\\cos(3x) \\quad \\blacksquare$$`,
        explanation:
          'La règle du produit annule exactement les termes en $\\sin(3x)$ et restitue $e^{2x}\\cos(3x)$.',
        keyRule: 'Contrôle par dérivation',
      },
    ],
  },

  av_basic_gram_schmidt: {
    title: 'Projection orthogonale & procédé de Gram-Schmidt',
    topicTag: 'Vecteurs · Produit scalaire',
    latexStatement: `Dans $\\mathbb{R}^3$ muni du produit scalaire usuel, soit :
$$\\mathbf{v}_1 = \\begin{pmatrix} 1 \\\\ 1 \\\\ 0 \\end{pmatrix}, \\quad \\mathbf{v}_2 = \\begin{pmatrix} 1 \\\\ 0 \\\\ 1 \\end{pmatrix}$$
On pose $\\mathbf{u}_1 = \\mathbf{v}_1$ et $\\mathbf{u}_2 = \\mathbf{v}_2 - \\operatorname{proj}_{\\mathbf{u}_1}(\\mathbf{v}_2)$. Démontrer que $\\langle \\mathbf{u}_2, \\mathbf{u}_1 \\rangle = 0$ et déterminer la famille orthonormée $(\\mathbf{e}_1, \\mathbf{e}_2)$.`,
    theoremContext: 'Projection orthogonale & procédé de Gram-Schmidt',
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Prouver l’orthogonalité du résidu de projection',
        latexContent: `$$\\left\\langle \\mathbf{v}_2 - \\frac{\\langle \\mathbf{v}_2, \\mathbf{u}_1 \\rangle}{\\|\\mathbf{u}_1\\|^2}\\mathbf{u}_1,\\, \\mathbf{u}_1 \\right\\rangle = \\langle \\mathbf{v}_2, \\mathbf{u}_1 \\rangle - \\langle \\mathbf{v}_2, \\mathbf{u}_1 \\rangle = 0$$`,
        explanation:
          'Par bilinéarité du produit scalaire, soustraire la projection annule le produit scalaire avec $\\mathbf{u}_1$.',
        keyRule: 'Bilinéarité du produit scalaire',
      },
      {
        stepNumber: 2,
        title: 'Calculer la composante projetée',
        latexContent: `$$\\|\\mathbf{u}_1\\|^2 = 2, \\; \\langle \\mathbf{v}_2, \\mathbf{u}_1 \\rangle = 1 \\implies \\operatorname{proj}_{\\mathbf{u}_1}(\\mathbf{v}_2) = \\begin{pmatrix}1/2\\\\1/2\\\\0\\end{pmatrix}$$`,
        explanation:
          'On calcule le coefficient de projection égal à $1/2$.',
        keyRule: 'Formule de projection',
      },
      {
        stepNumber: 3,
        title: 'Calculer u₂ et contrôler l’orthogonalité',
        latexContent: `$$\\mathbf{u}_2 = \\begin{pmatrix}1/2\\\\-1/2\\\\1\\end{pmatrix}, \\qquad \\langle \\mathbf{u}_2, \\mathbf{u}_1 \\rangle = \\frac{1}{2} - \\frac{1}{2} + 0 = 0$$`,
        explanation:
          'Le vecteur $\\mathbf{u}_2$ obtenu est bien orthogonal à $\\mathbf{u}_1$.',
        keyRule: 'Contrôle d’orthogonalité',
      },
      {
        stepNumber: 4,
        title: 'Normaliser en une base orthonormée',
        latexContent: `$$\\mathbf{e}_1 = \\frac{1}{\\sqrt{2}}\\begin{pmatrix}1\\\\1\\\\0\\end{pmatrix}, \\qquad \\mathbf{e}_2 = \\frac{1}{\\sqrt{6}}\\begin{pmatrix}1\\\\-1\\\\2\\end{pmatrix} \\quad \\blacksquare$$`,
        explanation:
          'En divisant par $\\|\\mathbf{u}_1\\| = \\sqrt{2}$ et $\\|\\mathbf{u}_2\\| = \\sqrt{6}/2$, on obtient une paire orthonormée.',
        keyRule: 'Normalisation unitaire',
      },
    ],
  },

  av_adv_gaussian_integral: {
    title: 'Démonstration de l’intégrale gaussienne en coordonnées polaires',
    topicTag: 'Intégrales impropres · Fubini-Tonelli',
    latexStatement: `Démontrer rigoureusement que l’intégrale impropre converge vers $\\sqrt{\\pi}$ :
$$I = \\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi}$$`,
    theoremContext: 'Théorème de Fubini-Tonelli & jacobien polaire',
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Justifier la convergence et former l’intégrale double I²',
        latexContent: `$$e^{-x^2} \\le e^{-|x|} \\; (|x|\\ge 1) \\implies I < \\infty; \\quad I^2 = \\iint_{\\mathbb{R}^2} e^{-(x^2+y^2)}\\,dx\\,dy$$`,
        explanation:
          'La comparaison assure la convergence, et le théorème de Tonelli permet de regrouper les intégrales.',
        keyRule: 'Théorème de Tonelli',
      },
      {
        stepNumber: 2,
        title: 'Passer en coordonnées polaires',
        latexContent: `$$I^2 = \\int_0^{2\\pi} d\\theta \\int_0^\\infty r e^{-r^2}\\,dr$$`,
        explanation:
          'Le jacobien du passage en coordonnées polaires introduit le facteur $r$.',
        keyRule: 'Jacobien polaire $r\\,dr\\,d\\theta$',
      },
      {
        stepNumber: 3,
        title: 'Calculer l’intégrale radiale',
        latexContent: `$$\\int_0^R r e^{-r^2}\\,dr = \\frac{1}{2}(1 - e^{-R^2}) \\xrightarrow{R\\to\\infty} \\frac{1}{2}$$`,
        explanation:
          'La primitive immédiate donne la limite $1/2$.',
        keyRule: 'Limite de l’intégrale radiale',
      },
      {
        stepNumber: 4,
        title: 'Conclure par positivité de I',
        latexContent: `$$I^2 = 2\\pi \\cdot \\frac{1}{2} = \\pi, \\; I > 0 \\implies I = \\sqrt{\\pi} \\quad \\blacksquare$$`,
        explanation:
          'Comme l’intégrande est strictement positif, $I > 0$, d’où $I = \\sqrt{\\pi}$.',
        keyRule: 'Positivité stricte',
      },
    ],
  },

  av_adv_lagrange_sphere: {
    title: 'Maximum sous contrainte par Lagrange & Cauchy-Schwarz',
    topicTag: 'Analyse multivariable · Optimisation',
    latexStatement: `Démontrer que le maximum de $f(x, y, z) = 2x + y + 2z$ sur la sphère compacte $S = \\{(x,y,z) \\in \\mathbb{R}^3 : x^2 + y^2 + z^2 = 9\\}$ vaut $9$, à l’aide des multiplicateurs de Lagrange puis de l’inégalité de Cauchy-Schwarz.`,
    theoremContext: 'Multiplicateurs de Lagrange sur un compact',
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Justifier la compacité et la colinéarité des gradients',
        latexContent: `$$\\nabla g = (2x, 2y, 2z) \\ne \\mathbf{0} \\text{ sur } S, \\quad \\nabla f = \\lambda \\nabla g \\implies (2,1,2) = \\lambda(2x, 2y, 2z)$$`,
        explanation:
          'La continuité de $f$ sur le compact $S$ assure l’existence d’un extremum, où les gradients sont colinéaires.',
        keyRule: 'Condition de Lagrange',
      },
      {
        stepNumber: 2,
        title: 'Exprimer (x, y, z) en fonction de λ',
        latexContent: `$$x = \\frac{1}{\\lambda}, \\quad y = \\frac{1}{2\\lambda}, \\quad z = \\frac{1}{\\lambda}$$`,
        explanation:
          'L’identification coordonnée par coordonnée paramètre les points critiques par $\\lambda$.',
        keyRule: 'Paramétrage des points critiques',
      },
      {
        stepNumber: 3,
        title: 'Injecter dans la contrainte sphérique',
        latexContent: `$$\\frac{9}{4\\lambda^2} = 9 \\implies \\lambda = \\pm\\frac{1}{2}; \\quad f(2,1,2) = 9, \\; f(-2,-1,-2) = -9$$`,
        explanation:
          'Le multiplicateur positif donne le maximum global $+9$.',
        keyRule: 'Comparaison sur le compact',
      },
      {
        stepNumber: 4,
        title: 'Confirmer par Cauchy-Schwarz',
        latexContent: `$$f(x,y,z) \\le \\|(2,1,2)\\| \\|(x,y,z)\\| = 3 \\cdot 3 = 9 \\quad \\blacksquare$$`,
        explanation:
          'L’inégalité de Cauchy-Schwarz certifie globalement que $9$ est la borne supérieure atteinte.',
        keyRule: 'Confirmation par Cauchy-Schwarz',
      },
    ],
  },

  av_adv_basel_series: {
    title: 'Démonstration d’Euler du problème de Bâle ζ(2) = π²/6',
    topicTag: 'Séries infinies · Développements analytiques',
    latexStatement: `Démontrer la formule fermée d’Euler pour la somme des inverses des carrés :
$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$`,
    theoremContext: 'Série de Maclaurin & produit infini de sin(x)/x',
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Développement en série de Maclaurin de sin(x)/x',
        latexContent: `$$\\frac{\\sin x}{x} = 1 - \\frac{x^2}{6} + \\frac{x^4}{120} - \\cdots$$`,
        explanation:
          'En divisant la série de $\\sin x$ par $x$, le coefficient en $x^2$ vaut $-1/6$.',
        keyRule: 'Développement de Maclaurin',
      },
      {
        stepNumber: 2,
        title: 'Factorisation en produit infini par les racines',
        latexContent: `$$\\frac{\\sin x}{x} = \\prod_{n=1}^{\\infty} \\left(1 - \\frac{x^2}{n^2\\pi^2}\\right)$$`,
        explanation:
          'Les racines non nulles de $\\sin x / x$ étant $\\pm n\\pi$, le produit canonique rassemble les paires conjuguées.',
        keyRule: 'Produit infini d’Euler-Weierstrass',
      },
      {
        stepNumber: 3,
        title: 'Identifier les coefficients en x²',
        latexContent: `$$-\\frac{1}{\\pi^2}\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = -\\frac{1}{6}$$`,
        explanation:
          'Le terme quadratique du produit provient de la somme des termes $-x^2/(n^2\\pi^2)$.',
        keyRule: 'Unicité des coefficients analytiques',
      },
      {
        stepNumber: 4,
        title: 'Conclure pour ζ(2)',
        latexContent: `$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6} \\quad \\blacksquare$$`,
        explanation:
          'En multipliant par $-\\pi^2$, on obtient la valeur exacte $\\pi^2/6$.',
        keyRule: 'Identité de Bâle $\\zeta(2) = \\pi^2/6$',
      },
    ],
  },
};

export function getLocalizedTracks(lang: Language): Track[] {
  if (lang === 'en') return TRACKS;
  return TRACKS.map((tr) => {
    const fr = TRACK_FR_MAP[tr.slug];
    return fr
      ? {
          ...tr,
          title: fr.title,
          subtitle: fr.subtitle,
          description: fr.description,
        }
      : tr;
  });
}

export function getLocalizedExercises(lang: Language): Exercise[] {
  if (lang === 'en') return CURATED_EXERCISES;
  return CURATED_EXERCISES.map((ex) => {
    const fr = EXERCISE_FR_MAP[ex.id];
    return fr
      ? {
          ...ex,
          title: fr.title,
          topicTag: fr.topicTag,
          latexStatement: fr.latexStatement,
          theoremContext: fr.theoremContext,
          solvingSequences: fr.solvingSequences,
        }
      : ex;
  });
}
