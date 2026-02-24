
# Orden, Entropía y Persistencia: Simulador Termodinámico

Este proyecto es una aplicación web interactiva de vanguardia diseñada para la enseñanza de la termodinámica y la biología teórica. Permite a los estudiantes explorar cómo el orden local (vida) emerge y persiste no "a pesar" de la entropía, sino como un mecanismo eficiente para su disipación global.

## 🎯 Propósito Pedagógico

El simulador busca demostrar tres conceptos fundamentales:
1. **Sistemas Cerrados:** En ausencia de flujo de energía, el orden se degrada inevitablemente (Segunda Ley de la Termodinámica).
2. **Sistemas Abiertos:** El flujo de energía permite mantener focos de orden local (negatropía), pero siempre a costa de un aumento mayor en la entropía del entorno.
3. **Emergencia de la Vida:** La vida es tratada como una "máquina térmica" que captura energía para auto-mantenerse y reproducirse, actuando como un catalizador que acelera el fin térmico del universo mediante la creación de estructuras de complejidad creciente.

---

## 🕹️ Estructura del Juego y Mecánicas

### Modos de Inicio
- **Universo sin Vida:** Un sistema pasivo donde no hay agentes. El usuario es un mero observador de la muerte térmica.
- **Universo con Vida:** Se habilitan acciones metabólicas (reparar, estructurar, clonar, mutar) y la captura de energía exógena.

### Las 4 Fases de la Evolución
1. **Entropía Pasiva:** Observación del colapso natural del orden inicial dentro del **Nicho de Baja Entropía**.
2. **Flujo y Reparación:** Introducción de energía externa. El usuario puede "limpiar" el desorden forzando partículas al centro de integridad.
3. **Motores Biológicos:** Emergen patrones (Triángulos). Estas estructuras ancladas capturan energía automáticamente pero generan una estela de disipación.
4. **Hiperciclos de Mutación:** La fase de complejidad máxima. Los patrones pueden evolucionar de Triángulos a Cuadrados y Pentágonos. Cada salto jerárquico incrementa drásticamente la captura de energía y la disipación global.

---

## 🛠️ Detalles Técnicos de la Simulación

La simulación se basa en un modelo de partículas estocástico con reglas físicas precisas:

### 1. Dinámica de Partículas (Cinética Termodinámica)
- **Estados:** Cada partícula alterna entre `ordered` (baja energía cinética) y `disordered` (alta agitación térmica).
- **Movimiento Browniano:** Se implementa un modelo de vagabundeo aleatorio donde la intensidad depende de la entropía local.
- **Nicho de Baja Entropía:** El corazón del sistema es un vórtice de estabilidad donde el orden es posible. Las partículas "usadas" por la vida se anclan aquí, mientras que la materia inerte (gris) orbita o se degrada.
- **Noise Rate (Ruido):** Probabilidad estocástica constante de que el choque térmico desmorone una partícula ordenada.

### 2. Contabilidad Termodinámica y Disipación
El motor calcula dos métricas críticas en tiempo real:
- **Orden Local (Negatropía):** Porcentaje de integridad del sistema dentro del núcleo de estabilidad.
- **Entropía Global (Acumulada):** Un contador que suma:
  - **Calor de Trabajo:** Energía gastada por el usuario en acciones.
  - **Fricción de Información:** Partículas que se desordenan por ruido.
  - **Costo Metabólico:** Cada patrón vivo (Triángulo, Cuadrado, Pentágono) tiene una "tasa de quemado" de entropía proporcional a su complejidad.

### 3. Emergencia y Complejidad Geométrica
- **Estructura jerárquica:** El sistema reconoce patrones geométricos. 
- **Jerarquía de Disipación:** 
  - *Triángulo (3 pts):* Disipador base.
  - *Cuadrado (4 pts):* Multiplicador de energía x2.5, disipación x3.
  - *Pentágono (5 pts):* El motor más voraz. Multiplicador de energía x5.5, disipación masiva.
- **Metabolismo de Succión (Fase 4):** Los patrones vivos actúan como imanes termodinámicos, ordenando automáticamente el desorden cercano para alimentar su propia persistencia (Homeostasis).

### 4. Tecnologías y Visualización
- **React 19:** Gestión de estado reactivo para las métricas físicas.
- **Tailwind CSS:** Interfaz "Cyber-Academic" para una experiencia de usuario inmersiva.
- **Chart.js:** Visualización de la trayectoria disipativa al final de la simulación.
- **SVG & Canvas:** Sistema híbrido para renderizar enlaces estructurales y partículas con efectos de resplandor (glow) y vibración.

---

## 📊 Conclusión Científica
*"La vida no existe a pesar de la entropía; existe porque la entropía lo permite."* 
El simulador demuestra que la vida es el camino de menor resistencia para la degradación de gradientes energéticos en el universo.