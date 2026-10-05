# Animaciones de Voces de mi Tierra

Extrae este ZIP dentro de la raíz del proyecto existente y reemplaza los archivos coincidentes. Conserva los demás archivos: es una actualización parcial. No modifica el backend, fotos, historias, cuentas ni ventas.

Incluye entrada gradual de tarjetas y secciones al desplazarse, transición entre páginas, respuesta de botones al pulsar, realce de tarjetas con ratón y teclado, animación al marcar favoritos y portada más luminosa. Las animaciones respetan la preferencia del dispositivo de reducir movimiento; no bloquean la lectura ni las acciones. No requiere instalar dependencias.

En PowerShell de VS Code:

```powershell
git add src/App.tsx src/index.css src/components/PageMotion.tsx src/components/ProductCard.tsx src/pages/Home.tsx ACTUALIZAR_ANIMACIONES.md
git commit -m "Agregar animaciones y mejorar luminosidad de la portada"
git push
```

En el VPS:

```bash
cd /var/www/vocesdemitierra
sudo -u deploy git pull --ff-only
sudo -u deploy npm run build
```

Si git pull falla, detente antes de continuar. Después abre la web y pulsa Ctrl+F5. Revisa la portada, desplázate por el catálogo y marca un favorito con una cuenta iniciada. En móvil, las interacciones funcionan al tocar y las tarjetas entran al desplazarse. Con reducción de movimiento activada, el contenido sigue visible sin animaciones.

Validación: TypeScript sin errores y compilación de producción completada. No se realizó una revisión visual en el navegador durante esta actualización.
