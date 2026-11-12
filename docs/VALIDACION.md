# Validación

## Comprobaciones automatizadas

| Archivo | Qué valida |
| --- | --- |
| `content.test.mjs` | 178 lecciones, IDs estables, referencias, respuestas y orden de 19 módulos |
| `depth.test.mjs` | Seis apartados por lección, mecanismos, analogías y carga de archivos |
| `pwa.test.mjs` | Manifest, íconos, precarga, fallback offline, aislamiento de autenticación y actualización |
| `refresh.test.mjs` | 9 desafíos, 95 términos completos y ordenados, preferencias de las 10 combinaciones de apariencia |

Ejecutar desde la raíz: `npm test`. Los tests del service worker usan un entorno simulado; no sustituyen pruebas en dispositivos reales.

## Revisión manual de esta entrega

Se abrió la versión actual en navegador y se capturaron inicio, lección, tarjeta revelada, taller IAM y glosario oscuro. En revisiones previas se comprobaron el giro, la persistencia de preferencias y la solución del desafío de costos. Las capturas no representan pruebas exhaustivas de todos los dispositivos.

## Checklist para futuras versiones

- Abrir la app con conexión y esperar disponibilidad offline.
- Crear un apunte de prueba, recargar y verificar su conservación.
- Revelar una tarjeta y volver a su pregunta.
- Completar un desafío correcto y probar una respuesta incorrecta.
- Cambiar paleta y modo; comprobar contraste y recarga.
- Exportar e importar progreso de prueba.
- Comprobar el aviso de nueva versión y volver a abrir sin conexión.
- Probar navegación por teclado y una pantalla móvil real.
