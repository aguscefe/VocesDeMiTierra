# Banners distintos y fotografías aportadas

Extrae este ZIP dentro de la raíz del proyecto existente y reemplaza los archivos coincidentes. Incluye el diseño unificado anterior y requiere el proyecto funcional instalado. No sustituye .env, cuentas, pedidos ni productos.

## Cambios

- Catálogo: banner crema, detalles terracota y fotografía de textiles en un marco asimétrico.
- Productores: fondo verde selva, detalle dorado y fotografía de encuentro artesanal.
- Cómo funciona: café y terracota, fotografía del proceso de bordado.
- Trazabilidad: fotografía de trabajo en barro como fondo y texto sobre una capa oscura.
- Inicio y galería de oficios: nueve fotografías aportadas, conservadas sin generación de rostros ni cambios de identidad; el encuadre se adapta con CSS.
- Las fotografías de personas se presentan como imágenes de oficios, sin asociarlas a los nombres, cuentas o historias inventadas del catálogo. No se les atribuye una comunidad específica no confirmada.
- Los perfiles antiguos con retratos generados muestran una inicial. Las fotografías que los usuarios suban a sus perfiles se siguen mostrando normalmente. Los enlaces de talleres, origen declarado, carrito y favoritos siguen funcionando.

La primera imagen enviada era una captura de los cuatro perfiles anteriores, por lo que se usó como referencia visual y no como fotografía nueva. Las otras nueve se incluyeron en public/design/fotos. No son nuevas fotografías de cada uno de los 38 productos: el catálogo mantiene sus imágenes anteriores.

## En tu PC: PowerShell de VS Code

Después de extraer el ZIP dentro de tu proyecto:

```powershell
git add src/index.css src/components/CraftChart.tsx src/components/CraftBanner.tsx src/components/CraftPeople.tsx src/components/ImageWithFallback.tsx src/components/ProfileEditor.tsx src/components/Footer.tsx src/pages/Home.tsx src/pages/Catalog.tsx src/pages/ProducersList.tsx src/pages/HowItWorks.tsx src/pages/Traceability.tsx public/design/fotos .gitattributes ACTUALIZAR_BANNERS_FOTOGRAFIAS.md
git diff --cached --stat
git commit -m "Diferenciar banners e integrar fotografias artesanales"
git push
```

## En el VPS por SSH

```bash
cd /var/www/vocesdemitierra
sudo -u deploy git pull --ff-only
sudo -u deploy git lfs pull
```

Si terminó correctamente:

```bash
sudo -u deploy npm run build
```

Después abre la página y presiona Ctrl + F5. No requiere migraciones ni cambios en Nginx. Si el pull falla, detente y conserva el mensaje; no borres cambios del servidor.

## Comprobaciones

TypeScript y compilación de producción correctos. Se comprobaron carga de fotografías, banners de escritorio y celular, navegación, filtros, favoritos, carrito, zoom, paneles e idioma con API simulada. No se desplegó directamente en tu VPS.
