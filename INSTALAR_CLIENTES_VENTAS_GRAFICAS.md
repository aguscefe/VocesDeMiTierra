# Proyecto completo: clientes, ventas y gráficas

Este ZIP CONTIENE EL PROYECTO COMPLETO, incluidas las 38 fotos, perfiles, certificados, pagos de prueba y el dictado maya corregido. Combina los archivos en la raíz del proyecto existente. NO borres antes el proyecto, .git, .env, uploads ni la base de datos. No incluye dependencias instaladas, claves o contraseñas.

## En tu PC: VS Code / PowerShell

Abre la carpeta de tu repositorio, extrae aquí el ZIP y reemplaza archivos. Deben coexistir package.json, src/App.tsx, backend/artisan y services/maya-asr/server.py.

```powershell
git add src backend services public/demo .gitignore .gitattributes INSTALAR_CLIENTES_VENTAS_GRAFICAS.md ACTIVAR_DICTADO_MAYA.md
git diff --cached --stat
git commit -m "Agregar clientes ventas de ejemplo direcciones y graficas desde la base"
git push
```

Si `git diff --cached --stat` muestra archivos esenciales borrados, detente: la extracción no se hizo sobre el proyecto completo. No añadas archivos accidentales como `tatus --short`.

## En el VPS como root

El respaldo limitado guarda la corrección que ya hicimos directamente en server.py. No se aplica después porque este ZIP incluye esa corrección.

```bash
cd /var/www/vocesdemitierra
sudo -u deploy git stash push -m "Respaldo dictado maya antes de actualizar ventas" -- services/maya-asr/server.py
sudo -u deploy git pull --ff-only
sudo -u deploy git lfs pull
cd backend
sudo -u deploy php artisan config:clear
sudo -u deploy php artisan migrate --force
sudo -u deploy php artisan voces:demo
sudo -u deploy php artisan voces:ventas-demo
cd ..
sudo -u deploy npm run build
systemctl restart voces-maya-asr
```

**En `voces:ventas-demo` escribe la contraseña deseada para los 10 clientes nuevos.** Si eliges `12345678`, será la contraseña inicial de esas cuentas. Se almacena mediante hash. Si falta admin@gmail.com, se crea como administrador con la misma contraseña; si existe, conserva su contraseña, rol y estado. Un correo existente que no sea administrador provoca un error sin modificar datos.

No uses migrate:fresh, no importes schema.sql sobre la base actual y no vuelvas a generar APP_KEY. No necesitas reinstalar el modelo maya. Si el servicio no existe, consulta ACTIVAR_DICTADO_MAYA.md.

## Cuentas de clientes

| Nombre ficticio | Correo | Localidad |
|---|---|---|
| Sofía Mendoza | `cliente01@voces.example` | Cancún |
| Diego Ramírez | `cliente02@voces.example` | Playa del Carmen |
| Valeria López | `cliente03@voces.example` | Chetumal |
| Carlos Herrera | `cliente04@voces.example` | Bacalar |
| Mariana Pérez | `cliente05@voces.example` | Tulum |
| Luis Aguilar | `cliente06@voces.example` | Cozumel |
| Camila Torres | `cliente07@voces.example` | Felipe Carrillo Puerto |
| Jorge Medina | `cliente08@voces.example` | José María Morelos |
| Daniela Cruz | `cliente09@voces.example` | Isla Mujeres |
| Andrés Salazar | `cliente10@voces.example` | Puerto Morelos |

Administrador: `admin@gmail.com` (la clave existente se conserva).

Artesanos: `ana@voces.example`, `mateo@voces.example`, `elena@voces.example`, `lucia@voces.example` (sus claves existentes también se conservan).

## Datos y funcionamiento

- 10 clientes ficticios; 4 compras por cliente, 40 pedidos y 40 pagos. Historial distribuido en seis meses y los cuatro talleres. 30 pedidos pagados/enviados/entregados, 6 pendientes y 4 reembolsados; 20 registros de envío.
- Origen de los talleres y destino de los clientes en Quintana Roo. Nombres, calles y números son inventados para demostración; no corresponden a domicilios o personas verificadas. Teléfonos de prueba `0000000000` y correos reservados `.example`.
- Cada pedido conserva su dirección de origen/destino al comprar. Editar el perfil después no cambia direcciones de compras anteriores. Los artesanos pueden guardar origen en Perfil; clientes guardan dirección/CP y se precargan en Checkout.
- Stock descontado solo al crear cada pedido de ejemplo, excepto los reembolsados. Volver a ejecutar el comando no descuenta de nuevo, no duplica pedidos y respeta cambios de estados y contraseñas. Si un producto está sin stock o fue pausado, el comando se detiene y revierte su transacción.
- Gráficas de importes mensuales, pedidos por estado, pagos aprobados por método, piezas más vendidas/compradas y ventas por taller para el administrador. Son calculadas a partir de `/api/state`, que consulta MariaDB; no tienen cifras fijas en React.
- Consumidores: compras, pagos y direcciones propios. Productores: ventas propias, importe, comisión y neto. Administrador: información general. Resúmenes actualizados después de comprar y automáticamente cada 30 segundos mientras el panel está visible. Los filtros de fechas afectan las gráficas.
- Pendientes/cancelados/reembolsados no cuentan como ventas aprobadas. Gasto del cliente incluye envío; ventas por taller y producto excluyen envío. La sección Pagos muestra también pendientes y reembolsos.
- Puedes registrar clientes nuevos normalmente y realizar más compras; se guardan por el mismo flujo y se reflejan en paneles/gráficas. Se corrigió el identificador de carrito de las cuentas recién registradas.
- No se realizan cargos reales ni se guardan credenciales bancarias. PayPal y tarjeta siguen siendo demostraciones.

## Verificar

Abre la web con Ctrl+F5 e inicia sesión como admin o cliente. En Resumen/Estadísticas ajusta Desde/Hasta; Pedidos muestra origen y destino, Pagos muestra método y estado. Prueba una compra nueva con una cuenta recién registrada.

```bash
sudo mysql vocesdemitierra -e "SELECT COUNT(*) AS pedidos_demo FROM orders WHERE id LIKE 'demo_venta_%';"
sudo mysql vocesdemitierra -e "SELECT status, COUNT(*) AS pedidos, SUM(total) AS importe FROM orders GROUP BY status;"
curl --max-time 5 http://127.0.0.1:8765/health
```

Verificado localmente: compilación React/TypeScript, 17 pruebas y 336 aserciones del backend, finanzas/stock/roles, seeder idempotente, direcciones históricas y compra de un cliente nuevo. Falta instalar esta actualización en el VPS y revisar visualmente las gráficas allí.
