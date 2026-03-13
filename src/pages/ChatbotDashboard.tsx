import { useState, useRef, useEffect } from 'react';
import { useHealth } from '@/contexts/HealthContext';
import {
  predictHeartDiseaseRisk, predictDiabetesRisk, predictBloodPressureRisk,
  calculateLifestyleScore, calculateOverallHealthScore, getRiskLevel
} from '@/lib/health-utils';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function generateAIResponse(question: string, profile: any): string {
  const q = question.toLowerCase();
  const heartRisk = predictHeartDiseaseRisk(profile);
  const diabetesRisk = predictDiabetesRisk(profile);
  const bpRisk = predictBloodPressureRisk(profile);
  const lifestyle = calculateLifestyleScore(profile);
  const overall = calculateOverallHealthScore(profile);

  if (q.includes('diabetes') || q.includes('sugar') || q.includes('blood sugar')) {
    return `## Diabetes Risk Analysis\n\nYour current diabetes risk is **${diabetesRisk}%** (${getRiskLevel(diabetesRisk)}).\n\n### Key Factors:\n- **BMI**: ${profile.bmi} ${profile.bmi > 25 ? '(above normal — losing weight can significantly reduce risk)' : '(healthy range)'}\n- **Blood Sugar**: ${profile.bloodSugar} mg/dL ${profile.bloodSugar > 100 ? '(elevated)' : '(normal)'}\n- **Family History**: ${profile.familyHistoryDiabetes ? 'Yes (increases your risk)' : 'No'}\n\n### Recommendations:\n1. Reduce refined sugar and processed foods\n2. Increase fiber intake (whole grains, vegetables)\n3. Exercise at least 30 minutes daily\n4. Monitor blood glucose regularly\n5. Consider consulting an endocrinologist`;
  }

  if (q.includes('heart') || q.includes('cardio') || q.includes('cholesterol')) {
    return `## Heart Health Analysis\n\nYour heart disease risk is **${heartRisk}%** (${getRiskLevel(heartRisk)}).\n\n### Key Factors:\n- **Cholesterol**: ${profile.cholesterol} mg/dL\n- **Blood Pressure**: ${profile.bloodPressureSystolic}/${profile.bloodPressureDiastolic} mmHg\n- **Smoking**: ${profile.smokingHabit}\n\n### Heart-Healthy Foods:\n- 🐟 Fatty fish (salmon, mackerel)\n- 🥑 Avocado and nuts\n- 🫐 Berries and dark leafy greens\n- 🫒 Olive oil\n- 🌾 Whole grains\n\n### Tips:\n1. Aim for 150 minutes of moderate exercise per week\n2. Limit saturated fats and trans fats\n3. Manage stress with meditation or yoga`;
  }

  if (q.includes('blood pressure') || q.includes('hypertension') || q.includes('bp')) {
    return `## Blood Pressure Analysis\n\nYour hypertension risk is **${bpRisk}%** (${getRiskLevel(bpRisk)}).\n\nCurrent BP: **${profile.bloodPressureSystolic}/${profile.bloodPressureDiastolic} mmHg**\n\n### How to Reduce Blood Pressure:\n1. **Reduce sodium** to less than 2,300mg daily\n2. **DASH diet** — rich in fruits, vegetables, and low-fat dairy\n3. **Exercise** regularly (30 min/day)\n4. **Manage stress** through relaxation techniques\n5. **Limit alcohol** and caffeine\n6. **Sleep** 7-9 hours per night`;
  }

  if (q.includes('lifestyle') || q.includes('habit') || q.includes('improve')) {
    return `## Lifestyle Score: ${lifestyle}/100\n\n### Your Habits:\n- Exercise: ${profile.exerciseFrequency} days/week\n- Sleep: ${profile.sleepHours} hours\n- Stress: ${profile.stressLevel}/10\n- Water: ${profile.waterIntake} glasses\n- Screen time: ${profile.screenTime} hours\n\n### Top Improvements:\n1. ${profile.exerciseFrequency < 4 ? 'Increase exercise to 4+ days/week' : '✅ Great exercise frequency!'}\n2. ${profile.sleepHours < 7 ? 'Aim for 7-9 hours of sleep' : '✅ Good sleep habits!'}\n3. ${profile.stressLevel > 5 ? 'Try meditation or yoga for stress reduction' : '✅ Stress levels manageable'}\n4. ${profile.waterIntake < 8 ? 'Drink at least 8 glasses of water' : '✅ Good hydration!'}`;
  }

  if (q.includes('food') || q.includes('eat') || q.includes('diet') || q.includes('nutrition')) {
    return `## Personalized Nutrition Advice\n\nBased on your health profile (Overall Score: ${overall}/100):\n\n### Foods to Include:\n- 🥦 **Vegetables**: Broccoli, spinach, kale, sweet potatoes\n- 🍎 **Fruits**: Berries, citrus, apples\n- 🥜 **Healthy fats**: Nuts, seeds, avocado, olive oil\n- 🐟 **Lean protein**: Fish, chicken, legumes, tofu\n- 🌾 **Whole grains**: Brown rice, quinoa, oats\n\n### Foods to Limit:\n- 🍟 Fried and processed foods\n- 🧁 Added sugars and refined carbs\n- 🧂 High-sodium foods\n- 🥤 Sugary beverages`;
  }

  return `## Your Health Summary\n\n- **Overall Health Score**: ${overall}/100\n- **Heart Risk**: ${heartRisk}% (${getRiskLevel(heartRisk)})\n- **Diabetes Risk**: ${diabetesRisk}% (${getRiskLevel(diabetesRisk)})\n- **BP Risk**: ${bpRisk}% (${getRiskLevel(bpRisk)})\n- **Lifestyle Score**: ${lifestyle}/100\n\nI can help you with:\n- 🫀 Heart disease prevention\n- 🩸 Diabetes risk management\n- 💉 Blood pressure control\n- 🏃 Lifestyle improvements\n- 🥗 Diet and nutrition advice\n\nAsk me a specific question about any of these topics!`;
}

export default function ChatbotDashboard() {
  const { profile } = useHealth();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '👋 Hi! I\'m your AI Health Assistant. I can help you understand your health risks and provide personalized recommendations.\n\nTry asking me:\n- "Why is my diabetes risk high?"\n- "What foods improve heart health?"\n- "How can I reduce blood pressure?"\n- "Give me my health summary"' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(input, profile);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <PageHeader title="AI Health Assistant" description="Ask questions about your health and get personalized advice" />

      <div className="glass-card rounded-xl flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'gradient-primary' : 'bg-secondary'}`}>
                {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-primary-foreground" /> : <User className="w-4 h-4 text-secondary-foreground" />}
              </div>
              <div className={`max-w-[80%] rounded-xl p-4 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground animate-pulse" />
              </div>
              <div className="bg-muted rounded-xl p-4">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border p-4 flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your health..."
            className="flex-1 bg-muted rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center disabled:opacity-50 transition-opacity"
          >
            <Send className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
