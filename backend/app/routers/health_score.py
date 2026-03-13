from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.health_score_calculator import calculate_health_score
from app.services.recommendation_service import RecommendationService

router = APIRouter()
rec_service = RecommendationService()

class HealthOverviewInput(BaseModel):
    heart_risk: float
    diabetes_risk: float
    bp_risk: float
    lifestyle_score: float
    nutrition_score: float

@router.get("/overview")
async def get_health_overview(heart_risk: float = 20, diabetes_risk: float = 15, bp_risk: float = 25, lifestyle_score: float = 75, nutrition_score: float = 80):
    try:
        health_data = calculate_health_score(heart_risk, diabetes_risk, bp_risk, lifestyle_score, nutrition_score)
        diet_rec = rec_service.get_diet_recommendation({
            'heart_risk': heart_risk,
            'diabetes_risk': diabetes_risk,
            'bp_risk': bp_risk
        })
        return {
            **health_data,
            "daily_calories": 2200,  # Placeholder
            "diet_recommendation": diet_rec
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))