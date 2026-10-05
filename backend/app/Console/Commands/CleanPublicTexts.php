<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CleanPublicTexts extends Command
{
    protected $signature = 'voces:limpiar-textos';
    protected $description = 'Actualizar leyendas antiguas sin modificar cuentas, piezas ni compras';

    public function handle(): int
    {
        $catalog = json_decode(file_get_contents(database_path('catalog-demo.json')), true, 512, JSON_THROW_ON_ERROR);
        $counts = DB::transaction(function () use ($catalog) {
            $profiles = 0;
            foreach ($catalog['artisans'] as $artisan) {
                $profile = DB::table('producer_profiles')->where('id', $artisan['producer_id'])->first();
                if ($profile && preg_match('/proyecto escolar|demostraci[oó]n|personaje ficticio/iu', $profile->biography ?? '')) {
                    $profiles += DB::table('producer_profiles')->where('id', $profile->id)->update(['biography' => $artisan['biography']]);
                }
            }
            $notifications = 0;
            foreach (DB::table('notifications')->where('message', 'like', '%de demostración%')->get(['id', 'message']) as $notice) {
                $notifications += DB::table('notifications')->where('id', $notice->id)->update([
                    'message' => str_replace(' de demostración', '', $notice->message),
                ]);
            }
            return [$profiles, $notifications];
        });
        $this->info("Biografías actualizadas: {$counts[0]}. Notificaciones actualizadas: {$counts[1]}.");
        return self::SUCCESS;
    }
}
