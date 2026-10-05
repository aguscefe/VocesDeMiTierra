# Actualizar el diseño de Voces de mi Tierra

Este ZIP contiene una actualización del proyecto existente. Extrae sus archivos **dentro de la raíz de tu proyecto**, donde están `package.json`, `src` y `backend`, y acepta reemplazar los archivos coincidentes. No borres carpetas ni reemplaces el proyecto completo. Conserva las 38 fotos, cuentas, pedidos, certificados y datos actuales. No contiene ni sustituye `.env`.

## Qué incluye

- Header con navegación activa, carrito y selector persistente Español / Maya.
- Tarjetas redondeadas: clic para abrir la pieza, corazón para favoritos y botón independiente para añadir al carrito.
- Tarjetas de artesanos con fotografía y origen al pasar el cursor, enfocar o tocar.
- Banners, filtros, catálogo, perfiles, detalle de piezas y trazabilidad con color, fotografías y animaciones discretas.
- Paneles de cliente, artesano y administrador con estructura común y colores propios, pedidos con fotografías y direcciones, y gráficas conectadas a los datos existentes. Mantienen la actualización automática cada 30 segundos mientras la página está visible.
- Intérprete con mascota que reacciona al escuchar, traducir y reproducir la voz. Conserva Azure y el servicio de dictado maya instalado.
- Interfaz en maya mediante Azure Translator: traduce el texto visible, etiquetas y nuevas vistas al navegar. Conserva nombres marcados, importes, identificadores y valores de formularios. Las conversaciones del intérprete mantienen su idioma de origen y destino.

## 1. En tu PC, terminal de VS Code / PowerShell

Ejecuta desde la carpeta existente del proyecto, después de extraer el ZIP:

```powershell
git add src public/design .gitattributes backend/app/Http/Controllers/Api/TranslationController.php backend/routes/web.php backend/tests/Feature/PageTranslationTest.php ACTUALIZAR_DISENO_COLOR_MAYA.md
git diff --cached --stat
git commit -m "Rediseñar Voces con color, paneles e interfaz maya"
git push
```

No agregues `.env`, `node_modules`, `vendor`, entornos virtuales ni claves. El ZIP no añade dependencias.

## 2. En el VPS, conectado por SSH

Ejecuta los bloques en orden. Si `git pull` falla por cambios locales o conflictos, detente y conserva su mensaje; no uses `reset --hard`.

```bash
cd /var/www/vocesdemitierra
sudo -u deploy git pull --ff-only
sudo -u deploy git lfs pull
```

Después de que los dos comandos anteriores terminen correctamente:

```bash
cd /var/www/vocesdemitierra/backend
sudo -u deploy php artisan optimize:clear
sudo -u deploy php artisan route:list --path=translate
cd /var/www/vocesdemitierra
sudo -u deploy npm run build
```

No requiere migraciones, volver a cargar el catálogo ni regenerar la clave de Laravel. No modifica Nginx, el servicio de dictado ni la otra página alojada en el VPS.

## 3. Comprueba en la web

Abre https://vocesdemitierra.duckdns.org y recarga con Ctrl + F5. En celular recarga o elimina la caché del sitio si ves el diseño anterior.

Comprueba favoritos, carrito, filtros, origen de artesanos, zoom de fotografías y los tres paneles. Selecciona Maya en el header, espera la traducción y navega; vuelve a ES para restaurar el español. Esta opción usa las claves de Azure ya configuradas en el backend, consume cuota de Translator y almacena las traducciones en la caché de Laravel durante 30 días. Si Azure falla, la página conserva su texto y muestra un aviso para reintentar. Los textos a traducir se envían a Azure.

Los pagos de prueba conservan su funcionamiento y no cobran dinero. Las gráficas usan pedidos y pagos de la base de datos, incluidos los registros nuevos que se creen posteriormente.

## Comprobaciones realizadas

Pasaron TypeScript, compilación de producción y 20 pruebas del backend (350 comprobaciones), incluidas traducción por lotes, caché, límites y errores de Azure. También se probaron navegación, filtros, carrito, favoritos, zoom, cambios de idioma y paneles en navegador de escritorio y celular con API simulada. Se comprobó la carga de las imágenes incluidas.

La traducción automática requiere revisión lingüística. En esta sesión no se probó una clave real de Azure ni una grabación maya real; el rediseño conserva el reconocimiento de voz anterior y no garantiza su precisión. Las animaciones respetan la preferencia del dispositivo de reducir movimiento.
