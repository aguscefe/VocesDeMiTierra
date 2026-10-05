#!/usr/bin/env bash
set -euo pipefail
cd /var/www/vocesdemitierra
# Ejecutar como deploy; cambios locales deben revisarse antes de actualizar.
git pull --ff-only
npm ci
npm run build
cd backend
composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction
php artisan migrate --force
php artisan config:cache
php artisan view:cache
printf 'Actualización terminada.\n'
