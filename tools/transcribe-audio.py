#!/usr/bin/env python3
"""Offline ASR for the narration ending guard: prints {"text", "model"} as JSON.

Usage (by tools/make-audio.js): $EP_ASR_PYTHON -B tools/transcribe-audio.py MODEL_DIR AUDIO.mp3
Needs faster-whisper and a local model; never downloads one. Not human listening.
"""
import hashlib, json, subprocess, sys, tempfile
from pathlib import Path

def main(model_dir, audio):
    from faster_whisper import WhisperModel
    weights = Path(model_dir, 'model.bin')
    if not weights.is_file():
        raise SystemExit('local ASR model missing; never download implicitly during publication')
    with tempfile.TemporaryDirectory(prefix='ep-asr-') as work:
        wav = str(Path(work, 'decoded.wav'))
        subprocess.run(['ffmpeg', '-v', 'error', '-xerror', '-i', audio, '-ac', '1', '-ar', '16000', wav], check=True)
        model = WhisperModel(model_dir, device='cpu', compute_type='int8', cpu_threads=2, num_workers=1, local_files_only=True)
        segments, _ = model.transcribe(wav, language='en', beam_size=5, vad_filter=False)
        text = ' '.join(s.text.strip() for s in segments)
    print(json.dumps({'text': text, 'model': {'name': Path(model_dir).resolve().parent.parent.name,
                                              'sha256': hashlib.sha256(weights.read_bytes()).hexdigest()}}))

if __name__ == '__main__':
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    main(*sys.argv[1:])
