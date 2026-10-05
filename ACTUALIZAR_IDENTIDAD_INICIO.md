# Unificar el diseño con el inicio

Extrae este ZIP dentro de la raíz del proyecto existente y reemplaza los archivos coincidentes. Requiere la actualización anterior de diseño. Conserva las funciones, imágenes, datos y .env.

La referencia visual es el inicio: crema #FFFDF8, arena #F5EFE4, terracota #B85C38, verde selva #315C4C y dorado #D6A73C. La tipografía se unifica en Poppins y Playfair Display. Catálogo, productores, cómo funciona, trazabilidad, perfiles, piezas, paneles e intérprete comparten esta identidad. Los banners reutilizan el fondo del inicio y las gráficas usan la misma paleta.

En VS Code / PowerShell, desde tu proyecto:

```powershell
git add src/index.css src/components/CraftChart.tsx ACTUALIZAR_IDENTIDAD_INICIO.md
git commit -m "Unificar la identidad visual con el inicio"
git push
```

En el VPS, por SSH:

```bash
cd /var/www/vocesdemitierra
sudo -u deploy git pull --ff-only
```

Si termina correctamente:

```bash
sudo -u deploy npm run build
```

Abre la página y recarga con Ctrl + F5. No requiere migraciones ni cambios en Nginx o Azure. Si git pull marca conflictos, detente y conserva el mensaje.
