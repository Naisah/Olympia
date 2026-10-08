<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$photos = App\Models\AlbumPhoto::where('image_url', 'like', 'https://images.unsplash.com/%')->get();
foreach ($photos as $photo) {
    $photo->update(['image_url' => 'https://picsum.photos/seed/' . $photo->id . '/400/300']);
}

$albums = App\Models\Album::where('cover_image_url', 'like', 'https://images.unsplash.com/%')->get();
foreach ($albums as $album) {
    $album->update(['cover_image_url' => 'https://picsum.photos/seed/album_' . $album->id . '/400/300']);
}

echo "Updated " . $photos->count() . " photos and " . $albums->count() . " albums.";
