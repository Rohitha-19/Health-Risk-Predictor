def calculate_health_score(heart_risk: float, diabetes_risk: float, bp_risk: float, lifestyle_score: float, nutrition_score: float) -> dict:
    """
    Calculate overall health score from 0-100 based on various risk factors.
    """
    # Normalize risks (assuming risks are 0-100, higher is worse)
    # Invert risks: lower risk = higher score contribution
    heart_score = 100 - heart_risk
    diabetes_score = 100 - diabetes_risk
    bp_score = 100 - bp_risk

    # Lifestyle and nutrition are already scores 0-100
    # Weight the components
    weights = {
        'heart': 0.25,
        'diabetes': 0.25,
        'bp': 0.2,
        'lifestyle': 0.15,
        'nutrition': 0.15
    }

    overall_score = (
        heart_score * weights['heart'] +
        diabetes_score * weights['diabetes'] +
        bp_score * weights['bp'] +
        lifestyle_score * weights['lifestyle'] +
        nutrition_score * weights['nutrition']
    )

    # Interpret score
    if overall_score >= 90:
        interpretation = "Excellent"
    elif overall_score >= 70:
        interpretation = "Good"
    elif overall_score >= 50:
        interpretation = "Moderate Risk"
    else:
        interpretation = "High Risk"

    return {
        "health_score": round(overall_score, 2),
        "interpretation": interpretation
    }