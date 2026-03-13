from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class ChatbotInput(BaseModel):
    user_question: str

@router.post("/ask")
async def ask_chatbot(data: ChatbotInput):
    try:
        response = generate_response(data.user_question)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def generate_response(question: str) -> str:
    question_lower = question.lower()
    
    if "diabetes" in question_lower and "risk" in question_lower:
        return "To reduce diabetes risk: Maintain a healthy weight, exercise regularly (at least 150 minutes per week), eat a balanced diet low in sugar and refined carbs, monitor blood sugar levels, and get regular check-ups. If you have a family history, consult a doctor for personalized advice."
    
    elif "heart" in question_lower and "risk" in question_lower:
        return "Heart disease prevention: Don't smoke, maintain healthy blood pressure and cholesterol levels, stay physically active, eat a heart-healthy diet (fruits, vegetables, whole grains, lean proteins), maintain a healthy weight, and manage stress. Regular cardiovascular check-ups are important."
    
    elif "blood pressure" in question_lower:
        return "For blood pressure management: Reduce salt intake, eat a diet rich in fruits and vegetables, maintain a healthy weight, exercise regularly, limit alcohol, and manage stress. Monitor your blood pressure regularly and consult your doctor about medication if needed."
    
    elif "diet" in question_lower or "nutrition" in question_lower:
        return "Healthy eating tips: Focus on whole foods, include plenty of fruits and vegetables, choose lean proteins, whole grains, and healthy fats. Limit processed foods, added sugars, and excessive salt. Stay hydrated and consider portion control."
    
    elif "exercise" in question_lower or "physical activity" in question_lower:
        return "Regular exercise benefits: Aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity per week, plus strength training twice a week. Activities like walking, swimming, or cycling are great. Start slowly and consult a doctor before beginning a new exercise program."
    
    elif "stress" in question_lower:
        return "Stress management: Practice relaxation techniques like deep breathing, meditation, or yoga. Regular exercise, adequate sleep, and maintaining social connections can help. If stress is overwhelming, consider speaking with a mental health professional."
    
    else:
        return "I'm here to help with health-related questions about disease prevention, nutrition, exercise, and lifestyle improvements. Please ask about specific health topics like diabetes risk, heart health, diet, or exercise."