# Arquitectura y decisiones técnicas

## Flujo de datos

`index.html` carga datos, profundidad de lecciones, talleres y la lógica principal. `app.js` renderiza cada vista en `#app`. Las lecciones conservan IDs estables: el progreso utiliza esos IDs y no la posición visible de los módulos.

`data.js` ofrece datos base y metadatos; `depth.js` agrega a cada lección el funcionamiento, la analogía, los usos y las comparaciones. `workshops.js` concentra los talleres y las 95 entradas del glosario.

## Persistencia

| Clave | Datos |
| --- | --- |
| `aws-flopy-v1` | Lecciones estudiadas, tarjetas conocidas, apuntes, resultados y desafíos completados |
| `aws-flopy-appearance-v1` | Paleta y modo de pantalla |

El guardado es local al origen y al navegador. No hay sincronización entre equipos. La exportación produce un JSON que se valida antes de importar; no constituye cifrado ni un respaldo remoto automático.

## Ciclo de actualización PWA

El service worker precarga un conjunto explícito de archivos. Comprueba que el HTML sea el shell educativo antes de almacenarlo. Si un archivo necesario falla, la nueva precarga no se considera completa. Las rutas de autenticación y las solicitudes de terceros se dejan pasar a la red.

Las navegaciones al inicio intentan usar la red y recurren al shell guardado si no hay conexión. Los archivos estáticos conocidos se leen del caché. Una nueva versión espera activación y la interfaz ofrece «Actualizar app». Al activarse, elimina cachés anteriores con el prefijo propio, sin borrar localStorage ni cachés ajenos.

Para cambiar archivos precargados hay que actualizar tanto el nombre de caché como el marcador del shell en `sw.js` e `index.html`, y ajustar las expectativas de `tests/pwa.test.mjs`.

## Personalización

La preferencia se restaura antes de dibujar la interfaz. CSS usa atributos de tema y variables para separar fondo neutro, superficies, texto, acentos y estados semánticos. Las tarjetas de repaso conservan ambas caras en el DOM y cambian una transformación 3D; no se reconstruyen al pulsar revelar. El movimiento se desactiva cuando el sistema solicita reducir animaciones.

## Mantenimiento

Los archivos finales de `dist/` son editables directamente. No debe ejecutarse un script histórico de migración como si fuera una compilación habitual: podría reemplazar cambios posteriores de interfaz o glosario. Ver las instrucciones de `content/README.md`.
