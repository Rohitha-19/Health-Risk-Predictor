import { useHealth } from '@/contexts/HealthContext';
import { recommendedDaily } from '@/lib/health-utils';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';
import { Progress } from '@/components/ui/progress';

export default function NutritionDashboard() {
  const { nutritionLog } = useHealth();

  const totals = nutritionLog.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein: acc.protein + e.protein,
      fat: acc.fat + e.fat,
      carbs: acc.carbs + e.carbs,
      fiber: acc.fiber + e.fiber,
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 }
  );

  const macros = [
    { name: 'Calories', current: totals.calories, target: recommendedDaily.calories, unit: 'kcal', fill: 'hsl(var(--chart-diabetes))' },
    { name: 'Protein', current: totals.protein, target: recommendedDaily.protein, unit: 'g', fill: 'hsl(var(--chart-bp))' },
    { name: 'Fat', current: totals.fat, target: recommendedDaily.fat, unit: 'g', fill: 'hsl(var(--chart-heart))' },
    { name: 'Carbs', current: totals.carbs, target: recommendedDaily.carbs, unit: 'g', fill: 'hsl(var(--chart-lifestyle))' },
    { name: 'Fiber', current: totals.fiber, target: recommendedDaily.fiber, unit: 'g', fill: 'hsl(var(--chart-nutrition))' },
  ];

  const radialData = macros.map(m => ({
    name: m.name,
    value: Math.min(100, Math.round((m.current / m.target) * 100)),
    fill: m.fill,
  }));

  const mealBreakdown = (['breakfast', 'lunch', 'snack', 'dinner'] as const).map(meal => ({
    meal: meal.charAt(0).toUpperCase() + meal.slice(1),
    calories: nutritionLog.filter(e => e.meal === meal).reduce((s, e) => s + e.calories, 0),
    protein: nutritionLog.filter(e => e.meal === meal).reduce((s, e) => s + e.protein, 0),
  }));

  return (
    <DashboardLayout>
      <PageHeader title="Nutrition Tracking" description="Track your daily nutritional intake vs. recommended values" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4">Daily Progress</h3>
          <div className="space-y-4">
            {macros.map(m => (
              <div key={m.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{m.name}</span>
                  <span className="text-muted-foreground">{m.current} / {m.target} {m.unit}</span>
                </div>
                <Progress value={Math.min(100, (m.current / m.target) * 100)} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4">Intake vs Recommended (%)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={radialData} startAngle={180} endAngle={0}>
              <RadialBar dataKey="value" cornerRadius={4} />
              <Legend iconSize={10} formatter={(value) => <span className="text-xs">{value}</span>} />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="font-display font-semibold mb-4">Meal Breakdown</h3>
        {nutritionLog.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No meals logged yet. Start by adding entries in the Diet Analyzer.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={mealBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="meal" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip />
              <Bar dataKey="calories" fill="hsl(var(--chart-diabetes))" radius={[4, 4, 0, 0]} name="Calories" />
              <Bar dataKey="protein" fill="hsl(var(--chart-bp))" radius={[4, 4, 0, 0]} name="Protein (g)" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </DashboardLayout>
  );
}
