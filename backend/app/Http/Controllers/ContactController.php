<?Php 
namespace App\Http\Controllers;
use App\Mail\ContactAutoReply;
use App\Mail\ContactAdminNotification;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use App\Models\ContactMessage;

class ContactController extends Controller
{
    /**
     * POST /api/contact
     */
    public function send(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        $locale = in_array(
            $request->header('Accept-Language', 'fr'),
            ['fr', 'en', 'ar']
        ) ? $request->header('Accept-Language', 'fr') : 'fr';

        $message = ContactMessage::create(array_merge($validated, [
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'locale'     => $locale,
            'status'     => 'received',
        ]));

        // Confirmation email to the user
        $autoReplySent = false;
        try {
            Mail::to($validated['email'])
                ->locale($locale)
                ->send(new ContactAutoReply($validated));
            $autoReplySent = true;
        } catch (\Exception $e) {
            \Log::error('Contact auto-reply failed', [
                'to'    => $validated['email'],
                'error' => $e->getMessage(),
            ]);
        }

        $message->auto_reply_sent    = $autoReplySent;
        $message->auto_reply_sent_at = $autoReplySent ? now() : null;
        $message->save();

        // Notification email to admin
        try {
            Mail::to(config('mail.admin_address'))->send(new ContactAdminNotification($validated));
        } catch (\Exception $e) {
            \Log::error('Contact admin notification failed', [
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json(['message' => 'Message received. Thank you!']);
    }
}