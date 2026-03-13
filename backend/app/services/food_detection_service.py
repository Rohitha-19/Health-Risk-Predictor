from app.utils.image_processing import preprocess_image, detect_food
from app.utils.nutrition_calculator import calculate_nutrition

class FoodDetectionService:
    def analyze_food_image(self, image_bytes: bytes) -> dict:
        """
        Analyze food image and return nutrition info.
        """
        # Preprocess image
        processed_image = preprocess_image(image_bytes)

        # Detect food
        food_detected = detect_food(processed_image)

        # Get nutrition (assuming quantity 100g for detection)
        nutrition = calculate_nutrition(food_detected, 100.0)
        if "error" in nutrition:
            return {"error": "Food not recognized"}

        # Health suggestion
        health_suggestion = self.get_health_suggestion(food_detected)

        return {
            "food_detected": food_detected,
            **nutrition,
            "health_suggestion": health_suggestion
        }

    def get_health_suggestion(self, food: str) -> str:
        # Simple suggestions
        suggestions = {
            "apple": "Great choice! Apples are rich in fiber and antioxidants.",
            "pizza": "Enjoy in moderation. Consider whole grain crust and vegetable toppings.",
            "salad": "Excellent! Add variety of vegetables for better nutrition."
        }
        return suggestions.get(food.lower(), "Balanced portion sizes are key to healthy eating.")