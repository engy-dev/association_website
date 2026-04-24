<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; color: #333;">
    <p>A new contact message has been submitted.</p>
    <table>
        <tr><td><strong>Name:</strong></td><td>{{ $data['name'] }}</td></tr>
        <tr><td><strong>Email:</strong></td><td>{{ $data['email'] }}</td></tr>
        <tr><td><strong>Subject:</strong></td><td>{{ $data['subject'] ?? '(none)' }}</td></tr>
    </table>
    <hr>
    <p><strong>Message:</strong></p>
    <p>{{ $data['message'] }}</p>
</body>
</html>