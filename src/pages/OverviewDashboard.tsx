import { useHealth } from '@/contexts/HealthContext';
import {
  predictHeartDiseaseRisk, predictDiabetesRisk, predictBloodPressureRisk,
  calculateLifestyleScore, calculateOverallHealthScore, getRiskLevel, getScoreLabel
} from '@/lib/health-utils';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import ScoreRing from '@/components/shared/ScoreRing';
import StatCard from '@/components/shared/StatCard';
import RiskBadge from '@/components/shared/RiskBadge';
import { Heart, Droplets, Activity, Smile, Flame, BarChart3 } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const trendData = [
  { day: 'Mon', heart: 35, diabetes: 42, bp: 28 },
  { day: 'Tue', heart: 38, diabetes: 40, bp: 30 },
  { day: 'Wed', heart: 33, diabetes: 38, bp: 25 },
  { day: 'Thu', heart: 36, diabetes: 45, bp: 32 },
  { day: 'Fri', heart: 32, diabetes: 41, bp: 27 },
  { day: 'Sat', heart: 30, diabetes: 39, bp: 24 },
  { day: 'Sun', heart: 28, diabetes: 37, bp: 22 },
];

export default function OverviewDashboard() {
  const { profile, nutritionLog } = useHealth();

  const heartRisk = predictHeartDiseaseRisk(profile);
  const diabetesRisk = predictDiabetesRisk(profile);
  const bpRisk = predictBloodPressureRisk(profile);
  const lifestyleScore = calculateLifestyleScore(profile);
  const overallScore = calculateOverallHealthScore(profile);
  const totalCalories = nutritionLog.reduce((s, e) => s + e.calories, 0);

  const radarData = [
    { subject: 'Heart', value: 100 - heartRisk },
    { subject: 'Diabetes', value: 100 - diabetesRisk },
    { subject: 'BP', value: 100 - bpRisk },
    { subject: 'Lifestyle', value: lifestyleScore },
    { subject: 'Nutrition', value: Math.min(100, totalCalories > 0 ? 75 : 50) },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="Health Overview" description="Your comprehensive health summary at a glance" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 glass-card rounded-xl p-6 flex flex-col items-center justify-center">
          <ScoreRing score={overallScore} size={160} strokeWidth={10} label="Health Score" />
          <p className="mt-3 text-sm font-semibold">{getScoreLabel(overallScore)}</p>
          <p className="text-xs text-muted-foreground mt-1">Based on all health metrics</p>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard title="Heart Risk" value={`${heartRisk}%`} subtitle={getRiskLevel(heartRisk)} icon={Heart} gradient="gradient-heart" />
          <StatCard title="Diabetes Risk" value={`${diabetesRisk}%`} subtitle={getRiskLevel(diabetesRisk)} icon={Droplets} gradient="gradient-diabetes" />
          <StatCard title="BP Risk" value={`${bpRisk}%`} subtitle={getRiskLevel(bpRisk)} icon={Activity} gradient="gradient-bp" />
          <StatCard title="Lifestyle" value={`${lifestyleScore}/100`} subtitle={getScoreLabel(lifestyleScore)} icon={Smile} />
          <StatCard title="Calories" value={totalCalories || '—'} subtitle="Today" icon={Flame} gradient="gradient-diabetes" />
          <StatCard title="Nutrition" value={nutritionLog.length} subtitle="Meals logged" icon={BarChart3} gradient="gradient-bp" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4">Health Radar</h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4">Risk Trends (7 Days)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip />
              <Area type="monotone" dataKey="heart" stroke="hsl(var(--chart-heart))" fill="hsl(var(--chart-heart))" fillOpacity={0.1} />
              <Area type="monotone" dataKey="diabetes" stroke="hsl(var(--chart-diabetes))" fill="hsl(var(--chart-diabetes))" fillOpacity={0.1} />
              <Area type="monotone" dataKey="bp" stroke="hsl(var(--chart-bp))" fill="hsl(var(--chart-bp))" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 glass-card rounded-xl p-6">
        <h3 className="font-display font-semibold mb-4">Risk Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Heart Disease', risk: heartRisk },
            { label: 'Diabetes', risk: diabetesRisk },
            { label: 'Hypertension', risk: bpRisk },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">{item.label}</span>
              <RiskBadge level={getRiskLevel(item.risk)} />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
