<?php

namespace App\Observers;

use App\Mail\NewsletterMail;
use App\Models\MailContent;
use App\Models\NewsletterSubscriber;
use Illuminate\Support\Facades\Mail;

class MailContentObserver
{
    /**
     * Handle the MailContent "created" event.
     */
    public function created(MailContent $mailContent): void
    {
        $subscribers = NewsletterSubscriber::whereNull('unsubscribed_at')->get();
        foreach ($subscribers as $subscriber) {
            Mail::to($subscriber->email)->send(
                new NewsletterMail($mailContent->title, $mailContent->content)
            );
        }
    }

    /**
     * Handle the MailContent "updated" event.
     */
    public function updated(MailContent $mailContent): void
    {
        //
    }

    /**
     * Handle the MailContent "deleted" event.
     */
    public function deleted(MailContent $mailContent): void
    {
        //
    }

    /**
     * Handle the MailContent "restored" event.
     */
    public function restored(MailContent $mailContent): void
    {
        //
    }

    /**
     * Handle the MailContent "force deleted" event.
     */
    public function forceDeleted(MailContent $mailContent): void
    {
        //
    }
}
