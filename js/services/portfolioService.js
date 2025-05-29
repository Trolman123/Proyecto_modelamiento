import { API_CONFIG, fetchConfig, chartConfig } from '../config.js';

export function initPortfolioCalculator() {
    console.log('Inicializando Calculadora de Portafolio...');
    const form = document.getElementById('portfolio-form');
    if (!form) return;

    form.addEventListener('submit', handlePortfolioSubmit);
}

async function handlePortfolioSubmit(event) {
    event.preventDefault();
    console.log('Formulario de Portafolio enviado.');

    const e1 = parseFloat(document.getElementById('e1').value);
    const e2 = parseFloat(document.getElementById('e2').value);
    const ep = parseFloat(document.getElementById('ep').value);

    const requestData = { e1, e2, ep };

    console.log('=== Datos de la petición Portafolio ===');
    console.log('URL:', `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.calculatePortfolio}`);
    console.log('Método:', 'POST');
    console.log('Headers:', {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    });
    console.log('Datos enviados:', requestData);
    console.log('=====================================');

    try {
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.calculatePortfolio}`, {
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
            throw new Error(errorData?.detail || 'Error en el cálculo del portafolio');
        }

        const result = await response.json();
        console.log('Resultado:', result);
        displayPortfolioResults(result);
    } catch (error) {
        console.error('Error completo:', error);
        let errorMessage = 'Error al calcular el portafolio. ';
        if (error.message.includes('Failed to fetch')) {
            errorMessage += 'No se pudo conectar al servidor. Verifica que el contenedor Docker esté corriendo.';
        } else {
            errorMessage += error.message;
        }
        displayPortfolioResults(errorMessage, true);
    }
}

function displayPortfolioResults(result, isError = false) {
    const resultsDiv = document.getElementById('portfolio-results');
    if (!resultsDiv) return;

    if (isError) {
        resultsDiv.innerHTML = `<p style="color: red;">${result}</p>`;
        return;
    }

    // Verificar si el resultado tiene el formato esperado
    if (typeof result === 'object' && 'w1' in result && 'w2' in result) {
        const w1 = result.w1;
        const w2 = result.w2;
        const e1 = parseFloat(document.getElementById('e1').value);
        const e2 = parseFloat(document.getElementById('e2').value);
        const ep = parseFloat(document.getElementById('ep').value);
        
        // Calcular el rendimiento esperado del portafolio
        const expectedReturn = w1 * e1 + w2 * e2;

        resultsDiv.innerHTML = `
            <h3>Resultados:</h3>
            <p>Peso para Activo 1 (w₁): ${(w1 * 100).toFixed(2)}%</p>
            <p>Peso para Activo 2 (w₂): ${(w2 * 100).toFixed(2)}%</p>
            <p>Rendimiento esperado del portafolio: ${(expectedReturn * 100).toFixed(2)}%</p>
            <p>Suma de pesos: ${((w1 + w2) * 100).toFixed(2)}%</p>
        `;
    } else {
        resultsDiv.innerHTML = `<p style="color: red;">Formato de respuesta inesperado del servidor</p>`;
    }
} 