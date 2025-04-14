// Espera a que todo el contenido HTML esté cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Cargado. Inicializando scripts...');

    // --- Lógica Común (Ejecutar en todas las páginas) ---
    setActiveNavigationLink();


    // --- Lógica Específica por Página ---
    // Detectamos en qué página estamos usando el ID del body o la existencia de un elemento clave

    if (document.body.id === 'page-raices' || document.getElementById('tir-calculator')) {
        initTirCalculator(); // Llama a la función específica para la calculadora TIR
    }

    // if (document.body.id === 'page-sistemas' || document.getElementById('portfolio-optimizer')) {
    //     initPortfolioOptimizer(); // Llama a la función para el optimizador
    // }

    // ... añadir más 'if' para las otras páginas/calculadoras ...

});

// --- Funciones Comunes ---

/**
 * Marca como activo el enlace de navegación correspondiente a la página actual.
 */
function setActiveNavigationLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html'; // Obtiene el nombre del archivo actual
    const navLinks = document.querySelectorAll('.main-nav ul li a');

    navLinks.forEach(link => {
        // Comprueba si el href del enlace coincide con la página actual
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active'); // Asegura que otros no estén activos
        }
    });
}


// --- Funciones Específicas (Ejemplo para Calculadora TIR) ---

/**
 * Inicializa la funcionalidad de la calculadora de TIR.
 */
function initTirCalculator() {
    console.log('Inicializando Calculadora TIR...');
    const form = document.getElementById('tir-form');
    if (!form) return; // Salir si el formulario no existe en esta página

    form.addEventListener('submit', handleTirFormSubmit);
}

/**
 * Maneja el evento de envío del formulario de TIR.
 * @param {Event} event - El objeto del evento de envío.
 */
function handleTirFormSubmit(event) {
    event.preventDefault(); // Evita que la página se recargue
    console.log('Formulario TIR enviado.');

    // 1. Obtener los valores del formulario
    const initialInvestment = parseFloat(document.getElementById('initial-investment').value);
    const cashFlowsString = document.getElementById('cash-flows').value;
    const cashFlows = cashFlowsString.split(',').map(cf => parseFloat(cf.trim())); // Convierte string a array de números

    // Validación simple (se puede mejorar)
    if (isNaN(initialInvestment) || cashFlows.some(isNaN) || initialInvestment >= 0) {
        displayTirResults('Error: Verifica los datos ingresados. La inversión inicial debe ser negativa y los flujos números válidos.', true);
        return;
    }

    // Crear el array completo de flujos incluyendo la inversión inicial
    const allFlows = [initialInvestment, ...cashFlows];

    // 2. Llamar a la función que calcula el TIR (Simulación)
    //    *** IMPORTANTE: Aquí iría la lógica REAL de cálculo del TIR ***
    //    Esta lógica podría usar un método numérico implementado en JS
    //    o, para este proyecto, podrías mostrar un resultado PRECALCULADO
    //    o simular el cálculo.
    //    Por ejemplo, simularemos un resultado:
    const simulatedTir = calculateIRR(allFlows); // Llama a una función (definida abajo) que simula/calcula

    // 3. Mostrar los resultados
    if (simulatedTir !== null) {
        displayTirResults(`El TIR calculado es: ${(simulatedTir * 100).toFixed(2)}%`);
        // 4. (Opcional) Crear/Actualizar el gráfico de convergencia o VPN vs tasa
        createConvergenceChart(simulatedTir); // Función para dibujar el gráfico
    } else {
        displayTirResults('No se pudo calcular el TIR con los datos proporcionados (podría no existir o el método falló).', true);
    }
}

/**
 * Muestra los resultados del cálculo del TIR en el DOM.
 * @param {string} message - El mensaje a mostrar.
 * @param {boolean} [isError=false] - Indica si el mensaje es un error.
 */
function displayTirResults(message, isError = false) {
    const resultsDiv = document.getElementById('tir-results');
    if (!resultsDiv) return;

    resultsDiv.innerHTML = `<p>${message}</p>`;
    resultsDiv.style.color = isError ? 'red' : 'inherit'; // Cambia color si es error
}

/**
 * Función SIMULADA/PLACEHOLDER para calcular el TIR.
 * En un proyecto real, aquí implementarías Newton-Raphson, Bisección, etc.
 * O podrías tener resultados precalculados de Octave y mostrarlos.
 * @param {number[]} cashflows - Array de flujos de caja (incluye inversión inicial negativa).
 * @returns {number|null} El TIR calculado como decimal, o null si falla.
 */
function calculateIRR(cashflows) {
    // --- SIMULACIÓN ---
    // Esto es solo un ejemplo muy básico. No es un cálculo real.
    // Podrías tener lógica más compleja o devolver valores fijos basados en la entrada.
    console.log("Simulando cálculo de TIR para flujos:", cashflows);
    // Ejemplo simple: devuelve un valor fijo o ligeramente variado para demostración
    if (cashflows.length > 1 && cashflows[0] < 0) {
        // Una heurística muy simple y probablemente incorrecta, solo para mostrar algo
        const totalPositiveFlows = cashflows.slice(1).reduce((sum, cf) => sum + (cf > 0 ? cf : 0), 0);
        const initialInvestmentAbs = Math.abs(cashflows[0]);
        if (initialInvestmentAbs === 0) return null;
        // Estimación muy burda basada en retorno simple
        const estimatedReturn = (totalPositiveFlows / initialInvestmentAbs) - 1;
        const periods = cashflows.length - 1;
        if (periods === 0) return null;
        // Devuelve una aproximación simple o un valor fijo para probar
        return Math.pow(1 + estimatedReturn, 1 / periods) - 1; // Ejemplo simplificado
        // return 0.15; // O devolver un valor fijo 15%
    }
    return null; // No se pudo calcular
    // --- FIN SIMULACIÓN ---

    // --- Lógica Real (Ejemplo conceptual con Newton-Raphson - requeriría más funciones) ---
    // let guess = 0.1; // Estimación inicial
    // let iterations = 0;
    // const MAX_ITERATIONS = 100;
    // const TOLERANCE = 1e-6;
    //
    // while (iterations < MAX_ITERATIONS) {
    //     const npvValue = npv(cashflows, guess);
    //     const npvDerivativeValue = npvDerivative(cashflows, guess); // Necesitas calcular la derivada del NPV
    //
    //     if (Math.abs(npvValue) < TOLERANCE) {
    //         return guess; // Convergencia
    //     }
    //     if (npvDerivativeValue === 0) {
    //         return null; // División por cero, método falla
    //     }
    //
    //     guess = guess - npvValue / npvDerivativeValue; // Iteración de Newton
    //     iterations++;
    // }
    // return null; // No convergió
    // --- Fin Lógica Real ---
}

// Funciones auxiliares para la lógica real (si la implementaras)
// function npv(cashflows, rate) { ... }
// function npvDerivative(cashflows, rate) { ... }


/**
 * (Opcional) Crea o actualiza un gráfico usando Chart.js.
 * @param {number} tirValue - El valor del TIR para mostrar alguna relación.
 */
let tirChartInstance = null; // Variable global para mantener la instancia del gráfico
function createConvergenceChart(tirValue) {
    const ctx = document.getElementById('tir-convergence-chart');
    if (!ctx) return; // Salir si el canvas no existe

    // Datos de ejemplo para el gráfico (puedes mostrar VPN vs tasa o iteraciones)
    const labels = [0.05, 0.1, tirValue, 0.2, 0.25]; // Tasas de ejemplo
    // Simula calcular el NPV para esas tasas (necesitarías la función npv)
    const data = labels.map(rate => {
        // Simulación de NPV (reemplazar con cálculo real si es posible)
        return 1000 * (tirValue - rate) * 5 + Math.random() * 50 - 25; // Formula arbitraria para ejemplo
    }).sort((a, b) => a - b); // Ordenar para gráfico

    // Destruye el gráfico anterior si existe para evitar solapamientos
    if (tirChartInstance) {
        tirChartInstance.destroy();
    }

    // Crea el nuevo gráfico
    tirChartInstance = new Chart(ctx, {
        type: 'line', // o 'scatter'
        data: {
            labels: labels.map(l => (l * 100).toFixed(1) + '%'), // Formato de etiquetas
            datasets: [{
                label: 'VPN vs Tasa de Descuento (Ejemplo)',
                data: data,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    title: { display: true, text: 'Valor Presente Neto (VPN)' }
                },
                x: {
                    title: { display: true, text: 'Tasa de Descuento' }
                }
            },
            plugins: {
                title: { display: true, text: 'Relación VPN y Tasa (Ilustrativo)' }
            }
        }
    });
}

// --- Fin Funciones Específicas TIR ---


// --- Puedes añadir aquí más bloques de funciones para las otras páginas ---
// function initPortfolioOptimizer() { ... }
// function handlePortfolioFormSubmit(event) { ... }
// ... etc ...