import { useHealth } from '@/contexts/HealthContext';
import { predictHeartDiseaseRisk, predictDiabetesRisk, predictBloodPressureRisk, getDietPlan } from '@/lib/health-utils';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Apple, Coffee, Sun, Moon, Cookie } from 'lucide-react';

const mealIcons = {
  breakfast: Coffee,
  lunch: Sun,
  snack: Cookie,
  dinner: Moon,
};

export default function DietPlanDashboard() {
  const { profile } = useHealth();
  const heartRisk = predictHeartDiseaseRisk(profile);
  const diabetesRisk = predictDiabetesRisk(profile);
  const bpRisk = predictBloodPressureRisk(profile);

  const plan = getDietPlan(heartRisk, diabetesRisk, bpRisk);

  return (
    <DashboardLayout>
      <PageHeader title="Personalized Diet Plan" description={`Recommendations for ${plan.condition}`} />

      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Apple className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-display font-semibold">Focus: {plan.condition}</p>
            <p className="text-sm text-muted-foreground">Based on your health risk analysis</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Object.entries(plan.meals) as [keyof typeof mealIcons, string[]][]).map(([meal, items]) => {
          const Icon = mealIcons[meal];
          return (
            <div key={meal} className="glass-card rounded-xl p-6 animate-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <Icon className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold capitalize">{meal}</h3>
              </div>
              <ul className="space-y-2">
                {items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-6 glass-card rounded-xl p-6">
        <h3 className="font-display font-semibold mb-3">💡 Nutrition Tips</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-success/10">
            <p className="text-sm font-semibold text-success">High Protein</p>
            <p className="text-xs text-muted-foreground mt-1">Focus on lean meats, eggs, legumes, and dairy for muscle health</p>
          </div>
          <div className="p-4 rounded-lg bg-info/10">
            <p className="text-sm font-semibold text-info">Balanced Carbs</p>
            <p className="text-xs text-muted-foreground mt-1">Choose whole grains over refined carbohydrates</p>
          </div>
          <div className="p-4 rounded-lg bg-warning/10">
            <p className="text-sm font-semibold text-warning">Healthy Fats</p>
            <p className="text-xs text-muted-foreground mt-1">Include nuts, seeds, avocado, and olive oil</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
