
export const CONFIG = {
  PARTICLE_COUNT: 70, 
  NOISE_RATE: 0.12,
  ENERGY_PER_ROUND: 2.0,
  
  // Brownian Motion
  WANDER_INTENSITY: 9,    
  DRIFT_INTENSITY: 2.5,     
  STRUCTURE_VIBRATION: 0.4, 
  
  // Action Costs (Bases)
  REPAIR_COST: 1,      
  ORGANIZE_COST: 2.5,  
  EVOLVE_COST: 6.0,    
  COPY_COST: 5,        
  
  REPAIR_EFFECT: 4,    
  PATTERN_BONUS_ENERGY: 2.2, 
  COPY_ERROR_RATE: 0.12,
  MUTATION_RATE: 0.3,
  
  MAX_ROUNDS_PER_PHASE: 20,
  MIN_ROUNDS_TO_ADVANCE: 5,
  
  // Geometry
  TRI_RADIUS: 2.5, 
  GRID_COLS: 5,
  GRID_ROWS: 4,
  
  // Nicho de Baja Entropía
  BIO_WELL: {
    cx: 28, 
    cy: 50, 
    r: 25   
  },

  // Evolution Multipliers
  COMPLEXITY: {
    TRI: { pts: 3, bonus: 1, dissipation: 15 },
    SQR: { pts: 4, bonus: 2.5, dissipation: 45 },
    PNT: { pts: 5, bonus: 5.5, dissipation: 110 }
  },

  // Phase 4
  PHASE4_COPY_COST_BASE: 1.2,     
  PHASE4_ATTRACTION_RADIUS: 48,    
  PHASE4_CONVERSION_LIMIT: 8,      
  PHASE4_ENTROPY_PER_PATTERN: 50,  
  PHASE4_ENERGY_BONUS: 4.5,        
};

export const PHASE_COLORS = [
  '#f59e0b',
  '#ec4899',
  '#10b981',
  '#8b5cf6',
  '#06b6d4',
];

export const TRANSLATIONS = {
  es: {
    title: "Orden, Entropía y Persistencia",
    subtitle: "Un viaje interactivo desde el colapso inevitable de un sistema cerrado hasta la emergencia de estructuras auto-mantenidas.",
    guideTitle: "Guía del Investigador",
    lifelessUniverse: "Universo sin Vida",
    withLifeUniverse: "Universo con Vida",
    lifelessDesc: "Observa cómo la entropía degrada el orden natural sin agentes que lo mantengan. Un sistema puramente pasivo.",
    withLifeDesc: "Introduce flujos de energía y organismos capaces de mantener orden local a cambio de disipar calor global.",
    startSelect: "Selecciona el tipo de universo para iniciar",
    readGuide: "Leer Guía del Investigador",
    quote: "La vida no existe a pesar de la entropía; existe porque la entropía lo permite.",
    cycle: "Ciclo",
    of: "de",
    localOrder: "Orden Local",
    globalEntropy: "Entropía Global",
    autoMode: "AUTO-DISIPACIÓN",
    runCycle: "EJECUTAR CICLO",
    collect: "RECOLECTAR",
    structure: "ESTRUCTURAR",
    clone: "CLONAR",
    mutate: "MUTAR",
    energyFlow: "Flujo de Energía",
    nextPhase: "SIGUIENTE FASE",
    results: "RESULTADOS",
    autoStrategy: "ESTRATEGIA TERMODINÁMICA VORAZ",
    noAgents: "SIN AGENTES ACTIVOS (SISTEMA PASIVO)",
    objectiveTitle: "Tu Objetivo Actual",
    objectiveDesc: "Maximiza la Entropía Global creando estructuras complejas.",
    machineStatus: "Estado de la Máquina",
    dissipationEngines: "Motores de Disipación",
    formsDesc: "Las formas complejas queman el combustible universal mucho más rápido.",
    logTitle: "Bitácora de Campo",
    help: "Ayuda",
    triangles: "Triángulos",
    squares: "Cuadrados",
    pentagons: "Pentágonos",
    lawTitle: "Ley Termodinámica",
    lawDesc: '"El universo tiende al desorden. La vida no detiene este proceso; lo organiza para que ocurra más rápido."',
    balanceTitle: "Balance Final",
    balanceSubtitle: "Resumen de la evolución disipativa",
    maxOrder: "Orden Max",
    entropy: "Entropía",
    analysisTitle: "Análisis Temporal",
    metricsConsolidated: "Métricas Consolidadas",
    totalDissipation: "Disipación Total del Universo",
    degradationRate: "Tasa de Degradación por Ciclo",
    accumulatedOrder: "Acumulación Local de Orden",
    reflectionQuote: '"La vida no es una excepción a la entropía, es su catalizador más eficiente."',
    reflectionDesc: "Has demostrado que mediante el consumo de energía y la creación de patrones (mutación y persistencia), el sistema puede mantener focos de orden local a cambio de una disipación global masiva. Este es el principio rector de la termodinámica de la vida.",
    newSimulation: "Nueva Simulación",
    understand: "Entendido",
    phases: {
      1: {
        title: "Fase 1: Entropía Pasiva",
        desc: "Sistema cerrado. El orden se degrada sin remedio en el nicho de estabilidad.",
        rule: "Solo observa. Sin energía, el universo bosteza hacia el desorden.",
        log: "La entropía pasiva es ineficiente. Necesitamos un motor de orden para acelerarla."
      },
      2: {
        title: "Fase 2: Flujo y Reparación",
        desc: "Sistema abierto. Introduces energía para forzar partículas al nicho de estabilidad.",
        rule: "Gasta energía para ordenar. Nota que 'limpiar' tu casa calienta el universo.",
        log: "Al forzar el orden, estamos 'comprando' entropía global con energía externa."
      },
      3: {
        title: "Fase 3: La Máquina Biológica",
        desc: "Estructuras complejas se anclan en el núcleo ordenado para capturar energía.",
        rule: "Estructura patrones. Son motores que devoran energía para no morir.",
        log: "¡Éxito! La organización local permite quemar energía de forma sostenida."
      },
      4: {
        title: "Fase 4: Hiperciclos de Mutación",
        desc: "Evolución forzada. Los patrones ahora pueden mutar a formas más complejas.",
        rule: "Muta tus estructuras. Un pentágono es un motor térmico devastador.",
        log: "La mutación compleja es el clímax térmico: estructuras que consumen todo a su alrededor."
      }
    }
  },
  en: {
    title: "Order, Entropy, and Persistence",
    subtitle: "An interactive journey from the inevitable collapse of a closed system to the emergence of self-sustaining structures.",
    guideTitle: "Researcher's Guide",
    lifelessUniverse: "Lifeless Universe",
    withLifeUniverse: "Universe with Life",
    lifelessDesc: "Observe how entropy degrades natural order without agents to maintain it. A purely passive system.",
    withLifeDesc: "Introduce energy flows and organisms capable of maintaining local order at the cost of dissipating global heat.",
    startSelect: "Select the type of universe to begin",
    readGuide: "Read Researcher's Guide",
    quote: "Life does not exist despite entropy; it exists because entropy allows it.",
    cycle: "Cycle",
    of: "of",
    localOrder: "Local Order",
    globalEntropy: "Global Entropy",
    autoMode: "AUTO-DISSIPATION",
    runCycle: "EXECUTE CYCLE",
    collect: "COLLECT",
    structure: "STRUCTURE",
    clone: "CLONE",
    mutate: "MUTATE",
    energyFlow: "Energy Flow",
    nextPhase: "NEXT PHASE",
    results: "RESULTS",
    autoStrategy: "VORACIOUS THERMODYNAMIC STRATEGY",
    noAgents: "NO ACTIVE AGENTS (PASSIVE SYSTEM)",
    objectiveTitle: "Your Current Objective",
    objectiveDesc: "Maximize Global Entropy by creating complex structures.",
    machineStatus: "Machine Status",
    dissipationEngines: "Dissipation Engines",
    formsDesc: "Complex forms burn universal fuel much faster.",
    logTitle: "Field Log",
    help: "Help",
    triangles: "Triangles",
    squares: "Squares",
    pentagons: "Pentagons",
    lawTitle: "Thermodynamic Law",
    lawDesc: '"The universe tends toward disorder. Life doesn\'t stop this process; it organizes it to happen faster."',
    balanceTitle: "Final Balance",
    balanceSubtitle: "Summary of dissipative evolution",
    maxOrder: "Max Order",
    entropy: "Entropy",
    analysisTitle: "Temporal Analysis",
    metricsConsolidated: "Consolidated Metrics",
    totalDissipation: "Total Universal Dissipation",
    degradationRate: "Degradation Rate per Cycle",
    accumulatedOrder: "Local Order Accumulation",
    reflectionQuote: '"Life is not an exception to entropy; it is its most efficient catalyst."',
    reflectionDesc: "You have shown that through energy consumption and pattern creation (mutation and persistence), the system can maintain pockets of local order in exchange for massive global dissipation. This is the guiding principle of the thermodynamics of life.",
    newSimulation: "New Simulation",
    understand: "Understood",
    phases: {
      1: {
        title: "Phase 1: Passive Entropy",
        desc: "Closed system. Order inevitably degrades in the stability niche.",
        rule: "Just observe. Without energy, the universe yawns toward disorder.",
        log: "Passive entropy is inefficient. We need an order engine to accelerate it."
      },
      2: {
        title: "Phase 2: Flow and Repair",
        desc: "Open system. You introduce energy to force particles into the stability niche.",
        rule: "Spend energy to order. Note that 'cleaning' your house heats up the universe.",
        log: "By forcing order, we are 'buying' global entropy with external energy."
      },
      3: {
        title: "Phase 3: The Biological Machine",
        desc: "Complex structures anchor in the ordered core to capture energy.",
        rule: "Structure patterns. They are engines that devour energy to survive.",
        log: "Success! Local organization allows for sustained energy burning."
      },
      4: {
        title: "Phase 4: Mutation Hypercycles",
        desc: "Forced evolution. Patterns can now mutate into more complex forms.",
        rule: "Mutate your structures. A pentagon is a devastating thermal engine.",
        log: "Complex mutation is the thermal climax: structures consuming everything around them."
      }
    }
  }
};

// Fix: Exporting PHASE_DESCRIPTIONS for PredictionScreen.tsx
export const PHASE_DESCRIPTIONS = TRANSLATIONS.es.phases;
