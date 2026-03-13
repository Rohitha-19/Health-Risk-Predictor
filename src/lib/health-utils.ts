// Health prediction algorithms (client-side simulation)

export interface HealthProfile {
  age: number;
  gender: 'male' | 'female';
  bmi: number;
  cholesterol: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  smokingHabit: 'never' | 'former' | 'current';
  exerciseFrequency: number; // days per week
  bloodSugar: number;
  familyHistoryDiabetes: boolean;
  stressLevel: number; // 1-10
  sleepHours: number;
  waterIntake: number; // glasses per day
  screenTime: number; // hours
  saltIntake: 'low' | 'moderate' | 'high';
}

export const defaultProfile: HealthProfile = {
  age: 35,
  gender: 'male',
  bmi: 24.5,
  cholesterol: 200,
  bloodPressureSystolic: 120,
  bloodPressureDiastolic: 80,
  heartRate: 72,
  smokingHabit: 'never',
  exerciseFrequency: 3,
  bloodSugar: 95,
  familyHistoryDiabetes: false,
  stressLevel: 5,
  sleepHours: 7,
  waterIntake: 6,
  screenTime: 6,
  saltIntake: 'moderate',
};

export function predictHeartDiseaseRisk(p: HealthProfile): number {
  let risk = 10;
  risk += Math.max(0, (p.age - 30) * 0.8);
  risk += p.gender === 'male' ? 5 : 0;
  risk += Math.max(0, (p.cholesterol - 200) * 0.15);
  risk += Math.max(0, (p.bloodPressureSystolic - 120) * 0.3);
  risk += Math.max(0, (p.heartRate - 80) * 0.2);
  risk += p.smokingHabit === 'current' ? 15 : p.smokingHabit === 'former' ? 5 : 0;
  risk -= p.exerciseFrequency * 2;
  risk += Math.max(0, (p.bmi - 25) * 2);
  return Math.min(95, Math.max(5, Math.round(risk)));
}

export function predictDiabetesRisk(p: HealthProfile): number {
  let risk = 8;
  risk += Math.max(0, (p.age - 35) * 0.6);
  risk += Math.max(0, (p.bmi - 25) * 3);
  risk += Math.max(0, (p.bloodSugar - 100) * 0.5);
  risk += p.familyHistoryDiabetes ? 15 : 0;
  risk -= p.exerciseFrequency * 2.5;
  risk += p.stressLevel * 0.5;
  return Math.min(95, Math.max(5, Math.round(risk)));
}

export function predictBloodPressureRisk(p: HealthProfile): number {
  let risk = 10;
  risk += Math.max(0, (p.age - 30) * 0.5);
  risk += Math.max(0, (p.bloodPressureSystolic - 120) * 0.5);
  risk += Math.max(0, (p.bloodPressureDiastolic - 80) * 0.4);
  risk += p.stressLevel * 1.5;
  risk -= Math.max(0, (p.sleepHours - 5) * 2);
  risk += p.saltIntake === 'high' ? 12 : p.saltIntake === 'moderate' ? 5 : 0;
  risk -= p.exerciseFrequency * 1.5;
  return Math.min(95, Math.max(5, Math.round(risk)));
}

export function calculateLifestyleScore(p: HealthProfile): number {
  let score = 50;
  score += Math.min(20, p.exerciseFrequency * 4);
  score += p.sleepHours >= 7 && p.sleepHours <= 9 ? 15 : p.sleepHours >= 6 ? 8 : 0;
  score -= p.stressLevel * 1.5;
  score += Math.min(10, p.waterIntake * 1.2);
  score -= Math.max(0, (p.screenTime - 4) * 2);
  score += p.smokingHabit === 'never' ? 10 : p.smokingHabit === 'former' ? 3 : -10;
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function calculateOverallHealthScore(p: HealthProfile): number {
  const heart = 100 - predictHeartDiseaseRisk(p);
  const diabetes = 100 - predictDiabetesRisk(p);
  const bp = 100 - predictBloodPressureRisk(p);
  const lifestyle = calculateLifestyleScore(p);
  return Math.round((heart * 0.25 + diabetes * 0.25 + bp * 0.25 + lifestyle * 0.25));
}

export function getRiskLevel(risk: number): 'Low' | 'Moderate' | 'High' {
  if (risk < 30) return 'Low';
  if (risk < 60) return 'Moderate';
  return 'High';
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Moderate';
  return 'Needs Improvement';
}

export function getHeartRecommendations(p: HealthProfile): string[] {
  const recs: string[] = [];
  if (p.cholesterol > 200) recs.push('Reduce cholesterol intake — limit fried foods and saturated fats');
  if (p.exerciseFrequency < 4) recs.push('Increase physical activity to at least 4 days per week');
  if (p.bmi > 25) recs.push('Work towards a healthy BMI through balanced diet and exercise');
  if (p.smokingHabit === 'current') recs.push('Quit smoking — it significantly reduces heart disease risk');
  if (p.heartRate > 80) recs.push('Practice relaxation techniques to lower resting heart rate');
  if (p.bloodPressureSystolic > 130) recs.push('Monitor blood pressure regularly and reduce sodium intake');
  if (recs.length === 0) recs.push('Maintain your current healthy habits!');
  return recs;
}

export function getDiabetesRecommendations(p: HealthProfile): string[] {
  const recs: string[] = [];
  if (p.bloodSugar > 100) recs.push('Reduce sugar consumption and monitor blood glucose regularly');
  if (p.bmi > 25) recs.push('Lose weight gradually — even 5% weight loss significantly reduces risk');
  if (p.exerciseFrequency < 3) recs.push('Exercise daily for at least 30 minutes');
  if (p.familyHistoryDiabetes) recs.push('Get regular HbA1c screenings due to family history');
  recs.push('Increase fiber intake through whole grains, vegetables, and legumes');
  return recs;
}

export function getBPRecommendations(p: HealthProfile): string[] {
  const recs: string[] = [];
  if (p.saltIntake !== 'low') recs.push('Reduce sodium intake to less than 2300mg per day');
  if (p.stressLevel > 5) recs.push('Practice stress management — meditation, yoga, or deep breathing');
  if (p.sleepHours < 7) recs.push('Improve sleep quality — aim for 7-9 hours per night');
  if (p.exerciseFrequency < 4) recs.push('Increase cardiovascular exercise frequency');
  if (p.bloodPressureSystolic > 130) recs.push('Monitor blood pressure daily and consult your physician');
  if (recs.length === 0) recs.push('Your blood pressure habits are excellent — keep it up!');
  return recs;
}

export function getLifestyleRecommendations(p: HealthProfile): string[] {
  const recs: string[] = [];
  if (p.exerciseFrequency < 4) recs.push('Increase daily physical activity');
  if (p.sleepHours < 7) recs.push('Improve sleep duration to 7-9 hours');
  if (p.waterIntake < 8) recs.push('Drink at least 8 glasses of water daily');
  if (p.screenTime > 6) recs.push('Reduce screen time — take breaks every 30 minutes');
  if (p.stressLevel > 6) recs.push('Incorporate relaxation techniques into your routine');
  return recs;
}

export interface NutritionEntry {
  id: string;
  meal: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  foodName: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  timestamp: Date;
  imageUrl?: string;
}

export const recommendedDaily = {
  calories: 2000,
  protein: 50,
  fat: 65,
  carbs: 300,
  fiber: 25,
};

export interface DietPlan {
  condition: string;
  meals: {
    breakfast: string[];
    lunch: string[];
    snack: string[];
    dinner: string[];
  };
}

export function getDietPlan(heartRisk: number, diabetesRisk: number, bpRisk: number): DietPlan {
  if (diabetesRisk >= 50) {
    return {
      condition: 'Diabetes Prevention',
      meals: {
        breakfast: ['Oats with nuts and seeds', 'Boiled eggs', 'Whole grain toast with avocado'],
        lunch: ['Brown rice with grilled chicken', 'Mixed vegetable salad', 'Lentil soup'],
        snack: ['Greek yogurt with berries', 'Almonds and walnuts', 'Apple slices with peanut butter'],
        dinner: ['Grilled fish with steamed vegetables', 'Quinoa bowl', 'Vegetable soup with whole grain bread'],
      },
    };
  }
  if (heartRisk >= 50) {
    return {
      condition: 'Heart Health',
      meals: {
        breakfast: ['Oatmeal with flaxseed', 'Fresh fruit smoothie', 'Whole grain cereal with low-fat milk'],
        lunch: ['Grilled salmon with leafy greens', 'Chickpea salad', 'Vegetable stir-fry with tofu'],
        snack: ['Mixed berries', 'Dark chocolate (small portion)', 'Hummus with carrot sticks'],
        dinner: ['Baked chicken breast with roasted vegetables', 'Lentil curry with brown rice', 'Mediterranean salad'],
      },
    };
  }
  if (bpRisk >= 50) {
    return {
      condition: 'Blood Pressure Management',
      meals: {
        breakfast: ['Banana smoothie with spinach', 'Low-sodium granola with yogurt', 'Egg white omelette with vegetables'],
        lunch: ['Grilled turkey wrap with vegetables', 'Beet and goat cheese salad', 'Low-sodium minestrone soup'],
        snack: ['Unsalted nuts', 'Fresh fruits', 'Celery with almond butter'],
        dinner: ['Herb-baked fish with sweet potato', 'Vegetable stew', 'Grilled chicken with quinoa'],
      },
    };
  }
  return {
    condition: 'General Wellness',
    meals: {
      breakfast: ['Whole grain toast with eggs', 'Fresh fruit bowl', 'Yogurt parfait with granola'],
      lunch: ['Grilled chicken salad', 'Brown rice with vegetables', 'Whole wheat pasta with marinara'],
      snack: ['Mixed nuts', 'Protein bar', 'Fresh fruit'],
      dinner: ['Grilled fish with salad', 'Stir-fried vegetables with tofu', 'Chicken soup with whole grain bread'],
    },
  };
}
