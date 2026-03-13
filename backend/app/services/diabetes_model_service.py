import joblib
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier

class DiabetesModelService:
    def __init__(self):
        self.model = None
        self.load_model()

    def load_model(self):
        try:
            self.model = joblib.load('models/diabetes_model.pkl')
        except FileNotFoundError:
            # Create a dummy model
            self.model = GradientBoostingClassifier()
            X_dummy = np.random.rand(100, 6)
            y_dummy = np.random.randint(0, 2, 100)
            self.model.fit(X_dummy, y_dummy)

    def predict_risk(self, features: dict) -> dict:
        """
        Predict diabetes risk.
        Features: age, bmi, blood_sugar, family_history, diet_quality, physical_activity
        """
        input_data = np.array([
            features['age'],
            features['bmi'],
            features['blood_sugar'],
            1 if features['family_history'] else 0,
            features['diet_quality'],
            features['physical_activity']
        ]).reshape(1, -1)

        risk_prob = self.model.predict_proba(input_data)[0][1] * 100

        if risk_prob <= 30:
            risk_level = "Low"
        elif risk_prob <= 60:
            risk_level = "Moderate"
        else:
            risk_level = "High"

        recommendations = self.get_recommendations(risk_level)

        return {
            "risk_probability": round(risk_prob, 2),
            "risk_level": risk_level,
            "future_risk_prediction": f"Increased risk over next 5 years: {round(risk_prob * 1.2, 2)}%",
            "recommendations": recommendations
        }

    def get_recommendations(self, risk_level: str) -> list:
        if risk_level == "Low":
            return ["Maintain balanced diet", "Regular exercise"]
        elif risk_level == "Moderate":
            return ["Monitor blood sugar", "Weight management", "Healthy eating"]
        else:
            return ["Consult endocrinologist", "Blood sugar monitoring", "Dietary changes", "Exercise regimen"]