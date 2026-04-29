<!DOCTYPE html>
<html dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}">
<body style="font-family: sans-serif; color: #333;">
    <p>{{ __('emails.auto_reply.greeting', ['name' => $data['name']]) }}</p>
    <p>{{ __('emails.auto_reply.received') }}</p>
    <hr>
    <p><strong>{{ __('emails.auto_reply.your_message') }}</strong></p>
    <p>{{ $data['message'] }}</p>
    <hr>
    <p>– {{ __('emails.auto_reply.signature', ['app' => config('app.name')]) }}</p>
</body>
</html>