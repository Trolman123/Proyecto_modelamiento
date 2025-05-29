import { API_CONFIG } from '../config.js';

export function initOptionsCalculator() {
    const form = document.getElementById('options-form');
    if (!form) {
        console.error('Options form not found');
        return;
    }

    form.addEventListener('submit', handleOptionsSubmit);
}

async function handleOptionsSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const resultsDiv = document.getElementById('options-results');
    const chartContainer = document.getElementById('options-chart-container');
    
    try {
        // Obtener valores del formulario
        const K = parseFloat(form.querySelector('#strike-price').value);
        const r = parseFloat(form.querySelector('#interest-rate').value);
        const T = parseFloat(form.querySelector('#time-to-maturity').value);
        const S0 = parseFloat(form.querySelector('#current-price').value);
        const sigma = parseFloat(form.querySelector('#volatility').value);

        // Construir el payload
        const requestData = {
            K,
            r,
            T,
            S0,
            sigma
        };

        console.log('Sending request to backend:', requestData);

        // Realizar la petición al backend
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.calculateOption}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al calcular el valor de la opción');
        }

        const result = await response.json();
        console.log('Received result:', result);

        // Mostrar resultados
        displayOptionsResults(result);
        
        // Crear gráfico
        createOptionsChart(result, S0, K);

    } catch (error) {
        console.error('Error:', error);
        resultsDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        chartContainer.style.display = 'none';
    }
}

function displayOptionsResults(result) {
    const resultsDiv = document.getElementById('options-results');
    
    if (!result) {
        resultsDiv.innerHTML = '<p class="error">Error: Formato de respuesta inválido</p>';
        return;
    }

    // Handle different response formats
    let optionValue;
    if (typeof result === 'object') {
        optionValue = result.valor_opcion || result.value;
    } else {
        optionValue = result;
    }
    
    if (typeof optionValue === 'undefined' || isNaN(optionValue)) {
        resultsDiv.innerHTML = '<p class="error">Error: Formato de respuesta inválido</p>';
        return;
    }

    resultsDiv.innerHTML = `
        <h3>Resultados</h3>
        <p>Valor de la opción: $${optionValue.toFixed(4)}</p>
        ${result.delta ? `<p>Delta: ${result.delta.toFixed(4)}</p>` : ''}
        ${result.gamma ? `<p>Gamma: ${result.gamma.toFixed(4)}</p>` : ''}
        ${result.theta ? `<p>Theta: ${result.theta.toFixed(4)}</p>` : ''}
        ${result.vega ? `<p>Vega: ${result.vega.toFixed(4)}</p>` : ''}
    `;
}

function createOptionsChart(result, S0, K) {
    const chartContainer = document.getElementById('options-chart-container');
    const canvas = document.getElementById('payoff-density-chart');
    
    if (!canvas) {
        console.error('Chart canvas not found');
        return;
    }

    chartContainer.style.display = 'block';

    // Destruir el gráfico anterior si existe
    if (window.optionsChart) {
        window.optionsChart.destroy();
    }

    // Crear datos para el gráfico
    const spotPrices = Array.from({ length: 50 }, (_, i) => S0 * (0.5 + i * 0.02));
    const payoffs = spotPrices.map(S => Math.max(0, S - K));
    const densities = spotPrices.map(S => {
        const d1 = (Math.log(S/S0) + (result.r + 0.5 * result.sigma * result.sigma) * result.T) / (result.sigma * Math.sqrt(result.T));
        return Math.exp(-0.5 * d1 * d1) / (S * result.sigma * Math.sqrt(2 * Math.PI * result.T));
    });

    // Crear el gráfico
    window.optionsChart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: spotPrices.map(S => S.toFixed(2)),
            datasets: [
                {
                    label: 'Payoff',
                    data: payoffs,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    yAxisID: 'y'
                },
                {
                    label: 'Densidad de Probabilidad',
                    data: densities,
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Payoff'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Densidad'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
} 