# Examen Final - Computación Visual 2026-I

**Estudiante:** Joan Sebastian Roberto Puerto
**Repositorio:** https://github.com/zebzs/examen-final-computation-visual-Joan-Roberto  
**Fecha de entrega:** 12/06/2026

## Descripción general

Este repositorio contiene la solución al examen final de Computación Visual. El examen consta de dos ejercicios independientes:

1. **Ejercicio 1 – Procesamiento visual e IA** 
   Aplicación en Python que carga una imagen (`sudoku.png`), aplica un pipeline de procesamiento que incluye: conversión a escala de grises, transformación a espacio HSV, suavizado Gaussiano, detección de bordes Canny, segmentación mediante umbralización y contornos, y guardado de resultados comparativos. Se generan 11 imágenes de salida que documentan el efecto de cada operación.

2. **Ejercicio 2 – Escena 3D interactiva temática** 
   Se implementará una escena 3D con Three.js, React Three Fiber o Unity sobre un tema a elegir (exploración espacial, entorno marino, robótica, etc.). Incluirá jerarquías, transformaciones, materiales PBR, iluminación, animaciones e interacción. La evidencia será un GIF o video.


## Dependencias

### Ejercicio 1
- Python 3.10 o superior (probado con Python 3.14)
- OpenCV 4.13.0 (instalable vía pip)
- NumPy 2.4.2

Las versiones exactas se especifican en `ejercicio_1_procesamiento_visual/requirements.txt`.

### Ejercicio 2 (por definir)
- Pendiente de selección (Three.js / React Three Fiber / Unity)

## Instalación

### Clonar el repositorio
```bash
git clone https://github.com/zebzs/examen-final-computation-visual-Joan-Roberto.git
cd examen-final-computation-visual-Joan-Roberto
```

### Instalar dependencias del ejercicio 1
```bash
pip install -r ejercicio_1_procesamiento_visual/requirements.txt
```
O si se prefiere instalar directamente:
```bash
pip install opencv-python numpy
```

### Ejercicio 2
Se añadirá posteriormente.

## Ejecución

### Ejercicio 1
```bash
cd ejercicio_1_procesamiento_visual/src
python main.py
```

El script procesará la imagen `../data/sudoku.png` y guardará los resultados en `../resultados/`.

### Ejercicio 2
Pendiente de implementación.

## Estructura del repositorio

```
examen-final-computation-visual-Joan-Roberto/
├── README.md                          # Este archivo
├── .gitignore
├── ejercicio_1_procesamiento_visual/
│   ├── README.md                      # Documentación detallada del ejercicio 1
│   ├── requirements.txt
│   ├── data/
│   │   └── sudoku.png                 # Imagen original
│   ├── src/
│   │   └── main.py                    # Código fuente del pipeline
│   └── resultados/                    # Imágenes generadas (11 archivos)
│       ├── 1_grayscale.jpg
│       ├── 2_hsv.jpg
│       ├── 2_hue.jpg
│       ├── 2_saturation.jpg
│       ├── 2_value.jpg
│       ├── 3_gaussian_blur.jpg
│       ├── 4_canny_edges.jpg
│       ├── 5_threshold_binary.jpg
│       ├── 5b_red_segmentation.jpg
│       ├── 6_contours_detection.jpg
│       └── 7_comparison_mosaic.jpg
└── ejercicio_2_escena_3d_interactiva/  # (A crear)
    ├── src/
    └── media/
```

## Evidencias

A continuación se muestran las imágenes más representativas del procesamiento realizado. Para una descripción detallada de cada una, consultar `ejercicio_1_procesamiento_visual/README.md`.

### Imagen original
![Imagen original](ejercicio_1_procesamiento_visual/data/sudoku.png)

### Mosaico comparativo (Original, Grises, Hue, Suavizado, Bordes, Umbral)
![Mosaico comparativo](ejercicio_1_procesamiento_visual/resultados/7_comparison_mosaic.jpg)

### Detección de bordes (Canny)
![Bordes Canny](ejercicio_1_procesamiento_visual/resultados/4_canny_edges.jpg)

### Detección de contornos
![Contornos](ejercicio_1_procesamiento_visual/resultados/6_contours_detection.jpg)

### Segmentación por umbral
![Umbralización](ejercicio_1_procesamiento_visual/resultados/5_threshold_binary.jpg)

Todas las imágenes generadas están disponibles en la carpeta `resultados/`.

## Análisis técnico

### Parámetros clave del ejercicio 1
- **Kernel Gaussiano:** (5,5) con sigma 1.5 – suavizado moderado que preserva bordes.
- **Umbrales Canny:** 50 (inferior) y 150 (superior) – relación 1:3 estándar para capturar bordes débiles y fuertes en la cuadrícula del sudoku.
- **Umbral de binarización:** 127 – punto medio de la escala 0-255, separa números oscuros del fondo claro.
- **Segmentación HSV rojo:** rangos (0-10) y (170-180) – ejemplo de segmentación por color.

Estos valores se eligieron experimentalmente para obtener resultados claros y comparables en la imagen de prueba.

### Decisiones de diseño
- Se utilizó OpenCV por su eficiencia y completitud.
- Se guardaron resultados intermedios para permitir la trazabilidad del procesamiento.
- El mosaico comparativo facilita la evaluación visual conjunta.

### Posibles mejoras
- Aplicar el pipeline a un video en tiempo real.
- Usar un modelo preentrenado (YOLO, SSD) para detección de objetos más compleja.

## Uso de IA

Durante el desarrollo del ejercicio 1 se emplearon herramientas de inteligencia artificial de forma auxiliar para tareas concretas:

- **Segmentación por color en HSV:** Se consultó un ejemplo de rangos HSV para rojo.
- **Creación del mosaico comparativo:** Se pidió orientación sobre cómo combinar imágenes con `np.hstack` y `np.vstack`.
- **Manejo de rutas relativas:** Se solicitó la forma de obtener rutas absolutas con `os.path.dirname(__file__)`.

*Para más detalles, ver sección "Uso de IA" en `ejercicio_1_procesamiento_visual/README.md`.*


## Contribuciones

Trabajo individual. Joan Roberto – 100% del desarrollo y documentación.
