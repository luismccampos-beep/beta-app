# TinyAya (llama.cpp) Setup Guide

## 1. Download llama.cpp Windows binary

Download from: https://github.com/ggerganov/llama.cpp/releases/latest
- File: `llama-bXXXX-bin-win-win-cuda-cu12.2.zip` (or CPU-only version)
- Extract to: `C:\tools\llama\`

You should have:
```
C:\tools\llama\llama-server.exe
```

## 2. Download GGUF model (ultra-light for 2GB RAM)

### Recommended: Qwen2.5-0.5B-Instruct Q4_K_M (~0.4 GB RAM)

Download from HuggingFace:
- URL: https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf
- Save to: `C:\models\qwen2.5-0.5b-instruct-q4_k_m.gguf`

### Fallback: Q2_K (even less RAM, ~0.3 GB)
- URL: https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q2_k.gguf

Create folder:
```powershell
mkdir C:\models
```

## 3. Start llama.cpp server (TinyAya)

Open PowerShell as Administrator and run:

```powershell
# Set environment variables for ML service
$env:ML_SERVICE_TINY_AYA_API_URL="http://localhost:8080/v1"
$env:ML_SERVICE_TINY_AYA_API_KEY=""
$env:ML_SERVICE_BACKEND_URL="http://localhost:3001"

# Start llama.cpp server with minimal RAM settings
C:\tools\llama\llama-server.exe --host 0.0.0.0 --port 8080 --path /v1 --model "C:\models\qwen2.5-0.5b-instruct-q4_k_m.gguf" --ctx-size 512 --threads 2
```

### Flags explained:
- `--host 0.0.0.0`: Allow connections from any IP
- `--port 8080`: TinyAya port (matches ML_SERVICE_TINY_AYA_API_URL)
- `--path /v1`: OpenAI-compatible endpoint
- `--ctx-size 512`: Small context to save RAM
- `--threads 2`: Use only 2 CPU threads

## 4. Start ML Service

In another PowerShell:

```powershell
cd "c:\Users\luism\Documents\AKMLEVA\ml-service"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## 5. Test endpoints

```powershell
# TinyAya health
curl http://localhost:8080/v1/health

# ML service health
curl http://localhost:8000/health

# ML service chat health
curl http://localhost:8000/api/v1/chat/health

# ML service unified health
curl http://localhost:8000/api/v1/unified/health
```

## 6. Troubleshooting

### "llama-server.exe not found"
- Verify file exists at `C:\tools\llama\llama-server.exe`
- Use full path in command
- Add `C:\tools\llama` to PATH environment variable

### Model not found
- Verify GGUF file exists at `C:\models\qwen2.5-0.5b-instruct-q4_k_m.gguf`
- Try Q2_K version if Q4_K_M uses too much RAM

### Out of memory
- Reduce `--ctx-size` to 256
- Use Q2_K model instead of Q4_K_M
- Reduce `--threads` to 1

### Port already in use
- Change `--port 8080` and update `ML_SERVICE_TINY_AYA_API_URL`
- Or kill process using port 8080:
```powershell
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

## 7. Production (VPS) notes

For production with >2GB RAM:
- Use larger models (1B-3B parameters)
- Increase `--ctx-size` to 2048
- Use more threads
- Consider CUDA version if GPU available

## 8. Alternative: Docker (if Windows supports it)

```dockerfile
FROM ghcr.io/ggerganov/llama.cpp:server

# Copy model
COPY qwen2.5-0.5b-instruct-q4_k_m.gguf /models/model.gguf

# Run server
CMD ["--host", "0.0.0.0", "--port", "8080", "--path", "/v1", "--model", "/models/model.gguf", "--ctx-size", "512", "--threads", "2"]
```

Run with:
```powershell
docker run -p 8080:8080 -v C:\models:/models llama-server
```
