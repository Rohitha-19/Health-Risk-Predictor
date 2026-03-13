class RecommendationService:
    def get_diet_recommendation(self, user_risks: dict) -> dict:
        """
        Generate personalized diet recommendation based on health risks.
        """
        # Simple logic based on risks
        high_risk_areas = []
        if user_risks.get('heart_risk', 0) > 60:
            high_risk_areas.append('heart')
        if user_risks.get('diabetes_risk', 0) > 60:
            high_risk_areas.append('diabetes')
        if user_risks.get('bp_risk', 0) > 60:
            high_risk_areas.append('bp')

        if 'heart' in high_risk_areas:
            return {
                "breakfast": "Oatmeal with fruits and nuts",
                "lunch": "Grilled chicken salad with olive oil dressing",
                "snack": "Greek yogurt with berries",
                "dinner": "Baked salmon with vegetables"
            }
        elif 'diabetes' in high_risk_areas:
            return {
                "breakfast": "Whole grain toast with avocado",
                "lunch": "Quinoa bowl with vegetables and lean protein",
                "snack": "Apple with almond butter",
                "dinner": "Stir-fried vegetables with tofu"
            }
        elif 'bp' in high_risk_areas:
            return {
                "breakfast": "Smoothie with spinach and banana",
                "lunch": "Lentil soup with whole grain bread",
                "snack": "Carrot sticks with hummus",
                "dinner": "Grilled fish with steamed broccoli"
            }
        else:
            return {
                "breakfast": "Eggs with whole grain toast",
                "lunch": "Turkey sandwich on whole grain bread",
                "snack": "Mixed nuts",
                "dinner": "Lean meat with vegetables"
            }