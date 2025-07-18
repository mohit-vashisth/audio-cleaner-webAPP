import os
import shutil
import uuid
from fastapi import FastAPI, File, HTTPException, UploadFile, status
from fastapi import BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import time
from pipeline_v1_1_0 import async_pipeline_audio

app = FastAPI()

# Allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Vite frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)



@app.post("/upload-audio")
async def upload_audio(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    try:
        MAX_SIZE_MB = 100

        # Read contents once to measure size
        contents = await file.read()
        if len(contents) > MAX_SIZE_MB * 1024 * 1024:
            raise HTTPException(
                status_code=413,
                detail=f"File size exceeds {MAX_SIZE_MB} MB limit."
            )

        # Rewind the file after reading
        file.file.seek(0)

        upload_path = "uploads"
        os.makedirs(upload_path, exist_ok=True)

        # Unique file naming
        unique_id = uuid.uuid4().hex
        original_filename = f"{unique_id}_{file.filename}"
        processed_filename = f"{unique_id}_processed.wav"

        old_file_loc = os.path.join(upload_path, original_filename)
        new_file_loc = os.path.join(upload_path, processed_filename)

        with open(old_file_loc, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Call your async processing pipeline
        await async_pipeline_audio(input_uri=old_file_loc, output_uri=new_file_loc)

        try:
            os.remove(old_file_loc)
        except Exception as delete_error:
            print(f"[Warning] Failed to delete original file: {delete_error}")
        time.sleep(3)
        background_tasks.add_task(delete_file_safe, new_file_loc)

        response = FileResponse(
            path=new_file_loc,
            media_type="audio/wav",
            filename="cleaned_audio.wav",
            background=background_tasks
        )

        return response


    except Exception as exp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"your error: {str(exp)}"
        )
    
# Define deletion helper
def delete_file_safe(path: str):
    try:
        os.remove(path)
        print(f"[Info] Deleted processed file: {path}")
    except Exception as e:
        print(f"[Warning] Could not delete file: {path} | Error: {e}")