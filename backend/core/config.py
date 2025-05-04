from dotenv import load_dotenv
import os
from urllib.parse import urlparse

# Get environment type
ENVIRONMENT = os.getenv("ENV", "development")

# Set base directory path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load .env file based on environment
dotenv_file = ".env.live" if ENVIRONMENT == "production" else ".env.dev"
dotenv_path = os.path.join(BASE_DIR, dotenv_file)
load_dotenv(dotenv_path=dotenv_path)

# Function to fetch environment variable and optionally parse URLs
def env_variables(key) -> str:
    value = os.getenv(key)
    if value and value.startswith("http"):
        return urlparse(value).path or value  # fallback to full URL if .path is empty
    return value if value else ""

# API Endpoints
CLEAN_AUDIO_URL = env_variables("VITE_CLEAN_AUDIO_URL")
ALLOWED_ORIGINS = env_variables("VITE_ALLOWED_ORIGINS")
