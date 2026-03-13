from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.diabetes_model_service import DiabetesModelService

router = APIRouter()
service = DiabetesModelService()

class DiabetesInput(BaseModel):
    age: int
    bmi: float
    blood_sugar: float
    family_history: bool
    diet_quality: int  # 1-10 scale
    physical_activity: int  # 1-10 scale

@router.post("/diabetes")
async def predict_diabetes(data: DiabetesInput):
    try:
        result = service.predict_risk(data.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))