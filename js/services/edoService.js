import { API_CONFIG, fetchConfig, chartConfig } from '../config.js';

let edoChartInstance = null;

export function initEDOCalculator() {
    console.log('Inicializando Calculadora de EDO...');
    const form = document.getElementById('edo-form');
    if (!form) return;

    form.addEventListener('submit', handleEDOSubmit);
}

async function handleEDOSubmit(event) {
    event.preventDefault();
    console.log('Formulario de EDO enviado.');

    const W0 = parseFloat(document.getElementById('w0').value);
    const f = document.getElementById('function').value;
    const t0 = parseFloat(document.getElementById('t0').value);
    const T = parseFloat(document.getElementById('T').value);
    const N = parseInt(document.getElementById('N').value);
    const metodo = document.getElementById('metodo').value;

    const requestData = { W0, f, t0, T, N, metodo };

    console.log('=== Datos de la petición EDO ===');
    console.log('URL:', `${API_CONFIG.baseUrl}/resolver-edo/`);
    console.log('Método:', 'POST');
    console.log('Headers:', {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    });
    console.log('Datos enviados:', requestData);
    console.log('=============================');

    try {
        const response = await fetch(`${API_CONFIG.baseUrl}/resolver-edo/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            credentials: 'omit',
            body: JSON.stringify(requestData)
        });

        console.log('=== Respuesta del servidor ===');
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        console.log('Headers:', Object.fromEntries(response.headers.entries()));
        console.log('============================');

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('Error data:', errorData);
            throw new Error(errorData?.detail || 'Error en la resolución de la EDO');
        }

        const result = await response.json();
        console.log('Resultado:', result);
        displayEDOResults(result);
        createEDOChart(result);
    } catch (error) {
        console.error('Error completo:', error);
        let errorMessage = 'Error al resolver la EDO. ';
        if (error.message.includes('Failed to fetch')) {
            errorMessage += 'No se pudo conectar al servidor. Verifica que el contenedor Docker esté corriendo.';
        } else {
            errorMessage += error.message;
        }
        displayEDOResults(errorMessage, true);
    }
}

function displayEDOResults(result, isError = false) {
    const resultsDiv = document.getElementById('edo-results');
    if (!resultsDiv) return;

    if (isError) {
        resultsDiv.innerHTML = `<p class="error">${result}</p>`;
    } else {
        const { t, W } = result;
        let html = '<h3>Resultados de la EDO</h3>';
        html += '<table class="results-table">';
        html += '<tr><th>Tiempo (t)</th><th>Valor (W)</th></tr>';
        
        t.forEach((tiempo, i) => {
            html += `<tr><td>${tiempo.toFixed(4)}</td><td>${W[i].toFixed(4)}</td></tr>`;
        });
        
        html += '</table>';
        resultsDiv.innerHTML = html;
    }
}

function createEDOChart(result) {
    const ctx = document.getElementById('edo-chart');
    if (!ctx) return;

    const { t, W } = result;

    if (edoChartInstance) {
        edoChartInstance.destroy();
    }

    edoChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: t,
            datasets: [{
                label: 'Solución de la EDO',
                data: W,
                borderColor: chartConfig.defaultColor,
                tension: chartConfig.tension
            }]
        },
        options: {
            ...chartConfig,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'W(t)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 't'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Solución de la Ecuación Diferencial'
                }
            }
        }
    });
} 