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
}
