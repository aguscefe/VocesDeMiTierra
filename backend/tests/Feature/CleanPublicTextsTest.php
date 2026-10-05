<?php
namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class CleanPublicTextsTest extends TestCase
{
    use RefreshDatabase;
    protected function beforeRefreshingDatabase(): void
    {
        if (!str_ends_with((string) config('database.connections.mysql.database'), '_test')) throw new \RuntimeException('Usa una base dedicada terminada en _test.');
    }
    public function test_cleans_old_labels_is_idempotent_and_preserves_custom_biography(): void
    {
        foreach (['ana','mateo'] as $key) User::create(['id'=>$key,'name'=>'Cuenta','email'=>$key.'@example.test','password'=>'Test12345','phone'=>'','role'=>'producer','status'=>'active']);
        foreach (['ana'=>'Personaje ficticio de demostración para proyecto escolar.','mateo'=>'Biografía personalizada del productor.'] as $key=>$bio) {
            DB::table('producer_profiles')->insert(['id'=>'demo_taller_'.$key,'user_id'=>$key,'workshop_name'=>'Taller','biography'=>$bio,'community'=>'Lugar','municipality'=>'Lugar','languages'=>'[]','craft_types'=>'[]']);
        }
        DB::table('notifications')->insert(['id'=>'notice','user_id'=>'ana','type'=>'update','title'=>'Actualización','message'=>'Nueva venta de demostración: pedido-1']);
        $this->artisan('voces:limpiar-textos')->assertSuccessful();
        $clean=DB::table('producer_profiles')->where('id','demo_taller_ana')->value('biography');
        $this->assertStringNotContainsString('escolar', $clean);
        $this->assertDatabaseHas('producer_profiles',['id'=>'demo_taller_mateo','biography'=>'Biografía personalizada del productor.']);
        $this->assertDatabaseHas('notifications',['id'=>'notice','message'=>'Nueva venta: pedido-1']);
        $this->artisan('voces:limpiar-textos')->assertSuccessful();
        $this->assertSame($clean,DB::table('producer_profiles')->where('id','demo_taller_ana')->value('biography'));
        $this->assertDatabaseCount('users',2);
        $this->assertDatabaseCount('producer_profiles',2);
        $this->assertDatabaseCount('notifications',1);
    }
}
