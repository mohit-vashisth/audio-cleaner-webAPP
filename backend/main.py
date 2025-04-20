from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import shutil
import uuid
import os

app = FastAPI()

# Ensure uploads directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/clean-audio")
async def clean_audio(file: UploadFile = File(...)):
    # 1. Save incoming file
    input_filename = f"{uuid.uuid4()}_{file.filename}"
    input_path = os.path.join(UPLOAD_DIR, input_filename)

    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # 2. Call your cleaning logic
    # Yahan pe tu apna noisereduce/model logic lagayega
    cleaned_filename = input_filename.replace(".wav", "_cleaned.wav")
    cleaned_path = os.path.join(UPLOAD_DIR, cleaned_filename)

    try:
        # Example: noisereduce module
        # import noisereduce as nr
        # data, rate = sf.read(input_path)
        # reduced = nr.reduce_noise(y=data, sr=rate)
        # sf.write(cleaned_path, reduced, rate)

        # Filhaal demo mein bas copy kar dete hain
        shutil.copy(input_path, cleaned_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cleaning failed: {e}")

    # 3. Return the cleaned file by its path
    return FileResponse(
        path=cleaned_path,
        media_type="audio/wav",
        filename=f"cleaned_{file.filename}"
    )
