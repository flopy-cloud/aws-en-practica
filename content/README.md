# Fuentes y mantenimiento del contenido

La versión que ejecuta la app está en `../dist/data.js`, `../dist/depth.js` y `../dist/workshops.js`.

| Archivo | Uso |
| --- | --- |
| `base-data.js` | Datos de partida para expandir las lecciones |
| `expand.py` | Expansión y organización del contenido base |
| `activities.py` | Incorpora actividades y metadatos educativos |
| `depth-0.txt`, `depth-1.txt`, `depth-2.txt` | Datos de mecanismos, analogías, usos y alternativas |
| `depth-use.txt` | Utilidad de cada lección |
| `build-depth.py` | Compila los apartados adicionales en `dist/depth.js` |
| `update-app.py` | Migración histórica de interfaz; no ejecutar como build habitual |

Para modificar una entrada del glosario, editar `dist/workshops.js`, conservando los cuatro campos y el ordenamiento español. Para una corrección puntual de una lección se pueden editar los archivos finales, documentando también su fuente cuando corresponda.

La secuencia histórica `python3 content/expand.py`, `python3 content/activities.py` y `python3 content/build-depth.py` reconstruye datos de lecciones; debe ejecutarse en una rama y revisarse con `git diff` y `npm test` antes de aceptar cambios. No reconstruye automáticamente las personalizaciones posteriores de talleres o interfaz.
