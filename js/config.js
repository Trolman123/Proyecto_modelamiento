// Configuración de la API
export const API_CONFIG = {
    baseUrl: 'http://localhost:8000', // URL del backend en Docker
    endpoints: {
        calculateTIR: '/tir/',
        calculateNonLinearInterpolation: '/interpolate-no-lineal/',
        calculatePortfolio: '/portafolio/',
        solveEDO: '/resolver-edo/',
        calculateOption: '/opcion/'
    }
};

// Configuración común para las peticiones fetch
export const fetchConfig = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    mode: 'cors',
    credentials: 'omit'
};

// Configuración común para los gráficos
export const chartConfig = {
    defaultColor: 'rgb(75, 192, 192)',
    tension: 0.1,
    responsive: true
}; 