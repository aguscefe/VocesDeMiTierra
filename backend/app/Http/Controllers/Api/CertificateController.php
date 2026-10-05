<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB,Storage};
use Illuminate\Support\Str;
class CertificateController extends Controller {
 private function producer(Request $r): object {
  abort_unless($r->user()?->status==='active' && $r->user()->role==='producer',403);
  return DB::table('producer_profiles')->where('user_id',$r->user()->id)->firstOrFail();
 }
 public static function notifyAdmins(string $name,string $id): void {
  foreach(DB::table('users')->where('role','admin')->where('status','active')->pluck('id') as $uid)
   DB::table('notifications')->insert(['id'=>(string)Str::uuid(),'user_id'=>$uid,'type'=>'certificate','title'=>'Certificado pendiente de validación','message'=>'Revisa el certificado de '.$name.' en la sección Certificados. Producto: '.$id]);
 }
 public function upload(Request $r) {
  $p=$this->producer($r);
  $r->validate(['file'=>'required|file|mimes:pdf,jpg,jpeg,png,webp|max:10240']);
  $file=$r->file('file');$path=$file->store('certificates','local');abort_unless($path,500);
  $id=(string)Str::uuid();
  try { DB::table('product_certificates')->insert(['id'=>$id,'producer_id'=>$p->id,'path'=>$path,'original_name'=>mb_substr(basename($file->getClientOriginalName()),0,255),'mime_type'=>$file->getMimeType(),'status'=>'uploaded','created_at'=>now(),'updated_at'=>now()]); }
  catch(\Throwable $e){Storage::disk('local')->delete($path);throw $e;}
  return response()->json(['id'=>$id,'name'=>$file->getClientOriginalName()],201);
 }
 public function download(Request $r,string $id) {
  $u=$r->user();abort_unless($u?->status==='active',403);
  $c=DB::table('product_certificates')->where('id',$id)->first();abort_unless($c,404);
  $owner=DB::table('producer_profiles')->where('id',$c->producer_id)->value('user_id');
  abort_unless($u->role==='admin'||$owner===$u->id,403);
  abort_unless(Storage::disk('local')->exists($c->path),404);
  return Storage::disk('local')->download($c->path,$c->original_name,['Cache-Control'=>'private, no-store','X-Content-Type-Options'=>'nosniff']);
 }
 public function replace(Request $r,string $id) {
  $p=$this->producer($r);$v=$r->validate(['certificate_id'=>'required|string']);
  return DB::transaction(function()use($p,$v,$id){
   $product=DB::table('products')->where('id',$id)->where('producer_id',$p->id)->lockForUpdate()->first();abort_unless($product,404);
   $c=DB::table('product_certificates')->where('id',$v['certificate_id'])->where('producer_id',$p->id)->whereNull('product_id')->where('status','uploaded')->lockForUpdate()->first();abort_unless($c,422);
   // Preserve the old private document and decision, without attaching it to the current product.
   DB::table('product_certificates')->where('product_id',$id)->update(['product_id'=>null,'updated_at'=>now()]);
   DB::table('product_certificates')->where('id',$c->id)->update(['product_id'=>$id,'status'=>'pending','updated_at'=>now()]);
   DB::table('products')->where('id',$id)->update(['status'=>'pending','updated_at'=>now()]);
   self::notifyAdmins($product->name,$id);
   return response()->json(['ok'=>true]);
  });
 }
 public function review(Request $r,string $id) {
  $u=$r->user();abort_unless($u?->status==='active'&&$u->role==='admin',403);
  $v=$r->validate(['status'=>'required|in:approved,rejected','review_notes'=>'required_if:status,rejected|nullable|string|max:2000']);
  return DB::transaction(function()use($r,$u,$v,$id){
   $c=DB::table('product_certificates')->where('id',$id)->lockForUpdate()->first();abort_unless($c && $c->product_id,404);
   abort_unless($c->status==='pending',422,'Este certificado ya fue revisado.');
   DB::table('product_certificates')->where('id',$id)->update($v+['reviewed_by'=>$u->id,'reviewed_at'=>now(),'updated_at'=>now()]);
   if($v['status']==='rejected')DB::table('products')->where('id',$c->product_id)->update(['status'=>'rejected','updated_at'=>now()]);
   $owner=DB::table('producer_profiles')->where('id',$c->producer_id)->value('user_id');
   DB::table('notifications')->insert(['id'=>(string)Str::uuid(),'user_id'=>$owner,'type'=>'certificate','title'=>'Resultado de validación','message'=>'Certificado '.($v['status']==='approved'?'aprobado':'rechazado').'. '.($v['review_notes']??'').' La aprobación del documento no publica automáticamente la pieza.']);
   DB::table('audit_logs')->insert(['user_id'=>$u->id,'action'=>'certificate:'.$v['status'],'target_id'=>$id]);
   return response()->json(['ok'=>true]);
  });
 }
}
