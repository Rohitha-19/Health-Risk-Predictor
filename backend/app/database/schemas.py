from pydantic import BaseModel
from typing import Optional

# User schemas
class UserBase(BaseModel):
    name: str
    age: int
    gender: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int

    class Config:
        orm_mode = True

# Meal schemas
class MealBase(BaseModel):
    meal_type: str
    food_name: str
    quantity: float

class MealCreate(MealBase):
    user_id: int

class Meal(MealBase):
    id: int
    user_id: int
    calories: float
    protein: float
    fat: float
    carbohydrates: float

    class Config:
        orm_mode = True

# Health Data schemas
class HealthDataBase(BaseModel):
    heart_risk: float
    diabetes_risk: float
    bp_risk: float
    lifestyle_score: float
    nutrition_score: float

class HealthDataCreate(HealthDataBase):
    user_id: int

class HealthData(HealthDataBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True