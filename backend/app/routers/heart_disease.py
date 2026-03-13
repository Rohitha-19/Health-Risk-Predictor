from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.heart_model_service import HeartModelService

router = APIRouter()
service = HeartModelService()

class HeartDiseaseInput(BaseModel):
    age: int
    gender: str
    cholesterol: float
    blood_pressure: float
    heart_rate: float
    smoking: bool
    exercise_frequency: int  # times per week
    bmi: float

@router.post("/heart-disease")
async def predict_heart_disease(data: HeartDiseaseInput):
    try:
        result = service.predict_risk(data.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))