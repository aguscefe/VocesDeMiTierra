# Descripciones e historias del catálogo

Actualización parcial: extrae en la raíz de tu proyecto existente, conservando todos los demás archivos. Incluye la actualización anterior de las 38 historias.

Las descripciones se centran en diseño, materiales y apariencia. No declaran una fabricación, disponibilidad o procedencia verificada. Los relatos son inspiración creativa y no testimonios reales. No se eliminan los avisos generales de transparencia ni la identificación de pagos de prueba.

En PowerShell:

```powershell
git add backend/database/catalog-demo.json backend/database/catalog-stories.json backend/database/seeders/CatalogDemoSeeder.php backend/routes/console.php src/pages/ProductDetail.tsx ACTUALIZAR_DESCRIPCIONES.md
git commit -m "Actualizar descripciones e historias de las 38 piezas"
git push
```

En el VPS:

```bash
cd /var/www/vocesdemitierra
sudo -u deploy git pull --ff-only
cd backend
sudo -u deploy php artisan voces:historias
sudo -u deploy php artisan voces:descripciones
cd ..
sudo -u deploy npm run build
```

Recarga con Ctrl+F5. No ejecutes migrate:fresh ni regeneres claves. Se conservan cuentas, fotos, ventas, precios y existencias. Estos comandos vuelven a aplicar los textos incluidos a las 38 piezas precargadas; no afectan publicaciones nuevas.
