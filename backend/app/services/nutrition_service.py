from app.utils.nutrition_calculator import calculate_nutrition, get_daily_summary

class NutritionService:
    def add_meal(self, meal_data: dict) -> dict:
        """
        Add a meal and calculate nutrition.
        """
        nutrition = calculate_nutrition(meal_data['food_name'], meal_data['quantity'])
        if "error" in nutrition:
            return nutrition

        # In real implementation, save to database
        return {
            "meal_type": meal_data['meal_type'],
            "food_name": meal_data['food_name'],
            "quantity": meal_data['quantity'],
            **nutrition
        }

    def get_daily_summary(self, user_id: int) -> dict:
        """
        Get daily nutrition summary.
        """
        return get_daily_summary(user_id)