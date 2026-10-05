<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\{DB,Hash};
class CatalogDemoSeeder extends Seeder {
 public function run(): void {
  $data=json_decode(file_get_contents(database_path('catalog-demo.json')),true,512,JSON_THROW_ON_ERROR);
  foreach(array_merge(array_column($data['artisans'],'profile_image'),array_column($data['products'],'featured_image'))as$url){
   if(!is_file(base_path('../public'.$url)))throw new \RuntimeException('Falta una imagen del catálogo: '.$url);
  }
  $missing=array_filter($data['artisans'],fn($a)=>!DB::table('users')->where('id',$a['user_id'])->exists());
  $password=env('DEMO_PASSWORD');
  if($missing && !$password)$password=$this->command?->secret('Contraseña para las cuentas ficticias (mínimo 8 caracteres)');
  if($missing && (!is_string($password)||strlen($password)<8))throw new \RuntimeException('Introduce una contraseña de al menos 8 caracteres para las cuentas de ejemplo.');
  DB::transaction(function()use($data,$password){
   foreach($data['artisans']as$a){
    $existing=DB::table('users')->where('id',$a['user_id'])->first();
    if(!$existing){
     if(DB::table('users')->where('email',$a['email'])->exists())throw new \RuntimeException('El correo de ejemplo ya pertenece a otra cuenta: '.$a['email']);
     DB::table('users')->insert(['id'=>$a['user_id'],'name'=>$a['name'],'email'=>$a['email'],'password'=>Hash::make($password),'phone'=>'','role'=>'producer','status'=>'active','avatar_url'=>$a['profile_image']]);
    }
    DB::table('producer_profiles')->insertOrIgnore(['id'=>$a['producer_id'],'user_id'=>$a['user_id'],'workshop_name'=>$a['workshop_name'],'biography'=>$a['biography'],'community'=>$a['community'],'municipality'=>$a['municipality'],'languages'=>json_encode($a['languages'],JSON_UNESCAPED_UNICODE),'craft_types'=>json_encode($a['craft_types'],JSON_UNESCAPED_UNICODE),'years_experience'=>$a['years_experience'],'profile_image'=>$a['profile_image'],'authorization_status'=>'approved','verified_contact'=>0]);
   }
   foreach($data['products']as$p){
    $id=$p['id'];$producer=$p['producer_id'];
    $existed=DB::table('products')->where('id',$id)->exists();
    foreach(['materials','gallery']as$key)$p[$key]=json_encode($p[$key],JSON_UNESCAPED_UNICODE);
    DB::table('products')->insertOrIgnore($p);
    // Never recreate or override consent after a producer has withdrawn it.
    if(!$existed){
     $consent='demo_consent_'.substr($id,14);
     DB::table('cultural_consents')->insert(['id'=>$consent,'producer_id'=>$producer,'product_id'=>$id,'allow_name'=>1,'allow_community'=>1,'allow_photos'=>1,'allow_technique'=>1,'allow_materials'=>1,'allow_history'=>1,'allow_platform'=>1,'allow_qr'=>1]);
     $a=collect($data['artisans'])->firstWhere('producer_id',$producer);
     DB::table('cultural_records')->insert(['id'=>'demo_ficha_'.substr($id,14),'product_id'=>$id,'community_origin'=>$a['community'],'author_name'=>$a['name'],'cultural_description'=>'Ficha ficticia para demostración escolar. No documenta patrimonio ni atribuye diseños a una comunidad real.','production_process'=>$p['technique'].' (descripción simulada).','authorized_text'=>'Contenido de demostración; no constituye una autorización cultural real.','maya_content_status'=>'not_applicable','consent_id'=>$consent,'disclaimer'=>'Persona, producto y fotografía ficticios generados para este proyecto escolar.']);
     DB::table('qr_codes')->insert(['id'=>'demo_qr_'.substr($id,14),'product_id'=>$id,'public_url'=>config('app.url').'/producto/'.$id.'?qr=1','active'=>1]);
    }
   }
  });
  $this->command?->info('Catálogo de ejemplo listo: 4 artesanos/talleres y 8 productos. Se conservaron las cuentas y los cambios existentes.');
 }
}
