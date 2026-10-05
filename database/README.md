# Base de datos

Usa `php artisan migrate --force` con `backend/.env` configurado para `vocesdemitierra`.

`instalar_tablas.sql` es una alternativa equivalente para importar a una base VACÍA. No lo importes después de migrar. `crear_database.sql` solo crea la base; no contiene la clave de tu usuario. El seeder `php artisan db:seed` genera los datos opcionales y genera hashes de las contraseñas con Laravel.

Tablas: users, producer_profiles, products, cultural_consents, cultural_records, orders, order_items, payments, reviews, notifications, qr_codes, favorites, carts, cart_items, support_tickets, shipments, analytics_events, audit_logs.
