import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier

class HeartModelService:
    def __init__(self):
        self.model = None
        self.load_model()

    def load_model(self):
        try:
            self.model = joblib.load('models/heart_model.pkl')
        except FileNotFoundError:
            # Create a dummy model if not trained
            self.model = RandomForestClassifier()
            # Dummy fit
            X_dummy = np.random.rand(100, 8)
            y_dummy = np.random.randint(0, 2, 100)
            self.model.fit(X_dummy, y_dummy)

    def predict_risk(self, features: dict) -> dict:
        """
        Predict heart disease risk.
        Features: age, gender, cholesterol, blood_pressure, heart_rate, smoking, exercise_frequency, bmi
        """
        # Prepare input
        input_data = np.array([
            features['age'],
            1 if features['gender'].lower() == 'male' else 0,
            features['cholesterol'],
            features['blood_pressure'],
            features['heart_rate'],
            1 if features['smoking'] else 0,
            features['exercise_frequency'],
            features['bmi']
        ]).reshape(1, -1)

        # Predict probability
        risk_prob = self.model.predict_proba(input_data)[0][1] * 100

        # Determine risk level
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
            "recommendations": recommendations
        }

    def get_recommendations(self, risk_level: str) -> list:
        if risk_level == "Low":
            return ["Maintain healthy lifestyle", "Regular check-ups"]
        elif risk_level == "Moderate":
            return ["Reduce cholesterol intake", "Increase exercise", "Monitor blood pressure"]
        else:
            return ["Consult cardiologist", "Medication if prescribed", "Lifestyle changes", "Dietary modifications"]