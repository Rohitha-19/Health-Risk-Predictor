import joblib
import numpy as np
from sklearn.tree import DecisionTreeClassifier

class BPModelService:
    def __init__(self):
        self.model = None
        self.load_model()

    def load_model(self):
        try:
            self.model = joblib.load('models/bp_model.pkl')
        except FileNotFoundError:
            # Create a dummy model
            self.model = DecisionTreeClassifier()
            X_dummy = np.random.rand(100, 6)
            y_dummy = np.random.randint(0, 2, 100)
            self.model.fit(X_dummy, y_dummy)

    def predict_risk(self, features: dict) -> dict:
        """
        Predict blood pressure risk.
        Features: age, blood_pressure, stress_level, sleep_quality, salt_intake, exercise_level
        """
        input_data = np.array([
            features['age'],
            features['blood_pressure'],
            features['stress_level'],
            features['sleep_quality'],
            features['salt_intake'],
            features['exercise_level']
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
            "hypertension_risk": round(risk_prob, 2),
            "risk_level": risk_level,
            "recommendations": recommendations
        }

    def get_recommendations(self, risk_level: str) -> list:
        if risk_level == "Low":
            return ["Maintain healthy habits", "Regular monitoring"]
        elif risk_level == "Moderate":
            return ["Reduce salt intake", "Stress management", "Regular exercise"]
        else:
            return ["Consult physician", "Medication if needed", "Dietary sodium reduction", "Weight management"]