# Actualización de dictado maya yucateco

Este ZIP es una actualización: extrae sus archivos en la raíz del proyecto existente. Conserva las 38 fotos, certificados, perfiles y pagos de demostración. No sustituye tu .env ni borra datos.

## Subir desde VS Code

```bash
git add src backend services public/demo .gitattributes ACTUALIZAR_LECTURA_CATALOGO_CERTIFICADOS.md ACTIVAR_DICTADO_MAYA.md
git commit -m "Agregar reconocimiento de voz maya yucateco"
git push
```

No agregues .env, services/maya-asr/.venv ni cache a Git. El ZIP no contiene claves.

## En el VPS como root

```bash
cd /var/www/vocesdemitierra
sudo -u deploy git pull --ff-only
sudo -u deploy git lfs pull
cd backend
sudo -u deploy php artisan config:clear
sudo -u deploy php artisan migrate --force
sudo -u deploy php artisan voces:demo
cd ..
sudo -u deploy npm run build
bash services/maya-asr/install.sh
```

El instalador requiere **8 GiB de RAM disponibles**, conexión a Hugging Face/PyPI y espacio para aproximadamente 4 GB de modelo más dependencias. Si falta RAM, se detiene antes de modificar servicios: en ese VPS el dictado maya todavía no estará activo. No abras el puerto 8765 al público. El servicio escucha únicamente en localhost. No modifica la otra página ni Nginx.

La primera carga puede tardar varios minutos. Verifica:

```bash
journalctl -u voces-maya-asr -n 40 --no-pager
curl http://127.0.0.1:8765/health
```

Debe responder `{"status":"ok","language":"yua"}`. Después abre la web, cambia a Maya → Español, permite el micrófono, graba una frase corta, pulsa otra vez para detener, revisa la transcripción y pulsa Traducir. La grabación termina automáticamente a los 15 segundos. Se usa MMS con adaptador yua; no se usa reconocimiento español para audio maya. No se guardan grabaciones. Azure sigue traduciendo el texto y la respuesta española se lee en voz alta.

## Alcance y comprobaciones

Modelo oficial: https://huggingface.co/facebook/mms-1b-all (Meta, licencia CC-BY-NC-4.0; previsto para este proyecto académico). Las transcripciones pueden contener errores: revisión humana antes de traducir. La voz de salida maya conserva la lectura aproximada anterior si el navegador no tiene voz yua.

Se comprobaron TypeScript, compilación de producción y pruebas del backend con servicio simulado. No se descargó ni ejecutó el modelo de ~4 GB en esta sesión; falta verificar el reconocimiento con una grabación maya real en el VPS. No se garantiza precisión lingüística ni velocidad de inferencia; si tu CPU supera 50 segundos, se informa un error y permite reintentar con una frase más corta.
