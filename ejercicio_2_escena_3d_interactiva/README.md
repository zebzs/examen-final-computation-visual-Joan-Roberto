# Ejercicio 2 – Escena 3D interactiva temática (Exploración espacial)

## Propósito

Desarrollar una escena 3D en tiempo real que simule la superficie de Marte, controlable por el usuario, con un rover móvil y un astronauta autónomo. El objetivo es demostrar la aplicación de conceptos fundamentales de gráficos 3D: jerarquías de objetos, transformaciones (traslación, rotación, escala), materiales PBR, iluminación coherente, animaciones, interacción entre elementos e interacción con el usuario. Todo ello integrado en una experiencia interactiva fluida.

## Herramientas, librerías y motores

- **React** (con Vite) – estructura de la aplicación.
- **React Three Fiber** – puente entre React y Three.js para renderizado declarativo.
- **Drei** – conjunto de ayudas para Three.js (OrbitControls, useGLTF, Environment, Stars, Text, etc.).
- **Three.js** – motor gráfico subyacente.
- **Modelos 3D**:
  - `Rover.glb` – vehículo explorador.
  - `Astronauta.glb` – personaje autónomo.
  - `linterna1.glb` – accesorio jerárquico del rover.
- **Texturas PBR** – suelo marciano con mapa difuso (red laterite soil stones).

## Ejecución de la solución

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn

### Instalación y ejecución local

```bash
cd ejercicio_2_escena_3d_interactiva
npm install
npm run dev
```

Luego abre `http://localhost:5173` en tu navegador.

### Controles
- **Teclado (WASD)**: mover el rover hacia delante, atrás, izquierda y derecha.
- **Ratón**: hacer clic y arrastrar para orbitar la cámara (Pan, Zoom, Rotación).

## Resultados obtenidos

La escena representa una extensión de terreno marciano texturizado, con un rover controlable y un astronauta animado que reacciona a la proximidad del rover. Se cumplen todos los requisitos técnicos:

| Requisito | Implementación |
|-----------|----------------|
| **Tema** | Exploración espacial (superficie marciana) |
| **Jerarquía de objetos** | `<group>` rover → `<group>` linterna (con modelo, spotlight, cono, esfera).<br>Rocas: `<group>` con 80 hijos individuales. |
| **Transformaciones** | Traslación: movimiento del rover (WASD).<br>Rotación: rover gira hacia la dirección de movimiento.<br>Escala: rover (0.8), linterna (0.25), astronauta (8), rocas (0.2–0.7). |
| **Cámara interactiva** | `OrbitControls` (pan, zoom, rotación). |
| **Materiales PBR** | Suelo: `meshStandardMaterial` con textura difusa, roughness y metalness.<br>Modelos GLB con sus propios materiales.<br>Linterna: materiales emisivos y transparentes. |
| **Iluminación** | AmbientLight, DirectionalLight (sol), PointLight (relleno cálido), Spotlight (linterna del rover), Environment nocturno. |
| **Animaciones** | Astronauta: flotación sinusoidal + salto al acercarse el rover.<br>Rover: desplazamiento continuo. |
| **Interacción entre elementos** | Cuando el rover se acerca a menos de 3.5 unidades, el astronauta: cambia a color naranja brillante, realiza un salto y muestra texto "🚀 ¡HOLA!". |
| **Interacción del usuario** | Teclado (WASD) y mouse (cámara). |

### Evidencias visuales

A continuación se muestran las capturas y el GIF animado que demuestran el funcionamiento:

#### Capturas fijas
![Vista general de la escena](media/captura_1.png)
*Vista amplia del terreno, rocas, rover y astronauta con cielo estrellado.*

![Primer plano del rover y linterna](media/captura_2.png)
*Detalle del rover con la linterna activada (cono de luz, halo brillante) y el astronauta cerca.*

#### Demostración en movimiento
![GIF animado con todas las interacciones](media/demo.gif)
*El GIF muestra: navegación de cámara, movimiento del rover con WASD, la linterna iluminando el suelo, el acercamiento al astronauta y la reacción de salto, cambio de color y texto "¡HOLA!".*

## Dificultades encontradas y cómo se resolvieron

1. **Problema con la orientación del cono de luz (linterna)**  
   Inicialmente el cono apuntaba hacia abajo. Se corrigió ajustando la rotación a `[-Math.PI / 2, 0, 0]` y posicionándolo en `[0, 0, 1.0]` respecto al grupo linterna.

2. **Astronauta aparecía bajo el suelo**  
   La posición Y del astronauta era demasiado baja para su escala (8). Se subió a `position={[1, 4, 2]}` y se ajustó el texto a `[0, 6, 0]` para que sea visible.

3. **Texto "¡HOLA!" no se veía**  
   Debido al enorme tamaño del astronauta, el texto quedaba oculto. Se aumentó el fontSize a 1.2 y la altura a 6 unidades.

4. **Falta de estrellas y cielo no envolvente**  
   Se agregó `<Stars>` con 5000 partículas y `Environment preset="night" background={true}` para conseguir un cielo esférico sin bordes.

5. **Suelo finito (se veían los bordes del plano)**  
   Se amplió el plano a 200×200 unidades y se configuró la textura para que se repita 30 veces en cada dirección, dando sensación de infinito.

## Uso de IA

Durante el desarrollo se emplearon herramientas de inteligencia artificial de forma auxiliar:

- **Prompts para mejorar la linterna**  
  *“¿Cómo hacer un cono de luz que apunte hacia adelante con React Three Fiber?”* – Se obtuvo la idea de usar un `coneGeometry` con rotación y material emisivo.

- **Prompts para el salto del astronauta**  
  *“Necesito que un personaje salte cuando se acerca otro objeto, manteniendo la escala actual.”* – Se implementó la lógica de `useFrame` con temporizador y movimiento parabólico.

- **Prompts para cielo infinito**  
  *“¿Cómo eliminar el horizonte cuadrado y tener un cielo estrellado envolvente?”* – Se recomendó usar `Environment preset="night" background={true}`.


## Verificación manual por el estudiante

Se realizaron las siguientes comprobaciones:

- **Movimiento del rover** con teclas WASD en todas las direcciones; se verificó que la rotación del rover siga la dirección.
- **Linterna**: el cono amarillo y el halo son visibles; la luz spotlight ilumina el suelo y proyecta sombras.
- **Cámara interactiva** (OrbitControls): pan, zoom y rotación funcionan correctamente.
- **Cercanía al astronauta**: se probó acercando el rover a diferentes distancias; el umbral `3.5` activa salto, cambio de color y texto.
- **Escena visual**: el suelo se extiende sin bordes visibles, las rocas están dispersas y el cielo estrellado cubre todo el horizonte.
- **Rendimiento**: la escena se mantiene a 60 FPS en hardware estándar.

No se encontraron errores ni comportamientos inesperados. La escena es totalmente funcional y reproducible.

## Estructura de archivos del ejercicio

```
ejercicio_2_escena_3d_interactiva/
├── README.md                     (este archivo)
├── package.json
├── public/
│   ├── models/
│   │   ├── Rover.glb
│   │   ├── Astronauta.glb
│   │   └── linterna1.glb
│   └── textures/
│       └── red/
│           └── red_laterite_soil_stones_diff_4k.jpg
├── src/
│   ├── App.jsx                   
│   ├── main.jsx
│   └── index.css
└── media/
    ├── captura_1.png
    ├── captura_2.png
    └── demo.gif
```

## Conclusión

El ejercicio 2 cumple con todos los requisitos técnicos y de documentación solicitados en el examen. La escena 3D interactiva demuestra el uso correcto de jerarquías, transformaciones, materiales PBR, iluminación, animaciones, interacciones entre elementos y control por el usuario, todo ello integrado en una temática de exploración espacial.
