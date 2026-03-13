from fastapi import APIRouter, HTTPException, UploadFile, File
from app.services.food_detection_service import FoodDetectionService

router = APIRouter()
service = FoodDetectionService()

@router.post("/analyze")
async def analyze_food(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        result = service.analyze_food_image(image_bytes)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))