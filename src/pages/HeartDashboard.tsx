import { useHealth } from '@/contexts/HealthContext';
import { predictHeartDiseaseRisk, getRiskLevel, getHeartRecommendations } from '@/lib/health-utils';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import ScoreRing from '@/components/shared/ScoreRing';
import RiskBadge from '@/components/shared/RiskBadge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { CheckCircle2 } from 'lucide-react';

const mockTrend = [
  { month: 'Jan', risk: 42 }, { month: 'Feb', risk: 40 }, { month: 'Mar', risk: 38 },
  { month: 'Apr', risk: 41 }, { month: 'May', risk: 36 }, { month: 'Jun', risk: 34 },
];

export default function HeartDashboard() {
  const { profile, updateProfile } = useHealth();
  const risk = predictHeartDiseaseRisk(profile);
  const level = getRiskLevel(risk);
  const recs = getHeartRecommendations(profile);

  const factors = [
    { name: 'Cholesterol', value: Math.min(100, (profile.cholesterol / 300) * 100) },
    { name: 'Blood Pressure', value: Math.min(100, (profile.bloodPressureSystolic / 180) * 100) },
    { name: 'Heart Rate', value: Math.min(100, (profile.heartRate / 120) * 100) },
    { name: 'BMI', value: Math.min(100, (profile.bmi / 40) * 100) },
    { name: 'Exercise', value: (profile.exerciseFrequency / 7) * 100 },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="Heart Disease Risk" description="Predict and monitor your cardiovascular health" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass-card rounded-xl p-6 flex flex-col items-center">
          <ScoreRing score={risk} size={150} strokeWidth={10} label="Risk %" colorClass="text-destructive" />
          <RiskBadge level={level} />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {level === 'Low' ? 'Your heart health looks great!' : level === 'Moderate' ? 'Some factors need attention.' : 'Consult a healthcare provider.'}
          </p>
        </div>

        <div className="lg:col-span-2 glass-card rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4">Risk Factor Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={factors} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--chart-heart))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4">Update Your Data</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Age</Label>
                <Input type="number" value={profile.age} onChange={e => updateProfile({ age: +e.target.value })} />
              </div>
              <div>
                <Label>Gender</Label>
                <Select value={profile.gender} onValueChange={v => updateProfile({ gender: v as 'male' | 'female' })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Cholesterol (mg/dL)</Label>
                <Input type="number" value={profile.cholesterol} onChange={e => updateProfile({ cholesterol: +e.target.value })} placeholder="e.g., 200" />
              </div>
              <div>
                <Label>Systolic BP (mmHg)</Label>
                <Input type="number" value={profile.bloodPressureSystolic} onChange={e => updateProfile({ bloodPressureSystolic: +e.target.value })} placeholder="e.g., 120" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Heart Rate (bpm)</Label>
                <Input type="number" value={profile.heartRate} onChange={e => updateProfile({ heartRate: +e.target.value })} placeholder="e.g., 72" />
              </div>
              <div>
                <Label>BMI</Label>
                <Input type="number" step="0.1" value={profile.bmi} onChange={e => updateProfile({ bmi: +e.target.value })} placeholder="e.g., 24.5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Exercise (days/week)</Label>
                <Input type="number" value={profile.exerciseFrequency} onChange={e => updateProfile({ exerciseFrequency: +e.target.value })} min={0} max={7} placeholder="0-7" />
              </div>
              <div>
                <Label>Smoking</Label>
                <Select value={profile.smokingHabit} onValueChange={v => updateProfile({ smokingHabit: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="former">Former</SelectItem>
                    <SelectItem value="current">Current</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-xl p-6">
            <h3 className="font-display font-semibold mb-4">Risk Trend</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={mockTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip />
                <Line type="monotone" dataKey="risk" stroke="hsl(var(--chart-heart))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card rounded-xl p-6">
            <h3 className="font-display font-semibold mb-3">Recommendations</h3>
            <ul className="space-y-2">
              {recs.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
