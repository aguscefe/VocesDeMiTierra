<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\{DB,Hash};
use Illuminate\Support\Carbon;
class SalesDemoSeeder extends Seeder {
 public function run(): void {
  $customers=json_decode(file_get_contents(database_path('customers-demo.json')),true,512,JSON_THROW_ON_ERROR);
  $catalog=json_decode(file_get_contents(database_path('catalog-demo.json')),true,512,JSON_THROW_ON_ERROR);
  foreach($catalog['artisans'] as $a)if(!DB::table('producer_profiles')->where('id',$a['producer_id'])->exists())throw new \RuntimeException('Ejecuta primero php artisan voces:demo.');
  $needsPassword=!DB::table('users')->where('email','admin@gmail.com')->exists();
  foreach($customers as $c)if(!DB::table('users')->where('id',$c['id'])->exists())$needsPassword=true;
  $password=env('DEMO_CUSTOMERS_PASSWORD');
  if($needsPassword&&!$password)$password=$this->command?->secret('Contraseña para los 10 clientes y administrador NUEVOS (mínimo 8 caracteres)');
  if($needsPassword&&(!is_string($password)||strlen($password)<8))throw new \RuntimeException('Se requiere contraseña de al menos 8 caracteres.');
  $created=0;
  DB::transaction(function()use($customers,$catalog,$password,&$created){
   if(!DB::table('users')->where('email','admin@gmail.com')->exists())DB::table('users')->insert(['id'=>'demo_admin_sales','name'=>'Administrador','email'=>'admin@gmail.com','password'=>Hash::make($password),'role'=>'admin','status'=>'active']);
   elseif(DB::table('users')->where('email','admin@gmail.com')->value('role')!=='admin')throw new \RuntimeException('admin@gmail.com pertenece a una cuenta que no es administrador; no se modificó.');
   $origins=['Calle Telar 12, Centro, Felipe Carrillo Puerto, Quintana Roo, CP 77200','Calle Laguna 24, Centro, Bacalar, Quintana Roo, CP 77930','Calle Barro 36, Centro, Tulum, Quintana Roo, CP 77760','Calle Palma 48, Centro, José María Morelos, Quintana Roo, CP 77890'];
   foreach($catalog['artisans'] as $i=>$a)DB::table('producer_profiles')->where('id',$a['producer_id'])->whereNull('shipping_address')->update(['shipping_address'=>$origins[$i]]);
   foreach($customers as $i=>$c){
    $user=DB::table('users')->where('id',$c['id'])->first();
    if(!$user){
     if(DB::table('users')->where('email',$c['email'])->exists())throw new \RuntimeException('Correo de ejemplo ocupado: '.$c['email']);
     DB::table('users')->insert(['id'=>$c['id'],'name'=>$c['name'],'email'=>$c['email'],'password'=>Hash::make($password),'role'=>'consumer','status'=>'active','delivery_address'=>$c['address'],'delivery_postal'=>$c['postal'],'phone'=>'0000000000']);
    }elseif($user->role!=='consumer'||$user->email!==$c['email'])throw new \RuntimeException('Identificador de cliente de ejemplo ocupado.');
    for($j=0;$j<4;$j++){
     $id=sprintf('demo_venta_%02d_%d',$i+1,$j+1);
     if(DB::table('orders')->where('id',$id)->exists())continue;
     $artisan=$catalog['artisans'][($i+$j)%4];
     $choices=array_values(array_filter($catalog['products'],fn($x)=>$x['producer_id']===$artisan['producer_id']));
     $product=DB::table('products')->where('id',$choices[$i%count($choices)]['id'])->lockForUpdate()->first();
     if(!$product||$product->status!=='published'||!DB::table('cultural_consents')->where('product_id',$product->id)->whereNull('revoked_at')->where('allow_platform',1)->where(fn($q)=>$q->whereNull('expires_at')->orWhere('expires_at','>',now()))->exists())throw new \RuntimeException('Producto de ejemplo no disponible; no se alteró su autorización.');
     $status=['delivered','shipped','paid',$i%3===0?'refunded':'pending_payment'][$j];
     $refunded=$status==='refunded';$paid=$status!=='pending_payment';
     if(!$refunded&&$product->stock<1)throw new \RuntimeException('Stock insuficiente para precargar el historial: '.$product->name);
     $date=Carbon::now()->subMonthsNoOverflow(($i+$j)%6)->subDays(10+$j)->startOfDay()->addHours(10);
     $subtotal=(int)round($product->price*100);$shipping=13000;$total=$subtotal+$shipping;$commission=(int)round($subtotal*.1);
     $origin=DB::table('producer_profiles')->where('id',$artisan['producer_id'])->value('shipping_address');
     DB::table('orders')->insert(['id'=>$id,'order_number'=>sprintf('VMT-DEMO-%02d-%d',$i+1,$j+1),'consumer_id'=>$c['id'],'producer_id'=>$artisan['producer_id'],'status'=>$status,'subtotal'=>$subtotal/100,'shipping'=>130,'total'=>$total/100,'platform_commission'=>$commission/100,'producer_net'=>($subtotal-$commission)/100,'processing_cost'=>$paid?round($total*.036+300)/100:0,'consumer_address'=>$c['address'].', CP '.$c['postal'],'origin_address'=>$origin,'created_at'=>$date,'updated_at'=>$date,'estimated_delivery'=>$date->copy()->addDays(8)->toDateString(),'carrier'=>in_array($status,['shipped','delivered'])?'Envío regional de prueba':null,'tracking_number'=>in_array($status,['shipped','delivered'])?'DEMO-QR-'.($i+1).'-'.$j:null]);
     DB::table('order_items')->insert(['order_id'=>$id,'product_id'=>$product->id,'quantity'=>1,'unit_price'=>$product->price]);
     if(!$refunded)DB::table('products')->where('id',$product->id)->decrement('stock');
     $method=$status==='pending_payment'?'pending':['card','paypal','transfer'][($i+$j)%3];
     DB::table('payments')->insert(['id'=>'demo_pago_'.($i+1).'_'.$j,'order_id'=>$id,'transaction_id'=>'DEMO-PAGO-'.($i+1).'-'.$j,'method'=>$method,'status'=>$refunded?'refunded':($paid?'approved':'pending'),'amount'=>$total/100,'card_last_four'=>$method==='card'?'4242':null,'is_simulated'=>1,'created_at'=>$date]);
     if(in_array($status,['shipped','delivered']))DB::table('shipments')->insert(['id'=>'demo_envio_'.($i+1).'_'.$j,'order_id'=>$id,'carrier'=>'Envío regional de prueba','tracking_number'=>'DEMO-QR-'.($i+1).'-'.$j,'shipped_at'=>$date->copy()->addDay(),'delivered_at'=>$status==='delivered'?$date->copy()->addDays(5):null]);
     foreach([$c['id'],$artisan['user_id']] as $k=>$uid)DB::table('notifications')->insert(['id'=>'demo_aviso_'.($i+1).'_'.$j.'_'.$k,'user_id'=>$uid,'type'=>'order','title'=>$k?'Venta registrada':'Compra registrada','message'=>'Pedido de ejemplo '.$id.' · '.$product->name,'created_at'=>$date]);
     $created++;
    }
   }
  });
  $this->command?->info("10 clientes listos; $created pedidos nuevos. Historial: 40 pedidos y pagos, sin duplicados. Las cuentas y cambios existentes se conservaron.");
  $this->command?->table(['Nombre','Correo'],array_map(fn($c)=>[$c['name'],$c['email']],$customers));
 }
}
