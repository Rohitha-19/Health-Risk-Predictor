import { useHealth } from '@/contexts/HealthContext';
import { calculateLifestyleScore, getScoreLabel, getLifestyleRecommendations } from '@/lib/health-utils';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import ScoreRing from '@/components/shared/ScoreRing';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { CheckCircle2 } from 'lucide-react';

const weekTrend = [
  { day: 'Mon', score: 70 }, { day: 'Tue', score: 72 }, { day: 'Wed', score: 68 },
  { day: 'Thu', score: 75 }, { day: 'Fri', score: 78 }, { day: 'Sat', score: 80 }, { day: 'Sun', score: 76 },
];

export default function LifestyleDashboard() {
  const { profile, updateProfile } = useHealth();
  const score = calculateLifestyleScore(profile);
  const recs = getLifestyleRecommendations(profile);

  const radarData = [
    { habit: 'Exercise', value: (profile.exerciseFrequency / 7) * 100 },
    { habit: 'Sleep', value: profile.sleepHours >= 7 ? 90 : (profile.sleepHours / 7) * 90 },
    { habit: 'Stress Mgmt', value: (10 - profile.stressLevel) * 10 },
    { habit: 'Hydration', value: Math.min(100, (profile.waterIntake / 10) * 100) },
    { habit: 'Screen Time', value: Math.max(10, 100 - (profile.screenTime / 12) * 100) },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="Lifestyle Analyzer" description="Evaluate and improve your daily habits" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass-card rounded-xl p-6 flex flex-col items-center">
          <ScoreRing score={score} size={150} strokeWidth={10} label="Score" />
          <p className="mt-2 text-sm font-semibold">{getScoreLabel(score)}</p>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4">Habit Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="habit" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Radar dataKey="value" stroke="hsl(var(--chart-lifestyle))" fill="hsl(var(--chart-lifestyle))" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4">Weekly Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip />
              <Bar dataKey="score" fill="hsl(var(--chart-lifestyle))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4">Update Habits</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Exercise (days/week)</Label>
                <Input type="number" value={profile.exerciseFrequency} onChange={e => updateProfile({ exerciseFrequency: +e.target.value })} min={0} max={7} placeholder="0-7" />
              </div>
              <div>
                <Label>Sleep Hours</Label>
                <Input type="number" step="0.5" value={profile.sleepHours} onChange={e => updateProfile({ sleepHours: +e.target.value })} placeholder="e.g., 7" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Stress Level (1-10)</Label>
                <Input type="number" value={profile.stressLevel} onChange={e => updateProfile({ stressLevel: +e.target.value })} min={1} max={10} placeholder="1-10" />
              </div>
              <div>
                <Label>Water Intake (glasses)</Label>
                <Input type="number" value={profile.waterIntake} onChange={e => updateProfile({ waterIntake: +e.target.value })} min={0} max={15} placeholder="e.g., 8" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Screen Time (hours)</Label>
                <Input type="number" step="0.5" value={profile.screenTime} onChange={e => updateProfile({ screenTime: +e.target.value })} min={0} max={16} placeholder="e.g., 6" />
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

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display font-semibold mb-3">Improvement Suggestions</h3>
          <ul className="space-y-3">
            {recs.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
          {recs.length === 0 && <p className="text-sm text-muted-foreground">Great job! Your lifestyle habits are excellent.</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
