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
