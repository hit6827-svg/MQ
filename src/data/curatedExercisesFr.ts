import { Topic, Exercise, TopicSlug } from '../types/math.ts';
import { TOPICS, CURATED_EXERCISES } from './curatedExercises.ts';
import { Language } from '../i18n/translations.ts';

const TOPIC_FR_MAP: Record<TopicSlug, { title: string; description: string }> = {
  calculus: {
    title: 'Analyse & Calcul infinitésimal',
    description:
      'Intégrales définies, réductions à plusieurs variables, séries infinies et développements asymptotiques.',
  },
  linear_algebra: {
    title: 'Algèbre linéaire',
    description:
      'Sous-espaces propres, transformations matricielles, projections orthogonales et décompositions spectrales.',
  },
  number_theory: {
    title: 'Théorie des nombres',
    description:
      'Congruences modulaires, équations diophantiennes, indicatrice d’Euler et arithmétique des nombres premiers.',
  },
  discrete_math: {
    title: 'Mathématiques discrètes & Combinatoire',
    description:
      'Dérangements, relations de récurrence, fonctions génératrices et invariants combinatoires.',
  },
};

type ExerciseTranslation = Pick<
  Exercise,
  'title' | 'latexStatement' | 'theoremContext' | 'solvingSequences'
>;

const EXERCISE_FR_MAP: Record<string, ExerciseTranslation> = {
  calc_gaussian_integral: {
    title: 'L’intégrale gaussienne classique',
    latexStatement: `Évaluer l’intégrale impropre sur la droite réelle :
$$I = \\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx$$`,
    theoremContext: 'Théorème de Fubini-Tonelli & passage en coordonnées polaires',
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Former le carré via une intégrale double',
        latexContent: `$$I^2 = \\left( \\int_{-\\infty}^{\\infty} e^{-x^2} dx \\right) \\left( \\int_{-\\infty}^{\\infty} e^{-y^2} dy \\right) = \\int_{-\\infty}^{\\infty} \\int_{-\\infty}^{\\infty} e^{-(x^2 + y^2)} \\, dx \\, dy$$`,
        explanation:
          'Comme $x$ et $y$ sont des variables muettes indépendantes, le produit des deux intégrales simples sur $\\mathbb{R}$ égale l’intégrale double sur le plan $\\mathbb{R}^2$.',
        keyRule: 'Théorème de Fubini-Tonelli pour les fonctions positives',
      },
      {
        stepNumber: 2,
        title: 'Changement de variables en coordonnées polaires',
        latexContent: `$$\\begin{cases} x = r\\cos\\theta \\\\ y = r\\sin\\theta \\end{cases} \\implies x^2 + y^2 = r^2, \\quad dx\\,dy = r\\,dr\\,d\\theta$$
$$I^2 = \\int_{0}^{2\\pi} d\\theta \\int_{0}^{\\infty} r e^{-r^2} \\, dr$$`,
        explanation:
          'Le plan entier est parcouru par $\\theta \\in [0, 2\\pi]$ et $r \\in [0, \\infty)$. Le déterminant jacobien introduit le facteur $r$.',
        keyRule: 'Jacobien polaire : $J(r,\\theta) = r$',
      },
      {
        stepNumber: 3,
        title: 'Calculer l’intégrale radiale par substitution',
        latexContent: `$$\\int_{0}^{2\\pi} d\\theta = 2\\pi$$
$$\\text{Posons } u = r^2 \\implies du = 2r\\,dr \\implies r\\,dr = \\frac{du}{2}$$
$$\\int_{0}^{\\infty} r e^{-r^2} dr = \\frac{1}{2} \\int_{0}^{\\infty} e^{-u} du = \\frac{1}{2} \\left[-e^{-u}\\right]_0^\\infty = \\frac{1}{2}(0 - (-1)) = \\frac{1}{2}$$`,
        explanation:
          'La présence du facteur $r$ rend le calcul de la primitive immédiat.',
        keyRule: 'Primitive exponentielle usuelle',
      },
      {
        stepNumber: 4,
        title: 'Combiner les facteurs et extraire la racine positive',
        latexContent: `$$I^2 = 2\\pi \\cdot \\frac{1}{2} = \\pi \\implies I = \\sqrt{\\pi}$$`,
        explanation:
          'Comme l’intégrande $e^{-x^2} > 0$ pour tout $x \\in \\mathbb{R}$, on a $I > 0$, d’où $I = \\sqrt{\\pi}$.',
        keyRule: 'Positivité de l’intégrale',
      },
    ],
  },

  calc_basel_problem: {
    title: 'Le problème de Bâle (somme des inverses des carrés)',
    latexStatement: `Déterminer la valeur exacte de la série infinie :
$$S = \\sum_{n=1}^{\\infty} \\frac{1}{n^2} = 1 + \\frac{1}{4} + \\frac{1}{9} + \\frac{1}{16} + \\cdots$$`,
    theoremContext: 'Factorisation en produit infini d’Euler & série de Taylor',
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Développement en série entière du sinus cardinal',
        latexContent: `$$\\sin x = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\cdots \\implies \\frac{\\sin x}{x} = 1 - \\frac{x^2}{6} + \\frac{x^4}{120} - \\cdots$$`,
        explanation:
          'En divisant le développement de Maclaurin de $\\sin x$ par $x$, on obtient un coefficient quadratique égal à $-\\frac{1}{6}$.',
        keyRule: 'Développement de Maclaurin',
      },
      {
        stepNumber: 2,
        title: 'Factorisation d’Euler par les racines',
        latexContent: `$$\\frac{\\sin x}{x} = \\prod_{n=1}^{\\infty} \\left( 1 - \\frac{x^2}{n^2 \\pi^2} \\right) = \\left(1 - \\frac{x^2}{\\pi^2}\\right)\\left(1 - \\frac{x^2}{4\\pi^2}\\right)\\left(1 - \\frac{x^2}{9\\pi^2}\\right)\\cdots$$`,
        explanation:
          'Les zéros de $\\frac{\\sin x}{x}$ sont exactement $x = \\pm n\\pi$. Le regroupement des facteurs conjugués donne $\\prod (1 - x^2/(n^2\\pi^2))$.',
        keyRule: 'Produit infini de Weierstrass-Euler',
      },
      {
        stepNumber: 3,
        title: 'Identifier les coefficients en x²',
        latexContent: `$$\\text{Coefficient de } x^2 \\text{ dans le produit} = -\\sum_{n=1}^{\\infty} \\frac{1}{n^2\\pi^2} = -\\frac{1}{\\pi^2} \\sum_{n=1}^{\\infty} \\frac{1}{n^2}$$
$$\\text{Identification avec Taylor} : -\\frac{1}{6} = -\\frac{1}{\\pi^2} \\sum_{n=1}^{\\infty} \\frac{1}{n^2}$$`,
        explanation:
          'Le terme en $x^2$ provient du choix d’un seul facteur $-x^2/(n^2\\pi^2)$ multiplié par $1$ sur tous les autres termes.',
        keyRule: 'Relations coefficients-racines généralisées',
      },
      {
        stepNumber: 4,
        title: 'Conclure pour la somme infinie',
        latexContent: `$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$`,
        explanation:
          'En multipliant les deux membres par $-\\pi^2$, on obtient le célèbre résultat d’Euler $\\zeta(2) = \\frac{\\pi^2}{6}$.',
        keyRule: 'Valeur exacte de $\\zeta(2)$',
      },
    ],
  },

  linalg_eigen_decomposition: {
    title: 'Sous-espaces propres d’une matrice symétrique',
    latexStatement: `Soit la matrice $A$ définie par :
$$A = \\begin{pmatrix} 4 & 2 \\\\ 2 & 1 \\end{pmatrix}$$
Déterminer les valeurs propres $\\lambda_1, \\lambda_2$ (avec $\\lambda_1 \\ge \\lambda_2$) ainsi que le vecteur propre normé associé à la valeur propre dominante $\\lambda_1$.`,
    theoremContext: 'Théorème spectral pour les matrices symétriques réelles',
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Écrire le polynôme caractéristique',
        latexContent: `$$\\det(A - \\lambda I) = \\det\\begin{pmatrix} 4 - \\lambda & 2 \\\\ 2 & 1 - \\lambda \\end{pmatrix} = 0$$
$$(4 - \\lambda)(1 - \\lambda) - (2)(2) = \\lambda^2 - 5\\lambda + 4 - 4 = \\lambda^2 - 5\\lambda = 0$$`,
        explanation:
          'Les valeurs propres sont les racines du polynôme caractéristique obtenu via $\\det(A - \\lambda I) = 0$.',
        keyRule: 'Équation caractéristique : $\\det(A - \\lambda I) = 0$',
      },
      {
        stepNumber: 2,
        title: 'Factoriser pour trouver les valeurs propres',
        latexContent: `$$\\lambda(\\lambda - 5) = 0 \\implies \\lambda_1 = 5, \\quad \\lambda_2 = 0$$`,
        explanation:
          'La matrice est singulière ($\\det(A) = 0$), donc $0$ est valeur propre ; la trace $\\text{tr}(A) = 5$ confirme $\\lambda_1 + \\lambda_2 = 5$.',
        keyRule: 'Invariants trace et déterminant',
      },
      {
        stepNumber: 3,
        title: 'Déterminer le vecteur propre associé à λ₁ = 5',
        latexContent: `$$\\text{Pour } \\lambda_1 = 5 : \\quad (A - 5I)\\mathbf{v} = \\begin{pmatrix} -1 & 2 \\\\ 2 & -4 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$$
$$-x + 2y = 0 \\implies x = 2y$$`,
        explanation:
          'Les deux lignes donnent la même contrainte $-x + 2y = 0$. En prenant $y = 1$, on obtient le vecteur directeur $(2, 1)^T$.',
        keyRule: 'Calcul d’une base du noyau $\\ker(A - \\lambda_1 I)$',
      },
      {
        stepNumber: 4,
        title: 'Normaliser à l’unité',
        latexContent: `$$\\|\\mathbf{v}\\| = \\sqrt{2^2 + 1^2} = \\sqrt{5} \\implies \\mathbf{v}_1 = \\frac{1}{\\sqrt{5}} \\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix}$$`,
        explanation:
          'On divise par la norme euclidienne pour obtenir un vecteur propre unitaire.',
        keyRule: 'Normalisation euclidienne',
      },
    ],
  },

  numtheory_fermat_linear_congruence: {
    title: 'Congruence linéaire modulaire via Euclide-Bézout',
    latexStatement: `Trouver l’unique entier $x \\in \\{0, 1, \\dots, 28\\}$ vérifiant la congruence linéaire :
$$17x \\equiv 5 \\pmod{29}$$`,
    theoremContext: 'Identité de Bézout & inverse modulaire',
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Appliquer l’algorithme d’Euclide étendu',
        latexContent: `$$29 = 17 \\cdot 1 + 12$$
$$17 = 12 \\cdot 1 + 5$$
$$12 = 5 \\cdot 2 + 2$$
$$5 = 2 \\cdot 2 + 1$$`,
        explanation:
          'Les divisions euclidiennes successives atteignent le reste $1$, prouvant que $\\operatorname{pgcd}(17, 29) = 1$.',
        keyRule: 'Algorithme d’Euclide',
      },
      {
        stepNumber: 2,
        title: 'Remonter les équations pour exprimer 1',
        latexContent: `$$1 = 5 - 2(2) = 5 - 2(12 - 5\\cdot 2) = 5(5) - 2(12)$$
$$1 = 5(17 - 12) - 2(12) = 5(17) - 7(12)$$
$$1 = 5(17) - 7(29 - 17) = 12(17) - 7(29)$$`,
        explanation:
          'La remontée donne l’identité de Bézout $12(17) + (-7)(29) = 1$.',
        keyRule: 'Identité de Bézout : $au + bv = \\operatorname{pgcd}(a, b)$',
      },
      {
        stepNumber: 3,
        title: 'Extraire l’inverse modulaire',
        latexContent: `$$12 \\cdot 17 \\equiv 1 \\pmod{29} \\implies 17^{-1} \\equiv 12 \\pmod{29}$$`,
        explanation:
          'Modulo $29$, le terme $-7(29)$ s’annule, ce qui montre que $12$ est l’inverse de $17$ modulo $29$.',
        keyRule: 'Définition de l’inverse modulaire',
      },
      {
        stepNumber: 4,
        title: 'Multiplier et réduire modulo 29',
        latexContent: `$$x \\equiv 17^{-1} \\cdot 5 \\equiv 12 \\cdot 5 = 60 \\pmod{29}$$
$$60 = 2 \\cdot 29 + 2 \\implies x \\equiv 2 \\pmod{29}$$`,
        explanation:
          'Vérification : $17 \\times 2 = 34 = 29 + 5 \\equiv 5 \\pmod{29}$.',
        keyRule: 'Vérification : $17 \\cdot 2 = 34 \\equiv 5 \\pmod{29}$',
      },
    ],
  },

  discrete_derangements_recursion: {
    title: 'Nombre de dérangements de 5 éléments',
    latexStatement: `Un dérangement est une permutation de $\\{1, 2, \\dots, n\\}$ sans aucun point fixe ($\\forall i, \\sigma(i) \\ne i$).
Calculer $D_5$, le nombre de dérangements d’un ensemble à $n = 5$ éléments.`,
    theoremContext: 'Principe d’inclusion-exclusion & sous-factorielle !n',
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Rappeler la formule fermée d’inclusion-exclusion',
        latexContent: `$$D_n = n! \\left( \\frac{1}{0!} - \\frac{1}{1!} + \\frac{1}{2!} - \\frac{1}{3!} + \\cdots + \\frac{(-1)^n}{n!} \\right)$$`,
        explanation:
          'Par le principe d’inclusion-exclusion, on alterne l’ajout et le retrait des points fixes.',
        keyRule: 'Principe d’inclusion-exclusion (crible de Poincaré)',
      },
      {
        stepNumber: 2,
        title: 'Évaluer les termes jusqu’à n = 5',
        latexContent: `$$D_5 = 5! \\left( 1 - 1 + \\frac{1}{2} - \\frac{1}{6} + \\frac{1}{24} - \\frac{1}{120} \\right)$$
$$5! = 120$$`,
        explanation:
          'Les deux premiers termes $1 - 1$ s’annulent, puis on distribue $120$.',
        keyRule: 'Calcul factoriel : $5! = 120$',
      },
      {
        stepNumber: 3,
        title: 'Distribuer 120 sur chaque fraction',
        latexContent: `$$D_5 = 120 \\cdot \\frac{1}{2} - 120 \\cdot \\frac{1}{6} + 120 \\cdot \\frac{1}{24} - 120 \\cdot \\frac{1}{120}$$
$$D_5 = 60 - 20 + 5 - 1$$`,
        explanation: 'Chaque quotient donne un entier exact.',
        keyRule: 'Simplification arithmétique directe',
      },
      {
        stepNumber: 4,
        title: 'Additionner les termes partiels',
        latexContent: `$$D_5 = 40 + 4 = 44$$`,
        explanation:
          'Parmi les $120$ permutations de $5$ éléments, exactement $44$ ne laissent aucun élément à sa place initiale.',
        keyRule: 'Approximation asymptotique : $D_n \\approx \\lfloor n!/e + 1/2 \\rfloor$',
      },
    ],
  },

  calc_cyclic_integration_parts: {
    title: 'Intégration par parties cyclique : produit exponentiel-trigonométrique',
    latexStatement: `Déterminer la primitive générale :
$$J = \\int e^{2x} \\cos(3x) \\, dx$$`,
    theoremContext: 'Intégration par parties avec boucle algébrique',
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Première intégration par parties',
        latexContent: `$$\\text{Soit } u = \\cos(3x) \\implies du = -3\\sin(3x)\\,dx$$
$$dv = e^{2x}dx \\implies v = \\frac{1}{2}e^{2x}$$
$$J = \\frac{1}{2}e^{2x}\\cos(3x) - \\int \\frac{1}{2}e^{2x} (-3\\sin(3x))\\,dx = \\frac{1}{2}e^{2x}\\cos(3x) + \\frac{3}{2} \\int e^{2x}\\sin(3x)\\,dx$$`,
        explanation:
          'En dérivant le terme trigonométrique et en intégrant l’exponentielle, on fait apparaître une intégrale en $\\sin(3x)$.',
        keyRule: 'Intégration par parties : $\\int u\\,dv = uv - \\int v\\,du$',
      },
      {
        stepNumber: 2,
        title: 'Seconde intégration par parties sur l’intégrale auxiliaire',
        latexContent: `$$\\text{Pour } K = \\int e^{2x}\\sin(3x)\\,dx : \\quad u = \\sin(3x) \\implies du = 3\\cos(3x)\\,dx, \\quad v = \\frac{1}{2}e^{2x}$$
$$K = \\frac{1}{2}e^{2x}\\sin(3x) - \\frac{3}{2} \\int e^{2x}\\cos(3x)\\,dx = \\frac{1}{2}e^{2x}\\sin(3x) - \\frac{3}{2} J$$`,
        explanation:
          'En conservant le même ordre de dérivation/intégration, l’intégrale d’origine $J$ réapparaît.',
        keyRule: 'Choix cohérent de $u$ et $dv$',
      },
      {
        stepNumber: 3,
        title: 'Substituer K dans l’expression de J',
        latexContent: `$$J = \\frac{1}{2}e^{2x}\\cos(3x) + \\frac{3}{2} \\left( \\frac{1}{2}e^{2x}\\sin(3x) - \\frac{3}{2}J \\right)$$
$$J = \\frac{1}{2}e^{2x}\\cos(3x) + \\frac{3}{4}e^{2x}\\sin(3x) - \\frac{9}{4}J$$`,
        explanation:
          'On obtient une équation algébrique linéaire dont l’inconnue est $J$.',
        keyRule: 'Équation linéaire en l’intégrale $J$',
      },
      {
        stepNumber: 4,
        title: 'Isoler J et factoriser',
        latexContent: `$$J + \\frac{9}{4}J = \\frac{13}{4}J = \\frac{e^{2x}}{4}\\big(2\\cos(3x) + 3\\sin(3x)\\big)$$
$$J = \\frac{4}{13} \\cdot \\frac{e^{2x}}{4}\\big(2\\cos(3x) + 3\\sin(3x)\\big) + C = \\frac{e^{2x}}{13}\\big(2\\cos(3x) + 3\\sin(3x)\\big) + C$$`,
        explanation:
          'En multipliant par $4/13$ et en ajoutant la constante d’intégration $C$, on obtient la primitive exacte.',
        keyRule: 'Isolement algébrique des intégrales cycliques',
      },
    ],
  },

  linalg_gram_schmidt: {
    title: 'Orthonormalisation de Gram-Schmidt dans ℝ³',
    latexStatement: `Soit les deux vecteurs linéairement indépendants dans $\\mathbb{R}^3$ :
$$\\mathbf{v}_1 = \\begin{pmatrix} 1 \\\\ 1 \\\\ 0 \\end{pmatrix}, \\quad \\mathbf{v}_2 = \\begin{pmatrix} 1 \\\\ 0 \\\\ 1 \\end{pmatrix}$$
Appliquer le procédé de Gram-Schmidt pour déterminer le vecteur orthogonal $\\mathbf{u}_2$ (orthogonal à $\\mathbf{u}_1 = \\mathbf{v}_1$) puis le vecteur unitaire $\\mathbf{e}_2$.`,
    theoremContext: 'Procédé de Gram-Schmidt & projections orthogonales',
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Fixer le premier vecteur orthogonal',
        latexContent: `$$\\mathbf{u}_1 = \\mathbf{v}_1 = \\begin{pmatrix} 1 \\\\ 1 \\\\ 0 \\end{pmatrix}, \\quad \\|\\mathbf{u}_1\\|^2 = 1^2 + 1^2 + 0^2 = 2$$`,
        explanation:
          'Le premier vecteur sert directement de direction de référence.',
        keyRule: 'Initialisation de Gram-Schmidt : $\\mathbf{u}_1 = \\mathbf{v}_1$',
      },
      {
        stepNumber: 2,
        title: 'Calculer le produit scalaire et la projection',
        latexContent: `$$\\langle \\mathbf{v}_2, \\mathbf{u}_1 \\rangle = (1)(1) + (0)(1) + (1)(0) = 1$$
$$\\text{proj}_{\\mathbf{u}_1}(\\mathbf{v}_2) = \\frac{\\langle \\mathbf{v}_2, \\mathbf{u}_1 \\rangle}{\\|\\mathbf{u}_1\\|^2} \\mathbf{u}_1 = \\frac{1}{2} \\begin{pmatrix} 1 \\\\ 1 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} 1/2 \\\\ 1/2 \\\\ 0 \\end{pmatrix}$$`,
        explanation:
          'On projette orthogonalement $\\mathbf{v}_2$ sur la droite engendrée par $\\mathbf{u}_1$.',
        keyRule: 'Projection orthogonale : $\\text{proj}_{u}(v) = \\frac{v \\cdot u}{\\|u\\|^2} u$',
      },
      {
        stepNumber: 3,
        title: 'Soustraire la composante parallèle',
        latexContent: `$$\\mathbf{u}_2 = \\mathbf{v}_2 - \\text{proj}_{\\mathbf{u}_1}(\\mathbf{v}_2) = \\begin{pmatrix} 1 \\\\ 0 \\\\ 1 \\end{pmatrix} - \\begin{pmatrix} 1/2 \\\\ 1/2 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} 1/2 \\\\ -1/2 \\\\ 1 \\end{pmatrix}$$`,
        explanation:
          'On vérifie l’orthogonalité : $\\langle \\mathbf{u}_2, \\mathbf{u}_1 \\rangle = 1/2 - 1/2 + 0 = 0$.',
        keyRule: 'Condition d’orthogonalité : $\\langle \\mathbf{u}_2, \\mathbf{u}_1 \\rangle = 0$',
      },
      {
        stepNumber: 4,
        title: 'Normaliser le vecteur obtenu',
        latexContent: `$$\\|\\mathbf{u}_2\\| = \\sqrt{(1/2)^2 + (-1/2)^2 + 1^2} = \\sqrt{1/4 + 1/4 + 1} = \\sqrt{3/2} = \\frac{\\sqrt{6}}{2}$$
$$\\mathbf{e}_2 = \\frac{\\mathbf{u}_2}{\\|\\mathbf{u}_2\\|} = \\frac{2}{\\sqrt{6}} \\begin{pmatrix} 1/2 \\\\ -1/2 \\\\ 1 \\end{pmatrix} = \\frac{1}{\\sqrt{6}}\\begin{pmatrix} 1 \\\\ -1 \\\\ 2 \\end{pmatrix}$$`,
        explanation:
          'La division par la norme produit un vecteur unitaire formant un système orthonormé avec $\\mathbf{e}_1$.',
        keyRule: 'Normalisation : $\\mathbf{e}_i = \\mathbf{u}_i / \\|\\mathbf{u}_i\\|$',
      },
    ],
  },

  numtheory_chinese_remainder: {
    title: 'Système de congruences par le théorème des restes chinois',
    latexStatement: `Trouver le plus petit entier positif ou nul $x$ vérifiant simultanément :
$$\\begin{cases} x \\equiv 2 \\pmod{3} \\\\ x \\equiv 3 \\pmod{5} \\\\ x \\equiv 2 \\pmod{7} \\end{cases}$$`,
    theoremContext: 'Théorème des restes chinois (modules deux à deux premiers entre eux)',
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Calculer le module global et les produits partiels',
        latexContent: `$$M = 3 \\times 5 \\times 7 = 105$$
$$M_1 = \\frac{105}{3} = 35, \\quad M_2 = \\frac{105}{5} = 21, \\quad M_3 = \\frac{105}{7} = 15$$`,
        explanation:
          'Les modules $3, 5, 7$ étant deux à deux premiers entre eux, il existe une solution unique modulo $105$.',
        keyRule: 'Existence et unicité par le théorème des restes chinois',
      },
      {
        stepNumber: 2,
        title: 'Calculer les inverses modulaires partiels',
        latexContent: `$$M_1 y_1 \\equiv 1 \\pmod{3} \\implies 35 y_1 \\equiv 2 y_1 \\equiv 1 \\pmod{3} \\implies y_1 = 2$$
$$M_2 y_2 \\equiv 1 \\pmod{5} \\implies 21 y_2 \\equiv 1 y_2 \\equiv 1 \\pmod{5} \\implies y_2 = 1$$
$$M_3 y_3 \\equiv 1 \\pmod{7} \\implies 15 y_3 \\equiv 1 y_3 \\equiv 1 \\pmod{7} \\implies y_3 = 1$$`,
        explanation:
          'On résout chaque congruence $M_i y_i \\equiv 1 \\pmod{m_i}$.',
        keyRule: 'Inverses modulaires locaux',
      },
      {
        stepNumber: 3,
        title: 'Construire la combinaison linéaire',
        latexContent: `$$x = \\sum_{i=1}^{3} a_i M_i y_i$$
$$x = 2(35)(2) + 3(21)(1) + 2(15)(1) = 140 + 63 + 30 = 233$$`,
        explanation:
          'Cette somme vérifie chaque congruence car les autres termes sont divisibles par $m_i$.',
        keyRule: 'Superposition constructive du TRC',
      },
      {
        stepNumber: 4,
        title: 'Réduire modulo 105',
        latexContent: `$$x \\equiv 233 \\pmod{105}$$
$$233 = 2 \\times 105 + 23 \\implies x = 23$$`,
        explanation:
          'Vérification : $23 \\equiv 2 \\pmod{3}$, $23 \\equiv 3 \\pmod{5}$ et $23 \\equiv 2 \\pmod{7}$.',
        keyRule: 'Représentant canonique dans $[0, 104]$',
      },
    ],
  },

  discrete_catalan_formula: {
    title: 'Le 4e nombre de Catalan et les chemins de Dyck',
    latexStatement: `Soit $C_n$ le $n$-ième nombre de Catalan, qui dénombre les chemins de Dyck de $(0,0)$ à $(n,n)$ ne dépassant jamais la droite $y = x$.
Calculer $C_4$ à l’aide du principe de réflexion ou de la formule binomiale.`,
    theoremContext: 'Principe de réflexion d’André & nombres de Catalan',
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Rappeler la formule fermée',
        latexContent: `$$C_n = \\frac{1}{n+1} \\binom{2n}{n}$$
$$\\text{Pour } n = 4 : \\quad C_4 = \\frac{1}{5} \\binom{8}{4}$$`,
        explanation:
          'Les nombres de Catalan comptent aussi les parenthésages bien formés et les arbres binaires.',
        keyRule: 'Formule fermée des nombres de Catalan',
      },
      {
        stepNumber: 2,
        title: 'Calculer le coefficient binomial central',
        latexContent: `$$\\binom{8}{4} = \\frac{8 \\times 7 \\times 6 \\times 5}{4 \\times 3 \\times 2 \\times 1} = \\frac{1680}{24} = 70$$`,
        explanation:
          '$\\binom{8}{4} = 70$ correspond à l’ensemble des chemins monotones de $(0,0)$ à $(4,4)$.',
        keyRule: 'Combinaisons $\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$',
      },
      {
        stepNumber: 3,
        title: 'Appliquer le principe de réflexion d’André',
        latexContent: `$$\\text{Chemins invalides touchant } y = x+1 : \\quad \\binom{8}{3} = \\frac{8 \\times 7 \\times 6}{3 \\times 2 \\times 1} = 56$$
$$C_4 = \\binom{8}{4} - \\binom{8}{3} = 70 - 56 = 14$$`,
        explanation:
          'La réflexion après le premier contact avec $y = x+1$ établit une bijection vers les chemins aboutissant en $(3, 5)$.',
        keyRule: 'Principe de réflexion d’André',
      },
      {
        stepNumber: 4,
        title: 'Vérification par division directe',
        latexContent: `$$C_4 = \\frac{70}{5} = 14$$`,
        explanation:
          'Les deux méthodes donnent la suite : $C_0 = 1, C_1 = 1, C_2 = 2, C_3 = 5, C_4 = 14$.',
        keyRule: 'Quotient direct : $70 / 5 = 14$',
      },
    ],
  },

  calc_multivariable_lagrange: {
    title: 'Extremum sous contrainte par multiplicateurs de Lagrange',
    latexStatement: `Déterminer le maximum de la fonction linéaire $f(x, y, z) = 2x + y + 2z$ sous la contrainte sphérique :
$$x^2 + y^2 + z^2 = 9$$`,
    theoremContext: 'Théorème des multiplicateurs de Lagrange sur un compact',
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Calculer les vecteurs gradients',
        latexContent: `$$\\nabla f = \\begin{pmatrix} 2 \\\\ 1 \\\\ 2 \\end{pmatrix}, \\quad \\nabla g = \\begin{pmatrix} 2x \\\\ 2y \\\\ 2z \\end{pmatrix}$$`,
        explanation:
          'En un extremum lié régulier, le gradient de $f$ est colinéaire au gradient de la contrainte $g(x,y,z) = x^2+y^2+z^2-9$.',
        keyRule: 'Condition de Lagrange : $\\nabla f = \\lambda \\nabla g$',
      },
      {
        stepNumber: 2,
        title: 'Exprimer les coordonnées en fonction de λ',
        latexContent: `$$2 = 2\\lambda x \\implies x = \\frac{1}{\\lambda}, \\quad y = \\frac{1}{2\\lambda}, \\quad z = \\frac{1}{\\lambda}$$`,
        explanation:
          'Comme $\\nabla f \\ne \\mathbf{0}$, $\\lambda$ est nécessairement non nul.',
        keyRule: 'Paramétrage par le multiplicateur $\\lambda$',
      },
      {
        stepNumber: 3,
        title: 'Injecter dans l’équation de la sphère',
        latexContent: `$$\\frac{1}{\\lambda^2} \\left( 1 + \\frac{1}{4} + 1 \\right) = \\frac{9}{4\\lambda^2} = 9 \\implies 4\\lambda^2 = 1 \\implies \\lambda = \\pm \\frac{1}{2}$$`,
        explanation:
          'On obtient deux points critiques correspondant respectivement au maximum et au minimum globaux.',
        keyRule: 'Substitution dans la contrainte',
      },
      {
        stepNumber: 4,
        title: 'Évaluer le maximum au multiplicateur positif',
        latexContent: `$$\\text{Pour } \\lambda = \\frac{1}{2} : \\quad x = 2, \\quad y = 1, \\quad z = 2$$
$$f(2, 1, 2) = 2(2) + 1 + 2(2) = 9$$`,
        explanation:
          'Par l’inégalité de Cauchy-Schwarz, $f \\le \\sqrt{4+1+4}\\sqrt{9} = 9$ ; le maximum vaut bien $9$.',
        keyRule: 'Confirmation par Cauchy-Schwarz',
      },
    ],
  },

  linalg_cayley_hamilton_powers: {
    title: 'Puissances d’une matrice par décomposition nilpotente',
    latexStatement: `Soit $A = \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$.
À l’aide du théorème de Cayley-Hamilton ou de la formule du binôme de Newton sur la décomposition $A = I + N$, calculer $A^{10}$.`,
    theoremContext: 'Théorème de Cayley-Hamilton & réduction de Jordan',
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Décomposer A en identité plus matrice nilpotente',
        latexContent: `$$A = I + N, \\quad I = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}, \\quad N = \\begin{pmatrix} 0 & 2 \\\\ 0 & 0 \\end{pmatrix}$$`,
        explanation:
          'Comme $I$ et $N$ commutent ($IN = NI$), la formule du binôme de Newton s’applique aux matrices.',
        keyRule: 'Formule du binôme pour matrices qui commutent',
      },
      {
        stepNumber: 2,
        title: 'Vérifier la nilpotence de N',
        latexContent: `$$N^2 = \\begin{pmatrix} 0 & 2 \\\\ 0 & 0 \\end{pmatrix} \\begin{pmatrix} 0 & 2 \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix} = \\mathbf{0}$$
$$N^k = \\mathbf{0} \\quad \\forall k \\ge 2$$`,
        explanation:
          'La matrice $N$ est nilpotente d’indice 2 : toutes les puissances d’ordre $\\ge 2$ sont nulles.',
        keyRule: 'Nilpotence d’indice 2 : $N^2 = \\mathbf{0}$',
      },
      {
        stepNumber: 3,
        title: 'Tronquer le développement binomial à l’ordre 1',
        latexContent: `$$A^{10} = (I + N)^{10} = I + 10N + \\sum_{k=2}^{10} \\binom{10}{k} N^k = I + 10N$$`,
        explanation:
          'Seuls les termes de degrés 0 et 1 subsistent dans la somme.',
        keyRule: 'Troncature d’une série finie',
      },
      {
        stepNumber: 4,
        title: 'Assembler la matrice finale',
        latexContent: `$$A^{10} = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix} + 10 \\begin{pmatrix} 0 & 2 \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} 1 & 20 \\\\ 0 & 1 \\end{pmatrix}$$`,
        explanation:
          'On obtient exactement $A^{10} = \\begin{pmatrix} 1 & 20 \\\\ 0 & 1 \\end{pmatrix}$.',
        keyRule: 'Puissance d’un bloc de Jordan',
      },
    ],
  },

  numtheory_euler_totient_coprime: {
    title: 'Théorème d’Euler et réduction modulaire de grandes puissances',
    latexStatement: `Trouver les deux derniers chiffres de l’écriture décimale de $7^{102}$, c’est-à-dire calculer :
$$7^{102} \\pmod{100}$$`,
    theoremContext: 'Théorème d’Euler & indicatrice φ(n)',
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Calculer l’indicatrice d’Euler φ(100)',
        latexContent: `$$100 = 2^2 \\times 5^2$$
$$\\varphi(100) = 100 \\left(1 - \\frac{1}{2}\\right)\\left(1 - \\frac{1}{5}\\right) = 100 \\times \\frac{1}{2} \\times \\frac{4}{5} = 40$$`,
        explanation:
          'L’indicatrice $\\varphi(100)$ compte les entiers compris entre $1$ et $100$ qui sont premiers avec $100$.',
        keyRule: 'Formule multiplicative de l’indicatrice d’Euler',
      },
      {
        stepNumber: 2,
        title: 'Appliquer le théorème d’Euler',
        latexContent: `$$\\operatorname{pgcd}(7, 100) = 1 \\implies 7^{\\varphi(100)} \\equiv 7^{40} \\equiv 1 \\pmod{100}$$`,
        explanation:
          'Tout entier premier avec $100$ élevé à la puissance $40$ est congru à $1$ modulo $100$.',
        keyRule: 'Théorème d’Euler : $a^{\\varphi(m)} \\equiv 1 \\pmod{m}$',
      },
      {
        stepNumber: 3,
        title: 'Réduire l’exposant par division euclidienne',
        latexContent: `$$102 = 40 \\times 2 + 22 \\implies 7^{102} \\equiv (7^{40})^2 \\cdot 7^{22} \\equiv 7^{22} \\pmod{100}$$`,
        explanation:
          'On ramène l’exposant de $102$ à $22$, que l’on peut encore réduire grâce à $7^4 = 2401 \\equiv 1 \\pmod{100}$.',
        keyRule: 'Réduction modulaire de l’exposant',
      },
      {
        stepNumber: 4,
        title: 'Conclure avec le sous-cycle d’ordre 4',
        latexContent: `$$7^2 = 49, \\quad 7^4 = 2401 \\equiv 1 \\pmod{100}$$
$$7^{102} = (7^4)^{25} \\cdot 7^2 \\equiv 1^{25} \\cdot 49 \\equiv 49 \\pmod{100}$$`,
        explanation:
          'L’ordre multiplicatif de $7$ modulo $100$ vaut $4$. Les deux derniers chiffres sont donc $49$.',
        keyRule: 'Ordre multiplicatif modulo 100',
      },
    ],
  },
};

export function getLocalizedTopics(lang: Language): Topic[] {
  if (lang === 'en') return TOPICS;
  return TOPICS.map((t) => {
    const fr = TOPIC_FR_MAP[t.slug];
    return fr ? { ...t, title: fr.title, description: fr.description } : t;
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
          latexStatement: fr.latexStatement,
          theoremContext: fr.theoremContext,
          solvingSequences: fr.solvingSequences,
        }
      : ex;
  });
}
