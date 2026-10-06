# Registro, pagos y favoritos

Extrae este ZIP en la raíz del proyecto existente y reemplaza los archivos coincidentes.

- Header: Iniciar sesión y Crear cuenta, también en móvil.
- Registro: primero elige Consumidor o Productor. Consumidor tiene un solo formulario; productor conserva sus ocho pasos. Incluye campos identificados para autocompletado, validación, mensajes de error y bloqueo mientras guarda.
- Favoritos: usa el mismo componente y estilo de banner que las demás páginas.
- Checkout: elimina Pagar después, el selector aprobado/rechazado y la autorización extra de PayPal. Tarjeta, PayPal y transferencia envían escenario aprobado al confirmar, conservando validación, inventario, cálculo de envío e idempotencia del backend. Las fallas del servidor siguen mostrando un error; no se presentan como éxito.
- Se quitan las leyendas adicionales de pruebas de los formularios. Permanece un aviso único de que no se realizan cargos y campos bancarios precargados de solo lectura. No se solicitan credenciales ni números bancarios reales. No se cambia la pasarela ni los pagos anteriores.

## VS Code / PowerShell
```powershell
git add src/components/Header.tsx src/pages/Register.tsx src/pages/Favorites.tsx src/pages/Checkout.tsx src/pages/HowItWorks.tsx src/pages/DemoRegional.tsx src/index.css ACTUALIZAR_REGISTRO_PAGOS_FAVORITOS.md
git commit -m "Mejorar registro, favoritos y confirmacion de compras"
git push
```

## VPS por SSH
```bash
cd /var/www/vocesdemitierra
sudo -u deploy git pull --ff-only
```
Si termina correctamente:
```bash
sudo -u deploy npm run build
```
Después recarga con Ctrl + F5. No requiere nuevas dependencias, migraciones ni seeders. Conserva .env, cuentas, productos y pedidos. Si un comando falla, detente y conserva el error.
