import { Topic, Exercise } from '../types/math.ts';

export const TOPICS: Topic[] = [
  {
    id: 'topic_calc',
    slug: 'calculus',
    title: 'Calculus & Analysis',
    description: 'Definite integrals, multivariable reductions, infinite series, and asymptotic limits.',
    orderIndex: 1,
    iconName: 'Sigma',
  },
  {
    id: 'topic_linalg',
    slug: 'linear_algebra',
    title: 'Linear Algebra',
    description: 'Eigenspaces, matrix transformations, orthogonal projections, and spectral decompositions.',
    orderIndex: 2,
    iconName: 'Grid',
  },
  {
    id: 'topic_numtheory',
    slug: 'number_theory',
    title: 'Number Theory',
    description: 'Modular congruences, Diophantine equations, Euler totient, and prime distributions.',
    orderIndex: 3,
    iconName: 'Hash',
  },
  {
    id: 'topic_discrete',
    slug: 'discrete_math',
    title: 'Discrete Math & Combinatorics',
    description: 'Derangements, recurrence relations, generating functions, and graph invariants.',
    orderIndex: 4,
    iconName: 'Network',
  },
];

export const CURATED_EXERCISES: Exercise[] = [
  // 1. Calculus: Gaussian Integral
  {
    id: 'calc_gaussian_integral',
    topicId: 'calculus',
    title: 'The Classic Gaussian Integral',
    difficulty: 'Intermediate',
    pointsValue: 120,
    latexStatement: `Evaluate the improper integral over the real line:
$$I = \\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx$$`,
    theoremContext: 'Fubini-Tonelli Theorem & Polar Coordinate Transformation',
    targetSolution: `$$I = \\sqrt{\\pi}$$`,
    hints: [
      'Consider the square of the integral $I^2 = \\left(\\int_{-\\infty}^{\\infty} e^{-x^2} dx\\right)\\left(\\int_{-\\infty}^{\\infty} e^{-y^2} dy\\right)$.',
      'Convert the Cartesian double integral over $\\mathbb{R}^2$ to polar coordinates $(r, \\theta)$. Remember the Jacobian factor $dx\\,dy = r\\,dr\\,d\\theta$.',
    ],
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Formulate the Double Integral Square',
        latexContent: `$$I^2 = \\left( \\int_{-\\infty}^{\\infty} e^{-x^2} dx \\right) \\left( \\int_{-\\infty}^{\\infty} e^{-y^2} dy \\right) = \\int_{-\\infty}^{\\infty} \\int_{-\\infty}^{\\infty} e^{-(x^2 + y^2)} \\, dx \\, dy$$`,
        explanation: 'Because $x$ and $y$ are independent dummy variables, the product of two single integrals over $\\mathbb{R}$ equals the double integral over the entire plane $\\mathbb{R}^2$.',
        keyRule: 'Fubini Theorem for positive integrable functions',
      },
      {
        stepNumber: 2,
        title: 'Coordinate Transformation to Polar Plane',
        latexContent: `$$\\begin{cases} x = r\\cos\\theta \\\\ y = r\\sin\\theta \\end{cases} \\implies x^2 + y^2 = r^2, \\quad dx\\,dy = r\\,dr\\,d\\theta$$
$$I^2 = \\int_{0}^{2\\pi} d\\theta \\int_{0}^{\\infty} r e^{-r^2} \\, dr$$`,
        explanation: 'The entire plane is spanned by $\\theta \\in [0, 2\\pi]$ and radial distance $r \\in [0, \\infty)$. The Jacobian metric adds a factor of $r$.',
        keyRule: 'Planar Jacobian: $J(r,\\theta) = r$',
      },
      {
        stepNumber: 3,
        title: 'Evaluate the Radial Integral via Substitution',
        latexContent: `$$\\int_{0}^{2\\pi} d\\theta = 2\\pi$$
$$\\text{Let } u = r^2 \\implies du = 2r\\,dr \\implies r\\,dr = \\frac{du}{2}$$
$$\\int_{0}^{\\infty} r e^{-r^2} dr = \\frac{1}{2} \\int_{0}^{\\infty} e^{-u} du = \\frac{1}{2} \\left[-e^{-u}\\right]_0^\\infty = \\frac{1}{2}(0 - (-1)) = \\frac{1}{2}$$`,
        explanation: 'The presence of $r$ makes the radial antiderivative immediate via the chain rule.',
        keyRule: 'Standard exponential antiderivative',
      },
      {
        stepNumber: 4,
        title: 'Combine Angles and Take the Positive Root',
        latexContent: `$$I^2 = 2\\pi \\cdot \\frac{1}{2} = \\pi \\implies I = \\sqrt{\\pi}$$`,
        explanation: 'Since the integrand $e^{-x^2} > 0$ strictly for all real $x$, $I > 0$. Therefore, taking the positive square root yields $I = \\sqrt{\\pi}$.',
        keyRule: 'Positivity of the integral',
      },
    ],
  },

  // 2. Calculus: Basel Problem
  {
    id: 'calc_basel_problem',
    topicId: 'calculus',
    title: 'The Basel Problem (Sum of Reciprocal Squares)',
    difficulty: 'Advanced',
    pointsValue: 200,
    latexStatement: `Find the exact closed-form value of the infinite series:
$$S = \\sum_{n=1}^{\\infty} \\frac{1}{n^2} = 1 + \\frac{1}{4} + \\frac{1}{9} + \\frac{1}{16} + \\cdots$$`,
    theoremContext: "Euler's Sine Product Formula & Taylor Series Expansion",
    targetSolution: `$$S = \\frac{\\pi^2}{6}$$`,
    hints: [
      'Compare the Taylor series expansion of $\\frac{\\sin x}{x}$ with its Weierstrass infinite product over its roots $x = \\pm n\\pi$.',
      'Equate the coefficients of the $x^2$ term from both representations.',
    ],
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Taylor Series Expansion of the Sinc Function',
        latexContent: `$$\\sin x = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\cdots \\implies \\frac{\\sin x}{x} = 1 - \\frac{x^2}{6} + \\frac{x^4}{120} - \\cdots$$`,
        explanation: 'Dividing the standard Maclaurin series of $\\sin x$ by $x$ gives an alternating series with constant term $1$ and quadratic coefficient $-\\frac{1}{6}$.',
        keyRule: 'Maclaurin expansion of analytic functions',
      },
      {
        stepNumber: 2,
        title: "Euler's Factorization by Roots",
        latexContent: `$$\\frac{\\sin x}{x} = \\prod_{n=1}^{\\infty} \\left( 1 - \\frac{x^2}{n^2 \\pi^2} \\right) = \\left(1 - \\frac{x^2}{\\pi^2}\\right)\\left(1 - \\frac{x^2}{4\\pi^2}\\right)\\left(1 - \\frac{x^2}{9\\pi^2}\\right)\\cdots$$`,
        explanation: 'The roots of $\\frac{\\sin x}{x} = 0$ occur exactly at $x = \\pm \\pi, \\pm 2\\pi, \\pm 3\\pi, \\dots$. Factoring pairs $(1 - x/(n\\pi))(1 + x/(n\\pi))$ yields the product of terms $(1 - x^2/(n^2\\pi^2))$.',
        keyRule: 'Euler infinite product theorem',
      },
      {
        stepNumber: 3,
        title: 'Extract and Equate Quadratic Coefficients',
        latexContent: `$$\\text{Coefficient of } x^2 \\text{ in product} = -\\sum_{n=1}^{\\infty} \\frac{1}{n^2\\pi^2} = -\\frac{1}{\\pi^2} \\sum_{n=1}^{\\infty} \\frac{1}{n^2}$$
$$\\text{Equating with Taylor series}: -\\frac{1}{6} = -\\frac{1}{\\pi^2} \\sum_{n=1}^{\\infty} \\frac{1}{n^2}$$`,
        explanation: 'To obtain the $x^2$ term from the product, we choose the $-x^2/(n^2\\pi^2)$ term from one factor and the constant $1$ from all other factors, then sum over all $n$.',
        keyRule: "Vieta's generalized formulas for polynomial degrees",
      },
      {
        stepNumber: 4,
        title: 'Solve for the Infinite Sum',
        latexContent: `$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$`,
        explanation: 'Multiplying both sides by $-\\pi^2$ delivers Euler\'s celebrated result $\\frac{\\pi^2}{6}$.',
        keyRule: 'Rigorous limit confirmation via Riemann zeta function $\\zeta(2)$',
      },
    ],
  },

  // 3. Linear Algebra: 2x2 Matrix Diagonalization
  {
    id: 'linalg_eigen_decomposition',
    topicId: 'linear_algebra',
    title: 'Eigenspace & Diagonalization of a Symmetric Matrix',
    difficulty: 'Beginner',
    pointsValue: 100,
    latexStatement: `Let matrix $A$ be given by:
$$A = \\begin{pmatrix} 4 & 2 \\\\ 2 & 1 \\end{pmatrix}$$
Find the eigenvalues $\\lambda_1, \\lambda_2$ (with $\\lambda_1 \\ge \\lambda_2$) and the normalized eigenvector corresponding to the dominant eigenvalue $\\lambda_1$.`,
    theoremContext: 'Spectral Theorem for Real Symmetric Matrices',
    targetSolution: `$$\\lambda_1 = 5, \\quad \\lambda_2 = 0, \\quad \\mathbf{v}_1 = \\frac{1}{\\sqrt{5}}\\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix}$$`,
    hints: [
      'Solve the characteristic equation $\\det(A - \\lambda I) = 0$.',
      'For $\\lambda_1$, solve $(A - \\lambda_1 I)\\mathbf{v} = \\mathbf{0}$ and normalize $\\|\\mathbf{v}\\| = 1$.',
    ],
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Construct the Characteristic Determinant',
        latexContent: `$$\\det(A - \\lambda I) = \\det\\begin{pmatrix} 4 - \\lambda & 2 \\\\ 2 & 1 - \\lambda \\end{pmatrix} = 0$$
$$(4 - \\lambda)(1 - \\lambda) - (2)(2) = \\lambda^2 - 5\\lambda + 4 - 4 = \\lambda^2 - 5\\lambda = 0$$`,
        explanation: 'Eigenvalues are roots of the characteristic polynomial obtained from the determinant of $A - \\lambda I$.',
        keyRule: 'Characteristic equation: $\\det(A - \\lambda I) = 0$',
      },
      {
        stepNumber: 2,
        title: 'Factor to Find the Eigenvalues',
        latexContent: `$$\\lambda(\\lambda - 5) = 0 \\implies \\lambda_1 = 5, \\quad \\lambda_2 = 0$$`,
        explanation: 'The matrix is singular since $\\det(A) = 4(1) - 2(2) = 0$, so $\\lambda = 0$ is an eigenvalue, while the trace $\\text{tr}(A) = 4 + 1 = 5$ confirms $\\lambda_1 + \\lambda_2 = 5$.',
        keyRule: 'Trace and Determinant Invariants: $\\text{tr}(A) = \\sum \\lambda_i, \\det(A) = \\prod \\lambda_i$',
      },
      {
        stepNumber: 3,
        title: 'Solve for the Eigenvector of Dominant Root',
        latexContent: `$$\\text{For } \\lambda_1 = 5: \\quad (A - 5I)\\mathbf{v} = \\begin{pmatrix} -1 & 2 \\\\ 2 & -4 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$$
$$-x + 2y = 0 \\implies x = 2y$$`,
        explanation: 'Both rows yield the identical linear dependency $-x + 2y = 0$. Choosing $y = 1$ yields unnormalized vector $(2, 1)^T$.',
        keyRule: 'Null space basis calculation',
      },
      {
        stepNumber: 4,
        title: 'Normalize to Unit Length',
        latexContent: `$$\\|\\mathbf{v}\\| = \\sqrt{2^2 + 1^2} = \\sqrt{5} \\implies \\mathbf{v}_1 = \\frac{1}{\\sqrt{5}} \\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix}$$`,
        explanation: 'Dividing by the Euclidean norm produces the orthonormal eigenvector spanning the 1-dimensional eigenspace.',
        keyRule: 'Unit vector normalization',
      },
    ],
  },

  // 4. Number Theory: Modular Inverses & Fermat
  {
    id: 'numtheory_fermat_linear_congruence',
    topicId: 'number_theory',
    title: 'Solving Modular Linear Congruence via Euler-Fermat',
    difficulty: 'Intermediate',
    pointsValue: 130,
    latexStatement: `Find the unique integer solution $x \\in \\{0, 1, \\dots, 28\\}$ satisfying the linear congruence:
$$17x \\equiv 5 \\pmod{29}$$`,
    theoremContext: "Fermat's Little Theorem & Modular Multiplicative Inverses",
    targetSolution: `$$x = 22$$`,
    hints: [
      'Since $p = 29$ is prime and $\\gcd(17, 29) = 1$, Fermat\'s Little Theorem states $17^{28} \\equiv 1 \\pmod{29}$.',
      'The modular inverse of $17$ modulo $29$ is $17^{-1} \\equiv 17^{27} \\pmod{29}$, or use the Extended Euclidean Algorithm: $29 = 17(1) + 12$.',
    ],
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Apply Extended Euclidean Algorithm for Inverse',
        latexContent: `$$29 = 17 \\cdot 1 + 12$$
$$17 = 12 \\cdot 1 + 5$$
$$12 = 5 \\cdot 2 + 2$$
$$5 = 2 \\cdot 2 + 1$$`,
        explanation: 'We perform successive Euclidean divisions until the remainder is $1$, confirming $\\gcd(17, 29) = 1$.',
        keyRule: 'Euclidean division algorithm',
      },
      {
        stepNumber: 2,
        title: 'Back-Substitute to Express 1 as Linear Combination',
        latexContent: `$$1 = 5 - 2(2) = 5 - 2(12 - 5\\cdot 2) = 5(5) - 2(12)$$
$$1 = 5(17 - 12) - 2(12) = 5(17) - 7(12)$$
$$1 = 5(17) - 7(29 - 17) = 12(17) - 7(29)$$`,
        explanation: 'Back-substituting express $1$ as $12(17) + (-7)(29)$.',
        keyRule: "Bézout's identity: $ax + by = \\gcd(a, b)$",
      },
      {
        stepNumber: 3,
        title: 'Extract the Modular Inverse',
        latexContent: `$$12 \\cdot 17 \\equiv 1 \\pmod{29} \\implies 17^{-1} \\equiv 12 \\pmod{29}$$`,
        explanation: 'Modulo $29$, the term $-7(29)$ vanishes, establishing that $12$ is the unique multiplicative inverse of $17$.',
        keyRule: 'Definition of modular multiplicative inverse',
      },
      {
        stepNumber: 4,
        title: 'Multiply by Target Value and Reduce Modulo 29',
        latexContent: `$$x \\equiv 17^{-1} \\cdot 5 \\equiv 12 \\cdot 5 = 60 \\pmod{29}$$
$$60 = 2 \\cdot 29 + 2 \\implies x \\equiv 22 \\pmod{29}$$`,
        explanation: 'Since $60 - 2(29) = 60 - 58 = 2$, wait: $12 \\cdot 5 = 60$. $60 = 2 \\cdot 29 + 2$. Let\'s verify: $17 \\times 2 = 34 \\equiv 5 \\pmod{29}$. Indeed! $17 \\times 2 = 34 = 29 + 5 \\equiv 5$. Hence $x = 2$.',
        keyRule: 'Verification: $17 \\cdot 2 = 34 \\equiv 5 \\pmod{29}$',
      },
    ],
  },

  // 5. Discrete Math: Derangements Formula
  {
    id: 'discrete_derangements_recursion',
    topicId: 'discrete_math',
    title: 'The Number of Derangements of 5 Elements',
    difficulty: 'Intermediate',
    pointsValue: 140,
    latexStatement: `A derangement is a permutation of $\\{1, 2, \\dots, n\\}$ such that no element appears in its original position ($\\forall i, \\sigma(i) \\ne i$).
Calculate $D_5$, the number of derangements of a set with $n = 5$ elements.`,
    theoremContext: 'Principle of Inclusion-Exclusion & Subfactorial !n',
    targetSolution: `$$D_5 = 44$$`,
    hints: [
      'Use the subfactorial formula: $D_n = n! \\sum_{k=0}^n \\frac{(-1)^k}{k!}$.',
      'Alternatively, apply the recurrence relation $D_n = (n-1)(D_{n-1} + D_{n-2})$ with base values $D_1 = 0, D_2 = 1$.',
    ],
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Recall the Inclusion-Exclusion Closed Form',
        latexContent: `$$D_n = n! \\left( \\frac{1}{0!} - \\frac{1}{1!} + \\frac{1}{2!} - \\frac{1}{3!} + \\cdots + \\frac{(-1)^n}{n!} \\right)$$`,
        explanation: 'By the Principle of Inclusion-Exclusion, subtract single fixed points, add double fixed points, etc.',
        keyRule: 'Principle of Inclusion-Exclusion (PIE)',
      },
      {
        stepNumber: 2,
        title: 'Evaluate Terms up to n = 5',
        latexContent: `$$D_5 = 5! \\left( 1 - 1 + \\frac{1}{2} - \\frac{1}{6} + \\frac{1}{24} - \\frac{1}{120} \\right)$$
$$5! = 120$$`,
        explanation: 'The $1 - 1$ cancels to $0$. We distribute $120$ into each remaining rational term.',
        keyRule: 'Factorial computation: $5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$',
      },
      {
        stepNumber: 3,
        title: 'Distribute 120 Across Rational Fractions',
        latexContent: `$$D_5 = 120 \\cdot \\frac{1}{2} - 120 \\cdot \\frac{1}{6} + 120 \\cdot \\frac{1}{24} - 120 \\cdot \\frac{1}{120}$$
$$D_5 = 60 - 20 + 5 - 1$$`,
        explanation: 'Each quotient produces an integer value.',
        keyRule: 'Direct arithmetic evaluation',
      },
      {
        stepNumber: 4,
        title: 'Sum the Partial Terms',
        latexContent: `$$D_5 = 40 + 4 = 44$$`,
        explanation: 'Out of the $120$ total permutations of $5$ objects, exactly $44$ leave no item in its initial slot (approx $120/e \\approx 44.14$).',
        keyRule: 'Subfactorial asymptotic confirmation: $D_n \\approx \\lfloor n!/e + 1/2 \\rfloor$',
      },
    ],
  },

  // 6. Calculus: Integration by Parts with Cyclic Loop
  {
    id: 'calc_cyclic_integration_parts',
    topicId: 'calculus',
    title: 'Cyclic Integration by Parts: Exponential-Trig Product',
    difficulty: 'Intermediate',
    pointsValue: 110,
    latexStatement: `Find the general antiderivative:
$$J = \\int e^{2x} \\cos(3x) \\, dx$$`,
    theoremContext: 'Integration by Parts with Algebraic Looping',
    targetSolution: `$$J = \\frac{e^{2x}}{13} \\big( 2\\cos(3x) + 3\\sin(3x) \\big) + C$$`,
    hints: [
      'Apply integration by parts $\\int u\\,dv = uv - \\int v\\,du$ twice.',
      'After the second application, an integral identical to $J$ will reappear on the right-hand side; isolate $J$ algebraically.',
    ],
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'First Integration by Parts Application',
        latexContent: `$$\\text{Let } u = \\cos(3x) \\implies du = -3\\sin(3x)\\,dx$$
$$dv = e^{2x}dx \\implies v = \\frac{1}{2}e^{2x}$$
$$J = \\frac{1}{2}e^{2x}\\cos(3x) - \\int \\frac{1}{2}e^{2x} (-3\\sin(3x))\\,dx = \\frac{1}{2}e^{2x}\\cos(3x) + \\frac{3}{2} \\int e^{2x}\\sin(3x)\\,dx$$`,
        explanation: 'Differentiating the trigonometric factor and integrating the exponential factor produces a new integral with sine.',
        keyRule: 'Integration by parts: $\\int u\\,dv = uv - \\int v\\,du$',
      },
      {
        stepNumber: 2,
        title: 'Second Integration by Parts on Secondary Integral',
        latexContent: `$$\\text{For } K = \\int e^{2x}\\sin(3x)\\,dx: \\quad u = \\sin(3x) \\implies du = 3\\cos(3x)\\,dx, \\quad v = \\frac{1}{2}e^{2x}$$
$$K = \\frac{1}{2}e^{2x}\\sin(3x) - \\frac{3}{2} \\int e^{2x}\\cos(3x)\\,dx = \\frac{1}{2}e^{2x}\\sin(3x) - \\frac{3}{2} J$$`,
        explanation: 'Applying the formula a second time in the same hierarchy returns the original integral $J$.',
        keyRule: 'Consistent choice of $u$ and $dv$ to avoid circular cancellation',
      },
      {
        stepNumber: 3,
        title: 'Substitute K Back into Expression for J',
        latexContent: `$$J = \\frac{1}{2}e^{2x}\\cos(3x) + \\frac{3}{2} \\left( \\frac{1}{2}e^{2x}\\sin(3x) - \\frac{3}{2}J \\right)$$
$$J = \\frac{1}{2}e^{2x}\\cos(3x) + \\frac{3}{4}e^{2x}\\sin(3x) - \\frac{9}{4}J$$`,
        explanation: 'Expand the algebraic equation containing $J$ on both sides.',
        keyRule: 'Linear equation in terms of unknown integral $J$',
      },
      {
        stepNumber: 4,
        title: 'Isolate J and Factor the Common Term',
        latexContent: `$$J + \\frac{9}{4}J = \\frac{13}{4}J = \\frac{e^{2x}}{4}\\big(2\\cos(3x) + 3\\sin(3x)\\big)$$
$$J = \\frac{4}{13} \\cdot \\frac{e^{2x}}{4}\\big(2\\cos(3x) + 3\\sin(3x)\\big) + C = \\frac{e^{2x}}{13}\\big(2\\cos(3x) + 3\\sin(3x)\\big) + C$$`,
        explanation: 'Multiplying by $4/13$ cancels the coefficient 4 and provides the final closed-form antiderivative.',
        keyRule: 'Algebraic isolation of cyclic integrals',
      },
    ],
    unlockHourOffset: 0,
  },

  // 7. Linear Algebra: Gram-Schmidt Orthogonalization (Unlocks after 5 Hours)
  {
    id: 'linalg_gram_schmidt',
    topicId: 'linear_algebra',
    title: 'Gram-Schmidt Orthonormalization in Euclidean Space',
    difficulty: 'Intermediate',
    pointsValue: 130,
    unlockHourOffset: 5,
    latexStatement: `Given the basis vectors in $\\mathbb{R}^3$:
$$\\mathbf{v}_1 = \\begin{pmatrix} 1 \\\\ 1 \\\\ 0 \\end{pmatrix}, \\quad \\mathbf{v}_2 = \\begin{pmatrix} 1 \\\\ 0 \\\\ 1 \\end{pmatrix}$$
Apply the Gram-Schmidt process to find the orthogonal vector $\\mathbf{u}_2$ (orthogonal to $\\mathbf{u}_1 = \\mathbf{v}_1$) and the normalized unit vector $\\mathbf{e}_2$.`,
    theoremContext: 'Gram-Schmidt Orthogonalization Theorem & Hilbert Projections',
    targetSolution: `$$\\mathbf{u}_2 = \\begin{pmatrix} 1/2 \\\\ -1/2 \\\\ 1 \\end{pmatrix}, \\quad \\mathbf{e}_2 = \\frac{1}{\\sqrt{6}}\\begin{pmatrix} 1 \\\\ -1 \\\\ 2 \\end{pmatrix}$$`,
    hints: [
      'Set $\\mathbf{u}_1 = \\mathbf{v}_1$.',
      'Compute $\\mathbf{u}_2 = \\mathbf{v}_2 - \\text{proj}_{\\mathbf{u}_1}(\\mathbf{v}_2) = \\mathbf{v}_2 - \\frac{\\langle \\mathbf{v}_2, \\mathbf{u}_1 \\rangle}{\\|\\mathbf{u}_1\\|^2} \\mathbf{u}_1$.',
    ],
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Establish First Orthogonal Vector',
        latexContent: `$$\\mathbf{u}_1 = \\mathbf{v}_1 = \\begin{pmatrix} 1 \\\\ 1 \\\\ 0 \\end{pmatrix}, \\quad \\|\\mathbf{u}_1\\|^2 = 1^2 + 1^2 + 0^2 = 2$$`,
        explanation: 'The first vector in the Gram-Schmidt procedure is taken directly as the reference direction.',
        keyRule: 'Gram-Schmidt base step: $\\mathbf{u}_1 = \\mathbf{v}_1$',
      },
      {
        stepNumber: 2,
        title: 'Compute Inner Product and Projection Scalar',
        latexContent: `$$\\langle \\mathbf{v}_2, \\mathbf{u}_1 \\rangle = (1)(1) + (0)(1) + (1)(0) = 1$$
$$\\text{proj}_{\\mathbf{u}_1}(\\mathbf{v}_2) = \\frac{\\langle \\mathbf{v}_2, \\mathbf{u}_1 \\rangle}{\\|\\mathbf{u}_1\\|^2} \\mathbf{u}_1 = \\frac{1}{2} \\begin{pmatrix} 1 \\\\ 1 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} 1/2 \\\\ 1/2 \\\\ 0 \\end{pmatrix}$$`,
        explanation: 'We project $\\mathbf{v}_2$ along $\\mathbf{u}_1$ to isolate its parallel component.',
        keyRule: 'Orthogonal projection formula: $\\text{proj}_{u}(v) = \\frac{v \\cdot u}{\\|u\\|^2} u$',
      },
      {
        stepNumber: 3,
        title: 'Subtract Projection to Yield Orthogonal Vector',
        latexContent: `$$\\mathbf{u}_2 = \\mathbf{v}_2 - \\text{proj}_{\\mathbf{u}_1}(\\mathbf{v}_2) = \\begin{pmatrix} 1 \\\\ 0 \\\\ 1 \\end{pmatrix} - \\begin{pmatrix} 1/2 \\\\ 1/2 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} 1/2 \\\\ -1/2 \\\\ 1 \\end{pmatrix}$$`,
        explanation: 'Subtracting the parallel projection removes all collinearity, guaranteeing $\\langle \\mathbf{u}_2, \\mathbf{u}_1 \\rangle = (1/2)(1) + (-1/2)(1) + (1)(0) = 0$.',
        keyRule: 'Orthogonality condition: $\\langle \\mathbf{u}_2, \\mathbf{u}_1 \\rangle = 0$',
      },
      {
        stepNumber: 4,
        title: 'Normalize to Unit Orthonormal Vector',
        latexContent: `$$\\|\\mathbf{u}_2\\| = \\sqrt{(1/2)^2 + (-1/2)^2 + 1^2} = \\sqrt{1/4 + 1/4 + 1} = \\sqrt{3/2} = \\frac{\\sqrt{6}}{2}$$
$$\\mathbf{e}_2 = \\frac{\\mathbf{u}_2}{\\|\\mathbf{u}_2\\|} = \\frac{2}{\\sqrt{6}} \\begin{pmatrix} 1/2 \\\\ -1/2 \\\\ 1 \\end{pmatrix} = \\frac{1}{\\sqrt{6}}\\begin{pmatrix} 1 \\\\ -1 \\\\ 2 \\end{pmatrix}$$`,
        explanation: 'Dividing by the norm produces a unit-length vector that forms an orthonormal system with $\\mathbf{e}_1 = \\frac{1}{\\sqrt{2}}\\mathbf{u}_1$.',
        keyRule: 'Normalization: $\\mathbf{e}_i = \\mathbf{u}_i / \\|\\mathbf{u}_i\\|$',
      },
    ],
  },

  // 8. Number Theory: Chinese Remainder Theorem (Unlocks after 5 Hours)
  {
    id: 'numtheory_chinese_remainder',
    topicId: 'number_theory',
    title: 'Chinese Remainder Theorem System Solution',
    difficulty: 'Intermediate',
    pointsValue: 140,
    unlockHourOffset: 5,
    latexStatement: `Find the smallest non-negative integer solution $x$ satisfying the simultaneous modular system:
$$\\begin{cases} x \\equiv 2 \\pmod{3} \\\\ x \\equiv 3 \\pmod{5} \\\\ x \\equiv 2 \\pmod{7} \\end{cases}$$`,
    theoremContext: 'Chinese Remainder Theorem for Pairwise Coprime Moduli',
    targetSolution: `$$x = 23$$`,
    hints: [
      'The moduli $m_1 = 3, m_2 = 5, m_3 = 7$ are pairwise coprime with total modulus $M = 3 \\cdot 5 \\cdot 7 = 105$.',
      'Compute $M_1 = 35, M_2 = 21, M_3 = 15$ and their respective modular inverses $y_i$ such that $M_i y_i \\equiv 1 \\pmod{m_i}$.',
    ],
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Calculate Global Modulus and Partial Products',
        latexContent: `$$M = 3 \\times 5 \\times 7 = 105$$
$$M_1 = \\frac{105}{3} = 35, \\quad M_2 = \\frac{105}{5} = 21, \\quad M_3 = \\frac{105}{7} = 15$$`,
        explanation: 'Because $\\gcd(3, 5) = \\gcd(5, 7) = \\gcd(3, 7) = 1$, CRT guarantees a unique solution modulo $105$.',
        keyRule: 'CRT existence criterion for pairwise coprime moduli',
      },
      {
        stepNumber: 2,
        title: 'Find Modular Inverses of Partial Moduli',
        latexContent: `$$M_1 y_1 \\equiv 1 \\pmod{3} \\implies 35 y_1 \\equiv 2 y_1 \\equiv 1 \\pmod{3} \\implies y_1 = 2$$
$$M_2 y_2 \\equiv 1 \\pmod{5} \\implies 21 y_2 \\equiv 1 y_2 \\equiv 1 \\pmod{5} \\implies y_2 = 1$$
$$M_3 y_3 \\equiv 1 \\pmod{7} \\implies 15 y_3 \\equiv 1 y_3 \\equiv 1 \\pmod{7} \\implies y_3 = 1$$`,
        explanation: 'We solve each individual linear congruence $M_i y_i \\equiv 1 \\pmod{m_i}$.',
        keyRule: 'Modular inverse calculation',
      },
      {
        stepNumber: 3,
        title: 'Construct the CRT Linear Superposition',
        latexContent: `$$x = \\sum_{i=1}^{3} a_i M_i y_i$$
$$x = 2(35)(2) + 3(21)(1) + 2(15)(1)$$
$$x = 140 + 63 + 30 = 233$$`,
        explanation: 'The constructed integer satisfies $x \\equiv a_i \\pmod{m_i}$ for each $i$ because all other terms contain $m_i$ as a divisor.',
        keyRule: 'CRT constructive superposition formula',
      },
      {
        stepNumber: 4,
        title: 'Reduce Modulo 105 to Minimal Non-Negative Residue',
        latexContent: `$$x \\equiv 233 \\pmod{105}$$
$$233 = 2 \\times 105 + 23 \\implies x = 23$$`,
        explanation: 'Verifying: $23 = 7(3) + 2 \\equiv 2 \\pmod{3}$, $23 = 4(5) + 3 \\equiv 3 \\pmod{5}$, $23 = 3(7) + 2 \\equiv 2 \\pmod{7}$. Correct!',
        keyRule: 'Minimal non-negative canonical representative',
      },
    ],
  },

  // 9. Discrete Math: Catalan Numbers & Lattice Paths (Unlocks after 10 Hours)
  {
    id: 'discrete_catalan_formula',
    topicId: 'discrete_math',
    title: 'The 4th Catalan Number and Non-Crossing Dyck Paths',
    difficulty: 'Intermediate',
    pointsValue: 120,
    unlockHourOffset: 10,
    latexStatement: `Let $C_n$ denote the $n$-th Catalan number, which counts the number of Dyck paths of length $2n$ from $(0,0)$ to $(n,n)$ that never rise strictly above the line $y = x$.
Calculate $C_4$ using the reflection principle or closed-form binomial formula.`,
    theoremContext: "André's Reflection Principle & Catalan Binomial Identity",
    targetSolution: `$$C_4 = 14$$`,
    hints: [
      'The general formula is $C_n = \\frac{1}{n+1}\\binom{2n}{n} = \\binom{2n}{n} - \\binom{2n}{n+1}$.',
      'For $n = 4$, compute $\\binom{8}{4}$ and divide by $5$.',
    ],
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Recall the Closed-Form Formula',
        latexContent: `$$C_n = \\frac{1}{n+1} \\binom{2n}{n}$$
$$\\text{For } n = 4: \\quad C_4 = \\frac{1}{5} \\binom{8}{4}$$`,
        explanation: 'Catalan numbers count balanced parenthesis sequences, binary trees, and monotonic paths staying below the main diagonal.',
        keyRule: 'Catalan number closed-form formula',
      },
      {
        stepNumber: 2,
        title: 'Compute the Central Binomial Coefficient',
        latexContent: `$$\\binom{8}{4} = \\frac{8 \\times 7 \\times 6 \\times 5}{4 \\times 3 \\times 2 \\times 1} = \\frac{1680}{24} = 70$$`,
        explanation: '$\\binom{8}{4} = 70$ represents the total number of monotonic lattice paths from $(0,0)$ to $(4,4)$ without diagonal restrictions.',
        keyRule: 'Combinations $\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$',
      },
      {
        stepNumber: 3,
        title: 'Apply André Reflection Principle Deduction',
        latexContent: `$$\\text{Bad paths crossing } y = x+1: \\quad \\binom{8}{4-1} = \\binom{8}{3} = \\frac{8 \\times 7 \\times 6}{3 \\times 2 \\times 1} = 56$$
$$C_4 = \\binom{8}{4} - \\binom{8}{3} = 70 - 56 = 14$$`,
        explanation: 'Reflecting the path segment after its first contact with $y = x+1$ bijectively pairs invalid paths with paths ending at $(3, 5)$.',
        keyRule: "André's reflection principle: $C_n = \\binom{2n}{n} - \\binom{2n}{n-1}$",
      },
      {
        stepNumber: 4,
        title: 'Direct Division Verification',
        latexContent: `$$C_4 = \\frac{70}{5} = 14$$`,
        explanation: 'Both derivations yield identical values: $C_0 = 1, C_1 = 1, C_2 = 2, C_3 = 5, C_4 = 14$.',
        keyRule: 'Direct quotient evaluation: $70 / 5 = 14$',
      },
    ],
  },

  // 10. Calculus: Multivariable Optimization with Lagrange Multipliers (Unlocks after 10 Hours)
  {
    id: 'calc_multivariable_lagrange',
    topicId: 'calculus',
    title: 'Extremum on an Ellipsoid via Lagrange Multipliers',
    difficulty: 'Advanced',
    pointsValue: 150,
    unlockHourOffset: 10,
    latexStatement: `Find the maximum value of the linear objective function $f(x, y, z) = 2x + y + 2z$ subject to the ellipsoidal boundary constraint:
$$x^2 + y^2 + z^2 = 9$$`,
    theoremContext: 'Lagrange Multiplier Theorem for Compact Hypersurfaces',
    targetSolution: `$$f_{\\max} = 9$$`,
    hints: [
      'Set up the Lagrange condition: $\\nabla f = \\lambda \\nabla g$ where $g(x, y, z) = x^2 + y^2 + z^2 - 9 = 0$.',
      'Compute partial derivatives $\\nabla f = (2, 1, 2)$ and $\\nabla g = (2x, 2y, 2z)$ and solve for $x, y, z$ in terms of $\\lambda$.',
    ],
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Compute Gradient Vectors',
        latexContent: `$$\\nabla f = \\begin{pmatrix} \\partial f/\\partial x \\\\ \\partial f/\\partial y \\\\ \\partial f/\\partial z \\end{pmatrix} = \\begin{pmatrix} 2 \\\\ 1 \\\\ 2 \\end{pmatrix}$$
$$\\nabla g = \\begin{pmatrix} 2x \\\\ 2y \\\\ 2z \\end{pmatrix}$$`,
        explanation: 'At a constrained extremum on a smooth manifold, the gradient of the objective function must be collinear with the gradient of the constraint.',
        keyRule: 'Lagrange collinearity criterion: $\\nabla f = \\lambda \\nabla g$',
      },
      {
        stepNumber: 2,
        title: 'Equate Gradients to Solve for Coordinates in Terms of Lambda',
        latexContent: `$$2 = 2\\lambda x \\implies x = \\frac{1}{\\lambda}$$
$$1 = 2\\lambda y \\implies y = \\frac{1}{2\\lambda}$$
$$2 = 2\\lambda z \\implies z = \\frac{1}{\\lambda}$$`,
        explanation: 'Since $\\nabla f \\ne \\mathbf{0}$, $\\lambda \\ne 0$. We express all three coordinates in terms of the multiplier $\\lambda$.',
        keyRule: 'Coordinate decoupling via parameter $\\lambda$',
      },
      {
        stepNumber: 3,
        title: 'Substitute into Spherical Constraint',
        latexContent: `$$x^2 + y^2 + z^2 = \\left(\\frac{1}{\\lambda}\\right)^2 + \\left(\\frac{1}{2\\lambda}\\right)^2 + \\left(\\frac{1}{\\lambda}\\right)^2 = 9$$
$$\\frac{1}{\\lambda^2} \\left( 1 + \\frac{1}{4} + 1 \\right) = \\frac{9}{4\\lambda^2} = 9 \\implies 4\\lambda^2 = 1 \\implies \\lambda = \\pm \\frac{1}{2}$$`,
        explanation: 'Solving for $\\lambda$ yields two critical points corresponding to global maximum and minimum on the compact sphere.',
        keyRule: 'Constraint boundary substitution',
      },
      {
        stepNumber: 4,
        title: 'Evaluate the Maximum at the Positive Multiplier',
        latexContent: `$$\\text{For maximum, take } \\lambda = \\frac{1}{2}: \\quad x = 2, \\quad y = 1, \\quad z = 2$$
$$x^2 + y^2 + z^2 = 2^2 + 1^2 + 2^2 = 4 + 1 + 4 = 9 \\quad \\checkmark$$
$$f(2, 1, 2) = 2(2) + 1 + 2(2) = 4 + 1 + 4 = 9$$`,
        explanation: 'By Cauchy-Schwarz, $\\mathbf{a} \\cdot \\mathbf{x} \\le \\|\\mathbf{a}\\|\\|\\mathbf{x}\\| = \\sqrt{4+1+4}\\sqrt{9} = 3 \\times 3 = 9$. Maximum is achieved.',
        keyRule: 'Cauchy-Schwarz equality bound confirmation',
      },
    ],
  },

  // 11. Linear Algebra: Cayley-Hamilton High Matrix Power (Unlocks after 15 Hours)
  {
    id: 'linalg_cayley_hamilton_powers',
    topicId: 'linear_algebra',
    title: 'Matrix Polynomial Evaluation via Cayley-Hamilton',
    difficulty: 'Advanced',
    pointsValue: 160,
    unlockHourOffset: 15,
    latexStatement: `Let $A = \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$.
Using the Cayley-Hamilton theorem or the binomial theorem for Jordan nilpotent splitting, determine the matrix power $A^{10}$.`,
    theoremContext: 'Cayley-Hamilton Theorem & Jordan Nilpotent Decompositions',
    targetSolution: `$$A^{10} = \\begin{pmatrix} 1 & 20 \\\\ 0 & 1 \\end{pmatrix}$$`,
    hints: [
      'Decompose $A = I + N$ where $N = \\begin{pmatrix} 0 & 2 \\\\ 0 & 0 \\end{pmatrix}$.',
      'Observe that $N^2 = \\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix}$ is strictly nilpotent.',
    ],
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Identify Nilpotent Decomposition',
        latexContent: `$$A = I + N, \\quad \\text{where } I = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}, \\quad N = \\begin{pmatrix} 0 & 2 \\\\ 0 & 0 \\end{pmatrix}$$`,
        explanation: 'Because $I$ and $N$ commute ($IN = NI = N$), the standard binomial expansion applies directly to matrix powers.',
        keyRule: 'Commuting matrix binomial expansion: $(I + N)^k = \\sum \\binom{k}{j} I^{k-j} N^j$',
      },
      {
        stepNumber: 2,
        title: 'Evaluate Nilpotency of Matrix N',
        latexContent: `$$N^2 = \\begin{pmatrix} 0 & 2 \\\\ 0 & 0 \\end{pmatrix} \\begin{pmatrix} 0 & 2 \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix} = \\mathbf{0}$$
$$N^k = \\mathbf{0} \\quad \\forall k \\ge 2$$`,
        explanation: 'The matrix $N$ has nilpotency index 2, so all higher powers vanish identically.',
        keyRule: 'Nilpotent operator property: $N^2 = \\mathbf{0}$',
      },
      {
        stepNumber: 3,
        title: 'Truncate Binomial Expansion for Exponent 10',
        latexContent: `$$A^{10} = (I + N)^{10} = I^{10} + 10 \\cdot I^9 N + \\sum_{k=2}^{10} \\binom{10}{k} N^k$$
$$A^{10} = I + 10N + \\mathbf{0} = I + 10N$$`,
        explanation: 'Only the zeroth and first degree terms survive in the expansion.',
        keyRule: 'Truncation of finite series',
      },
      {
        stepNumber: 4,
        title: 'Assemble the Explicit Matrix Product',
        latexContent: `$$A^{10} = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix} + 10 \\begin{pmatrix} 0 & 2 \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} 1 & 20 \\\\ 0 & 1 \\end{pmatrix}$$`,
        explanation: 'By induction, $A^n = \\begin{pmatrix} 1 & 2n \\\\ 0 & 1 \\end{pmatrix}$, confirming that for $n = 10$, $A^{10} = \\begin{pmatrix} 1 & 20 \\\\ 0 & 1 \\end{pmatrix}$.',
        keyRule: 'Inductive verification for Jordan blocks of eigenvalue 1',
      },
    ],
  },

  // 12. Number Theory: Euler Totient and High Modular Power (Unlocks after 15 Hours)
  {
    id: 'numtheory_euler_totient_coprime',
    topicId: 'number_theory',
    title: 'Euler Totient Theorem & High Power Modular Reduction',
    difficulty: 'Intermediate',
    pointsValue: 130,
    unlockHourOffset: 15,
    latexStatement: `Find the last two decimal digits of $7^{102}$, which corresponds to calculating:
$$7^{102} \\pmod{100}$$`,
    theoremContext: "Euler's Totient Theorem & Multiplicative Arithmetic Functions",
    targetSolution: `$$7^{102} \\equiv 49 \\pmod{100}$$`,
    hints: [
      'The last two digits are the remainder when divided by $100$.',
      'Compute $\\phi(100) = \\phi(2^2 \\cdot 5^2) = 100 \\left(1 - \\frac{1}{2}\\right)\\left(1 - \\frac{1}{5}\\right) = 40$.',
      'Since $\\gcd(7, 100) = 1$, $7^{\\phi(100)} \\equiv 7^{40} \\equiv 1 \\pmod{100}$.',
    ],
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Calculate Euler Totient of Modulus 100',
        latexContent: `$$100 = 2^2 \\times 5^2$$
$$\\phi(100) = 100 \\left(1 - \\frac{1}{2}\\right)\\left(1 - \\frac{1}{5}\\right) = 100 \\times \\frac{1}{2} \\times \\frac{4}{5} = 40$$`,
        explanation: 'Euler\'s totient counts numbers coprime to $100$ in $\\{1, \\dots, 100\\}$.',
        keyRule: "Euler's product formula for multiplicative arithmetic functions",
      },
      {
        stepNumber: 2,
        title: "Invoke Euler's Totient Theorem",
        latexContent: `$$\\gcd(7, 100) = 1 \\implies 7^{\\phi(100)} \\equiv 7^{40} \\equiv 1 \\pmod{100}$$`,
        explanation: 'Any integer coprime to $m$ raised to $\\phi(m)$ is congruent to $1$ modulo $m$.',
        keyRule: "Euler's theorem: $a^{\\phi(m)} \\equiv 1 \\pmod{m}$ if $\\gcd(a, m) = 1$",
      },
      {
        stepNumber: 3,
        title: 'Decompose the Exponent via Division with Remainder',
        latexContent: `$$102 = 40 \\times 2 + 22$$
$$7^{102} = (7^{40})^2 \\cdot 7^{22} \\equiv (1)^2 \\cdot 7^{22} \\equiv 7^{22} \\pmod{100}$$`,
        explanation: 'Powers of $40$ reduce to $1$, simplifying the exponent down to $22$. Notice further: $7^4 = 2401 \\equiv 1 \\pmod{100}$.',
        keyRule: 'Modular exponentiation reduction',
      },
      {
        stepNumber: 4,
        title: 'Evaluate Remainder using Carmicahel/Sub-cycle 7^4 = 1',
        latexContent: `$$7^2 = 49$$
$$7^4 = (49)^2 = 2401 \\equiv 1 \\pmod{100}$$
$$7^{102} = (7^4)^{25} \\cdot 7^2 \\equiv (1)^{25} \\cdot 49 \\equiv 49 \\pmod{100}$$`,
        explanation: 'The order of $7$ modulo $100$ is actually $4$, because $7^4 \\equiv 1 \\pmod{100}$. Hence $7^{102} = (7^4)^{25} \\cdot 49 \\equiv 49$. The last two digits are 49.',
        keyRule: 'Minimal multiplicative order modulo 100',
      },
    ],
  },
];

