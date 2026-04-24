<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; color: #333;">
    <p>Hello {{ $data['name'] }},</p>
    <p>Thank you for reaching out. We have received your message and will get back to you as soon as possible.</p>
    <hr>
    <p><strong>Your message:</strong></p>
    <p>{{ $data['message'] }}</p>
    <hr>
    <p>– The {{ config('app.name') }} Team</p>
</body>
</html>