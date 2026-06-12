"""
Ejercicio 1 - Procesamiento visual e IA
Requisitos:
1. Cargar imagen/video
2. Escala de grises
3. Otro espacio de color (HSV)
4. Suavizado (Gaussiano)
5. Detección de bordes (Canny)
6. Segmentación/detección (umbralización + contornos)
7. Guardar resultados intermedios y finales
8. Documentar parámetros
"""

import cv2
import numpy as np
import os

# ------------------------------------------------------------
# 0. Configuración: rutas y parámetros
# ------------------------------------------------------------
# Obtén la carpeta donde está este script (src)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# La imagen está en la carpeta 'data' al mismo nivel que 'src'
INPUT_IMAGE = os.path.join(BASE_DIR, "../data/sudoku.png")
# Los resultados se guardarán en 'resultados' al mismo nivel que 'src'
OUTPUT_DIR = os.path.join(BASE_DIR, "../resultados")

# Asegurar que la carpeta media existe
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Parámetros (justificación en README)
GAUSSIAN_KERNEL = (5, 5)   # Tamaño del kernel (impar, impar)
GAUSSIAN_SIGMA = 1.5       # Desviación estándar
CANNY_THRESH1 = 50         # Umbral inferior
CANNY_THRESH2 = 150        # Umbral superior
# Para segmentación: umbral de binarización (0-255)
BINARY_THRESH = 127

# ------------------------------------------------------------
# 1. Cargar imagen
# ------------------------------------------------------------
img = cv2.imread(INPUT_IMAGE)
if img is None:
    raise FileNotFoundError(f"No se pudo cargar la imagen: {INPUT_IMAGE}")
img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # para mostrar bonito

# ------------------------------------------------------------
# 2. Escala de grises
# ------------------------------------------------------------
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
cv2.imwrite(os.path.join(OUTPUT_DIR, "1_grayscale.jpg"), gray)

# ------------------------------------------------------------
# 3. Otro espacio de color: HSV (también se puede LAB)
# ------------------------------------------------------------
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
cv2.imwrite(os.path.join(OUTPUT_DIR, "2_hsv.jpg"), hsv)

# (Opcional: guardar los canales HSV por separado para comparar)
h, s, v = cv2.split(hsv)
cv2.imwrite(os.path.join(OUTPUT_DIR, "2_hue.jpg"), h)
cv2.imwrite(os.path.join(OUTPUT_DIR, "2_saturation.jpg"), s)
cv2.imwrite(os.path.join(OUTPUT_DIR, "2_value.jpg"), v)

# ------------------------------------------------------------
# 4. Suavizado (Filtro Gaussiano)
# ------------------------------------------------------------
blurred = cv2.GaussianBlur(gray, GAUSSIAN_KERNEL, GAUSSIAN_SIGMA)
cv2.imwrite(os.path.join(OUTPUT_DIR, "3_gaussian_blur.jpg"), blurred)

# (Alternativa: filtro de mediana, comentado)
# blurred_median = cv2.medianBlur(gray, 5)
# cv2.imwrite(os.path.join(OUTPUT_DIR, "3_median_blur.jpg"), blurred_median)

# ------------------------------------------------------------
# 5. Detección de bordes (Canny)
# ------------------------------------------------------------
edges = cv2.Canny(blurred, CANNY_THRESH1, CANNY_THRESH2)
cv2.imwrite(os.path.join(OUTPUT_DIR, "4_canny_edges.jpg"), edges)

# (Alternativa: Sobel, comentado)
# sobelx = cv2.Sobel(blurred, cv2.CV_64F, 1, 0, ksize=3)
# sobely = cv2.Sobel(blurred, cv2.CV_64F, 0, 1, ksize=3)
# sobel_combined = cv2.magnitude(sobelx, sobely)
# sobel_combined = np.uint8(np.clip(sobel_combined, 0, 255))
# cv2.imwrite(os.path.join(OUTPUT_DIR, "4_sobel_edges.jpg"), sobel_combined)

# ------------------------------------------------------------
# 6. Segmentación o detección (método clásico: umbral + contornos)
# ------------------------------------------------------------
# Aplicamos umbral binario inverso para resaltar objetos
_, thresh = cv2.threshold(gray, BINARY_THRESH, 255, cv2.THRESH_BINARY_INV)
cv2.imwrite(os.path.join(OUTPUT_DIR, "5_threshold_binary.jpg"), thresh)

# Encontrar contornos
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Dibujar contornos sobre la imagen original (copia)
img_contours = img.copy()
cv2.drawContours(img_contours, contours, -1, (0, 255, 0), 2)
cv2.imwrite(os.path.join(OUTPUT_DIR, "6_contours_detection.jpg"), img_contours)

# Opcional: también podríamos segmentar por color en HSV (ej. detección de objetos rojos)
# Aquí mostramos un ejemplo simple de segmentación de color rojo en HSV
lower_red1 = np.array([0, 50, 50])
upper_red1 = np.array([10, 255, 255])
lower_red2 = np.array([170, 50, 50])
upper_red2 = np.array([180, 255, 255])
mask_red1 = cv2.inRange(hsv, lower_red1, upper_red1)
mask_red2 = cv2.inRange(hsv, lower_red2, upper_red2)
mask_red = cv2.bitwise_or(mask_red1, mask_red2)
cv2.imwrite(os.path.join(OUTPUT_DIR, "5b_red_segmentation.jpg"), mask_red)

# ------------------------------------------------------------
# 7. Guardar resultados comparativos (ya se fueron guardando)
# Adicionalmente, generamos una imagen de comparación en mosaico
# ------------------------------------------------------------
# Redimensionamos todas al mismo tamaño (por si acaso)
h, w = img.shape[:2]
images = [img_rgb, gray, hsv[:,:,0], blurred, edges, thresh]
titles = ["Original", "Grayscale", "Hue", "Gaussian Blur", "Canny Edges", "Threshold"]
# Ajustar tamaños: todas a (w, h)
resized = []
for im in images:
    if len(im.shape) == 2:
        im = cv2.cvtColor(im, cv2.COLOR_GRAY2BGR)
    else:
        im = cv2.cvtColor(im, cv2.COLOR_HSV2BGR) if im.shape[2]==3 and im is hsv[:,:,0] else im
    im = cv2.resize(im, (w, h))
    resized.append(im)

# Crear mosaico 2x3
top_row = np.hstack((resized[0], resized[1], resized[2]))
bottom_row = np.hstack((resized[3], resized[4], resized[5]))
mosaic = np.vstack((top_row, bottom_row))
cv2.imwrite(os.path.join(OUTPUT_DIR, "7_comparison_mosaic.jpg"), mosaic)

# ------------------------------------------------------------
# 8. Documentación en consola (para el README)
# ------------------------------------------------------------
print("=== Procesamiento completado ===")
print(f"Resultados guardados en: {OUTPUT_DIR}")
print("Parámetros utilizados:")
print(f"  - Gaussian kernel: {GAUSSIAN_KERNEL}, sigma={GAUSSIAN_SIGMA}")
print(f"  - Canny thresholds: {CANNY_THRESH1}, {CANNY_THRESH2}")
print(f"  - Binary threshold: {BINARY_THRESH}")
print("\nArchivos generados:")
for f in sorted(os.listdir(OUTPUT_DIR)):
    if f.endswith(('.jpg', '.png')):
        print(f"  - {f}")

# Si quieres mostrar las imágenes en ventanas (opcional, comenta si no)
# cv2.imshow("Original", img)
# cv2.imshow("Gray", gray)
# cv2.imshow("Edges", edges)
# cv2.waitKey(0)
# cv2.destroyAllWindows()