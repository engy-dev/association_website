<?php

namespace App\Http\Controllers;

abstract class Controller
{
    /**
     * Returns 'fr', 'en', or 'ar' based on the request header.
     * Falls back to 'fr' if the language is unsupported or missing.
     */
    protected function getLocale(): string
    {
        $supported = ['fr', 'en', 'ar'];
        $lang = request()->header('Accept-Language', 'fr');
        return in_array($lang, $supported) ? $lang : 'fr';
    }
}
