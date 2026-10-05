<?php
namespace Tests\Feature;
use Tests\TestCase;
use Illuminate\Support\Facades\{Cache,Http};
class PageTranslationTest extends TestCase {
 public function test_translates_a_batch_in_order_and_reuses_cached_labels(): void {
  config(['translator.key'=>'test-key','translator.region'=>'global','cache.default'=>'array']);Cache::flush();Http::preventStrayRequests();
  Http::fake(['api.cognitive.microsofttranslator.com/*'=>Http::response([['translations'=>[['text'=>'Traducción uno','to'=>'yua']]],['translations'=>[['text'=>'Traducción dos','to'=>'yua']]]],200)]);
  $this->postJson('/api/translate/page',['texts'=>['Primer texto','Segundo texto']])->assertOk()->assertJsonPath('texts.0','Traducción uno')->assertJsonPath('texts.1','Traducción dos');
  $this->postJson('/api/translate/page',['texts'=>['Segundo texto','Primer texto']])->assertOk()->assertJsonPath('texts.0','Traducción dos')->assertJsonPath('texts.1','Traducción uno');
  Http::assertSentCount(1);
  Http::assertSent(fn($request)=>str_contains($request->url(),'to=yua')&&$request[0]['Text']==='Primer texto');
 }
 public function test_rejects_oversized_batches_before_contacting_provider(): void {
  Http::fake();$this->postJson('/api/translate/page',['texts'=>array_fill(0,26,'Texto')])->assertUnprocessable();
  $this->postJson('/api/translate/page',['texts'=>[str_repeat('x',3000),str_repeat('y',3000)]])->assertUnprocessable();Http::assertNothingSent();
 }
 public function test_reports_missing_key_and_provider_failures_without_exposing_secrets(): void {
  config(['translator.key'=>null]);$this->postJson('/api/translate/page',['texts'=>['Texto']])->assertStatus(503);
  config(['translator.key'=>'private-test-key']);Cache::flush();Http::fake(['*'=>Http::response([],403)]);
  $this->postJson('/api/translate/page',['texts'=>['Nuevo texto']])->assertStatus(503)->assertDontSee('private-test-key');
 }
}
