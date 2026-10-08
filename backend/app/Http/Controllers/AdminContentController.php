<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\News;
use App\Models\Album;
use App\Models\AlbumPhoto;
use App\Models\Business;
use Illuminate\Support\Facades\Storage;
class AdminContentController extends Controller
{
    public function getNews()
    {
        return response()->json(News::orderBy('id', 'desc')->get());
    }
    public function createNews(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'published_date_string' => 'required|string|max:255',
            'is_featured' => 'boolean',
            'content' => 'required|string|max:50000',
            'link' => 'required|url:http,https|max:2048',
            'image' => 'nullable|image|max:2048' 
        ]);
        $data = $request->only(['title', 'published_date_string', 'is_featured', 'content', 'link']);
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('news_images', 'public');
            $data['image_url'] = '/storage/' . $path;
        }
        $news = News::create($data);
        return response()->json(['message' => 'News created successfully', 'news' => $news]);
    }
    public function deleteNews($id)
    {
        $news = News::findOrFail($id);
        if ($news->image_url && strpos($news->image_url, '/storage/') === 0) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $news->image_url));
        }
        $news->delete();
        return response()->json(['message' => 'News deleted successfully']);
    }
    public function getAlbums()
    {
        return response()->json(Album::with('photos')->orderBy('year', 'desc')->get());
    }
    public function createAlbum(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'year' => 'required|integer|between:1900,2100',
            'cover' => 'nullable|image|max:2048'
        ]);
        $data = $request->only(['title', 'year']);
        if ($request->hasFile('cover')) {
            $path = $request->file('cover')->store('album_covers', 'public');
            $data['cover_image_url'] = '/storage/' . $path;
        }
        $album = Album::create($data);
        return response()->json(['message' => 'Album created successfully', 'album' => $album]);
    }
    public function deleteAlbum($id)
    {
        $album = Album::findOrFail($id);
        if ($album->cover_image_url && strpos($album->cover_image_url, '/storage/') === 0) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $album->cover_image_url));
        }
        foreach ($album->photos as $photo) {
            if ($photo->image_url && strpos($photo->image_url, '/storage/') === 0) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $photo->image_url));
            }
            $photo->delete();
        }
        $album->delete();
        return response()->json(['message' => 'Album deleted successfully']);
    }
    public function addPhoto(Request $request, $albumId)
    {
        $request->validate([
            'caption' => 'nullable|string|max:255',
            'photo' => 'required|image|max:2048'
        ]);
        $album = Album::findOrFail($albumId);
        $path = $request->file('photo')->store('album_photos', 'public');
        $photo = AlbumPhoto::create([
            'album_id' => $album->id,
            'caption' => $request->caption,
            'image_url' => '/storage/' . $path
        ]);
        return response()->json(['message' => 'Photo added successfully', 'photo' => $photo]);
    }
    public function deletePhoto($id)
    {
        $photo = AlbumPhoto::findOrFail($id);
        if ($photo->image_url && strpos($photo->image_url, '/storage/') === 0) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $photo->image_url));
        }
        $photo->delete();
        return response()->json(['message' => 'Photo deleted successfully']);
    }
    public function getBusinesses()
    {
        return response()->json(Business::all());
    }
    public function createBusiness(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'details' => 'nullable|string|max:255', 
            'maps_url' => 'nullable|url:http,https|max:2048',
            'image' => 'nullable|image|max:2048'
        ]);
        $data = $request->only(['name', 'category', 'address', 'maps_url']);
        if ($request->details) {
            $data['details'] = array_map('trim', explode(',', $request->details));
        }
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('business_images', 'public');
            $data['image_url'] = '/storage/' . $path;
        }
        $business = Business::create($data);
        return response()->json(['message' => 'Business created successfully', 'business' => $business]);
    }
    public function deleteBusiness($id)
    {
        $business = Business::findOrFail($id);
        if ($business->image_url && strpos($business->image_url, '/storage/') === 0) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $business->image_url));
        }
        $business->delete();
        return response()->json(['message' => 'Business deleted successfully']);
    }
}
