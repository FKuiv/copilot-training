from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import os

app = FastAPI(title="Flight Delay Prediction API")

# Setup CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model and features on startup
MODEL_PATH = "../flight_delay_model.pkl"
FEATURES_PATH = "../model_features.pkl"
AIRPORTS_PATH = "../airports.csv"

try:
    model = joblib.load(MODEL_PATH)
    feature_columns = joblib.load(FEATURES_PATH)
    airports_df = pd.read_csv(AIRPORTS_PATH)
    print("Model and features loaded successfully")
except Exception as e:
    print(f"Error loading model or features: {e}")
    # We'll initialize them as None and handle in endpoints
    model = None
    feature_columns = None
    airports_df = None

class PredictionRequest(BaseModel):
    day_of_week: int
    destination_airport_id: int

class PredictionResponse(BaseModel):
    delay_probability: float
    day_name: str
    airport_id: int
    
@app.get("/")
def read_root():
    return {"message": "Flight Delay Prediction API is running"}

@app.get("/health")
def health_check():
    if model is None or feature_columns is None:
        raise HTTPException(status_code=503, detail="Model or features not loaded correctly")
    return {"status": "healthy"}

@app.get("/airports")
def get_airports():
    if airports_df is None:
        raise HTTPException(status_code=503, detail="Airport data not loaded correctly")
    airports = airports_df.to_dict(orient="records")
    return {"airports": airports}

@app.post("/predict", response_model=PredictionResponse)
def predict_delay(request: PredictionRequest):
    if model is None or feature_columns is None:
        raise HTTPException(status_code=503, detail="Model not loaded correctly")
    
    # Validate day of week
    if request.day_of_week < 0 or request.day_of_week > 6:
        raise HTTPException(status_code=400, detail="day_of_week must be between 0 (Monday) and 6 (Sunday)")
    
    try:
        # Create dataframe with input data
        input_data = pd.DataFrame({
            'DAY_OF_WEEK': [request.day_of_week],
            'DestAirportID': [request.destination_airport_id]
        })
        
        # One-hot encode categorical variables
        input_encoded = pd.get_dummies(input_data, columns=['DestAirportID'], drop_first=True)
        
        # Ensure all necessary columns exist
        for col in feature_columns:
            if col not in input_encoded.columns:
                input_encoded[col] = 0
                
        # Only keep columns used during training and in the right order
        input_encoded = input_encoded[feature_columns]
        
        # Make prediction
        prediction = model.predict(input_encoded)[0]
        probability = float(np.clip(prediction, 0, 1))
        
        # Map day of week to name
        day_names = {
            0: "Monday", 1: "Tuesday", 2: "Wednesday", 3: "Thursday",
            4: "Friday", 5: "Saturday", 6: "Sunday"
        }
        
        return {
            "delay_probability": probability,
            "day_name": day_names[request.day_of_week],
            "airport_id": request.destination_airport_id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
