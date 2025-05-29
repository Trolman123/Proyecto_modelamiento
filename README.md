# Proyecto de Modelamiento Matemático

Este proyecto implementa una aplicación web para realizar cálculos matemáticos financieros y de optimización, utilizando FastAPI en el backend y JavaScript en el frontend.

## 🚀 Características

### 1. Calculadora TIR (Tasa Interna de Retorno)
- Cálculo de la TIR para flujos de caja
- Visualización de resultados con gráficos
- Validación de datos de entrada
- Muestra el número de iteraciones realizadas

### 2. Interpolación
- Interpolación Lineal
- Interpolación No Lineal
- Soporte para múltiples puntos de datos
- Visualización de resultados

### 3. Optimización de Portafolio
- Cálculo de pesos óptimos
- Consideración de expectativas de retorno
- Optimización basada en restricciones

### 4. Resolución de Ecuaciones Diferenciales Ordinarias (EDO)
- Múltiples métodos de resolución
- Soporte para diferentes condiciones iniciales
- Visualización de resultados

### 5. Valuación de Opciones Financieras
- Cálculo de valores de opciones
- Modelo Black-Scholes
- Parámetros personalizables

## 🛠️ Tecnologías Utilizadas

### Backend
- FastAPI (Framework Python)
- Octave (Para cálculos matemáticos)
- Docker (Para containerización)
- CORS habilitado para comunicación con el frontend

### Frontend
- JavaScript Vanilla
- HTML5
- CSS3
- Chart.js (Para visualizaciones)

## 📋 Requisitos Previos

- Docker y Docker Compose
- Navegador web moderno
- Node.js (opcional, para desarrollo)

## 🚀 Instalación y Ejecución

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd [NOMBRE_DEL_DIRECTORIO]
```

2. Iniciar el backend (usando Docker):
```bash
docker compose -f docker-compose.yml up --build
```

3. El frontend se puede servir usando cualquier servidor web estático. Por ejemplo, con Python:
```bash
python -m http.server 8080
```

4. Acceder a la aplicación:
- Frontend: http://localhost:8080
- Backend API: http://localhost:8000
- Documentación API: http://localhost:8000/docs

## 📊 Endpoints de la API

### TIR
- **Endpoint**: `/tir/`
- **Método**: POST
- **Body**:
```json
{
    "x1": 0.1,
    "TOL": 0.0001,
    "inversion": -1000,
    "flujos": [500, 600, 700]
}
```

### Interpolación Lineal
- **Endpoint**: `/interpolate-lineal/`
- **Método**: POST
- **Body**:
```json
{
    "x": 2.5,
    "X": [1, 2, 3, 4],
    "Y": [10, 20, 30, 40]
}
```

### Interpolación No Lineal
- **Endpoint**: `/interpolate-no-lineal/`
- **Método**: POST
- **Body**: Mismo formato que interpolación lineal

### Portafolio
- **Endpoint**: `/portafolio/`
- **Método**: POST
- **Body**:
```json
{
    "e1": 0.1,  // Expectativa de retorno del activo 1
    "e2": 0.2,  // Expectativa de retorno del activo 2
    "ep": 0.15  // Expectativa de retorno del portafolio
}
```

### Resolución de EDO
- **Endpoint**: `/resolver-edo/`
- **Método**: POST
- **Body**:
```json
{
    "W0": 1.0,      // Condición inicial
    "f": "t*y",     // Función f(t,y)
    "t0": 0.0,      // Tiempo inicial
    "T": 1.0,       // Tiempo final
    "N": 100,       // Número de puntos
    "metodo": "euler" // Método de resolución (euler, rk4, etc.)
}
```

### Valuación de Opciones
- **Endpoint**: `/opcion/`
- **Método**: POST
- **Body**:
```json
{
    "K": 100,    // Precio de ejercicio
    "r": 0.05,   // Tasa de interés libre de riesgo
    "T": 1.0,    // Tiempo hasta el vencimiento
    "S0": 100,   // Precio actual del activo subyacente
    "sigma": 0.2 // Volatilidad
}
```

## 🧪 Uso

### Calculadora TIR
1. Ingresa la inversión inicial (valor negativo)
2. Ingresa los flujos de caja futuros (separados por comas)
3. Haz clic en "Calcular"
4. Visualiza el resultado y el gráfico de convergencia

### Interpolación
1. Selecciona el tipo de interpolación (lineal o no lineal)
2. Ingresa el valor x a interpolar
3. Ingresa los puntos X (separados por comas)
4. Ingresa los puntos Y (separados por comas)
5. Haz clic en "Calcular"

### Portafolio
1. Ingresa las expectativas de retorno (e1, e2, ep)
2. Haz clic en "Calcular"
3. Visualiza los pesos óptimos del portafolio

### Resolución de EDO
1. Ingresa la condición inicial (W0)
2. Define la función f(t,y)
3. Especifica el intervalo de tiempo (t0, T)
4. Selecciona el número de puntos (N)
5. Elige el método de resolución
6. Haz clic en "Calcular"

### Valuación de Opciones
1. Ingresa el precio de ejercicio (K)
2. Especifica la tasa de interés (r)
3. Define el tiempo hasta el vencimiento (T)
4. Ingresa el precio actual del activo (S0)
5. Establece la volatilidad (sigma)
6. Haz clic en "Calcular"

## 🔍 Debugging

El frontend incluye logs detallados en la consola del navegador para:
- Datos enviados en cada petición
- Respuestas del servidor
- Errores y excepciones
- Estado de la conexión con el backend

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Notas de Desarrollo

- El backend utiliza FastAPI para proporcionar una API RESTful
- Los cálculos matemáticos se realizan usando Octave
- El frontend está construido con JavaScript vanilla para mantener la simplicidad
- Se utiliza Docker para asegurar un entorno de desarrollo consistente
- Las ecuaciones diferenciales se resuelven usando métodos numéricos
- La valuación de opciones utiliza el modelo Black-Scholes

## ⚠️ Consideraciones

- Asegúrate de que el puerto 8000 esté disponible para el backend
- El frontend debe ser servido desde un servidor web (no abrir directamente el archivo HTML)
- Verifica que Docker esté corriendo antes de iniciar el backend
- Las funciones en la resolución de EDO deben ser expresiones válidas de Octave
- Los parámetros de las opciones deben ser valores positivos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## ✨ Agradecimientos

- FastAPI por proporcionar un framework web moderno y eficiente
- Octave por las capacidades de cálculo matemático
- Chart.js por las visualizaciones interactivas 