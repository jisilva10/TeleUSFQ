# USFQ TV Display

Pantalla para la tele Samsung (navegador Tizen). Es **un solo `index.html`** con HTML, CSS y JavaScript ES5.
No usa React, ni framer-motion, ni polyfills, así que corre en los navegadores Tizen viejos.

## Contenido

Las imágenes salen de carpetas públicas de Google Drive (los IDs están en `FOLDERS`, dentro de `index.html`):

| Carpeta  | Uso                                  |
|----------|--------------------------------------|
| artes    | Tarjetas a pantalla completa (10 s c/u) |
| platinum / golden / silver / red | Logos de la "Red de beneficios" |

- Para agregar o quitar contenido basta con cambiar los archivos en Drive. La tele vuelve a leer las carpetas cada 15 minutos y aplica los cambios al inicio del siguiente ciclo.
- Las imágenes se muestran **ordenadas por nombre de archivo**. Si quieres un orden específico, renómbralas como `01 ...`, `02 ...`, etc.
- Google entrega las imágenes ya redimensionadas: 1920×1080 para las artes y 480×360 para los logos. Puedes subir archivos grandes sin problema.

## Robustez

- Si no hay internet al prender la tele, reintenta sola (y usa la última lista guardada).
- Si una imagen no carga en 20 s, se salta.
- Cada 6 horas recarga la página completa, pero solo si el servidor responde, para limpiar memoria del navegador de la tele.

## Diagnóstico

Abre la página con `?debug=1` al final de la URL para ver un registro en la esquina inferior izquierda.

## Desarrollo

```bash
npm install
npm run dev      # servidor local
npm run build    # genera dist/ (index.html + imágenes de public/)
```
