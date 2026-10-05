<?php
namespace Tests\Feature;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\{DB,Hash};
use App\Models\User;
class MarketplaceTest extends TestCase {
 use RefreshDatabase;
 protected function beforeRefreshingDatabase(): void {
  if (!str_ends_with((string)config('database.connections.mysql.database'),'_test')) throw new \RuntimeException('Usa una base dedicada cuyo nombre termine en _test.');
 }
 private function fixture(): array {
  $buyer=User::create(['id'=>'buyer','name'=>'Comprador','email'=>'buyer@example.test','password'=>Hash::make('Test12345'),'phone'=>'9980000000','role'=>'consumer','status'=>'active']);
  $seller=User::create(['id'=>'seller','name'=>'Productor','email'=>'seller@example.test','password'=>Hash::make('Test12345'),'phone'=>'9980000000','role'=>'producer','status'=>'active']);
  DB::table('producer_profiles')->insert(['id'=>'profile','user_id'=>'seller','workshop_name'=>'Taller','biography'=>'Prueba','community'=>'Prueba','municipality'=>'Prueba','languages'=>'[]','craft_types'=>'[]','authorization_status'=>'approved']);
  DB::table('products')->insert(['id'=>'piece','producer_id'=>'profile','name'=>'Pieza','category'=>'Madera','description'=>'Prueba','price'=>800,'stock'=>2,'status'=>'published','materials'=>'[]','technique'=>'Prueba','package_weight'=>.5,'package_dimensions'=>'10x10x10','gallery'=>'[]']);
  DB::table('cultural_consents')->insert(['id'=>'consent','producer_id'=>'profile','product_id'=>'piece','allow_platform'=>1]);
  return [$buyer,$seller];
 }
 public function test_login_uses_hashed_password_and_hides_it(): void {[$buyer]=$this->fixture();$this->postJson('/api/login',['email'=>$buyer->email,'password'=>'Test12345'])->assertOk()->assertJsonMissingPath('user.password');$this->postJson('/api/login',['email'=>$buyer->email,'password'=>'bad'])->assertUnprocessable();}
 public function test_cart_and_checkout_ignore_client_prices_and_are_idempotent(): void {
  [$buyer]=$this->fixture();$this->actingAs($buyer)->putJson('/api/cart',['items'=>[['product_id'=>'piece','quantity'=>1,'unit_price'=>1]]])->assertOk();
  $body=['address'=>'Dirección','postal'=>'77500','method'=>'card','scenario'=>'approved','idempotency_key'=>'a990fdeb-6a60-4799-8e88-18984c539d43'];
  $this->postJson('/api/checkout',$body)->assertCreated();$this->postJson('/api/checkout',$body)->assertOk();
  $this->assertDatabaseCount('orders',1);$this->assertDatabaseHas('orders',['subtotal'=>800,'shipping'=>130,'total'=>930,'platform_commission'=>80,'producer_net'=>720]);$this->assertDatabaseHas('products',['id'=>'piece','stock'=>1]);
 }
 public function test_insufficient_stock_rolls_back_entire_checkout(): void {[$buyer]=$this->fixture();$this->actingAs($buyer)->putJson('/api/cart',['items'=>[['product_id'=>'piece','quantity'=>2]]])->assertOk();DB::table('products')->where('id','piece')->update(['stock'=>1]);$this->postJson('/api/checkout',['address'=>'Prueba','postal'=>'77500','method'=>'card','scenario'=>'approved','idempotency_key'=>'ba90fdeb-6a60-4799-8e88-18984c539d43'])->assertUnprocessable();$this->assertDatabaseCount('orders',0);$this->assertDatabaseHas('products',['id'=>'piece','stock'=>1]);}
 public function test_consumer_cannot_moderate_products_or_see_other_users(): void {[$buyer]=$this->fixture();$this->actingAs($buyer)->patchJson('/api/products/piece',['status'=>'published'])->assertForbidden();$data=$this->getJson('/api/state')->assertOk()->json('store');$this->assertCount(1,$data['users']);$this->assertSame('buyer',$data['users'][0]['id']);}
 public function test_revoked_consent_removes_publication(): void {[$buyer,$seller]=$this->fixture();$this->actingAs($seller)->deleteJson('/api/consents/consent')->assertOk();$this->assertDatabaseHas('products',['id'=>'piece','status'=>'paused']);$this->actingAs($buyer)->getJson('/api/state')->assertJsonCount(0,'store.products');}
 public function test_pending_payment_can_be_cancelled_and_stock_restored_once(): void {[$buyer]=$this->fixture();$this->actingAs($buyer)->putJson('/api/cart',['items'=>[['product_id'=>'piece','quantity'=>1]]])->assertOk();$this->postJson('/api/checkout',['address'=>'Prueba','postal'=>'77500','method'=>'pending','scenario'=>'pending','idempotency_key'=>'ca90fdeb-6a60-4799-8e88-18984c539d43'])->assertCreated();$id=DB::table('orders')->value('id');$this->patchJson('/api/orders/'.$id,['status'=>'cancelled'])->assertOk();$this->patchJson('/api/orders/'.$id,['status'=>'cancelled'])->assertUnprocessable();$this->assertDatabaseHas('products',['id'=>'piece','stock'=>2]);}

 public function test_profile_image_and_workshop_edit_are_owned_by_logged_in_user(): void {
  [$buyer,$seller]=$this->fixture();
  $this->actingAs($seller)->putJson('/api/profile',['name'=>'Mi nombre','phone'=>'9981111111','workshop_name'=>'Mi taller','biography'=>'Nuestra historia','community'=>'Cancún','municipality'=>'Benito Juárez','years_experience'=>8,'languages'=>['Español','Maya'],'craft_types'=>['Madera']])->assertOk();
  $this->assertDatabaseHas('producer_profiles',['id'=>'profile','workshop_name'=>'Mi taller','years_experience'=>8]);
  \Illuminate\Support\Facades\Storage::fake('public');
  $file=\Illuminate\Http\UploadedFile::fake()->createWithContent('foto.png',base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j3XcAAAAASUVORK5CYII='));
  $result=$this->actingAs($buyer)->postJson('/api/profile/image',['image'=>$file])->assertCreated();
  $this->assertDatabaseHas('users',['id'=>'buyer','avatar_url'=>$result->json('url')]);
  $this->assertDatabaseHas('users',['id'=>'seller','avatar_url'=>null]);
  $this->assertDatabaseHas('producer_profiles',['id'=>'profile','profile_image'=>null]);
  $this->postJson('/api/profile/image',['image'=>\Illuminate\Http\UploadedFile::fake()->create('script.php',1,'application/x-httpd-php')])->assertUnprocessable();
 }
 public function test_translator_uses_provider_and_validates_direction(): void {
  config(['translator.key'=>'test-key','translator.region'=>'test-region']);
  \Illuminate\Support\Facades\Http::preventStrayRequests();
  \Illuminate\Support\Facades\Http::fake(['api.cognitive.microsofttranslator.com/*'=>\Illuminate\Support\Facades\Http::response([['translations'=>[['text'=>'Resultado del proveedor','to'=>'yua']]]])]);
  $this->postJson('/api/translate',['text'=>'Texto libre','source'=>'es','target'=>'yua'])->assertOk()->assertJsonPath('text','Resultado del proveedor');
  \Illuminate\Support\Facades\Http::assertSent(fn($r)=>$r->hasHeader('Ocp-Apim-Subscription-Key','test-key')&&$r->hasHeader('Ocp-Apim-Subscription-Region','test-region')&&$r[0]['Text']==='Texto libre'&&str_contains($r->url(),'from=es')&&str_contains($r->url(),'to=yua'));
  $this->postJson('/api/translate',['text'=>'Texto','source'=>'es','target'=>'es'])->assertUnprocessable();
  $this->postJson('/api/translate',['text'=>str_repeat('a',3001),'source'=>'es','target'=>'yua'])->assertUnprocessable();
 }
 public function test_translator_reports_missing_key_and_provider_failure(): void {
  config(['translator.key'=>'']);
  $this->postJson('/api/translate',['text'=>'Texto','source'=>'yua','target'=>'es'])->assertStatus(503);
  config(['translator.key'=>'test-key']);
  \Illuminate\Support\Facades\Http::fake(['*'=>\Illuminate\Support\Facades\Http::response([],401)]);
  $this->postJson('/api/translate',['text'=>'Texto','source'=>'yua','target'=>'es'])->assertStatus(503)->assertJsonMissing(['key'=>'test-key']);
 }
 public function test_admin_command_creates_hashed_account(): void {
  $this->artisan('voces:admin',['email'=>'administrator@example.test'])->expectsQuestion('Contraseña del administrador (mínimo 8 caracteres)','AdminTest123')->expectsQuestion('Confirma la contraseña','AdminTest123')->expectsOutput('Administrador creado.')->assertSuccessful();
  $u=User::where('email','administrator@example.test')->firstOrFail();$this->assertSame('admin',$u->role);$this->assertTrue(Hash::check('AdminTest123',$u->password));
  $this->artisan('voces:admin',['email'=>'administrator@example.test'])->assertFailed();
 }

 public function test_demo_catalog_is_idempotent_and_preserves_existing_admin_and_edits(): void {
  $admin=User::create(['id'=>'existing_admin','name'=>'Administrador','email'=>'existing@example.test','password'=>'ExistingPass123','phone'=>'','role'=>'admin','status'=>'active']);
  $_ENV['DEMO_PASSWORD']=$_SERVER['DEMO_PASSWORD']='FixturePass123';
  try {
   $this->seed(\Database\Seeders\CatalogDemoSeeder::class);
   $this->assertDatabaseCount('users',5);$this->assertDatabaseCount('producer_profiles',4);$this->assertDatabaseCount('products',38);
   $this->assertTrue(Hash::check('ExistingPass123',$admin->fresh()->password));
   $this->assertTrue(Hash::check('FixturePass123',User::findOrFail('demo_user_ana')->password));
   DB::table('producer_profiles')->where('id','demo_taller_ana')->update(['biography'=>'Biografía editada por el usuario']);
   DB::table('products')->where('id','demo_producto_rebozo')->update(['stock'=>3,'status'=>'paused']);
   DB::table('cultural_consents')->where('product_id','demo_producto_rebozo')->update(['revoked_at'=>now()]);
   $this->seed(\Database\Seeders\CatalogDemoSeeder::class);
   $this->assertDatabaseCount('users',5);$this->assertDatabaseCount('products',38);
   $this->assertDatabaseHas('producer_profiles',['id'=>'demo_taller_ana','biography'=>'Biografía editada por el usuario']);
   $this->assertDatabaseHas('products',['id'=>'demo_producto_rebozo','stock'=>3,'status'=>'paused']);
   $this->assertNotNull(DB::table('cultural_consents')->where('product_id','demo_producto_rebozo')->value('revoked_at'));
   $this->getJson('/api/state')->assertOk()->assertJsonCount(37,'store.products');
  }finally{unset($_ENV['DEMO_PASSWORD'],$_SERVER['DEMO_PASSWORD']);}
 }

 public function test_certificate_is_private_and_requires_admin_review_before_publication(): void {
  [$buyer,$seller]=$this->fixture();
  $admin=User::create(['id'=>'admin','name'=>'Admin','email'=>'admin@example.test','password'=>'Test12345','phone'=>'','role'=>'admin','status'=>'active']);
  \Illuminate\Support\Facades\Storage::fake('local');
  $file=\Illuminate\Http\UploadedFile::fake()->createWithContent('certificado.pdf',"%PDF-1.4\n1 0 obj << /Type /Catalog >> endobj\n%%EOF");
  $this->actingAs($buyer)->postJson('/api/certificates',['file'=>$file])->assertForbidden();
  $uploaded=$this->actingAs($seller)->postJson('/api/certificates',['file'=>$file])->assertCreated();$cid=$uploaded->json('id');
  $body=['certificate_id'=>$cid,'name'=>'Artesanía nueva','description'=>'Pieza elaborada a mano','category'=>'Madera','price'=>100,'stock'=>5,'materials'=>['Madera'],'technique'=>'Tallado','package_weight'=>.5,'package_dimensions'=>'10x10x10','gallery'=>['/storage/uploads/foto.png'],'consents'=>['c_name'=>true,'c_platform'=>true,'c_photos'=>true,'c_technique'=>true,'c_materials'=>true]];
  $this->postJson('/api/products',$body)->assertCreated();$pid=DB::table('product_certificates')->where('id',$cid)->value('product_id');
  $this->postJson('/api/products',$body)->assertUnprocessable();
  $this->assertDatabaseHas('notifications',['user_id'=>'admin','type'=>'certificate']);
  $this->actingAs($buyer)->get('/api/certificates/'.$cid.'/download')->assertForbidden();
  $this->getJson('/api/state')->assertJsonCount(0,'store.certificates');
  $this->actingAs($seller)->get('/api/certificates/'.$cid.'/download')->assertOk();
  $this->patchJson('/api/certificates/'.$cid,['status'=>'approved'])->assertForbidden();
  $this->actingAs($admin)->patchJson('/api/products/'.$pid,['status'=>'published'])->assertUnprocessable();
  $this->getJson('/api/state')->assertJsonMissingPath('store.certificates.0.path');
  $this->patchJson('/api/certificates/'.$cid,['status'=>'approved','review_notes'=>'Documento revisado'])->assertOk();
  $this->assertDatabaseHas('products',['id'=>$pid,'status'=>'pending']);
  $this->patchJson('/api/products/'.$pid,['status'=>'published'])->assertOk();
  $this->assertDatabaseHas('audit_logs',['target_id'=>$cid,'action'=>'certificate:approved']);
  $this->patchJson('/api/certificates/'.$cid,['status'=>'rejected','review_notes'=>'No'])->assertUnprocessable();
 }
 public function test_rejected_certificate_can_be_replaced_only_by_owner(): void {
  [$buyer,$seller]=$this->fixture();
  $admin=User::create(['id'=>'admin','name'=>'Admin','email'=>'admin@example.test','password'=>'Test12345','phone'=>'','role'=>'admin','status'=>'active']);
  DB::table('product_certificates')->insert(['id'=>'old','producer_id'=>'profile','product_id'=>'piece','path'=>'certificates/old.pdf','original_name'=>'old.pdf','mime_type'=>'application/pdf','status'=>'pending','created_at'=>now(),'updated_at'=>now()]);
  $this->actingAs($admin)->patchJson('/api/certificates/old',['status'=>'rejected'])->assertUnprocessable();
  $this->patchJson('/api/certificates/old',['status'=>'rejected','review_notes'=>'Falta firma'])->assertOk();
  $this->assertDatabaseHas('products',['id'=>'piece','status'=>'rejected']);
  DB::table('product_certificates')->insert(['id'=>'new','producer_id'=>'profile','path'=>'certificates/new.pdf','original_name'=>'new.pdf','mime_type'=>'application/pdf','status'=>'uploaded','created_at'=>now(),'updated_at'=>now()]);
  $this->actingAs($buyer)->postJson('/api/products/piece/certificate',['certificate_id'=>'new'])->assertForbidden();
  $this->actingAs($seller)->postJson('/api/products/piece/certificate',['certificate_id'=>'new'])->assertOk();
  $this->assertDatabaseHas('product_certificates',['id'=>'new','product_id'=>'piece','status'=>'pending']);
  $this->assertDatabaseHas('product_certificates',['id'=>'old','product_id'=>null,'status'=>'rejected']);
  $this->assertDatabaseHas('products',['id'=>'piece','status'=>'pending']);
 }
 public function test_paypal_demo_records_payment_without_credentials(): void {
  [$buyer]=$this->fixture();$this->actingAs($buyer)->putJson('/api/cart',['items'=>[['product_id'=>'piece','quantity'=>1]]])->assertOk();
  $this->postJson('/api/checkout',['address'=>'Dirección','postal'=>'77500','method'=>'paypal','scenario'=>'approved','idempotency_key'=>'de90fdeb-6a60-4799-8e88-18984c539d43'])->assertCreated();
  $this->assertDatabaseHas('payments',['method'=>'paypal','status'=>'approved','is_simulated'=>1]);
 }
 public function test_maya_dictation_proxies_audio_without_using_spanish_recognition(): void {
  \Illuminate\Support\Facades\Http::preventStrayRequests();
  \Illuminate\Support\Facades\Http::fake(['127.0.0.1:8765/*'=>\Illuminate\Support\Facades\Http::sequence()->push(['text'=>"Bix a beel",'language'=>'yua'])->push([],503)]);
  $file=\Illuminate\Http\UploadedFile::fake()->createWithContent('maya.wav','RIFF'.pack('V',36).'WAVE'.str_repeat("\0",32));
  $this->postJson('/api/transcribe',['audio'=>$file])->assertOk()->assertJsonPath('text','Bix a beel');
  \Illuminate\Support\Facades\Http::assertSent(fn($r)=>$r->url()==='http://127.0.0.1:8765/transcribe' && str_starts_with($r->body(),'RIFF'));
  $this->postJson('/api/transcribe',['audio'=>\Illuminate\Http\UploadedFile::fake()->createWithContent('bad.wav','invalid')])->assertUnprocessable();
  $this->postJson('/api/transcribe',['audio'=>$file])->assertStatus(503);
 }
}
