# Actualización de Voces de Mi Tierra

Este ZIP reúne la lectura aproximada del maya, la corrección de imágenes, 30 productos nuevos (38 en el catálogo de ejemplo), certificados privados y PayPal de demostración.

## En Visual Studio Code

Extrae los archivos del ZIP en la raíz de tu proyecto existente y reemplaza los archivos correspondientes. Conserva `.git` y tu `.env`. El ZIP no contiene credenciales.

En la terminal de VS Code:

```bash
git add src backend public/demo .gitattributes ACTUALIZAR_LECTURA_CATALOGO_CERTIFICADOS.md
git commit -m "Corregir imagenes y agregar catalogo certificados y PayPal"
git push
```

## En el VPS

```bash
cd /var/www/vocesdemitierra
sudo -u deploy git pull --ff-only
sudo -u deploy git lfs pull
sudo -u deploy npm run build
cd backend
sudo -u deploy php artisan config:clear
sudo -u deploy php artisan migrate --force
sudo -u deploy php artisan voces:demo
```

No uses `migrate:fresh`, no importes otra vez el SQL inicial y no regeneres `APP_KEY`. Las migraciones agregan certificados y el método PayPal sin eliminar tus datos. El catálogo agrega las piezas nuevas y conserva existencias, contraseñas y modificaciones anteriores. Si faltan las cuentas de ejemplo, el comando solicitará una contraseña de al menos 8 caracteres.

Para permitir documentos privados y fotos:

```bash
cd /var/www/vocesdemitierra/backend
mkdir -p storage/app/private
chown -R deploy:www-data storage bootstrap/cache
chmod -R ug+rwX storage bootstrap/cache
```

Recarga el navegador con Ctrl + F5. Comprueba catálogo, una ficha y el formulario de publicación.

## Certificados

En Publicar una pieza, el productor carga PDF, JPG, PNG o WEBP de máximo 10 MB, además de las fotografías. El archivo se guarda en `storage/app/private` y se descarga solo mediante una ruta autenticada por su propietario o un administrador.

Al enviar una publicación, todos los administradores activos reciben una notificación. El panel actualiza los datos cada 30 segundos mientras está visible. En Certificados pueden descargar el documento y aprobarlo o rechazarlo. El rechazo requiere observaciones y el artesano puede cargar una versión corregida.

Aprobar un certificado no publica la pieza automáticamente: después debe publicarse desde Productos. No se permite publicar una pieza con un certificado pendiente o rechazado. Las piezas de ejemplo y publicaciones anteriores conservan su estado, sin atribuirles una certificación inexistente.

## Pagos

Tarjeta, PayPal, transferencia y pago pendiente operan sobre pedidos de demostración guardados en la base de datos. PayPal tiene cuenta precargada y autorización de demostración; no solicita contraseña ni conecta con PayPal. La tarjeta tiene datos de ejemplo de solo lectura. No se reciben datos financieros reales ni se efectúan cargos.

La interfaz conserva una indicación discreta de que no hay cargos. Las métricas y los movimientos provienen de la base de datos; no son transacciones financieras reales.

## Imágenes

El componente ya no oculta imágenes durante la carga. Esto evita el conflicto con imágenes en caché y la carga diferida. Todas las nuevas fotos viven en `public/demo/productos` y Vite las copia a `dist/demo/productos` al compilar.

Si una imagen sigue fallando, comprueba que el archivo exista en `dist/demo/productos` y revisa la respuesta de su URL. No reemplaces la configuración de Nginx ni los certificados HTTPS para instalar esta actualización.

## Traducción y voz

Se conserva la integración de Azure y sus variables `.env`. Cuando no existe voz compatible con maya yucateco se usa voz española con lectura aproximada, que no constituye guía de pronunciación. Se reproduce al traducir y mediante el altavoz de cada respuesta.

## Fotos del catálogo

Fotos generadas con el generador integrado. Prompt por pieza: fotografía individual de producto, sujeto y cantidad correspondientes al nombre del producto, fondo crema, luz natural suave, textura artesanal, encuadre cuadrado, pieza completa, sin personas, marcas ni textos. Los prompts específicos están en `public/demo/PROMPTS_CATALOGO.md`.
