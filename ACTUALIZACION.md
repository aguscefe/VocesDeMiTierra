# Actualización: perfiles, imágenes, traductor y administrador

Esta actualización conserva tu base de datos. No uses migrate:fresh ni vuelvas a importar el SQL inicial.

## 1. En Windows / Visual Studio Code
Extrae VocesDeMiTierra-actualizacion.zip sobre la carpeta de tu repositorio, reemplazando los archivos. El ZIP contiene solo archivos modificados. No contiene .env, contraseñas ni imágenes de producción.

En la terminal de VS Code, desde la raíz:

```powershell
git add .
git commit -m "Agrega fotos de perfil y traductor español maya"
git push origin main
```

## 2. En el VPS

```bash
cd /var/www/vocesdemitierra
sudo -u deploy git pull --ff-only origin main
sudo -u deploy npm run build
cd backend
sudo -u deploy php artisan config:clear
sudo -u deploy php artisan migrate --force
sudo -u deploy php artisan voces:admin admin@gmail.com
```

El último comando solicita la contraseña dos veces sin mostrarla. Introduce la que elegiste en la conversación. Se guarda como hash; no se publica en GitHub. Si el correo ya existe, el comando se detiene sin cambiar esa cuenta.

No necesitas reinstalar dependencias: esta actualización no añade paquetes. No requiere recargar Nginx.

## 3. Activar la traducción de texto libre

El código utiliza la API oficial Azure Translator, que soporta español (es) y maya yucateco (yua). Necesitas un recurso Translator de tu propia cuenta de Azure y su clave. Consulta https://learn.microsoft.com/en-us/azure/ai-services/translator/quickstart-text-rest-api y https://learn.microsoft.com/en-us/azure/ai-services/translator/text-translation/reference/authentication

En el VPS:

```bash
cd /var/www/vocesdemitierra/backend
nano .env
```

Agrega la clave y la región EXACTA de tu recurso (puede quedar vacía si tu recurso global no exige región):

```dotenv
AZURE_TRANSLATOR_KEY="TU_CLAVE_DE_AZURE"
AZURE_TRANSLATOR_REGION="REGION_DE_TU_RECURSO"
```

Guarda y ejecuta:

```bash
sudo -u deploy php artisan config:clear
```

La clave permanece en el servidor. No la pegues en el chat ni en GitHub. La traducción envía el texto a Microsoft. Hay límite de 3000 caracteres por solicitud y 10 solicitudes por minuto por IP; sin clave, el panel informa que falta configurar el servicio. No incluye una cuenta de Azure ni garantiza cuota gratuita.

## 4. Verificación

- Inicia sesión con el administrador y abre Perfil; carga una foto JPG/PNG/WebP hasta 5 MB y cambia nombre/teléfono.
- Inicia sesión como productor; edita Perfil y comprueba tu foto, biografía y datos del taller en la ficha pública.
- Traduce una frase en español; invierte los idiomas y vuelve a traducir el resultado del proveedor.
- Prueba credenciales inválidas del proveedor: el panel debe informar el error, sin inventar traducciones.

El dictado del navegador se ofrece en español. La lectura de maya se habilita únicamente si el dispositivo cuenta con una voz yua; de lo contrario informa que no dispone de voz compatible. Esta entrega no implementa reconocimiento de voz maya ni crea una voz maya. Traducción automática no equivale a validación lingüística humana.

Verificado en desarrollo: TypeScript, Vite, sintaxis PHP y 10 pruebas / 47 aserciones, con solicitudes de Azure simuladas. Las traducciones reales y el despliegue de esta actualización todavía requieren configuración y comprobación en tu VPS.
