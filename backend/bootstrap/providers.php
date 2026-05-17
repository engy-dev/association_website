<?php

use App\Providers\AppServiceProvider;
use App\Models\MailContent;


return [
    AppServiceProvider::class,
    Mailtrap\Bridge\Laravel\MailtrapSdkProvider::class,

];
