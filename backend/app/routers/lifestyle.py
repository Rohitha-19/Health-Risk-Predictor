from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class LifestyleInput(BaseModel):
    exercise_minutes: int
    sleep_hours: float
    stress_level: int  # 1-10
    water_intake: float  # liters
    screen_time: float  # hours
    smoking: bool

def calculate_lifestyle_score(data: dict) -> float:
    score = 0
    # Exercise: 20 points max
    if data['exercise_minutes'] >= 150:  # WHO recommendation
        score += 20
    elif data['exercise_minutes'] >= 75:
        score += 10

    # Sleep: 20 points max
    if 7 <= data['sleep_hours'] <= 9:
        score += 20
    elif 6 <= data['sleep_hours'] <= 10:
        score += 10

    # Stress: 20 points max
    score += (11 - data['stress_level']) * 2

    # Water: 15 points max
    if data['water_intake'] >= 2:
        score += 15
    elif data['water_intake'] >= 1.5:
        score += 10

    # Screen time: 15 points max
    if data['screen_time'] <= 2:
        score += 15
    elif data['screen_time'] <= 4:
        score += 10

    # Smoking: 10 points max
    if not data['smoking']:
        score += 10

    return min(score, 100)

@router.post("/analyze")
async def analyze_lifestyle(data: LifestyleInput):
    try:
        score = calculate_lifestyle_score(data.dict())
        suggestions = get_improvement_suggestions(data.dict(), score)
        return {
            "lifestyle_score": round(score, 2),
            "improvement_suggestions": suggestions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def get_improvement_suggestions(data: dict, score: float) -> list:
    suggestions = []
    if data['exercise_minutes'] < 150:
        suggestions.append("Aim for at least 150 minutes of moderate exercise per week")
    if not (7 <= data['sleep_hours'] <= 9):
        suggestions.append("Try to get 7-9 hours of sleep per night")
    if data['stress_level'] > 5:
        suggestions.append("Practice stress management techniques like meditation")
    if data['water_intake'] < 2:
        suggestions.append("Increase water intake to at least 2 liters per day")
    if data['screen_time'] > 2:
        suggestions.append("Reduce screen time to less than 2 hours per day")
    if data['smoking']:
        suggestions.append("Consider quitting smoking for better health")
    return suggestions