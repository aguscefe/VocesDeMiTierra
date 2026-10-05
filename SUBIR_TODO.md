# Subir todo junto: perfiles, catálogo y traductor

Este ZIP contiene el proyecto completo actualizado y las 12 fotografías generadas. Reemplaza la actualización anterior. Para tu VPS ya publicado usa estos pasos; no reinstales Nginx, no regeneres APP_KEY ni recrees la base de datos.

## 1. Visual Studio Code / Windows
Extrae el ZIP sobre la carpeta de tu repositorio VocesDeMiTierra. Acepta reemplazar los archivos. La raíz debe contener package.json y backend. No borres .git ni tu .env: el paquete no incluye ninguno.

En la terminal de VS Code:

```powershell
git add .
git commit -m "Agrega perfiles editables traductor y catálogo con fotografías"
git push origin main
```

Las nuevas fotografías de public/demo/artesanos y public/demo/productos se suben como archivos normales de Git. El logo y las imágenes antiguas mantienen Git LFS.

## 2. Dentro del VPS por SSH
Ejecuta uno por uno y detente si alguno falla:

```bash
cd /var/www/vocesdemitierra
sudo -u deploy git pull --ff-only origin main
sudo -u deploy git lfs pull
sudo -u deploy npm run build
cd backend
sudo -u deploy php artisan config:clear
sudo -u deploy php artisan migrate --force
sudo -u deploy php artisan voces:demo
```

El último comando te pide una contraseña de al menos 8 caracteres para las cuatro cuentas de artesanos ficticios. Se guarda como hash. Puedes elegir la misma que usas para tu demostración. No crea ni cambia el administrador. Si repites este comando conserva tus ediciones, existencias y consentimientos retirados, y no duplica los ocho productos. Tampoco borra registros anteriores.

Si configuraste DEMO_PASSWORD anteriormente, usa esa clave para las cuentas nuevas; el comando no la solicitará. Quítala del .env después de la carga y deja DEMO_SEED=false.

## 3. Administrador
Si todavía no existe:

```bash
sudo -u deploy php artisan voces:admin admin@gmail.com
```

Introduce y confirma la contraseña que solicitaste en el chat. Si ya existe el correo, el comando se detiene y conserva esa cuenta. No introduzcas contraseñas en archivos que subes a GitHub.

## 4. Artesanos de ejemplo

| Nombre ficticio | Taller ficticio | Municipio | Cuenta |
|---|---|---|---|
| Ana Castillo | Tejidos Brisa del Sur | Felipe Carrillo Puerto | ana@voces.example |
| Mateo Torres | Maderas Laguna | Bacalar | mateo@voces.example |
| Elena Santos | Barro del Caribe | Tulum | elena@voces.example |
| Lucía Ramos | Fibras del Sol | José María Morelos | lucia@voces.example |

Los correos .example son identificadores para iniciar sesión, no buzones de correo reales. Cada artesano tiene dos productos: rebozo y bolsa; cuenco y portavasos; vasija y tazas; canasta y mantel individual. Incluyen precio, stock, materiales, técnica, peso/dimensiones, ficha de demostración, autorización simulada y QR. Todas las fotografías están dentro del proyecto y no dependen de Unsplash.

No se fabrican pedidos, ventas, reseñas ni ingresos para este catálogo nuevo. Si ya cargaste datos históricos anteriores se conservan.

## 5. Edición de perfil
Todas las cuentas (administrador, consumidor y productor) pueden cambiar nombre, teléfono y foto desde Perfil. Los productores pueden editar también taller, biografía, municipio, comunidad, idiomas, artesanías y experiencia. Subida JPG/PNG/WebP hasta 5 MB. Los cambios son persistentes y se muestran en la ficha pública del productor. Cada cuenta puede modificar únicamente su propio perfil.

## 6. Activar el traductor
La API está integrada; para traducir texto real tienes que configurar un recurso Azure Translator en tu cuenta. Consulta https://learn.microsoft.com/en-us/azure/ai-services/translator/text-translation/reference/authentication

En el VPS:

```bash
cd /var/www/vocesdemitierra/backend
nano .env
```

Agrega:

```dotenv
AZURE_TRANSLATOR_KEY="TU_CLAVE_DEL_RECURSO"
AZURE_TRANSLATOR_REGION="REGION_DEL_RECURSO"
```

Usa la región que corresponde a tu recurso; puede quedar vacía cuando tu recurso global no exige región. Guarda y ejecuta:

```bash
sudo -u deploy php artisan config:clear
```

La clave permanece en el servidor; no la pongas en GitHub ni la compartas por chat. La integración utiliza es ↔ yua y limita 3000 caracteres por solicitud y 10 solicitudes/minuto por IP. El texto se envía a Microsoft. La cuenta/clave del servicio no está incluida en este ZIP. El dictado es en español; la lectura de maya necesita una voz compatible del dispositivo. No hay reconocimiento de voz maya implementado.

## 7. Comprobar
Abre https://vocesdemitierra.duckdns.org/catalogo y /productores; busca las nuevas ocho piezas y sus talleres. Inicia sesión con un artesano de ejemplo, cambia su perfil/foto y comprueba la ficha pública. Registra un consumidor para comprar en modo sandbox. Comprueba el traductor después de configurar la clave.

Verificado en desarrollo: TypeScript, compilación Vite, sintaxis PHP y 11 pruebas / 59 aserciones, incluida carga repetida junto a un administrador existente y conservación de cambios. La API de Azure se probó con respuestas simuladas; falta probarla con tu clave real.
