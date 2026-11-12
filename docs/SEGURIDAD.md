# Seguridad y datos

## Alcance actual

La aplicación no solicita credenciales AWS ni administra recursos remotos. Los permisos IAM del taller son un modelo educativo simplificado, sin conexión a una cuenta real.

Los apuntes y el progreso se guardan sin cifrar en localStorage. No conviene escribir secretos ni información sensible. Quien tenga acceso al perfil del navegador podría acceder a esos datos. Borrar los datos del sitio puede eliminar el progreso: exportar una copia antes de hacerlo.

La importación valida estructura, tipos, IDs y tamaño máximo del archivo. Los textos de apuntes se escapan al incorporarse al HTML. Los enlaces externos se abren con protecciones de relación. El caché utiliza una lista explícita de archivos y valida el shell para evitar almacenar una página de acceso como si fuera la aplicación.

## Publicación y privacidad

La autorización del alojamiento privado no forma parte de esta aplicación estática. Copiar el código a otro servidor no conserva automáticamente ese control de acceso. Publicar el repositorio permite ver el código; publicar una demo permite usarla según los permisos del nuevo alojamiento.

El paquete no contiene credenciales, historial de Git, datos reales de progreso ni configuración privada del alojamiento de origen. Las capturas muestran una sesión de demostración sin apuntes personales.

## Límites y mejoras posibles

No se afirma haber realizado una auditoría de seguridad ni una prueba de penetración. Antes de convertirla en un producto con cuentas, pagos o sincronización habría que diseñar autenticación, autorización, almacenamiento seguro, gestión de sesiones, tratamiento de datos y pruebas específicas. La versión actual mantiene ese alcance fuera del producto.
