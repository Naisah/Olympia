<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\News;
use App\Models\Album;
use App\Models\Business;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMessage;
class PublicContentController extends Controller
{
    public function getNews()
    {
        $news = News::orderBy('id', 'asc')->get(); 
        $featured = $news->where('is_featured', true)->values()->map(function ($item) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                'image' => $item->image_url,
                'date' => $item->published_date_string,
                'link' => $item->link,
            ];
        });
        $latest = $news->where('is_featured', false)->values()->map(function ($item) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                'date' => $item->published_date_string,
                'link' => $item->link,
            ];
        });
        return response()->json([
            'featured' => $featured,
            'latest' => $latest
        ]);
    }
    public function getGallery()
    {
        $albums = Album::with('photos')->orderBy('year', 'desc')->get();
        $galleryData = [];
        foreach ($albums as $album) {
            $year = $album->year;
            if (!isset($galleryData[$year])) {
                $galleryData[$year] = [];
            }
            $galleryData[$year][] = [
                'id' => $album->id,
                'title' => $album->title,
                'cover' => $album->cover_image_url,
                'photos' => $album->photos->map(function ($p) {
                    return [
                        'url' => $p->image_url,
                        'caption' => $p->caption
                    ];
                })
            ];
        }
        return response()->json($galleryData);
    }
    public function getBusinesses()
    {
        $businesses = Business::all()->map(function ($b) {
            return [
                'id' => $b->id,
                'category' => $b->category,
                'name' => $b->name,
                'image' => $b->image_url,
                'address' => $b->address,
                'details' => $b->details,
                'mapLink' => $b->maps_url,
            ];
        });
        return response()->json($businesses);
    }

    public function submitContact(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:5000',
        ]);

        $recipient = config('services.contact.recipient');
        if (!filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
            return response()->json(['message' => 'Contact messaging is temporarily unavailable.'], 503);
        }
        try {
            Mail::to($recipient)->send(new ContactMessage(
                name: $request->name,
                email: $request->email,
                messageContent: $request->message,
            ));
            return response()->json(['message' => 'Message sent successfully']);
        } catch (\Exception $e) {
            \Log::error('Contact form email failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to send message'], 500);
        }
    }
}
