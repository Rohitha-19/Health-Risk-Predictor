from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.bp_model_service import BPModelService

router = APIRouter()
service = BPModelService()

class BloodPressureInput(BaseModel):
    age: int
    blood_pressure: float
    stress_level: int  # 1-10 scale
    sleep_quality: int  # 1-10 scale
    salt_intake: int  # 1-10 scale
    exercise_level: int  # 1-10 scale

@router.post("/blood-pressure")
async def predict_blood_pressure(data: BloodPressureInput):
    try:
        result = service.predict_risk(data.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))