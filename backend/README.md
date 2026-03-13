# AI Personal Health Risk Predictor Backend

This is the backend for the AI Personal Health Risk Predictor with Smart Lifestyle and Food Nutrition Analyzer.

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Train the models (optional, dummy models are created if not found):
   ```bash
   python train_heart_model.py
   python train_diabetes_model.py
   python train_bp_model.py
   ```

3. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

The API will be available at http://localhost:8000

## API Endpoints

### Health Overview
- GET /health/overview?heart_risk=20&diabetes_risk=15&bp_risk=25&lifestyle_score=75&nutrition_score=80

### Heart Disease Prediction
- POST /predict/heart-disease
  ```json
  {
    "age": 45,
    "gender": "male",
    "cholesterol": 220,
    "blood_pressure": 130,
    "heart_rate": 75,
    "smoking": true,
    "exercise_frequency": 3,
    "bmi": 25.5
  }
  ```

### Diabetes Prediction
- POST /predict/diabetes
  ```json
  {
    "age": 45,
    "bmi": 26.8,
    "blood_sugar": 95,
    "family_history": false,
    "diet_quality": 7,
    "physical_activity": 6
  }
  ```

### Blood Pressure Prediction
- POST /predict/blood-pressure
  ```json
  {
    "age": 50,
    "blood_pressure": 135,
    "stress_level": 6,
    "sleep_quality": 6,
    "salt_intake": 6,
    "exercise_level": 4
  }
  ```

### Lifestyle Analysis
- POST /lifestyle/analyze
  ```json
  {
    "exercise_minutes": 120,
    "sleep_hours": 7.5,
    "stress_level": 4,
    "water_intake": 2.0,
    "screen_time": 3.0,
    "smoking": false
  }
  ```

### Nutrition Tracking
- POST /nutrition/add-meal
  ```json
  {
    "meal_type": "breakfast",
    "food_name": "apple",
    "quantity": 150
  }
  ```
- GET /nutrition/daily-summary?user_id=1

### Food Image Analysis
- POST /food/analyze (multipart/form-data with image file)

### AI Chatbot
- POST /chatbot/ask
  ```json
  {
    "user_question": "How can I reduce my diabetes risk?"
  }
  ```

## Project Structure

- `app/`: Main application
  - `main.py`: FastAPI app
  - `config.py`: Configuration
- `routers/`: API endpoints
- `services/`: Business logic and ML models
- `models/`: Trained ML models
- `database/`: Database models and connection
- `utils/`: Utility functions
- `datasets/`: Sample datasets
- `requirements.txt`: Python dependencies