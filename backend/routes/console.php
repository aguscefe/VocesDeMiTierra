<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('voces:admin {email} {--name=Administrador}', function () {
 $email=$this->argument('email');
 if(!filter_var($email,FILTER_VALIDATE_EMAIL)){ $this->error('Correo inválido.'); return 1; }
 $existing=\App\Models\User::where('email',$email)->first();
 if($existing){$this->error('El correo ya existe. No se modificó su cuenta.');return 1;}
 $password=$this->secret('Contraseña del administrador (mínimo 8 caracteres)');
 if(!is_string($password)||strlen($password)<8){$this->error('La contraseña debe tener al menos 8 caracteres.');return 1;}
 if($password!==$this->secret('Confirma la contraseña')){$this->error('Las contraseñas no coinciden.');return 1;}
 \App\Models\User::create(['id'=>(string)\Illuminate\Support\Str::uuid(),'name'=>$this->option('name'),'email'=>$email,'password'=>$password,'role'=>'admin','status'=>'active','phone'=>'']);
 $this->info('Administrador creado.');
})->purpose('Crear un administrador sin guardar su contraseña en Git');

Artisan::command('voces:demo', function () {
 return $this->call('db:seed',['--class'=>\Database\Seeders\CatalogDemoSeeder::class,'--force'=>true]);
})->purpose('Agregar catálogo ficticio sin borrar cuentas ni duplicar productos');

Artisan::command('voces:ventas-demo', function () {
 return $this->call('db:seed',['--class'=>\Database\Seeders\SalesDemoSeeder::class,'--force'=>true]);
})->purpose('Precargar 10 clientes, administrador e historial de 40 compras sin duplicarlos');

Artisan::command('voces:historias', function () {
 $stories=json_decode(file_get_contents(database_path('catalog-stories.json')),true,512,JSON_THROW_ON_ERROR);
 $count=\Illuminate\Support\Facades\DB::transaction(function()use($stories){
  $count=0;
  foreach($stories as$id=>$story){
   $record=\Illuminate\Support\Facades\DB::table('cultural_records')->where('id','demo_ficha_'.substr($id,14))->where('product_id',$id)->first();
   if(!$record)continue;
   $consent=\Illuminate\Support\Facades\DB::table('cultural_consents')->where('id',$record->consent_id)->first();
   if(!$consent || !$consent->allow_history || $consent->revoked_at || ($consent->expires_at && strtotime($consent->expires_at)<time()))continue;
   $count+=\Illuminate\Support\Facades\DB::table('cultural_records')->where('id',$record->id)->update(['cultural_description'=>$story['history'],'production_process'=>$story['process']]);
  }
  return $count;
 });
 $this->info('Fichas actualizadas: '.$count.'. Cuentas, ventas y productos conservados.');
})->purpose('Actualizar relatos creativos del catálogo con consentimiento vigente');

Artisan::command('voces:descripciones', function () {
 $catalog=json_decode(file_get_contents(database_path('catalog-demo.json')),true,512,JSON_THROW_ON_ERROR);
 $count=\Illuminate\Support\Facades\DB::transaction(function()use($catalog){
  $count=0;
  foreach($catalog['products'] as$product){
   if(!str_starts_with($product['id'],'demo_producto_'))continue;
   $count+=\Illuminate\Support\Facades\DB::table('products')->where('id',$product['id'])->where('producer_id',$product['producer_id'])->update(['description'=>$product['description'],'production_time'=>$product['production_time']]);
  }
  return $count;
 });
 $this->info('Descripciones actualizadas: '.$count.'. Precios, existencias, cuentas y compras conservados.');
})->purpose('Actualizar las descripciones de las 38 piezas del catálogo');
