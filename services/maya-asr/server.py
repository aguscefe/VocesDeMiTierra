"""Local-only Maya Yucatec recognition. Audio is never persisted."""
import io
import threading
import wave
import numpy as np
import torch
from fastapi import FastAPI, Request, HTTPException
from transformers import AutoProcessor, Wav2Vec2ForCTC

torch.set_num_threads(2)
processor = AutoProcessor.from_pretrained("facebook/mms-1b-all", target_lang="yua")
model = Wav2Vec2ForCTC.from_pretrained("facebook/mms-1b-all", target_lang="yua", ignore_mismatched_sizes=True, low_cpu_mem_usage=True)
model.eval()
lock = threading.Lock()
app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok", "language": "yua"}

@app.post("/transcribe")
async def transcribe(request: Request):
    if not lock.acquire(blocking=False):
        raise HTTPException(429, "El reconocimiento está ocupado; intenta de nuevo.")
    try:
        data = bytearray()
        async for chunk in request.stream():
            data.extend(chunk)
            if len(data) > 500000:
                raise HTTPException(413, "Audio demasiado grande.")
        try:
            with wave.open(io.BytesIO(data)) as audio:
                if audio.getframerate() != 16000 or audio.getnchannels() != 1 or audio.getsampwidth() != 2:
                    raise ValueError()
                count = audio.getnframes()
                if not 1600 <= count <= 240000:
                    raise ValueError()
                samples = np.frombuffer(audio.readframes(count), dtype="<i2").astype(np.float32) / 32768
                if samples.size != count:
                    raise ValueError()
        except (ValueError, wave.Error, EOFError):
            raise HTTPException(422, "Usa audio WAV mono de 16 kHz, entre 0.1 y 15 segundos.")
        inputs = processor(samples, sampling_rate=16000, return_tensors="pt")
        with torch.inference_mode():
            logits = model(**inputs).logits
        text = processor.batch_decode(torch.argmax(logits, dim=-1))[0].strip()
        return {"text": text, "language": "yua"}
    finally:
        lock.release()
