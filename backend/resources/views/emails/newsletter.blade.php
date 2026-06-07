<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body>
    <h1>{{ $title }}</h1>
    <p>{{ $emailContent }}</p>
    <p style="font-size: 0.85rem; color: #666;">
        <a href="{{ $unsubscribeUrl }}">Unsubscribe from this newsletter</a>
    </p>
</body>
</html>