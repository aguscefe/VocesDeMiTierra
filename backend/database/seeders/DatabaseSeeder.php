<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\{DB,Hash};
class DatabaseSeeder extends Seeder {
 public function run(): void {
  if (!filter_var(env('DEMO_SEED',false),FILTER_VALIDATE_BOOLEAN)) { $this->command?->warn('DEMO_SEED=false: no se cargaron datos.'); return; }
  if (DB::table('users')->exists()) throw new \RuntimeException('El seeder solo debe ejecutarse en una base vacía.');
  $password=env('DEMO_PASSWORD');if(!$password||strlen($password)<8)throw new \RuntimeException('Configura DEMO_PASSWORD (mínimo 8 caracteres).');
  $data=json_decode(file_get_contents(database_path('demo.json')),true,512,JSON_THROW_ON_ERROR);
  DB::transaction(function()use($data,$password){
   foreach($data['users']as$x){unset($x['password_demo']);$x['password']=Hash::make($password);DB::table('users')->insert($x);}
   foreach($data['producer_profiles']as$x){unset($x['total_products']);foreach(['languages','craft_types']as$k)$x[$k]=json_encode($x[$k]);DB::table('producer_profiles')->insert($x);}
   foreach($data['products']as$x){foreach(['materials','gallery']as$k)$x[$k]=json_encode($x[$k]);DB::table('products')->insert($x);}
   foreach($data['cultural_records']as$x){$product=DB::table('products')->where('id',$x['product_id'])->first();DB::table('cultural_consents')->insert(['id'=>$x['consent_id'],'producer_id'=>$product->producer_id,'product_id'=>$x['product_id'],'allow_name'=>1,'allow_community'=>1,'allow_photos'=>1,'allow_technique'=>1,'allow_materials'=>1,'allow_history'=>1,'allow_video'=>1,'allow_platform'=>1,'allow_qr'=>1]);$x['production_process']=$x['process'];unset($x['process']);DB::table('cultural_records')->insert($x);}
   foreach($data['orders']as$x){$items=$x['items'];unset($x['items']);DB::table('orders')->insert($x);foreach($items as$i)DB::table('order_items')->insert($i+['order_id'=>$x['id']]);if(in_array($x['status'],['shipped','delivered']))DB::table('shipments')->insert(['id'=>'sh_'.$x['id'],'order_id'=>$x['id'],'carrier'=>$x['carrier']??'Paquetería demo','tracking_number'=>$x['tracking_number']??('DEMO-'.$x['id']),'shipped_at'=>$x['created_at'],'delivered_at'=>$x['status']==='delivered'?$x['created_at']:null]);}
   foreach($data['payments']as$x){$x['transaction_id']=$x['sandbox_transaction_id'];$x['is_simulated']=1;unset($x['sandbox_transaction_id'],$x['simulated']);DB::table('payments')->insert($x);}
   foreach(['reviews','favorites','support_tickets']as$t)foreach($data[$t]as$x)DB::table($t)->insert($x);
   foreach($data['notifications']as$x){$x['is_read']=$x['read'];unset($x['read']);DB::table('notifications')->insert($x);}
   foreach($data['qr_codes']as$x){$x['public_url']=config('app.url').'/producto/'.$x['product_id'].'?qr=1';if(empty($x['last_scan']))$x['last_scan']=null;DB::table('qr_codes')->insert($x);}
   // Historical data is deliberately fictional and retained only as demo data.
  });
 }
}
