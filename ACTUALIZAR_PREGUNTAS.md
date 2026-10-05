# Actualizar preguntas frecuentes y Nosotros
Extrae en la raíz de tu proyecto y reemplaza src/pages/StaticPages.tsx.

En PowerShell de VS Code:
```powershell
git add src/pages/StaticPages.tsx ACTUALIZAR_PREGUNTAS.md
git commit -m "Actualizar preguntas frecuentes y textos informativos"
git push
```
En SSH del VPS:
```bash
cd /var/www/vocesdemitierra
sudo -u deploy git pull --ff-only
```
Si terminó correctamente:
```bash
sudo -u deploy npm run build
```
Recarga con Ctrl + F5. No requiere migraciones ni cambios a la base de datos.
El formulario de pago conserva el aviso de que no se realizan cargos.
