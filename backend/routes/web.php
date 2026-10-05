<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MarketplaceController as M;
Route::prefix('api')->group(function () {
 Route::get('csrf', fn()=>response()->json(['token'=>csrf_token()]));
 Route::get('health', fn()=>response()->json(['status'=>'ok']));
 Route::post('translate',[\App\Http\Controllers\Api\TranslationController::class,'translate'])->middleware('throttle:10,1');
 Route::get('state', [M::class,'state']);
 Route::post('login', [M::class,'login'])->middleware('throttle:10,1');
 Route::post('register',[M::class,'register'])->middleware('throttle:10,1');
 Route::post('events',[M::class,'event'])->middleware('throttle:60,1');
 Route::middleware('auth')->group(function () {
  Route::post('logout',[M::class,'logout']);
  Route::put('cart',[M::class,'cart']);
  Route::post('favorites/{id}',[M::class,'favorite']);
  Route::post('checkout/quote',[M::class,'quote']);
  Route::post('checkout',[M::class,'checkout']);
  Route::patch('orders/{id}',[M::class,'order']);
  Route::post('products',[M::class,'product']);
  Route::patch('products/{id}',[M::class,'moderateProduct']);
  Route::patch('producers/{id}',[M::class,'moderateProducer']);
  Route::patch('users/{id}',[M::class,'moderateUser']);
  Route::post('uploads',[M::class,'upload']);
  Route::post('tickets',[M::class,'ticket']);
  Route::patch('tickets/{id}',[M::class,'ticketUpdate']);
  Route::post('reviews',[M::class,'review']);
  Route::patch('reviews/{id}',[M::class,'reviewUpdate']);
  Route::post('notifications/read',[M::class,'readNotifications']);
  Route::post('profile/image',[M::class,'profileImage']);
  Route::put('profile',[M::class,'profile']);
  Route::delete('consents/{id}',[M::class,'withdraw']);
  Route::patch('qr/{id}',[M::class,'qr']);
 });
});
