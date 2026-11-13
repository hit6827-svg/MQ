import { Track, Exercise } from '../types/math.ts';

export const TRACKS: Track[] = [
  {
    id: 'track_ns',
    slug: 'numbers_structures',
    title: 'Numbers and Structures',
    subtitle: 'Induction, Linear Subspaces, Eigenstructures & Modular Algebras',
    description:
      'Build deductive mastery over discrete identities, finite-dimensional vector spaces, algebraic congruences, and matrix decompositions.',
    orderIndex: 1,
  },
  {
    id: 'track_av',
    slug: 'analysis_vectors',
    title: 'Analysis and Vectors',
    subtitle: 'Continuity, Integration, Inner-Product Geometry & Series Convergence',
    description:
      'Prove analytic inequalities, exact integral evaluations, orthogonal projections in Euclidean space, and multivariable extrema.',
    orderIndex: 2,
  },
];

export const CURATED_EXERCISES: Exercise[] = [
  // ============================================================================
  // TRACK 1: NUMBERS AND STRUCTURES — BASIC (1–3)
  // ============================================================================
  {
    id: 'ns_basic_induction_squares',
    trackId: 'numbers_structures',
    level: 'basic',
    orderInLevel: 1,
    title: 'Sum of Squares by Mathematical Induction',
    topicTag: 'Discrete Proof · Induction',
    defaultMinutes: 10,
    latexStatement: `Prove by mathematical induction that for every integer $n \\ge 1$:
$$\\sum_{k=1}^{n} k^2 = 1^2 + 2^2 + \\cdots + n^2 = \\frac{n(n+1)(2n+1)}{6}$$`,
    theoremContext: 'Principle of Mathematical Induction',
    targetSolution: `$$\\forall n \\in \\mathbb{Z}_{\\ge 1}, \\quad \\sum_{k=1}^{n} k^2 = \\frac{n(n+1)(2n+1)}{6}$$`,
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Verify the Base Case (n = 1)',
        latexContent: `$$\\text{LHS} = \\sum_{k=1}^{1} k^2 = 1^2 = 1, \\qquad \\text{RHS} = \\frac{1(1+1)(2(1)+1)}{6} = \\frac{1 \\cdot 2 \\cdot 3}{6} = 1$$`,
        explanation:
          'Both sides evaluate to $1$ when $n = 1$, establishing the base case $P(1)$.',
        keyRule: 'Induction base step $P(1)$',
      },
      {
        stepNumber: 2,
        title: 'State the Inductive Hypothesis',
        latexContent: `$$\\text{Assume for some fixed } m \\ge 1 \\text{ that } \\sum_{k=1}^{m} k^2 = \\frac{m(m+1)(2m+1)}{6}$$`,
        explanation:
          'We take $P(m)$ as true and must prove that $P(m+1)$ follows deductively.',
        keyRule: 'Inductive assumption $P(m)$',
      },
      {
        stepNumber: 3,
        title: 'Expand the (m + 1)-th Partial Sum',
        latexContent: `$$\\sum_{k=1}^{m+1} k^2 = \\left(\\sum_{k=1}^{m} k^2\\right) + (m+1)^2 = \\frac{m(m+1)(2m+1)}{6} + (m+1)^2$$
$$= \\frac{(m+1)\\big[m(2m+1) + 6(m+1)\\big]}{6} = \\frac{(m+1)(2m^2 + 7m + 6)}{6}$$`,
        explanation:
          'Factor out the common term $(m+1)/6$ and combine the remaining quadratic polynomial.',
        keyRule: 'Common factor extraction & algebraic combination',
      },
      {
        stepNumber: 4,
        title: 'Factor Quadratic to Match P(m + 1)',
        latexContent: `$$2m^2 + 7m + 6 = (m+2)(2m+3) = \\big((m+1)+1\\big)\\big(2(m+1)+1\\big)$$
$$\\implies \\sum_{k=1}^{m+1} k^2 = \\frac{(m+1)(m+2)(2m+3)}{6} \\quad \\blacksquare$$`,
        explanation:
          'The factored form matches the target formula with $n = m+1$. By induction, the identity holds for all $n \\ge 1$.',
        keyRule: 'Induction conclusion $P(m) \\implies P(m+1)$',
      },
    ],
  },
  {
    id: 'ns_basic_kernel_subspace',
    trackId: 'numbers_structures',
    level: 'basic',
    orderInLevel: 2,
    title: 'Kernel Subspace Proof & Null-Space Basis',
    topicTag: 'Linear Algebra · Subspaces',
    defaultMinutes: 15,
    latexStatement: `Let $T : V \\to W$ be a linear transformation between real vector spaces.
(a) Prove rigorously that $\\ker(T) = \\{\\mathbf{v} \\in V : T(\\mathbf{v}) = \\mathbf{0}_W\\}$ is a linear subspace of $V$.
(b) Find a basis for $\\ker(A)$ where $A = \\begin{pmatrix} 1 & -2 & 3 \\\\ 2 & -4 & 6 \\end{pmatrix}$.`,
    theoremContext: 'Subspace Criterion & Linearity Homogeneity',
    targetSolution: `$$\\ker(T) \\le V \\text{ by linearity}; \\quad \\ker(A) = \\operatorname{span}\\left\\{\\begin{pmatrix}2\\\\1\\\\0\\end{pmatrix}, \\begin{pmatrix}-3\\\\0\\\\1\\end{pmatrix}\\right\\}$$`,
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Prove Non-Emptiness (Zero Vector Containment)',
        latexContent: `$$T(\\mathbf{0}_V) = T(0 \\cdot \\mathbf{0}_V) = 0 \\cdot T(\\mathbf{0}_V) = \\mathbf{0}_W \\implies \\mathbf{0}_V \\in \\ker(T)$$`,
        explanation:
          'Any linear map sends the additive identity of $V$ to the additive identity of $W$, so $\\ker(T) \\ne \\emptyset$.',
        keyRule: 'Subspace Axiom 1: Zero vector containment',
      },
      {
        stepNumber: 2,
        title: 'Prove Closure Under Vector Addition and Scalar Multiplication',
        latexContent: `$$\\text{Let } \\mathbf{u}, \\mathbf{v} \\in \\ker(T) \\text{ and } c \\in \\mathbb{R}.$$
$$T(\\mathbf{u} + \\mathbf{v}) = T(\\mathbf{u}) + T(\\mathbf{v}) = \\mathbf{0}_W + \\mathbf{0}_W = \\mathbf{0}_W \\implies \\mathbf{u} + \\mathbf{v} \\in \\ker(T)$$
$$T(c\\mathbf{u}) = cT(\\mathbf{u}) = c\\mathbf{0}_W = \\mathbf{0}_W \\implies c\\mathbf{u} \\in \\ker(T)$$`,
        explanation:
          'By linearity of $T$, $\\ker(T)$ is closed under both addition and scaling, completing the subspace proof.',
        keyRule: 'Subspace Axioms 2 & 3: Linear closure',
      },
      {
        stepNumber: 3,
        title: 'Row-Reduce Matrix A to RREF',
        latexContent: `$$\\begin{pmatrix} 1 & -2 & 3 \\\\ 2 & -4 & 6 \\end{pmatrix} \\xrightarrow{R_2 \\leftarrow R_2 - 2R_1} \\begin{pmatrix} 1 & -2 & 3 \\\\ 0 & 0 & 0 \\end{pmatrix}$$
$$x_1 - 2x_2 + 3x_3 = 0 \\implies x_1 = 2x_2 - 3x_3$$`,
        explanation:
          'The second row is a scalar multiple of the first, leaving one pivot variable $x_1$ and two free variables $x_2, x_3$.',
        keyRule: 'Gaussian elimination & free parameters',
      },
      {
        stepNumber: 4,
        title: 'Parameterize and Extract Linearly Independent Basis',
        latexContent: `$$\\begin{pmatrix} x_1 \\\\ x_2 \\\\ x_3 \\end{pmatrix} = x_2 \\begin{pmatrix} 2 \\\\ 1 \\\\ 0 \\end{pmatrix} + x_3 \\begin{pmatrix} -3 \\\\ 0 \\\\ 1 \\end{pmatrix} \\implies \\mathcal{B}_{\\ker(A)} = \\left\\{\\begin{pmatrix}2\\\\1\\\\0\\end{pmatrix}, \\begin{pmatrix}-3\\\\0\\\\1\\end{pmatrix}\\right\\}$$`,
        explanation:
          'Setting $(x_2, x_3)$ equal to standard basis vectors $(1,0)$ and $(0,1)$ yields two linearly independent spanning vectors, matching $\\dim\\ker(A) = 3 - \\operatorname{rank}(A) = 2$.',
        keyRule: 'Rank-Nullity consistency: $\\dim\\ker(A) + \\operatorname{rank}(A) = 3$',
      },
    ],
  },
  {
    id: 'ns_basic_symmetric_eigen',
    trackId: 'numbers_structures',
    level: 'basic',
    orderInLevel: 3,
    title: 'Spectral Orthogonality of a Symmetric Matrix',
    topicTag: 'Linear Algebra · Eigenstructures',
    defaultMinutes: 15,
    latexStatement: `Consider the real symmetric matrix $A = \\begin{pmatrix} 4 & 2 \\\\ 2 & 1 \\end{pmatrix}$.
Determine both eigenvalues $\\lambda_1 > \\lambda_2$, find unit eigenvectors $\\mathbf{v}_1, \\mathbf{v}_2$, and verify explicitly that $\\langle \\mathbf{v}_1, \\mathbf{v}_2 \\rangle = 0$.`,
    theoremContext: 'Real Spectral Theorem ($A = A^T \\implies$ Orthogonal Eigenspaces)',
    targetSolution: `$$\\lambda_1 = 5, \\; \\mathbf{v}_1 = \\frac{1}{\\sqrt{5}}\\begin{pmatrix}2\\\\1\\end{pmatrix}; \\quad \\lambda_2 = 0, \\; \\mathbf{v}_2 = \\frac{1}{\\sqrt{5}}\\begin{pmatrix}-1\\\\2\\end{pmatrix}; \\quad \\mathbf{v}_1 \\cdot \\mathbf{v}_2 = 0$$`,
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Solve the Characteristic Equation',
        latexContent: `$$\\det(A - \\lambda I) = (4 - \\lambda)(1 - \\lambda) - 4 = \\lambda^2 - 5\\lambda = \\lambda(\\lambda - 5) = 0$$
$$\\implies \\lambda_1 = 5, \\quad \\lambda_2 = 0$$`,
        explanation:
          'The characteristic polynomial factors cleanly, confirming trace $\\lambda_1 + \\lambda_2 = 5$ and determinant $\\lambda_1\\lambda_2 = 0$.',
        keyRule: 'Characteristic determinant $\\det(A - \\lambda I) = 0$',
      },
      {
        stepNumber: 2,
        title: 'Find the Unit Eigenvector for λ₁ = 5',
        latexContent: `$$(A - 5I)\\mathbf{x} = \\begin{pmatrix} -1 & 2 \\\\ 2 & -4 \\end{pmatrix}\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\mathbf{0} \\implies x = 2y$$
$$\\mathbf{v}_1 = \\frac{1}{\\sqrt{2^2 + 1^2}}\\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix} = \\frac{1}{\\sqrt{5}}\\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix}$$`,
        explanation:
          'Every vector in $\\ker(A - 5I)$ is a multiple of $(2, 1)^T$; normalizing by $\\sqrt{5}$ produces unit vector $\\mathbf{v}_1$.',
        keyRule: 'Eigenspace $\\ker(A - \\lambda_1 I)$ normalization',
      },
      {
        stepNumber: 3,
        title: 'Find the Unit Eigenvector for λ₂ = 0',
        latexContent: `$$A\\mathbf{x} = \\begin{pmatrix} 4 & 2 \\\\ 2 & 1 \\end{pmatrix}\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\mathbf{0} \\implies 2x + y = 0 \\implies y = -2x$$
$$\\mathbf{v}_2 = \\frac{1}{\\sqrt{(-1)^2 + 2^2}}\\begin{pmatrix} -1 \\\\ 2 \\end{pmatrix} = \\frac{1}{\\sqrt{5}}\\begin{pmatrix} -1 \\\\ 2 \\end{pmatrix}$$`,
        explanation:
          'The null space $\\ker(A)$ is spanned by $(-1, 2)^T$, giving normalized eigenvector $\\mathbf{v}_2$.',
        keyRule: 'Null space eigenspace for $\\lambda_2 = 0$',
      },
      {
        stepNumber: 4,
        title: 'Verify Orthogonal Inner Product',
        latexContent: `$$\\langle \\mathbf{v}_1, \\mathbf{v}_2 \\rangle = \\frac{1}{5}\\big((2)(-1) + (1)(2)\\big) = \\frac{-2 + 2}{5} = 0 \\quad \\blacksquare$$`,
        explanation:
          'Distinct eigenvalues of a real symmetric matrix always have orthogonal eigenspaces, verified directly by the zero dot product.',
        keyRule: 'Symmetric orthogonality: $(\\lambda_1 - \\lambda_2)(\\mathbf{v}_1 \\cdot \\mathbf{v}_2) = 0$',
      },
    ],
  },

  // ============================================================================
  // TRACK 1: NUMBERS AND STRUCTURES — ADVANCED (4–6)
  // ============================================================================
  {
    id: 'ns_adv_modular_inverse',
    trackId: 'numbers_structures',
    level: 'advanced',
    orderInLevel: 1,
    title: 'Constructive Modular Inverse via Bézout Proof',
    topicTag: 'Modular Algebras · Number Theory',
    defaultMinutes: 20,
    latexStatement: `Prove that the congruence $17x \\equiv 5 \\pmod{29}$ admits a unique residue solution $x \\in \\{0, 1, \\dots, 28\\}$, and construct it rigorously via the Extended Euclidean Algorithm.`,
    theoremContext: "Bézout's Identity & Units in $\\mathbb{Z}/29\\mathbb{Z}$",
    targetSolution: `$$x = 2 \\quad (\\text{unique modulo } 29)$$`,
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Establish Invertibility via Euclidean Divisions',
        latexContent: `$$29 = 17 \\cdot 1 + 12$$
$$17 = 12 \\cdot 1 + 5$$
$$12 = 5 \\cdot 2 + 2$$
$$5 = 2 \\cdot 2 + 1$$`,
        explanation:
          'The last nonzero remainder is $1$, proving $\\gcd(17, 29) = 1$. Hence $17$ is a unit in $\\mathbb{Z}/29\\mathbb{Z}$ and multiplication by $17$ is a bijection.',
        keyRule: 'Coprime invertibility in $\\mathbb{Z}/p\\mathbb{Z}$',
      },
      {
        stepNumber: 2,
        title: 'Back-Substitute to Construct Bézout Coefficients',
        latexContent: `$$1 = 5 - 2(2) = 5 - 2(12 - 5\\cdot 2) = 5(5) - 2(12)$$
$$1 = 5(17 - 12) - 2(12) = 5(17) - 7(12)$$
$$1 = 5(17) - 7(29 - 17) = 12(17) - 7(29)$$`,
        explanation:
          'Unwinding the remainders writes $1$ explicitly as an integer linear combination $12 \\cdot 17 + (-7) \\cdot 29 = 1$.',
        keyRule: "Bézout's Identity: $au + bv = \\gcd(a, b)$",
      },
      {
        stepNumber: 3,
        title: 'Isolate the Multiplicative Inverse Modulo 29',
        latexContent: `$$12 \\cdot 17 \\equiv 1 \\pmod{29} \\implies 17^{-1} \\equiv 12 \\pmod{29}$$`,
        explanation:
          'Reducing Bézout’s identity modulo $29$ eliminates $-7(29)$, proving $12$ is the unique inverse of $17$ in $\\mathbb{Z}/29\\mathbb{Z}$.',
        keyRule: 'Uniqueness of inverse in a field',
      },
      {
        stepNumber: 4,
        title: 'Multiply Both Sides and Verify Canonical Residue',
        latexContent: `$$x \\equiv 12 \\cdot 5 = 60 \\equiv 2 \\pmod{29}$$
$$\\text{Check: } 17 \\cdot 2 = 34 = 29 + 5 \\equiv 5 \\pmod{29} \\quad \\blacksquare$$`,
        explanation:
          'Multiplying the congruence by $12$ isolates $x \\equiv 2 \\pmod{29}$, and substitution confirms $34 \\equiv 5 \\pmod{29}$.',
        keyRule: 'Canonical residue check in $\\{0, \\dots, 28\\}$',
      },
    ],
  },
  {
    id: 'ns_adv_crt_system',
    trackId: 'numbers_structures',
    level: 'advanced',
    orderInLevel: 2,
    title: 'Chinese Remainder Theorem Constructive Proof',
    topicTag: 'Algebraic Structures · CRT',
    defaultMinutes: 20,
    latexStatement: `Consider the simultaneous congruence system:
$$\\begin{cases} x \\equiv 2 \\pmod{3} \\\\ x \\equiv 3 \\pmod{5} \\\\ x \\equiv 2 \\pmod{7} \\end{cases}$$
Prove that a unique residue exists modulo $105$ and construct the smallest non-negative integer solution $x$.`,
    theoremContext: 'Chinese Remainder Theorem Ring Isomorphism',
    targetSolution: `$$x = 23 \\pmod{105}$$`,
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Prove Uniqueness and Define Partial Products',
        latexContent: `$$M = 3 \\times 5 \\times 7 = 105, \\quad \\gcd(3,5)=\\gcd(5,7)=\\gcd(3,7)=1$$
$$M_1 = \\frac{105}{3} = 35, \\quad M_2 = \\frac{105}{5} = 21, \\quad M_3 = \\frac{105}{7} = 15$$`,
        explanation:
          'If two solutions $x, x\'$ exist, $3, 5, 7$ each divide $x - x\'$; pairwise coprimality implies $105 \\mid (x - x\')$, proving uniqueness modulo $105$.',
        keyRule: 'Pairwise coprime divisibility & uniqueness',
      },
      {
        stepNumber: 2,
        title: 'Compute Orthogonal Idempotent Inverses',
        latexContent: `$$35y_1 \\equiv 2y_1 \\equiv 1 \\pmod{3} \\implies y_1 = 2$$
$$21y_2 \\equiv 1y_2 \\equiv 1 \\pmod{5} \\implies y_2 = 1$$
$$15y_3 \\equiv 1y_3 \\equiv 1 \\pmod{7} \\implies y_3 = 1$$`,
        explanation:
          'Each term $e_i = M_i y_i$ satisfies $e_i \\equiv 1 \\pmod{m_i}$ and $e_i \\equiv 0 \\pmod{m_j}$ for $j \\ne i$.',
        keyRule: 'Orthogonal idempotents in $\\mathbb{Z}/105\\mathbb{Z}$',
      },
      {
        stepNumber: 3,
        title: 'Form the Linear Superposition',
        latexContent: `$$x_0 = 2(35)(2) + 3(21)(1) + 2(15)(1) = 140 + 63 + 30 = 233$$`,
        explanation:
          'Because $e_i$ vanishes modulo the other moduli, $x_0$ simultaneously satisfies all three congruences.',
        keyRule: 'CRT constructive combination',
      },
      {
        stepNumber: 4,
        title: 'Reduce Modulo 105 and Verify',
        latexContent: `$$233 = 2 \\times 105 + 23 \\implies x = 23$$
$$23 \\equiv 2 \\pmod{3}, \\; 23 \\equiv 3 \\pmod{5}, \\; 23 \\equiv 2 \\pmod{7} \\quad \\blacksquare$$`,
        explanation:
          'Reducing $233$ modulo $105$ yields the minimal non-negative representative $x = 23$.',
        keyRule: 'Canonical remainder verification',
      },
    ],
  },
  {
    id: 'ns_adv_jordan_nilpotent',
    trackId: 'numbers_structures',
    level: 'advanced',
    orderInLevel: 3,
    title: 'Nilpotent Jordan Splitting & Inductive Matrix Power',
    topicTag: 'Matrix Algebras · Jordan Forms',
    defaultMinutes: 25,
    latexStatement: `Let $A = \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$.
Prove using the decomposition $A = I + N$ and nilpotency of $N$ that for every integer $n \\ge 1$, $A^n = \\begin{pmatrix} 1 & 2n \\\\ 0 & 1 \\end{pmatrix}$, and deduce $A^{10}$.`,
    theoremContext: 'Commuting Matrix Binomial Theorem & Nilpotent Operators',
    targetSolution: `$$A^n = \\begin{pmatrix} 1 & 2n \\\\ 0 & 1 \\end{pmatrix}, \\qquad A^{10} = \\begin{pmatrix} 1 & 20 \\\\ 0 & 1 \\end{pmatrix}$$`,
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Establish Commuting Splitting A = I + N',
        latexContent: `$$A = I + N, \\quad I = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}, \\quad N = \\begin{pmatrix} 0 & 2 \\\\ 0 & 0 \\end{pmatrix}$$
$$I N = N I = N$$`,
        explanation:
          'Because the identity matrix commutes with every $2 \\times 2$ matrix, the standard binomial theorem holds in $\\mathbb{R}^{2\\times 2}$ for $(I + N)^n$.',
        keyRule: 'Commuting matrix binomial validity',
      },
      {
        stepNumber: 2,
        title: 'Prove Nilpotency Index Two',
        latexContent: `$$N^2 = \\begin{pmatrix} 0 & 2 \\\\ 0 & 0 \\end{pmatrix}\\begin{pmatrix} 0 & 2 \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix} = \\mathbf{0}$$
$$\\implies N^k = \\mathbf{0} \\quad \\forall k \\ge 2$$`,
        explanation:
          'Direct matrix multiplication shows $N^2 = \\mathbf{0}$, and multiplying further by $N$ gives $N^k = \\mathbf{0}$ for all $k \\ge 2$.',
        keyRule: 'Nilpotency index $N^2 = \\mathbf{0}$',
      },
      {
        stepNumber: 3,
        title: 'Truncate the Matrix Binomial Sum',
        latexContent: `$$A^n = (I + N)^n = \\sum_{k=0}^{n} \\binom{n}{k} I^{n-k} N^k = I + nN + \\sum_{k=2}^{n} \\binom{n}{k} \\mathbf{0} = I + nN$$`,
        explanation:
          'Every binomial term with $k \\ge 2$ vanishes identically, collapsing the entire expansion to two terms.',
        keyRule: 'Finite polynomial truncation',
      },
      {
        stepNumber: 4,
        title: 'Evaluate General Form and Specialize n = 10',
        latexContent: `$$A^n = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix} + n\\begin{pmatrix} 0 & 2 \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} 1 & 2n \\\\ 0 & 1 \\end{pmatrix}$$
$$A^{10} = \\begin{pmatrix} 1 & 20 \\\\ 0 & 1 \\end{pmatrix} \\quad \\blacksquare$$`,
        explanation:
          'Substituting $n = 10$ gives $A^{10}$ immediately without repeated matrix multiplication.',
        keyRule: 'Jordan block closed-form exponentiation',
      },
    ],
  },

  // ============================================================================
  // TRACK 2: ANALYSIS AND VECTORS — BASIC (7–9)
  // ============================================================================
  {
    id: 'av_basic_mvt_lipschitz',
    trackId: 'analysis_vectors',
    level: 'basic',
    orderInLevel: 1,
    title: 'Lipschitz Bound of Sine via Mean Value Theorem',
    topicTag: 'Calculus · Mean Value Theorem',
    defaultMinutes: 10,
    latexStatement: `Using the Mean Value Theorem, prove that for all real numbers $a, b \\in \\mathbb{R}$:
$$|\\sin b - \\sin a| \\le |b - a|$$`,
    theoremContext: 'Lagrange Mean Value Theorem & Bounded Derivative Criterion',
    targetSolution: `$$\\forall a, b \\in \\mathbb{R}, \\quad |\\sin b - \\sin a| \\le |b - a|$$`,
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Handle the Trivial Case a = b',
        latexContent: `$$\\text{If } a = b: \\quad |\\sin b - \\sin a| = 0 \\le 0 = |b - a|$$`,
        explanation:
          'When $a = b$, both sides equal zero and the inequality holds trivially. Now assume without loss of generality that $a < b$.',
        keyRule: 'Case split & WLOG symmetry',
      },
      {
        stepNumber: 2,
        title: 'Verify Mean Value Theorem Hypotheses',
        latexContent: `$$f(x) = \\sin x \\text{ is continuous on } [a, b] \\text{ and differentiable on } (a, b), \\quad f'(x) = \\cos x$$`,
        explanation:
          'Because $\\sin x$ is everywhere differentiable on $\\mathbb{R}$, both continuity on $[a,b]$ and differentiability on $(a,b)$ are satisfied.',
        keyRule: 'MVT regularity hypotheses',
      },
      {
        stepNumber: 3,
        title: 'Apply Lagrange Mean Value Theorem',
        latexContent: `$$\\exists c \\in (a, b) \\text{ such that } \\frac{\\sin b - \\sin a}{b - a} = f'(c) = \\cos c$$`,
        explanation:
          'The secant slope over $[a,b]$ equals the instantaneous tangent slope $\\cos c$ at some interior point $c$.',
        keyRule: 'Mean Value Theorem identity',
      },
      {
        stepNumber: 4,
        title: 'Take Absolute Values and Bound |cos c| ≤ 1',
        latexContent: `$$|\\sin b - \\sin a| = |\\cos c| \\cdot |b - a| \\le 1 \\cdot |b - a| = |b - a| \\quad \\blacksquare$$`,
        explanation:
          'Since $|\\cos c| \\le 1$ for every $c \\in \\mathbb{R}$, multiplying both sides by $|b - a|$ proves the global $1$-Lipschitz bound.',
        keyRule: 'Trigonometric bound $|\\cos c| \\le 1$',
      },
    ],
  },
  {
    id: 'av_basic_cyclic_ibp',
    trackId: 'analysis_vectors',
    level: 'basic',
    orderInLevel: 2,
    title: 'Cyclic Integration by Parts Proof',
    topicTag: 'Calculus · Antiderivatives',
    defaultMinutes: 15,
    latexStatement: `Derive and verify by differentiation the closed-form antiderivative:
$$J = \\int e^{2x} \\cos(3x) \\, dx$$`,
    theoremContext: 'Integration by Parts & Fundamental Theorem of Calculus',
    targetSolution: `$$J = \\frac{e^{2x}}{13}\\big(2\\cos(3x) + 3\\sin(3x)\\big) + C$$`,
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Apply First Integration by Parts',
        latexContent: `$$u = \\cos(3x) \\implies du = -3\\sin(3x)\\,dx; \\qquad dv = e^{2x}\\,dx \\implies v = \\frac{1}{2}e^{2x}$$
$$J = \\frac{1}{2}e^{2x}\\cos(3x) + \\frac{3}{2} \\int e^{2x}\\sin(3x)\\,dx$$`,
        explanation:
          'Differentiating the trigonometric factor and integrating the exponential preserves the form of the integrand.',
        keyRule: 'Integration by parts: $\\int u\\,dv = uv - \\int v\\,du$',
      },
      {
        stepNumber: 2,
        title: 'Apply Second Integration by Parts to Recover J',
        latexContent: `$$\\int e^{2x}\\sin(3x)\\,dx = \\frac{1}{2}e^{2x}\\sin(3x) - \\frac{3}{2} \\int e^{2x}\\cos(3x)\\,dx = \\frac{1}{2}e^{2x}\\sin(3x) - \\frac{3}{2}J$$`,
        explanation:
          'Applying integration by parts a second time in the same direction brings back the original integral $J$.',
        keyRule: 'Consistent cyclic substitution',
      },
      {
        stepNumber: 3,
        title: 'Solve the Linear Equation for J',
        latexContent: `$$J = \\frac{1}{2}e^{2x}\\cos(3x) + \\frac{3}{4}e^{2x}\\sin(3x) - \\frac{9}{4}J$$
$$\\frac{13}{4}J = \\frac{e^{2x}}{4}\\big(2\\cos(3x) + 3\\sin(3x)\\big) \\implies J = \\frac{e^{2x}}{13}\\big(2\\cos(3x) + 3\\sin(3x)\\big) + C$$`,
        explanation:
          'Combining the $J$ terms gives coefficient $13/4$, and multiplying by $4/13$ isolates the antiderivative.',
        keyRule: 'Algebraic isolation',
      },
      {
        stepNumber: 4,
        title: 'Verify by Product-Rule Differentiation',
        latexContent: `$$\\frac{d}{dx}\\left[\\frac{e^{2x}}{13}(2\\cos 3x + 3\\sin 3x)\\right] = \\frac{e^{2x}}{13}\\big[(4\\cos 3x + 6\\sin 3x) + (-6\\sin 3x + 9\\cos 3x)\\big] = e^{2x}\\cos(3x) \\quad \\blacksquare$$`,
        explanation:
          'Differentiating confirms exact cancellation of the sine terms and recovery of $e^{2x}\\cos(3x)$.',
        keyRule: 'Product-rule verification',
      },
    ],
  },
  {
    id: 'av_basic_gram_schmidt',
    trackId: 'analysis_vectors',
    level: 'basic',
    orderInLevel: 3,
    title: 'Orthonormal Vector Projection & Gram-Schmidt Proof',
    topicTag: 'Vectors · Inner-Product Geometry',
    defaultMinutes: 15,
    latexStatement: `In $\\mathbb{R}^3$ equipped with the standard Euclidean inner product, let:
$$\\mathbf{v}_1 = \\begin{pmatrix} 1 \\\\ 1 \\\\ 0 \\end{pmatrix}, \\quad \\mathbf{v}_2 = \\begin{pmatrix} 1 \\\\ 0 \\\\ 1 \\end{pmatrix}$$
Set $\\mathbf{u}_1 = \\mathbf{v}_1$ and $\\mathbf{u}_2 = \\mathbf{v}_2 - \\operatorname{proj}_{\\mathbf{u}_1}(\\mathbf{v}_2)$. Prove orthogonality $\\langle \\mathbf{u}_2, \\mathbf{u}_1 \\rangle = 0$ and compute the orthonormal pair $(\\mathbf{e}_1, \\mathbf{e}_2)$.`,
    theoremContext: 'Orthogonal Projection & Gram-Schmidt Theorem',
    targetSolution: `$$\\mathbf{e}_1 = \\frac{1}{\\sqrt{2}}\\begin{pmatrix}1\\\\1\\\\0\\end{pmatrix}, \\quad \\mathbf{e}_2 = \\frac{1}{\\sqrt{6}}\\begin{pmatrix}1\\\\-1\\\\2\\end{pmatrix}$$`,
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Prove General Orthogonality of Projection Residual',
        latexContent: `$$\\left\\langle \\mathbf{v}_2 - \\frac{\\langle \\mathbf{v}_2, \\mathbf{u}_1 \\rangle}{\\|\\mathbf{u}_1\\|^2}\\mathbf{u}_1,\\, \\mathbf{u}_1 \\right\\rangle = \\langle \\mathbf{v}_2, \\mathbf{u}_1 \\rangle - \\frac{\\langle \\mathbf{v}_2, \\mathbf{u}_1 \\rangle}{\\|\\mathbf{u}_1\\|^2} \\langle \\mathbf{u}_1, \\mathbf{u}_1 \\rangle = 0$$`,
        explanation:
          'By bilinearity of the dot product and $\\langle \\mathbf{u}_1, \\mathbf{u}_1 \\rangle = \\|\\mathbf{u}_1\\|^2$, the subtracted projection makes $\\mathbf{u}_2 \\perp \\mathbf{u}_1$ identically.',
        keyRule: 'Bilinearity of Euclidean inner product',
      },
      {
        stepNumber: 2,
        title: 'Compute Parallel Projection Component',
        latexContent: `$$\\|\\mathbf{u}_1\\|^2 = 1^2 + 1^2 + 0^2 = 2, \\quad \\langle \\mathbf{v}_2, \\mathbf{u}_1 \\rangle = 1$$
$$\\operatorname{proj}_{\\mathbf{u}_1}(\\mathbf{v}_2) = \\frac{1}{2}\\begin{pmatrix}1\\\\1\\\\0\\end{pmatrix} = \\begin{pmatrix}1/2\\\\1/2\\\\0\\end{pmatrix}$$`,
        explanation:
          'We calculate the inner product and squared norm of $\\mathbf{u}_1$ to determine the projection scalar $1/2$.',
        keyRule: 'Projection vector formula',
      },
      {
        stepNumber: 3,
        title: 'Subtract to Obtain u₂ and Confirm Dot Product',
        latexContent: `$$\\mathbf{u}_2 = \\begin{pmatrix}1\\\\0\\\\1\\end{pmatrix} - \\begin{pmatrix}1/2\\\\1/2\\\\0\\end{pmatrix} = \\begin{pmatrix}1/2\\\\-1/2\\\\1\\end{pmatrix}$$
$$\\langle \\mathbf{u}_2, \\mathbf{u}_1 \\rangle = \\frac{1}{2}(1) - \\frac{1}{2}(1) + 1(0) = 0$$`,
        explanation:
          'The dot product vanishes as proved in Step 1.',
        keyRule: 'Residual orthogonality check',
      },
      {
        stepNumber: 4,
        title: 'Normalize to Orthonormal Vectors e₁, e₂',
        latexContent: `$$\\mathbf{e}_1 = \\frac{\\mathbf{u}_1}{\\sqrt{2}} = \\frac{1}{\\sqrt{2}}\\begin{pmatrix}1\\\\1\\\\0\\end{pmatrix}, \\quad \\|\\mathbf{u}_2\\| = \\sqrt{\\frac{1}{4}+\\frac{1}{4}+1} = \\frac{\\sqrt{6}}{2}$$
$$\\mathbf{e}_2 = \\frac{\\mathbf{u}_2}{\\|\\mathbf{u}_2\\|} = \\frac{1}{\\sqrt{6}}\\begin{pmatrix}1\\\\-1\\\\2\\end{pmatrix} \\quad \\blacksquare$$`,
        explanation:
          'Dividing each orthogonal vector by its Euclidean norm produces unit vectors satisfying $\\langle \\mathbf{e}_i, \\mathbf{e}_j \\rangle = \\delta_{ij}$.',
        keyRule: 'Orthonormal basis condition $\\langle \\mathbf{e}_i, \\mathbf{e}_j \\rangle = \\delta_{ij}$',
      },
    ],
  },

  // ============================================================================
  // TRACK 2: ANALYSIS AND VECTORS — ADVANCED (10–12)
  // ============================================================================
  {
    id: 'av_adv_gaussian_integral',
    trackId: 'analysis_vectors',
    level: 'advanced',
    orderInLevel: 1,
    title: 'Proof of the Gaussian Integral via Polar Reduction',
    topicTag: 'Improper Integrals · Fubini-Tonelli',
    defaultMinutes: 20,
    latexStatement: `Prove rigorously that the Gaussian improper integral converges to $\\sqrt{\\pi}$:
$$I = \\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi}$$`,
    theoremContext: 'Fubini-Tonelli Theorem & Polar Coordinate Jacobian',
    targetSolution: `$$I = \\sqrt{\\pi}$$`,
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Justify Convergence & Square as Double Integral',
        latexContent: `$$e^{-x^2} \\le e^{-|x|} \\text{ for } |x| \\ge 1 \\implies I < \\infty$$
$$I^2 = \\left(\\int_{-\\infty}^{\\infty} e^{-x^2}dx\\right)\\left(\\int_{-\\infty}^{\\infty} e^{-y^2}dy\\right) = \\iint_{\\mathbb{R}^2} e^{-(x^2+y^2)}\\,dx\\,dy$$`,
        explanation:
          'Comparing against $e^{-|x|}$ establishes absolute integrability, allowing Tonelli’s theorem for positive functions to merge the product into an integral over $\\mathbb{R}^2$.',
        keyRule: 'Comparison test & Tonelli product theorem',
      },
      {
        stepNumber: 2,
        title: 'Transform to Polar Coordinates',
        latexContent: `$$x = r\\cos\\theta, \\; y = r\\sin\\theta \\implies \\det\\frac{\\partial(x,y)}{\\partial(r,\\theta)} = r$$
$$I^2 = \\int_0^{2\\pi} d\\theta \\int_0^\\infty r e^{-r^2}\\,dr$$`,
        explanation:
          'The polar diffeomorphism maps $(0, \\infty) \\times (0, 2\\pi)$ bijectively onto $\\mathbb{R}^2$ up to a ray of measure zero, introducing Jacobian factor $r$.',
        keyRule: 'Planar Jacobian $dx\\,dy = r\\,dr\\,d\\theta$',
      },
      {
        stepNumber: 3,
        title: 'Evaluate the Radial Improper Integral',
        latexContent: `$$\\int_0^R r e^{-r^2}\\,dr = \\left[-\\frac{1}{2}e^{-r^2}\\right]_0^R = \\frac{1}{2}\\left(1 - e^{-R^2}\\right) \\xrightarrow{R\\to\\infty} \\frac{1}{2}$$`,
        explanation:
          'Taking the limit $R \\to \\infty$ evaluates the radial integral cleanly via the substitution $u = r^2$.',
        keyRule: 'Exact antiderivative & upper limit',
      },
      {
        stepNumber: 4,
        title: 'Multiply Angular Factor and Take Positive Root',
        latexContent: `$$I^2 = 2\\pi \\cdot \\frac{1}{2} = \\pi; \\quad \\text{since } e^{-x^2} > 0, \\; I > 0 \\implies I = \\sqrt{\\pi} \\quad \\blacksquare$$`,
        explanation:
          'Positivity of the integrand guarantees $I > 0$, isolating the positive root $\\sqrt{\\pi}$.',
        keyRule: 'Strict positivity of integral',
      },
    ],
  },
  {
    id: 'av_adv_lagrange_sphere',
    trackId: 'analysis_vectors',
    level: 'advanced',
    orderInLevel: 2,
    title: 'Constrained Extremum Proof via Lagrange & Cauchy-Schwarz',
    topicTag: 'Multivariable Analysis · Optimization',
    defaultMinutes: 20,
    latexStatement: `Prove that the maximum of $f(x, y, z) = 2x + y + 2z$ on the compact sphere $S = \\{(x,y,z) \\in \\mathbb{R}^3 : x^2 + y^2 + z^2 = 9\\}$ is $9$, using both Lagrange multipliers and a Cauchy-Schwarz confirmation.`,
    theoremContext: 'Lagrange Multiplier Theorem on Compact Manifolds',
    targetSolution: `$$\\max_{x^2+y^2+z^2=9} f(x, y, z) = f(2, 1, 2) = 9$$`,
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Verify Compactness & Gradient Collinearity',
        latexContent: `$$g(x,y,z) = x^2 + y^2 + z^2 - 9 = 0, \\quad \\nabla g = (2x, 2y, 2z) \\ne \\mathbf{0} \\text{ on } S$$
$$\\nabla f = \\lambda \\nabla g \\implies \\begin{pmatrix} 2 \\\\ 1 \\\\ 2 \\end{pmatrix} = \\lambda \\begin{pmatrix} 2x \\\\ 2y \\\\ 2z \\end{pmatrix}$$`,
        explanation:
          'Because $S$ is closed and bounded (compact) and $f$ is continuous, a global maximum exists. Regularity $\\nabla g \\ne \\mathbf{0}$ ensures the Lagrange condition applies.',
        keyRule: 'Extreme Value Theorem & Lagrange collinearity',
      },
      {
        stepNumber: 2,
        title: 'Solve Critical Coordinates in Terms of λ',
        latexContent: `$$\\lambda \\ne 0, \\quad x = \\frac{1}{\\lambda}, \\quad y = \\frac{1}{2\\lambda}, \\quad z = \\frac{1}{\\lambda}$$`,
        explanation:
          'Matching components expresses the critical point solely in terms of $\\lambda$.',
        keyRule: 'Componentwise gradient match',
      },
      {
        stepNumber: 3,
        title: 'Substitute into Constraint Sphere',
        latexContent: `$$\\frac{1}{\\lambda^2} + \\frac{1}{4\\lambda^2} + \\frac{1}{\\lambda^2} = \\frac{9}{4\\lambda^2} = 9 \\implies \\lambda = \\pm \\frac{1}{2}$$
$$f(2, 1, 2) = 9, \\quad f(-2, -1, -2) = -9$$`,
        explanation:
          'Comparing the values at the two critical points identifies $+9$ as the maximum and $-9$ as the minimum.',
        keyRule: 'Compact manifold candidate comparison',
      },
      {
        stepNumber: 4,
        title: 'Confirm Independently with Cauchy-Schwarz',
        latexContent: `$$f(x,y,z) = (2,1,2)\\cdot(x,y,z) \\le \\|(2,1,2)\\| \\|(x,y,z)\\| = \\sqrt{9}\\cdot\\sqrt{9} = 9 \\quad \\blacksquare$$`,
        explanation:
          'Cauchy-Schwarz proves $f \\le 9$ globally on $S$, with equality realized at $(2,1,2)$.',
        keyRule: 'Cauchy-Schwarz upper bound',
      },
    ],
  },
  {
    id: 'av_adv_basel_series',
    trackId: 'analysis_vectors',
    level: 'advanced',
    orderInLevel: 3,
    title: "Euler's Proof of the Basel Series ζ(2) = π²/6",
    topicTag: 'Infinite Series · Analytic Expansions',
    defaultMinutes: 25,
    latexStatement: `Prove Euler's closed-form summation for the reciprocal squares:
$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$`,
    theoremContext: "Maclaurin Series & Weierstrass Product Factorization of sin(x)/x",
    targetSolution: `$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$`,
    solvingSequences: [
      {
        stepNumber: 1,
        title: 'Expand sinc(x) as a Maclaurin Series',
        latexContent: `$$\\sin x = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\cdots \\implies \\frac{\\sin x}{x} = 1 - \\frac{x^2}{6} + \\frac{x^4}{120} - \\cdots$$`,
        explanation:
          'Dividing the convergent Taylor series of $\\sin x$ by $x$ reveals a quadratic coefficient of $-1/6$.',
        keyRule: 'Analytic Maclaurin expansion',
      },
      {
        stepNumber: 2,
        title: 'Represent sinc(x) by Its Root Product',
        latexContent: `$$\\frac{\\sin x}{x} = \\prod_{n=1}^{\\infty} \\left(1 - \\frac{x^2}{n^2\\pi^2}\\right)$$`,
        explanation:
          'Since $\\frac{\\sin x}{x} = 1$ at $x = 0$ and vanishes precisely at $x = \\pm n\\pi$ ($n \\ge 1$), Weierstrass factorization yields the canonical infinite product.',
        keyRule: 'Weierstrass-Euler infinite product',
      },
      {
        stepNumber: 3,
        title: 'Equate Coefficients of x²',
        latexContent: `$$\\text{Coefficient of } x^2 = -\\sum_{n=1}^{\\infty} \\frac{1}{n^2\\pi^2} = -\\frac{1}{\\pi^2}\\sum_{n=1}^{\\infty} \\frac{1}{n^2}$$
$$-\\frac{1}{\\pi^2}\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = -\\frac{1}{6}$$`,
        explanation:
          'Expanding the product collects every pair choosing $-x^2/(n^2\\pi^2)$ from one factor and $1$ from all others.',
        keyRule: 'Uniqueness of power series coefficients',
      },
      {
        stepNumber: 4,
        title: 'Conclude Exact Value of ζ(2)',
        latexContent: `$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6} \\quad \\blacksquare$$`,
        explanation:
          'Multiplying both sides by $-\\pi^2$ establishes the exact convergence value $\\pi^2/6$.',
        keyRule: 'Basel identity $\\zeta(2) = \\pi^2/6$',
      },
    ],
  },
];
