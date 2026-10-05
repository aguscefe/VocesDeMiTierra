<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\ConnectionException;
class TranslationController extends Controller {
 public function translate(Request $r) {
  $v=$r->validate(['text'=>'required|string|max:3000','source'=>'required|in:es,yua','target'=>'required|in:es,yua']);
  abort_if($v['source']===$v['target'],422,'Selecciona dos idiomas diferentes.');
  $key=config('translator.key');
  if(!$key)return response()->json(['message'=>'El administrador debe configurar la clave del servicio de traducción.'],503);
  $headers=['Ocp-Apim-Subscription-Key'=>$key];
  if(config('translator.region'))$headers['Ocp-Apim-Subscription-Region']=config('translator.region');
  try {
   $response=Http::withHeaders($headers)->acceptJson()->connectTimeout(5)->timeout(20)->post('https://api.cognitive.microsofttranslator.com/translate?'.http_build_query(['api-version'=>'3.0','from'=>$v['source'],'to'=>$v['target'],'textType'=>'plain']),[['Text'=>$v['text']]]);
  } catch(ConnectionException $e) {return response()->json(['message'=>'No se pudo conectar con el traductor. Inténtalo de nuevo.'],503);}
  if(!$response->successful())return response()->json(['message'=>'El servicio de traducción no está disponible. Revisa la clave, la región y la cuota.'],503);
  $text=$response->json('0.translations.0.text');
  if(!is_string($text)||$text==='')return response()->json(['message'=>'El traductor devolvió una respuesta inválida.'],502);
  return response()->json(['text'=>$text,'source'=>$v['source'],'target'=>$v['target'],'provider'=>'Microsoft Translator'])->header('Cache-Control','no-store');
 }
}
