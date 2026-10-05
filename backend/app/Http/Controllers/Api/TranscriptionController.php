<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\ConnectionException;
class TranscriptionController extends Controller {
 public function transcribe(Request $request) {
  $request->validate(['audio'=>'required|file|max:490']);
  $data=file_get_contents($request->file('audio')->getRealPath());
  if(substr($data,0,4)!=='RIFF' || substr($data,8,4)!=='WAVE')return response()->json(['message'=>'El audio debe ser WAV.'],422);
  try { $result=Http::connectTimeout(3)->timeout(50)->withBody($data,'audio/wav')->post('http://127.0.0.1:8765/transcribe'); }
  catch(ConnectionException $e) {return response()->json(['message'=>'El servicio de dictado maya está iniciando o no está instalado. Consulta al administrador.'],503);}
  if(!$result->successful())return response()->json(['message'=>$result->status()===429?'El dictado está ocupado. Inténtalo de nuevo.':'No se pudo reconocer el audio. Graba una frase corta y clara.'], $result->status()===429?429:503);
  $text=$result->json('text');
  if(!is_string($text)||trim($text)===''||mb_strlen($text)>3000)return response()->json(['message'=>'No se reconoció una frase. Inténtalo de nuevo.'],422);
  return response()->json(['text'=>$text,'language'=>'yua'])->header('Cache-Control','no-store');
 }
}
