from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import (
    heart_disease, diabetes, blood_pressure, lifestyle,
    nutrition, food_analyzer, health_score, chatbot
)
# from app.database import database

app = FastAPI(title="AI Personal Health Risk Predictor", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(heart_disease.router, prefix="/predict", tags=["Heart Disease"])
app.include_router(diabetes.router, prefix="/predict", tags=["Diabetes"])
app.include_router(blood_pressure.router, prefix="/predict", tags=["Blood Pressure"])
app.include_router(lifestyle.router, prefix="/lifestyle", tags=["Lifestyle"])
app.include_router(nutrition.router, prefix="/nutrition", tags=["Nutrition"])
app.include_router(food_analyzer.router, prefix="/food", tags=["Food Analyzer"])
app.include_router(health_score.router, prefix="/health", tags=["Health Score"])
app.include_router(chatbot.router, prefix="/chatbot", tags=["Chatbot"])

# @app.on_event("startup")
# async def startup():
#     await database.connect()

# @app.on_event("shutdown")
# async def shutdown():
#     await database.disconnect()

@app.get("/")
async def root():
    return {"message": "AI Personal Health Risk Predictor API"}