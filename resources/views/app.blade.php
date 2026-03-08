<!DOCTYPE html>
<html lang="{{ str_replace("_", "-", app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex">
    <meta name="googlebot" content="noindex">
    <title>{{ env("APP_NAME") }}</title>
    <link rel="icon" href="{{ asset("favicon.png") }}">
    @viteReactRefresh
    @vite(["resources/ts/App.tsx"])
</head>

<body>
<div id="root"></div>
</body>

</html>
