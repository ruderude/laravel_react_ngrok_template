#!/bin/bash

docker compose down --rmi all --volumes --remove-orphans
sleep 5

rm -R vendor/
rm -R node_modules/

rm -R public/build
rm -R storage/framework/cache/*
rm -R storage/framework/sessions/*
rm -R storage/framework/views/*
rm -R storage/logs/*

docker compose build --no-cache
docker compose up -d

docker compose exec app composer install --optimize-autoloader
docker compose exec app composer dump-autoload
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate --seed
docker compose exec app php artisan cache:clear
docker compose exec app php artisan config:clear
docker compose exec app php artisan route:clear
docker compose exec app php artisan view:clear

docker compose exec app npm install

docker compose exec app chmod -R 777 .

# shellcheck disable=SC2035
docker compose exec app chmod +x *.sh
