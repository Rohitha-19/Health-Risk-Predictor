from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.nutrition_service import NutritionService

router = APIRouter()
service = NutritionService()

class MealInput(BaseModel):
    meal_type: str
    food_name: str
    quantity: float

@router.post("/add-meal")
async def add_meal(data: MealInput):
    try:
        result = service.add_meal(data.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/daily-summary")
async def get_daily_summary(user_id: int = 1):
    try:
        result = service.get_daily_summary(user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))