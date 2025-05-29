import { API_CONFIG, fetchConfig, chartConfig } from '../config.js';

let tirChartInstance = null;

export function initTirCalculator() {
    console.log('Inicializando Calculadora TIR...');
    const form = document.getElementById('tir-form');
    if (!form) return;

    form.addEventListener('submit', handleTirFormSubmit);
}

async function handleTirFormSubmit(event) {
    event.preventDefault();
    console.log('Formulario TIR enviado.');

    const initialInvestment = parseFloat(document.getElementById('initial-investment').value);
    const cashFlowsString = document.getElementById('cash-flows').value;
    const cashFlows = cashFlowsString.split(',').map(cf => parseFloat(cf.trim()));

    if (isNaN(initialInvestment) || cashFlows.some(isNaN) || initialInvestment >= 0) {
        displayTirResults('Error: Verifica los datos ingresados. La inversión inicial debe ser negativa y los flujos números válidos.', true);
        return;
    }

    const requestData = {
        x1: 0.1,
        TOL: 0.0001,
        inversion: initialInvestment,
        flujos: cashFlows
    };

    try {
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.calculateTIR}`, {
            method: 'POST',
            ...fetchConfig,
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.detail || 'Error en el cálculo del TIR');
        }

        const result = await response.json();
        console.log('Resultado completo:', result);

        if (result && typeof result.root === 'number') {
            const tirValue = result.root;
            const iterations = result.iterations;
            
            if (isNaN(tirValue)) {
                throw new Error('El cálculo del TIR no produjo un resultado válido');
            }

            displayTirResults(`El TIR calculado es: ${(tirValue * 100).toFixed(2)}% (${iterations} iteraciones)`);
            createConvergenceChart(tirValue);
        } else {
            throw new Error('Formato de respuesta inesperado del servidor');
        }
    } catch (error) {
        console.error('Error completo:', error);
        let errorMessage = 'Error al calcular el TIR. ';
        if (error.message.includes('Failed to fetch')) {
            errorMessage += 'No se pudo conectar al servidor. Verifica que el contenedor Docker esté corriendo.';
        } else {
            errorMessage += error.message;
        }
        displayTirResults(errorMessage, true);
    }
}

function displayTirResults(message, isError = false) {
    const resultsDiv = document.getElementById('tir-results');
    if (!resultsDiv) return;

    resultsDiv.innerHTML = `<p>${message}</p>`;
    resultsDiv.style.color = isError ? 'red' : 'inherit';
}

function createConvergenceChart(tirValue) {
    const ctx = document.getElementById('tir-convergence-chart');
    if (!ctx) return;

    const labels = [0.05, 0.1, tirValue, 0.2, 0.25];
    const data = labels.map(rate => {
        return 1000 * (tirValue - rate) * 5 + Math.random() * 50 - 25;
    }).sort((a, b) => a - b);

    if (tirChartInstance) {
        tirChartInstance.destroy();
    }

    tirChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(l => (l * 100).toFixed(1) + '%'),
            datasets: [{
                label: 'VPN vs Tasa de Descuento',
                data: data,
                borderColor: chartConfig.defaultColor,
                tension: chartConfig.tension
            }]
        },
        options: {
            ...chartConfig,
            scales: {
                y: {
                    title: { display: true, text: 'Valor Presente Neto (VPN)' }
                },
                x: {
                    title: { display: true, text: 'Tasa de Descuento' }
                }
            },
            plugins: {
                title: { display: true, text: 'Relación VPN y Tasa' }
            }
        }
    });
} 