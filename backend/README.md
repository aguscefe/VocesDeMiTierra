# Voces de mi Tierra API

Backend de **Voces de mi Tierra** construido con Laravel 12 y preparado para
MySQL/MariaDB de XAMPP.

## Requisitos

- PHP 8.2 o superior
- Composer 2
- MySQL o MariaDB
- Extensiones PHP habituales de Laravel: OpenSSL, PDO, Mbstring, Tokenizer,
  XML, Ctype y JSON

## Instalación con XAMPP

1. Copia el proyecto completo dentro de `C:\xampp\htdocs\voces-de-mi-tierra`.
2. Inicia Apache y MySQL desde XAMPP.
3. Abre phpMyAdmin en `http://localhost/phpmyadmin`.
4. Importa `database/voces_de_mi_tierra.sql`.
5. Abre una terminal en la carpeta `backend`.
6. Ejecuta:

```bash
composer install
copy .env.example .env
php artisan key:generate
php artisan config:clear
```

En macOS o Linux sustituye `copy` por:

```bash
cp .env.example .env
```

La configuración inicial espera:

```env
DB_DATABASE=voces_de_mi_tierra
DB_USERNAME=root
DB_PASSWORD=
```

Si tu MySQL tiene contraseña, actualiza `DB_PASSWORD`.

## Probar la API

Con Apache:

```text
http://localhost/voces-de-mi-tierra/backend/public/api/health
```

Durante desarrollo también puedes ejecutar:

```bash
php artisan serve
```

Y abrir:

```text
http://127.0.0.1:8000/api/health
```

## Endpoints iniciales

| Método | Endpoint | Descripción |
| --- | --- | --- |
| GET | `/api/health` | Estado del servicio |
| POST | `/api/login` | Inicio de sesión |
| GET | `/api/products` | Catálogo publicado |
| GET | `/api/products/{id}` | Detalle, productor e historia cultural |
| GET | `/api/producers` | Productores aprobados |
| GET | `/api/producers/{id}` | Perfil y productos del productor |

Ejemplo de acceso:

```json
{
  "email": "productor@vocesdemo.mx",
  "password": "Demo1234"
}
```

## Seguridad antes de producción

`password_demo` existe para mantener compatibilidad con el prototipo actual.
Antes de publicar el sistema:

1. Migrar las contraseñas a hashes creados con `Hash::make()`.
2. Instalar Laravel Sanctum para autenticación por token o sesión.
3. Restringir `FRONTEND_URL` al dominio definitivo.
4. Mover videos e imágenes a `storage/app/public` o almacenamiento externo.
5. Configurar HTTPS, respaldos y variables de entorno seguras.
