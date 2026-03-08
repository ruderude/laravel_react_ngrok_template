FROM php:8.5.3-fpm-trixie

WORKDIR /var/www/html

COPY ./.docker/app/php.ini /usr/local/etc/php/php.ini

RUN apt-get update
RUN apt-get -y upgrade
RUN apt-get -y install build-essential libpq-dev curl unzip

RUN docker-php-ext-install pdo pgsql pdo_pgsql
RUN pecl install xdebug

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN curl -sL https://deb.nodesource.com/setup_24.x | bash -
RUN apt-get install -y nodejs

RUN npm install -g npm
