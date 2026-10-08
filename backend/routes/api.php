<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\PublicServiceController;
use App\Http\Controllers\UserAuthController;

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

// User Authentication Routes
Route::post('/user/register', [UserAuthController::class, 'register'])->middleware('throttle:5,1');
Route::post('/user/login', [UserAuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('/ekyc/verify', [\App\Http\Controllers\EkycController::class, 'verify'])->middleware('throttle:5,1');

Route::get('/public/service/{name}/schedule', [PublicServiceController::class, 'getServiceSchedule']);
Route::get('/public/content/news', [App\Http\Controllers\PublicContentController::class, 'getNews']);
Route::get('/public/content/gallery', [App\Http\Controllers\PublicContentController::class, 'getGallery']);
Route::get('/public/content/businesses', [App\Http\Controllers\PublicContentController::class, 'getBusinesses']);
Route::post('/public/contact', [App\Http\Controllers\PublicContentController::class, 'submitContact'])->middleware('throttle:10,1');
Route::post('/public/service/reserve', [PublicServiceController::class, 'reserve'])->middleware('throttle:10,1');
Route::post('/public/document/request', [PublicServiceController::class, 'requestDocument'])->middleware('throttle:10,1');

Route::middleware(['auth:sanctum', \App\Http\Middleware\RequireAccountType::class . ':resident'])->group(function () {
    // User routes
    Route::post('/user/logout', [UserAuthController::class, 'logout']);
    Route::get('/user/me', [UserAuthController::class, 'me']);
    Route::put('/user/profile', [UserAuthController::class, 'updateProfile']);
    
});

Route::middleware(['auth:sanctum', \App\Http\Middleware\RequireAccountType::class . ':admin'])->group(function () {
    Route::get('/admin/identity-reviews', [\App\Http\Controllers\IdentityReviewController::class, 'index']);
    Route::get('/admin/identity-reviews/{user}/image/{side?}', [\App\Http\Controllers\IdentityReviewController::class, 'image'])->whereIn('side', ['front', 'back']);
    Route::put('/admin/identity-reviews/{user}', [\App\Http\Controllers\IdentityReviewController::class, 'update']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/admin/dashboard', [App\Http\Controllers\AdminDashboardController::class, 'index']);
    Route::get('/admin/residents', [App\Http\Controllers\AdminDashboardController::class, 'getResidents']);
    Route::put('/admin/document/{id}/status', [App\Http\Controllers\AdminDashboardController::class, 'updateDocumentStatus']);
    Route::put('/admin/service/{id}/status', [App\Http\Controllers\AdminDashboardController::class, 'updateServiceStatus']);
    Route::get('/admin/content/news', [App\Http\Controllers\AdminContentController::class, 'getNews']);
    Route::post('/admin/content/news', [App\Http\Controllers\AdminContentController::class, 'createNews']);
    Route::delete('/admin/content/news/{id}', [App\Http\Controllers\AdminContentController::class, 'deleteNews']);
    Route::get('/admin/content/albums', [App\Http\Controllers\AdminContentController::class, 'getAlbums']);
    Route::post('/admin/content/albums', [App\Http\Controllers\AdminContentController::class, 'createAlbum']);
    Route::delete('/admin/content/albums/{id}', [App\Http\Controllers\AdminContentController::class, 'deleteAlbum']);
    Route::post('/admin/content/albums/{id}/photos', [App\Http\Controllers\AdminContentController::class, 'addPhoto']);
    Route::delete('/admin/content/photos/{id}', [App\Http\Controllers\AdminContentController::class, 'deletePhoto']);
    Route::get('/admin/content/businesses', [App\Http\Controllers\AdminContentController::class, 'getBusinesses']);
    Route::post('/admin/content/businesses', [App\Http\Controllers\AdminContentController::class, 'createBusiness']);
    Route::delete('/admin/content/businesses/{id}', [App\Http\Controllers\AdminContentController::class, 'deleteBusiness']);
});
