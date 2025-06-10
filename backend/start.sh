#!/bin/bash
# Start the FastAPI backend
echo "Starting Flight Delay Prediction API..."
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
