import { useHealth } from '@/contexts/HealthContext';
import { predictDiabetesRisk, getRiskLevel, getDiabetesRecommendations } from '@/lib/health-utils';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import ScoreRing from '@/components/shared/ScoreRing';
import RiskBadge from '@/components/shared/RiskBadge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle2 } from 'lucide-react';

const timelineData = [
  { year: '1Y', risk: 15 }, { year: '2Y', risk: 25 }, { year: '3Y', risk: 38 },
  { year: '4Y', risk: 50 }, { year: '5Y', risk: 65 },
];

export default function DiabetesDashboard() {
  const { profile, updateProfile } = useHealth();
  const risk = predictDiabetesRisk(profile);
  const level = getRiskLevel(risk);
  const recs = getDiabetesRecommendations(profile);

  const pieData = [
    { name: 'BMI', value: Math.min(30, (profile.bmi - 18) * 2) },
    { name: 'Blood Sugar', value: Math.min(30, Math.max(0, profile.bloodSugar - 80)) },
    { name: 'Family History', value: profile.familyHistoryDiabetes ? 20 : 5 },
    { name: 'Activity', value: Math.max(5, 20 - profile.exerciseFrequency * 3) },
  ];
  const COLORS = ['hsl(var(--chart-diabetes))', 'hsl(var(--chart-heart))', 'hsl(var(--chart-nutrition))', 'hsl(var(--chart-lifestyle))'];

  return (
    <DashboardLayout>
      <PageHeader title="Diabetes Risk Prediction" description="Monitor and reduce your diabetes risk factors" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass-card rounded-xl p-6 flex flex-col items-center">
          <ScoreRing score={risk} size={150} strokeWidth={10} label="Risk %" colorClass="text-warning" />
          <RiskBadge level={level} />
          <p className="text-xs text-muted-foreground mt-2">Projected 5-year risk: {Math.min(95, risk + 20)}%</p>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4">Risk Factor Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {pieData.map((d, i) => (
              <span key={i} className="text-[10px] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                {d.name}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4">5-Year Projection</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={timelineData.map(d => ({ ...d, risk: Math.round(d.risk * (risk / 50)) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip />
              <Area type="monotone" dataKey="risk" stroke="hsl(var(--chart-diabetes))" fill="hsl(var(--chart-diabetes))" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4">Your Data</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Age</Label>
                <Input type="number" value={profile.age} onChange={e => updateProfile({ age: +e.target.value })} />
              </div>
              <div>
                <Label>BMI</Label>
                <Input type="number" step="0.1" value={profile.bmi} onChange={e => updateProfile({ bmi: +e.target.value })} placeholder="e.g., 24.5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Blood Sugar (mg/dL)</Label>
                <Input type="number" value={profile.bloodSugar} onChange={e => updateProfile({ bloodSugar: +e.target.value })} placeholder="e.g., 95" />
              </div>
              <div>
                <Label>Exercise (days/week)</Label>
                <Input type="number" value={profile.exerciseFrequency} onChange={e => updateProfile({ exerciseFrequency: +e.target.value })} min={0} max={7} placeholder="0-7" />
              </div>
            </div>
            <div>
              <Label>Stress Level (1-10)</Label>
              <Input type="number" value={profile.stressLevel} onChange={e => updateProfile({ stressLevel: +e.target.value })} min={1} max={10} placeholder="1-10" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={profile.familyHistoryDiabetes} onCheckedChange={v => updateProfile({ familyHistoryDiabetes: v })} />
              <Label>Family history of diabetes</Label>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display font-semibold mb-3">Recommendations</h3>
          <ul className="space-y-3">
            {recs.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
