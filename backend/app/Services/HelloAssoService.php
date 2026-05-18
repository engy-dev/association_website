<?php
namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class HelloAssoService
{
    private string $baseUrl = 'https://api.helloasso-sandbox.com/v5';
    private string $authUrl    = 'https://api.helloasso-sandbox.com/oauth2';

    private function getAccessToken(): string
    {
        // Cache tokens so we reuse them within their 30-min window
        if (Cache::has('helloasso_access_token')) {
            return Cache::get('helloasso_access_token');
        }

        if (Cache::has('helloasso_refresh_token')) {
            $response = Http::withoutVerifying()->asForm()->post("{$this->authUrl}/token", [
                'grant_type'    => 'refresh_token',
                'refresh_token' => Cache::get('helloasso_refresh_token'),
            ]);
        } else {
            $response = Http::withoutVerifying()->asForm()->post("{$this->authUrl}/token", [
                'grant_type'    => 'client_credentials',
                'client_id'     => config('services.helloasso.client_id'),
                'client_secret' => config('services.helloasso.client_secret'),
            ]);
        }

        $data = $response->json();
        Log::debug('HelloAsso auth response', [
            'status'  => $response->status(),
            'body'    => $response->body(),
            'data'    => $data,
            'auth_url' => $this->authUrl,
            'client_id' => config('services.helloasso.client_id'),
        ]);

        if (empty($data['access_token'])) {
            throw new \Exception('HelloAsso auth failed: ' . $response->body());
        }

        Cache::put('helloasso_access_token',  $data['access_token'],  now()->addSeconds(1700));
        Cache::put('helloasso_refresh_token', $data['refresh_token'], now()->addDays(29));

        return $data['access_token'];
    }

    public function createCheckoutIntent(array $payload): array
    {
        $token = $this->getAccessToken();
        $orgSlug = config('services.helloasso.org_slug');

        $response = Http::withoutVerifying()
            ->withToken($token)
            ->post("{$this->baseUrl}/organizations/{$orgSlug}/checkout-intents", $payload);

        if ($response->failed()) {
            throw new \Exception('HelloAsso checkout creation failed: ' . $response->body());
        }

        return $response->json(); // contains 'id' and 'redirectUrl'
    }
}