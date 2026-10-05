# Fotografías de personas y tarjetas de oficios

Aplica sobre el diseño unificado anterior (661e96b), después de revertir la actualización b64f107 que cambiaba la distribución. Extrae este ZIP dentro del proyecto existente y acepta reemplazar los archivos coincidentes. No borres el proyecto.

Se conserva el diseño, el header, los banners y las tarjetas anteriores. La actualización cambia las fotografías de Productores, Cómo funciona y Trazabilidad, y añade cinco tarjetas de oficios en Productores. Las tarjetas muestran imágenes de productos; al pasar el cursor, enfocar con el teclado o tocar en celular, aparece una descripción breve. Los enlaces de los talleres y sus datos permanecen disponibles.

Las 15 fotografías aportadas están repartidas una vez cada una entre esos tres apartados: cuatro para representar el oficio de los talleres del catálogo, una en el banner de Productores, nueve en Cómo funciona y una en el banner de Trazabilidad. Los cuatro pasos de trazabilidad usan imágenes distintas de piezas. El retrato del mismo taller se mantiene coherente cuando se muestra también en Inicio o en su ficha.

Las fotos se conservan sin modificar píxeles ni rostros; el encuadre se adapta con CSS. Las fotografías de los cuatro talleres precargados se presentan como referencia del oficio y no se atribuyen a los nombres inventados de sus cuentas. Las fotos que un productor suba a su perfil se conservan y tienen prioridad; la sustitución solo afecta las cuatro rutas de retratos generados de ejemplo. No se inventaron nombres ni comunidades para las personas fotografiadas.

## En VS Code / PowerShell

Desde la raíz del proyecto, después de extraer:

```powershell
git add src/index.css src/components/ArtisanCard.tsx src/components/CraftTrades.tsx src/utils/producerPortrait.ts src/pages/ProducersList.tsx src/pages/HowItWorks.tsx src/pages/Traceability.tsx src/pages/ProducerProfile.tsx src/pages/ProductDetail.tsx public/design/personas .gitattributes ACTUALIZAR_FOTOS_OFICIOS.md
git diff --cached --stat
git commit -m "Actualizar fotos y agregar tarjetas de oficios sin cambiar el diseno"
git push
```

No agregues .env, claves, node_modules ni vendor.

## En el VPS por SSH

```bash
cd /var/www/vocesdemitierra
sudo -u deploy git pull --ff-only
sudo -u deploy git lfs pull
```

Si ambos terminan correctamente:

```bash
sudo -u deploy npm run build
```

Abre la página y recarga con Ctrl + F5. No hay migraciones, cambios de cuentas o pedidos, ni modificación de Nginx. Si el pull marca conflictos, detente y conserva el mensaje.
