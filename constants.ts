
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
    cx: 50, 
    cy: 50, 
    r: 30   
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
  
  // Phase 5
  PHASE5_MAX_PATTERNS: 40,
  PHASE5_GRID_COLS: 8,
  PHASE5_GRID_ROWS: 5,
  PHASE5_RADIUS_SCALE: 0.6,
};

export const PHASE_THEMES = {
  1: { bg: 'bg-slate-950', cell: 'rgba(71, 85, 105, 0.2)', particle: '#94a3b8', border: '#475569' },
  2: { bg: 'bg-indigo-950', cell: 'rgba(79, 70, 229, 0.2)', particle: '#818cf8', border: '#6366f1' },
  3: { bg: 'bg-emerald-950', cell: 'rgba(16, 185, 129, 0.2)', particle: '#34d399', border: '#10b981' },
  4: { bg: 'bg-purple-950', cell: 'rgba(139, 92, 246, 0.2)', particle: '#a78bfa', border: '#8b5cf6' },
  5: { bg: 'bg-rose-950', cell: 'rgba(244, 63, 94, 0.2)', particle: '#fb7185', border: '#f43f5e' }
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
    title: "ENTROPIA + VIDA",
    subtitle: "Un viaje interactivo desde el colapso inevitable de un sistema cerrado hasta la emergencia de estructuras auto-mantenidas.",
    guideTitle: "Guía del Investigador",
    lifelessUniverse: "Universo sin Vida",
    withLifeUniverse: "Universo con Vida",
    voraciousUniverse: "Universo Voraz",
    lifelessDesc: "Observa cómo la entropía degrada el orden natural sin agentes que lo mantengan. Un sistema puramente pasivo.",
    withLifeDesc: "Introduce flujos de energía y organismos capaces de mantener orden local. Tú controlas las acciones del sistema.",
    voraciousDesc: "La vida en su máxima expresión disipativa. El sistema se auto-mantiene y evoluciona automáticamente para devorar energía.",
    startSelect: "Selecciona el tipo de universo para iniciar",
    cyclesPerLevel: "Ciclos por nivel",
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
    finishSimulation: "Terminar Simulación",
    results: "RESULTADOS",
    autoStrategy: "ESTRATEGIA TERMODINÁMICA VORAZ",
    noAgents: "SIN AGENTES ACTIVOS (SISTEMA PASIVO)",
    captureData: "CAPTURAR DATOS",
    downloadData: "DESCARGAR CSV",
    captureChart: "CAPTURAR GRÁFICA",
    darkMode: "MODO OSCURO",
    lightMode: "MODO CLARO",
    dataCaptured: "Datos capturados para el informe",
    objectiveTitle: "Qué hacer",
    objectiveDesc: "Aumenta la energía y observa cómo sube la entropía.",
    machineStatus: "Estado del Sistema",
    dissipationEngines: "Entidades Activas",
    formsDesc: "Las formas complejas consumen energía más rápido.",
    logTitle: "Ayuda",
    help: "Guía",
    triangles: "Triángulos",
    squares: "Cuadrados",
    pentagons: "Pentágonos",
    harvester: "Recolector",
    harvesterDesc: "Atrae partículas lejanas al centro.",
    producer: "Productor",
    producerDesc: "Genera mucha más energía por ciclo.",
    replicator: "Replicador",
    replicatorDesc: "Reduce el costo de crear nuevos patrones.",
    recycler: "Reciclador",
    recyclerDesc: "Reduce el costo de reparación y mantenimiento.",
    roleColors: {
      HARVESTER: '#38bdf8', // Sky Blue
      PRODUCER: '#fbbf24',  // Amber
      REPLICATOR: '#fb7185', // Rose
      RECYCLER: '#34d399'    // Emerald
    },
    lawTitle: "",
    lawDesc: "",
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
        desc: "Solo observa cómo las partículas se desordenan solas.",
        rule: "No puedes hacer nada, solo mirar el desorden natural.",
        log: "Partículas libres: Se mueven al azar perdiendo el orden inicial."
      },
      2: {
        title: "Fase 2: Flujo y Reparación",
        desc: "Usa el botón RECOLECTAR para ordenar partículas.",
        rule: "Gasta energía para mover partículas al centro y ganar orden.",
        log: "Partículas capturadas: Partículas que has forzado a entrar en el círculo central."
      },
      3: {
        title: "Fase 3: La Máquina Biológica",
        desc: "Usa ESTRUCTURAR para crear triángulos permanentes.",
        rule: "Crea triángulos para generar energía automáticamente cada ciclo.",
        log: "Replicadores simples: Triángulos que mantienen el orden y generan energía."
      },
      4: {
        title: "Fase 4: Hiperciclos de Mutación",
        desc: "Usa CLONAR y MUTAR para crear formas complejas.",
        rule: "Crea cuadrados y pentágonos para disipar energía mucho más rápido.",
        log: "Replicadores complejos: Cuadrados y pentágonos con mayor capacidad de disipación."
      },
      5: {
        title: "Fase 5: Especialización Celular",
        desc: "Crea una colonia con roles especializados.",
        rule: "Observa cómo la división del trabajo baja los costos y maximiza la eficiencia.",
        log: "Replicadores funcionales: Entidades con roles (Recolector, Productor, Replicador, Reciclador)."
      }
    }
  },
  en: {
    title: "ENTROPY + LIFE",
    subtitle: "An interactive journey from the inevitable collapse of a closed system to the emergence of self-sustaining structures.",
    guideTitle: "Researcher's Guide",
    lifelessUniverse: "Lifeless Universe",
    withLifeUniverse: "Universe with Life",
    voraciousUniverse: "Voracious Universe",
    lifelessDesc: "Observe how entropy degrades natural order without agents to maintain it. A purely passive system.",
    withLifeDesc: "Introduce energy flows and organisms capable of maintaining local order. You control the system's actions.",
    voraciousDesc: "Life at its maximum dissipative expression. The system self-maintains and evolves automatically to devour energy.",
    startSelect: "Select the type of universe to begin",
    cyclesPerLevel: "Cycles per level",
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
    finishSimulation: "Finish Simulation",
    results: "RESULTS",
    autoStrategy: "VORACIOUS THERMODYNAMIC STRATEGY",
    noAgents: "NO ACTIVE AGENTS (PASSIVE SYSTEM)",
    captureData: "CAPTURE DATA",
    downloadData: "DOWNLOAD CSV",
    captureChart: "CAPTURE CHART",
    darkMode: "DARK MODE",
    lightMode: "LIGHT MODE",
    dataCaptured: "Data captured for report",
    objectiveTitle: "What to do",
    objectiveDesc: "Increase energy and observe how entropy rises.",
    machineStatus: "System Status",
    dissipationEngines: "Active Entities",
    formsDesc: "Complex forms consume energy faster.",
    logTitle: "Help",
    help: "Guide",
    triangles: "Triangles",
    squares: "Squares",
    pentagons: "Pentagons",
    harvester: "Harvester",
    harvesterDesc: "Attracts distant particles to the center.",
    producer: "Producer",
    producerDesc: "Generates much more energy per cycle.",
    replicator: "Replicator",
    replicatorDesc: "Reduces the cost of creating new patterns.",
    recycler: "Recycler",
    recyclerDesc: "Reduces repair and maintenance costs.",
    roleColors: {
      HARVESTER: '#38bdf8',
      PRODUCER: '#fbbf24',
      REPLICATOR: '#fb7185',
      RECYCLER: '#34d399'
    },
    lawTitle: "",
    lawDesc: "",
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
        desc: "Just observe how particles disorder themselves.",
        rule: "You can't do anything, just watch the natural disorder.",
        log: "Free particles: Moving randomly losing initial order."
      },
      2: {
        title: "Phase 2: Flow and Repair",
        desc: "Use COLLECT button to order particles.",
        rule: "Spend energy to move particles to the center and gain order.",
        log: "Captured particles: Particles you've forced into the central circle."
      },
      3: {
        title: "Phase 3: The Biological Machine",
        desc: "Use STRUCTURE to create permanent triangles.",
        rule: "Create triangles to generate energy automatically each cycle.",
        log: "Simple replicators: Triangles that maintain order and generate energy."
      },
      4: {
        title: "Phase 4: Mutation Hypercycles",
        desc: "Use CLONE and MUTATE to create complex forms.",
        rule: "Create squares and pentagons to dissipate energy much faster.",
        log: "Complex replicators: Squares and pentagons with higher dissipation capacity."
      },
      5: {
        title: "Phase 5: Cellular Specialization",
        desc: "Create a colony with specialized roles.",
        rule: "Observe how division of labor lowers costs and maximizes efficiency.",
        log: "Functional replicators: Entities with roles (Harvester, Producer, Replicator, Recycler)."
      }
    }
  }
};

// Fix: Exporting PHASE_DESCRIPTIONS for PredictionScreen.tsx
export const PHASE_DESCRIPTIONS = TRANSLATIONS.es.phases;
