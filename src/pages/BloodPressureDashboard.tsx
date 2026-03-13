import { useHealth } from '@/contexts/HealthContext';
import { predictBloodPressureRisk, getRiskLevel, getBPRecommendations } from '@/lib/health-utils';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import ScoreRing from '@/components/shared/ScoreRing';
import RiskBadge from '@/components/shared/RiskBadge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

const bpTrend = [
  { time: '6AM', systolic: 118, diastolic: 76 },
  { time: '9AM', systolic: 125, diastolic: 82 },
  { time: '12PM', systolic: 130, diastolic: 85 },
  { time: '3PM', systolic: 128, diastolic: 83 },
  { time: '6PM', systolic: 122, diastolic: 79 },
  { time: '9PM', systolic: 120, diastolic: 78 },
];

export default function BloodPressureDashboard() {
  const { profile, updateProfile } = useHealth();
  const risk = predictBloodPressureRisk(profile);
  const level = getRiskLevel(risk);
  const recs = getBPRecommendations(profile);

  return (
    <DashboardLayout>
      <PageHeader title="Blood Pressure Risk" description="Monitor and manage your hypertension risk" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass-card rounded-xl p-6 flex flex-col items-center">
          <ScoreRing score={risk} size={150} strokeWidth={10} label="Risk %" colorClass="text-info" />
          <RiskBadge level={level} />
          <div className="mt-4 text-center">
            <p className="text-2xl font-bold font-display">{profile.bloodPressureSystolic}/{profile.bloodPressureDiastolic}</p>
            <p className="text-xs text-muted-foreground">mmHg</p>
          </div>
        </div>

        <div className="lg:col-span-2 glass-card rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4">Blood Pressure Trend (Today)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={bpTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip />
              <Line type="monotone" dataKey="systolic" stroke="hsl(var(--chart-bp))" strokeWidth={2} name="Systolic" />
              <Line type="monotone" dataKey="diastolic" stroke="hsl(var(--chart-lifestyle))" strokeWidth={2} name="Diastolic" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4">Adjust Parameters</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Systolic BP (mmHg)</Label>
                <Input type="number" value={profile.bloodPressureSystolic} onChange={e => updateProfile({ bloodPressureSystolic: +e.target.value })} placeholder="e.g., 120" />
              </div>
              <div>
                <Label>Diastolic BP (mmHg)</Label>
                <Input type="number" value={profile.bloodPressureDiastolic} onChange={e => updateProfile({ bloodPressureDiastolic: +e.target.value })} placeholder="e.g., 80" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Stress Level (1-10)</Label>
                <Input type="number" value={profile.stressLevel} onChange={e => updateProfile({ stressLevel: +e.target.value })} min={1} max={10} placeholder="1-10" />
              </div>
              <div>
                <Label>Sleep Hours</Label>
                <Input type="number" step="0.5" value={profile.sleepHours} onChange={e => updateProfile({ sleepHours: +e.target.value })} placeholder="e.g., 7" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Salt Intake</Label>
                <Select value={profile.saltIntake} onValueChange={v => updateProfile({ saltIntake: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Exercise (days/week)</Label>
                <Input type="number" value={profile.exerciseFrequency} onChange={e => updateProfile({ exerciseFrequency: +e.target.value })} min={0} max={7} placeholder="0-7" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {risk >= 50 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-destructive">High Risk Alert</p>
                <p className="text-xs text-muted-foreground mt-1">Your blood pressure readings suggest elevated risk. Please consult a healthcare provider.</p>
              </div>
            </div>
          )}
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
      </div>
    </DashboardLayout>
  );
}
