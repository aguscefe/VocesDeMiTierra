# Textos visibles y sección Cómo funciona del inicio

Extrae este ZIP dentro del proyecto existente y reemplaza los archivos coincidentes. No elimina cuentas, productos ni pedidos, ni cambia .env.

Se elimina la leyenda del pie de página y las referencias visibles a proyecto escolar o demostración en acceso, paneles, recorrido, textos informativos y checkout. Los pagos conservan su aviso de pago de prueba sin cargos: el procesamiento sigue siendo simulado y no debe presentarse como un cobro real.

La sección Cómo funciona del inicio conserva sus tres tarjetas y distribución, pero ahora utiliza morado ciruela inspirado en el colibrí, tarjetas crema y detalles dorados. Sus fotografías muestran piezas diferentes, en lugar de repetir los retratos de productores.

## En VS Code / PowerShell

```powershell
git add src/pages/ProductDetail.tsx src/data/seed.ts src/components/Footer.tsx src/pages/Home.tsx src/pages/DemoRegional.tsx src/pages/Login.tsx src/pages/LiveDashboard.tsx src/pages/HowItWorks.tsx src/pages/StaticPages.tsx src/pages/Checkout.tsx src/index.css backend/app/Console/Commands/CleanPublicTexts.php backend/app/Http/Controllers/Api/MarketplaceController.php backend/database/catalog-demo.json backend/tests/Feature/CleanPublicTextsTest.php ACTUALIZAR_TEXTOS_BANNER.md
git diff --cached --stat
git commit -m "Limpiar leyendas y armonizar el proceso del inicio"
git push
```

## En el VPS por SSH

```bash
cd /var/www/vocesdemitierra
sudo -u deploy git pull --ff-only
```

Si termina correctamente:

```bash
cd /var/www/vocesdemitierra/backend
sudo -u deploy php artisan optimize:clear
sudo -u deploy php artisan voces:limpiar-textos
cd /var/www/vocesdemitierra
sudo -u deploy npm run build
```

El comando limpia las biografías antiguas de los cuatro talleres precargados solo si todavía contienen la leyenda anterior; conserva las biografías personalizadas. También quita la expresión antigua de las notificaciones de venta. Se puede repetir sin duplicar registros. No se requieren migraciones ni recargar el catálogo.

Después recarga con Ctrl + F5. Si un comando falla, detente y conserva el mensaje.

## Verificación

TypeScript y compilación correctos; comprobaciones de navegador en escritorio y celular con API simulada. El backend se comprobó en una base dedicada de pruebas, incluida la limpieza repetida y la conservación de biografías personalizadas. No se desplegó directamente en el VPS.
