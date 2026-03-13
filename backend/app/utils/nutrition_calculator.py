import pandas as pd
from typing import Dict

# Load nutrition dataset
NUTRITION_DATA = pd.read_csv('datasets/food_nutrition_dataset.csv')

def calculate_nutrition(food_name: str, quantity: float) -> Dict[str, float]:
    """
    Calculate nutrition values for a given food and quantity.
    """
    food_data = NUTRITION_DATA[NUTRITION_DATA['food_name'].str.lower() == food_name.lower()]
    if food_data.empty:
        return {"error": "Food not found in database"}

    # Assuming quantity is in grams, and dataset has per 100g values
    factor = quantity / 100.0

    return {
        "calories": food_data['calories'].values[0] * factor,
        "protein": food_data['protein'].values[0] * factor,
        "fat": food_data['fat'].values[0] * factor,
        "carbohydrates": food_data['carbohydrates'].values[0] * factor,
        "fiber": food_data.get('fiber', 0).values[0] * factor if 'fiber' in food_data.columns else 0
    }

def get_daily_summary(user_id: int) -> Dict[str, float]:
    """
    Get daily nutrition summary for a user.
    This would query the database, but for now, return placeholder.
    """
    # Placeholder implementation
    return {
        "total_calories": 2000,
        "protein": 150,
        "fat": 70,
        "carbohydrates": 250,
        "recommended_intake": {
            "calories": 2200,
            "protein": 165,
            "fat": 73,
            "carbohydrates": 275
        }
    }