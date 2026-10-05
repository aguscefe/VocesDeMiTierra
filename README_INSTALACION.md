> **VPS ya publicado:** sigue SUBIR_TODO.md para aplicar este paquete y cargar el nuevo catálogo.

# Voces de mi Tierra — React + Laravel + MariaDB

Este paquete conecta el frontend a una API Laravel 12. Los datos se guardan en MariaDB; el navegador no guarda contraseñas ni una base de datos simulada. Los pagos y las cotizaciones de envío son exclusivamente de demostración. No existe integración bancaria ni compra de guías reales.

## Estructura

- `src/`: interfaz React y cliente de API.
- `backend/`: Laravel, controladores, migraciones, seeder y pruebas.
- `database/instalar_tablas.sql`: alternativa SQL a las migraciones, sin DROP ni credenciales.
- `deploy/nginx.conf`: configuración del dominio nuevo.
- `deploy/update.sh`: actualización posterior desde GitHub.

PHP 8.2 o superior, Composer 2, MariaDB 10.4 o superior y Node 22.12+ (se recomienda 24). Extensiones PHP: PDO MySQL, mbstring, DOM/XML, ctype, fileinfo, tokenizer, openssl, curl y zip. Se usan cookies de sesión, CSRF y contraseñas Hash; no hace falta instalar Sanctum.

## 1. Crear el repositorio desde Windows

Extrae el ZIP en una carpeta nueva. Abre esa carpeta en VS Code. En GitHub crea un repositorio VACÍO `vocesdemitierra`, sin README inicial. En la terminal de esa carpeta:

```powershell
git init
git add .
git commit -m "Voces de mi Tierra con API Laravel y MariaDB"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/vocesdemitierra.git
git push -u origin main
```

El `.gitignore` excluye `.env`, vendor, node_modules y archivos subidos. No incluyas contraseñas ni la base de datos de producción. Si el repositorio es privado, configura una deploy key de lectura en el VPS; no pongas un token en la URL.

## 2. Descargar en el VPS

Desde PowerShell:

```powershell
ssh -p 22022 root@129.121.63.189
```

Dentro del VPS, usando el usuario `deploy` que ya existe:

```bash
mkdir -p /var/www/vocesdemitierra
chown deploy:www-data /var/www/vocesdemitierra
sudo -u deploy git clone https://github.com/TU_USUARIO/vocesdemitierra.git /var/www/vocesdemitierra
cd /var/www/vocesdemitierra
sudo -u deploy npm ci
sudo -u deploy npm run build
cd backend
sudo -u deploy composer install --no-dev --prefer-dist --optimize-autoloader
sudo -u deploy cp .env.example .env
nano .env
```

Configura:

```dotenv
APP_ENV=production
APP_DEBUG=false
APP_URL=https://vocesdemitierra.duckdns.org
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=vocesdemitierra
DB_USERNAME=voces_user
DB_PASSWORD="TU_CLAVE_REAL"
SESSION_DRIVER=file
SESSION_SECURE_COOKIE=true
SESSION_COOKIE=voces_session
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

Usa la contraseña que ya creaste. Si contiene comillas o símbolos especiales, respeta el formato dotenv. No copies un `.env` de Tutorías: esta aplicación necesita su propia APP_KEY.

```bash
sudo -u deploy php artisan key:generate
chown deploy:www-data .env
chmod 640 .env
chown -R deploy:www-data storage bootstrap/cache
chmod -R ug+rwX storage bootstrap/cache
sudo -u deploy php artisan storage:link
```

## 3. Tablas: elige UNA opción

La base `vocesdemitierra` y `voces_user` ya están creados en tu VPS. No necesitan recrearse.

**Opción recomendada — migraciones:**

```bash
cd /var/www/vocesdemitierra/backend
sudo -u deploy php artisan migrate --force
```

**Alternativa — SQL:** solo si la base aún no tiene tablas:

```bash
cd /var/www/vocesdemitierra
mysql -u voces_user -p vocesdemitierra < database/instalar_tablas.sql
```

El SQL registra la misma migración en la tabla `migrations`. No ejecutes ambos procedimientos sobre tablas ya creadas. No uses `migrate:fresh` en una base con información que quieras conservar.

## 4. Datos de demostración y primera cuenta administrativa

El seeder funciona exclusivamente si `users` está vacío. Agrega temporalmente en `backend/.env`:

```dotenv
DEMO_SEED=true
DEMO_PASSWORD="UNA_CLAVE_DE_PRUEBA_QUE_ELIJAS"
```

```bash
cd /var/www/vocesdemitierra/backend
sudo -u deploy php artisan db:seed --force
```

Se crean perfiles ficticios, productos, consentimientos, pedidos históricos, pagos sandbox, favoritos, reseñas y tickets. Correos principales:

- `consumidor@vocesdemo.mx`
- `productor@vocesdemo.mx`
- `admin@vocesdemo.mx`

La contraseña es `DEMO_PASSWORD` y se guarda como hash. Después configura `DEMO_SEED=false` y quita `DEMO_PASSWORD` del `.env`.

Si quieres los botones de acceso rápido que venían en el prototipo, usa `DEMO_PASSWORD=Demo1234` al cargar datos y `VITE_DEMO_LOGIN=true` en el `.env` de la RAÍZ antes de compilar. Eso crea un entorno abierto de prueba con cuentas conocidas, incluido el administrador. Para una instalación privada usa una clave propia y deja los botones desactivados.

Para iniciar SIN datos de prueba, crea el administrador con Tinker (correo y clave elegidos por ti):

```bash
sudo -u deploy php artisan tinker
```

```php
\App\Models\User::create(['id'=>(string)\Illuminate\Support\Str::uuid(),'name'=>'Administrador','email'=>'TU_CORREO','password'=>'TU_CLAVE','phone'=>'TU_TELEFONO','role'=>'admin','status'=>'active']);
exit
```

El registro web solo crea consumidores o productores, nunca administradores.

## 5. Nginx y HTTPS

Este archivo configura solamente el dominio nuevo. Comprueba que DuckDNS contiene la IP `129.121.63.189` y que el puerto HTTP 80 y HTTPS 443 están disponibles para la web.

```bash
cd /var/www/vocesdemitierra
PHP_VERSION=$(php -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;')
PHP_SOCKET="/run/php/php${PHP_VERSION}-fpm.sock"
test -S "$PHP_SOCKET"
sed "s|__PHP_SOCKET__|$PHP_SOCKET|g" deploy/nginx.conf > /etc/nginx/sites-available/vocesdemitierra
ln -s /etc/nginx/sites-available/vocesdemitierra /etc/nginx/sites-enabled/vocesdemitierra
nginx -t
```

Solo cuando `nginx -t` indique éxito:

```bash
systemctl reload nginx
certbot --nginx -d vocesdemitierra.duckdns.org
```

Si `test -S` falla, ejecuta `ls /run/php/` y usa el socket del PHP-FPM instalado (8.2 o superior). No recargues con una configuración inválida. Certbot ya puede estar instalado por tu primera página; si el comando no existe, instala `certbot` y `python3-certbot-nginx` mediante el gestor de paquetes del VPS.

```bash
cd /var/www/vocesdemitierra/backend
sudo -u deploy php artisan config:cache
sudo -u deploy php artisan view:cache
curl -I https://vocesdemitierra.duckdns.org
curl https://vocesdemitierra.duckdns.org/api/health
```

Abre el dominio por HTTPS, inicia sesión y prueba un pedido. Para depurar un error 500, revisa `backend/storage/logs/laravel.log`; no publiques el `.env`.

## 6. Recorrido funcional

1. Registra una cuenta de productor.
2. Administrador: aprueba el productor en su panel.
3. Productor: carga fotografías, completa la publicación y sus consentimientos.
4. Administrador: publica la pieza. La autorización del productor y el consentimiento son obligatorios.
5. Consumidor: agrega al carrito y cotiza envío antes del pago.
6. Checkout: tarjeta 4242 4242 4242 4242 aprueba; 4000 0000 0000 0002 rechaza. No ingresa información bancaria real. Una compra con varios productores genera un pedido y envío por cada uno.
7. Productor: prepara y captura paquetería y guía.
8. Consumidor: confirma recepción, envía reseña o solicita devolución.
9. Administrador: revisa reseñas, tickets y reembolsos sandbox.
10. Productor: descarga QR o retira consentimiento. El retiro pausa la publicación y desactiva el QR.

Los importes, existencias, permisos y cambios de estado se validan en el servidor. El envío simulado parte de $130 por productor y aumenta según peso físico o volumétrico. Comisión: 10% del producto; neto: 90%. Procesamiento interno: 3.6% del total del pedido + $3; no se cobra realmente.

## 7. Actualizar desde GitHub

```bash
sudo -u deploy bash /var/www/vocesdemitierra/deploy/update.sh
```

El script usa `git pull --ff-only`, compila el frontend, instala las dependencias fijadas en Composer y ejecuta solo migraciones pendientes. No regenera APP_KEY ni vuelve a cargar datos.

## Pruebas de desarrollo

```bash
npm ci
npx tsc --noEmit
npm run build
cd backend
composer install
```

Las pruebas PHP requieren una base SEPARADA `vocesdemitierra_test`. El guard de las pruebas impide ejecutarlas con un nombre que no termine en `_test`. Crea un usuario exclusivo para esa base, copia `.env.testing.example` a `.env.testing`, configura sus credenciales y ejecuta:

```bash
php artisan config:clear
php artisan test
```

No uses las credenciales ni el nombre de la base publicada para pruebas. Las pruebas recrean las tablas de la base de pruebas.

## Alcance de esta entrega

Incluye persistencia y flujos del marketplace, registro/login, permisos, publicación, aprobación, carrito, checkout sandbox, pedidos, guía manual, reseñas, notificaciones internas, soporte, perfiles, consentimientos, QR, estadísticas basadas en pedidos, CSV y bitácora. El seeder es opcional y los datos son ficticios.

No integra pagos reales, compra de guías, seguimiento automático de paqueterías ni traducción validada por hablantes de maya. La actualización incorpora traducción automática mediante Azure Translator, pendiente de configurar la clave del servicio; consulta ACTUALIZACION.md. Las notificaciones son internas, no se envían correos ni WhatsApp. Los paneles se reorganizaron para conectar las operaciones a la API; no son una réplica exacta de los paneles originales. No se incluyen recorte de imágenes, chat en tiempo real ni restablecimiento de contraseñas por correo. Estos servicios necesitan una ampliación específica si los quieres antes de abrir a usuarios reales.
