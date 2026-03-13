import { useHealth } from '@/contexts/HealthContext';
import {
  calculateOverallHealthScore, predictHeartDiseaseRisk, predictDiabetesRisk,
  predictBloodPressureRisk, calculateLifestyleScore, getRiskLevel, getScoreLabel
} from '@/lib/health-utils';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import ScoreRing from '@/components/shared/ScoreRing';
import RiskBadge from '@/components/shared/RiskBadge';
import { Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function HealthScoreDashboard() {
  const { profile } = useHealth();
  const overall = calculateOverallHealthScore(profile);
  const heart = predictHeartDiseaseRisk(profile);
  const diabetes = predictDiabetesRisk(profile);
  const bp = predictBloodPressureRisk(profile);
  const lifestyle = calculateLifestyleScore(profile);

  const categories = [
    { name: 'Heart Health', score: 100 - heart, weight: '25%', risk: getRiskLevel(heart) },
    { name: 'Diabetes Prevention', score: 100 - diabetes, weight: '25%', risk: getRiskLevel(diabetes) },
    { name: 'Blood Pressure', score: 100 - bp, weight: '25%', risk: getRiskLevel(bp) },
    { name: 'Lifestyle', score: lifestyle, weight: '25%', risk: getRiskLevel(100 - lifestyle) },
  ];

  const interpretation = getScoreLabel(overall);

  return (
    <DashboardLayout>
      <PageHeader title="Health Risk Score" description="Your comprehensive health score breakdown" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass-card rounded-xl p-8 flex flex-col items-center justify-center">
          <ScoreRing score={overall} size={180} strokeWidth={12} label="Overall" />
          <p className="mt-4 text-lg font-bold font-display">{interpretation}</p>
          <p className="text-xs text-muted-foreground mt-1">Based on all health metrics</p>
        </div>

        <div className="lg:col-span-2 glass-card rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Score Breakdown
          </h3>
          <div className="space-y-4">
            {categories.map(cat => (
              <div key={cat.name} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{cat.name}</span>
                    <span className="text-sm text-muted-foreground">{cat.score}/100 ({cat.weight})</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        cat.score >= 70 ? 'bg-success' : cat.score >= 40 ? 'bg-warning' : 'bg-destructive'
                      }`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                </div>
                <RiskBadge level={cat.risk} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="font-display font-semibold mb-4">Score Interpretation</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { range: '90-100', label: 'Excellent', color: 'bg-success/15 text-success', icon: TrendingUp },
            { range: '70-89', label: 'Good', color: 'bg-info/15 text-info', icon: TrendingUp },
            { range: '50-69', label: 'Moderate Risk', color: 'bg-warning/15 text-warning', icon: Minus },
            { range: 'Below 50', label: 'High Risk', color: 'bg-destructive/15 text-destructive', icon: TrendingDown },
          ].map(item => (
            <div key={item.range} className={`rounded-xl p-4 ${item.color} ${overall >= parseInt(item.range) && overall <= parseInt(item.range.split('-')[1] || '100') ? 'ring-2 ring-current' : ''}`}>
              <item.icon className="w-5 h-5 mb-2" />
              <p className="font-bold text-lg">{item.range}</p>
              <p className="text-xs">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
