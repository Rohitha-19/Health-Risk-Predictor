from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer)
    gender = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Meal(Base):
    __tablename__ = "meals"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    meal_type = Column(String)  # breakfast, lunch, dinner, snack
    food_name = Column(String)
    quantity = Column(Float)
    calories = Column(Float)
    protein = Column(Float)
    fat = Column(Float)
    carbohydrates = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

class HealthData(Base):
    __tablename__ = "health_data"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    heart_risk = Column(Float)
    diabetes_risk = Column(Float)
    bp_risk = Column(Float)
    lifestyle_score = Column(Float)
    nutrition_score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)