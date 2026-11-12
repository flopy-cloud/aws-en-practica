# Subir el proyecto a GitHub

## Desde la web

1. Descomprimir el ZIP y abrir la carpeta `aws-en-practica`.
2. Crear un repositorio llamado `aws-en-practica` en tu cuenta de GitHub. Elegir su visibilidad y dejar desmarcada la creación automática de README, licencia y gitignore: este paquete ya contiene README y gitignore.
3. Usar **Add file → Upload files** y subir el contenido de la carpeta. `README.md`, `dist/`, `docs/` y `tests/` deben quedar en la raíz, sin otra carpeta contenedora.
4. Comprobar que `.github/workflows/ci.yml` también se haya subido; algunos selectores ocultan carpetas que empiezan con punto.
5. Guardar el commit y revisar que README e imágenes se vean correctamente.
6. En **About**, usar la descripción y los temas sugeridos debajo. Revisar la pestaña **Actions** para comprobar la primera ejecución de pruebas.

## Desde VS Code y Git

Abrir `aws-en-practica` en VS Code. Crear primero un repositorio vacío en GitHub y copiar su URL SSH exacta. En la terminal:

```bash
git init
git add .
git commit -m "Presentar AWS en práctica: PWA educativa y documentación"
git branch -M main
```

Después ejecutar `git remote add origin URL_SSH_COPIADA` reemplazando el marcador por la URL real, y luego `git push -u origin main`. Requiere tener Git y la autenticación de GitHub configurados.

## Presentación sugerida

**Descripción:** PWA educativa en español para aprender AWS con 178 lecciones, tarjetas de repaso, desafíos, talleres interactivos y acceso sin conexión.

**Temas:** `aws`, `cloud-practitioner`, `pwa`, `javascript`, `cloud-computing`, `devsecops`, `educacion`.

Para destacar el proyecto, fijar el repositorio en el perfil y usar una captura de `docs/images/` como vista previa social.

## Código y demo son publicaciones distintas

Este paquete está listo para subir; no crea por sí solo un repositorio en tu cuenta ni publica una demo. El enlace privado actual puede requerir acceso y no sirve como demo pública para cualquier reclutador. Las capturas y la ejecución local permiten revisar el proyecto sin cambiar esa privacidad.

La aplicación usa rutas absolutas desde `/` para la PWA. Un servidor en la raíz del dominio funciona directamente; para alojarla en un subdirectorio, como una página de proyecto de GitHub Pages, se deben adaptar manifest, service worker y rutas antes de publicar.

No se añade una licencia de reutilización automática. Publicar el código no obliga a conceder una licencia permisiva: podés decidirla después según tus objetivos.
