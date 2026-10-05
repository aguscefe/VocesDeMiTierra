// Capture PCM directly: works without browser speech-language support or codecs.
export async function recordMaya(onStop: (audio: Blob) => void, onError: (message: string) => void) {
  const stream = await navigator.mediaDevices.getUserMedia({audio: true});
  const context = new AudioContext();
  try { await context.resume(); } catch (error) { stream.getTracks().forEach(t=>t.stop()); await context.close(); throw error; }
  const source = context.createMediaStreamSource(stream);
  const node = context.createScriptProcessor(4096, 1, 1);
  const mute = context.createGain(); mute.gain.value = 0;
  const chunks: Float32Array[] = []; let length=0; let stopped=false;
  node.onaudioprocess = event => { const chunk=event.inputBuffer.getChannelData(0).slice(); chunks.push(chunk); length+=chunk.length; };
  source.connect(node); node.connect(mute); mute.connect(context.destination);
  function stop(deliver=true) {
    if(stopped)return; stopped=true; clearTimeout(timer);
    node.disconnect(); source.disconnect(); mute.disconnect(); stream.getTracks().forEach(t=>t.stop()); void context.close();
    if(!deliver)return;
    if(length<context.sampleRate*.1) { onError("Graba una frase antes de detener el micrófono."); return; }
    const joined=new Float32Array(length); let offset=0; for(const chunk of chunks){joined.set(chunk,offset);offset+=chunk.length;}
    const ratio=context.sampleRate/16000; const count=Math.min(240000,Math.floor(length/ratio));
    const buffer=new ArrayBuffer(44+count*2); const view=new DataView(buffer);
    const str=(pos:number,text:string)=>{for(let i=0;i<text.length;i++)view.setUint8(pos+i,text.charCodeAt(i));};
    str(0,"RIFF"); view.setUint32(4,36+count*2,true); str(8,"WAVE"); str(12,"fmt "); view.setUint32(16,16,true); view.setUint16(20,1,true); view.setUint16(22,1,true); view.setUint32(24,16000,true); view.setUint32(28,32000,true); view.setUint16(32,2,true); view.setUint16(34,16,true); str(36,"data");view.setUint32(40,count*2,true);
    for(let i=0;i<count;i++){const start=Math.floor(i*ratio),end=Math.min(length,Math.floor((i+1)*ratio));let sum=0;for(let j=start;j<end;j++)sum+=joined[j];const sample=Math.max(-1,Math.min(1,sum/Math.max(1,end-start)));view.setInt16(44+i*2,sample<0?sample*32768:sample*32767,true);}
    onStop(new Blob([buffer],{type:"audio/wav"}));
  }
  const timer=window.setTimeout(()=>stop(),15000);
  return stop;
}
