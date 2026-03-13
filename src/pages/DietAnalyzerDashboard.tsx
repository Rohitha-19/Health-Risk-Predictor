import { useState, useRef } from 'react';
import { useHealth } from '@/contexts/HealthContext';
import { NutritionEntry } from '@/lib/health-utils';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Plus, UtensilsCrossed, Camera, Upload, Loader2, Sparkles, Search } from 'lucide-react';

type Meal = 'breakfast' | 'lunch' | 'snack' | 'dinner';

const mealIcons: Record<Meal, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  snack: '🍎',
  dinner: '🌙',
};

// Simulated food nutrition database for name-based lookup
const foodNutritionDB: Record<string, { calories: number; protein: number; fat: number; carbs: number; fiber: number; suggestion: string }> = {
  'dosa': { calories: 200, protein: 5, fat: 7, carbs: 30, fiber: 1, suggestion: 'Add a boiled egg or paneer to increase protein intake.' },
  'dosa with coconut chutney': { calories: 280, protein: 7, fat: 10, carbs: 42, fiber: 2, suggestion: 'Add a boiled egg or paneer to increase protein intake.' },
  'idli': { calories: 150, protein: 4, fat: 1, carbs: 30, fiber: 2, suggestion: 'Pair with sambar for added protein and fiber.' },
  'grilled chicken': { calories: 250, protein: 38, fat: 8, carbs: 0, fiber: 0, suggestion: 'Add a side salad for extra vitamins and fiber.' },
  'grilled chicken salad': { calories: 320, protein: 35, fat: 14, carbs: 12, fiber: 5, suggestion: 'Great protein choice! Add avocado for healthy fats.' },
  'rice': { calories: 210, protein: 4, fat: 1, carbs: 46, fiber: 1, suggestion: 'Switch to brown rice for more fiber and nutrients.' },
  'rice with dal': { calories: 400, protein: 12, fat: 5, carbs: 72, fiber: 6, suggestion: 'Add a side of yogurt for probiotics and calcium.' },
  'brown rice': { calories: 220, protein: 5, fat: 2, carbs: 45, fiber: 4, suggestion: 'Great choice! Add lean protein for a balanced meal.' },
  'pasta': { calories: 350, protein: 12, fat: 5, carbs: 65, fiber: 3, suggestion: 'Switch to whole wheat pasta for more fiber.' },
  'pasta with marinara': { calories: 450, protein: 14, fat: 10, carbs: 75, fiber: 4, suggestion: 'Switch to whole wheat pasta and add grilled vegetables.' },
  'sandwich': { calories: 300, protein: 10, fat: 12, carbs: 38, fiber: 3, suggestion: 'Use whole grain bread and add lean protein like turkey.' },
  'sandwich with vegetables': { calories: 350, protein: 12, fat: 14, carbs: 42, fiber: 4, suggestion: 'Use whole grain bread and add lean protein like turkey.' },
  'fruit smoothie': { calories: 200, protein: 4, fat: 2, carbs: 45, fiber: 4, suggestion: 'Add protein powder or Greek yogurt for a more balanced drink.' },
  'fruit smoothie bowl': { calories: 280, protein: 8, fat: 6, carbs: 50, fiber: 7, suggestion: 'Add chia seeds or flaxseed for omega-3 fatty acids.' },
  'oats': { calories: 180, protein: 6, fat: 3, carbs: 32, fiber: 5, suggestion: 'Add nuts and seeds for extra protein and healthy fats.' },
  'oatmeal': { calories: 180, protein: 6, fat: 3, carbs: 32, fiber: 5, suggestion: 'Add berries and nuts for antioxidants and healthy fats.' },
  'egg': { calories: 78, protein: 6, fat: 5, carbs: 1, fiber: 0, suggestion: 'Great protein source! Add vegetables for a balanced meal.' },
  'boiled egg': { calories: 78, protein: 6, fat: 5, carbs: 1, fiber: 0, suggestion: 'Great protein source! Add whole grain toast.' },
  'scrambled eggs': { calories: 180, protein: 12, fat: 13, carbs: 2, fiber: 0, suggestion: 'Add vegetables like spinach or tomatoes for extra nutrition.' },
  'banana': { calories: 105, protein: 1, fat: 0, carbs: 27, fiber: 3, suggestion: 'Great pre-workout snack! Pair with peanut butter for sustained energy.' },
  'apple': { calories: 95, protein: 0, fat: 0, carbs: 25, fiber: 4, suggestion: 'Pair with almond butter for a balanced snack.' },
  'yogurt': { calories: 150, protein: 12, fat: 4, carbs: 17, fiber: 0, suggestion: 'Choose Greek yogurt for higher protein content.' },
  'chicken biryani': { calories: 500, protein: 22, fat: 18, carbs: 60, fiber: 3, suggestion: 'Have a smaller portion and add raita for probiotics.' },
  'pizza': { calories: 285, protein: 12, fat: 10, carbs: 36, fiber: 2, suggestion: 'Opt for thin crust with vegetable toppings.' },
  'burger': { calories: 400, protein: 20, fat: 22, carbs: 35, fiber: 2, suggestion: 'Choose a grilled chicken patty and skip the cheese for fewer calories.' },
  'salad': { calories: 120, protein: 3, fat: 7, carbs: 12, fiber: 4, suggestion: 'Add grilled chicken or chickpeas for protein.' },
  'chapati': { calories: 120, protein: 3, fat: 3, carbs: 20, fiber: 2, suggestion: 'Use whole wheat flour and pair with protein-rich curry.' },
  'paneer': { calories: 265, protein: 18, fat: 20, carbs: 4, fiber: 0, suggestion: 'Great protein source! Grill instead of frying for fewer calories.' },
  'dal': { calories: 150, protein: 9, fat: 3, carbs: 22, fiber: 5, suggestion: 'Excellent fiber and protein! Add vegetables for more nutrients.' },
  'fish': { calories: 200, protein: 25, fat: 10, carbs: 0, fiber: 0, suggestion: 'Bake or grill instead of frying. Add lemon for flavor.' },
  'grilled fish': { calories: 200, protein: 25, fat: 10, carbs: 0, fiber: 0, suggestion: 'Excellent choice! Add steamed vegetables as a side.' },
};

// Simulated image analysis results
const simulatedImageResults = [
  { name: 'Dosa with Coconut Chutney', calories: 280, protein: 7, fat: 10, carbs: 42, fiber: 2, suggestion: 'Add a boiled egg or paneer to increase protein intake.' },
  { name: 'Grilled Chicken Salad', calories: 320, protein: 35, fat: 14, carbs: 12, fiber: 5, suggestion: 'Great protein choice! Add avocado for healthy fats.' },
  { name: 'Rice with Dal', calories: 400, protein: 12, fat: 5, carbs: 72, fiber: 6, suggestion: 'Add a side of yogurt for probiotics and calcium.' },
  { name: 'Pasta with Marinara', calories: 450, protein: 14, fat: 10, carbs: 75, fiber: 4, suggestion: 'Switch to whole wheat pasta and add grilled vegetables.' },
  { name: 'Fruit Smoothie Bowl', calories: 280, protein: 8, fat: 6, carbs: 50, fiber: 7, suggestion: 'Add chia seeds or flaxseed for omega-3 fatty acids.' },
  { name: 'Chicken Biryani', calories: 500, protein: 22, fat: 18, carbs: 60, fiber: 3, suggestion: 'Have a smaller portion and add raita for probiotics.' },
];

type AnalysisResult = { name: string; calories: number; protein: number; fat: number; carbs: number; fiber: number; suggestion: string };

export default function DietAnalyzerDashboard() {
  const { nutritionLog, addNutritionEntry, removeNutritionEntry } = useHealth();
  const [meal, setMeal] = useState<Meal>('breakfast');
  const [foodName, setFoodName] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const lookupByName = () => {
    if (!foodName.trim()) return;
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const key = foodName.trim().toLowerCase();
      const match = foodNutritionDB[key];
      if (match) {
        setResult({ name: foodName.trim(), ...match });
      } else {
        // Fuzzy: find partial match
        const partial = Object.entries(foodNutritionDB).find(([k]) => key.includes(k) || k.includes(key));
        if (partial) {
          setResult({ name: foodName.trim(), ...partial[1] });
        } else {
          // Generate estimated values
          const hash = key.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
          setResult({
            name: foodName.trim(),
            calories: 150 + (hash % 350),
            protein: 3 + (hash % 30),
            fat: 2 + (hash % 20),
            carbs: 10 + (hash % 60),
            fiber: 1 + (hash % 8),
            suggestion: 'Consider pairing with vegetables or a protein source for a balanced meal.',
          });
        }
      }
      setAnalyzing(false);
    }, 1200);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setResult(null);
      analyzeImage();
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const randomFood = simulatedImageResults[Math.floor(Math.random() * simulatedImageResults.length)];
      setResult(randomFood);
      setFoodName(randomFood.name);
      setAnalyzing(false);
    }, 2000);
  };

  const addToLog = () => {
    if (!result) return;
    const entry: NutritionEntry = {
      id: Date.now().toString(),
      meal,
      foodName: result.name,
      calories: result.calories,
      protein: result.protein,
      fat: result.fat,
      carbs: result.carbs,
      fiber: result.fiber,
      timestamp: new Date(),
      imageUrl: imagePreview || undefined,
    };
    addNutritionEntry(entry);
    setResult(null);
    setFoodName('');
    setImagePreview(null);
  };

  const mealGroups = (['breakfast', 'lunch', 'snack', 'dinner'] as Meal[]).map(m => ({
    meal: m,
    entries: nutritionLog.filter(e => e.meal === m),
  }));

  return (
    <DashboardLayout>
      <PageHeader title="Diet Analyzer" description="Track meals by uploading food images or typing food names — nutrition is predicted automatically" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Input Section */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Log a Meal
          </h3>

          <div className="space-y-3">
            <div>
              <Label>Meal</Label>
              <Select value={meal} onValueChange={v => setMeal(v as Meal)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">🌅 Breakfast</SelectItem>
                  <SelectItem value="lunch">☀️ Lunch</SelectItem>
                  <SelectItem value="snack">🍎 Snack</SelectItem>
                  <SelectItem value="dinner">🌙 Dinner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="type" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="type" className="text-xs"><Search className="w-3 h-3 mr-1" /> Type Food Name</TabsTrigger>
                <TabsTrigger value="upload" className="text-xs"><Camera className="w-3 h-3 mr-1" /> Upload Photo</TabsTrigger>
              </TabsList>

              <TabsContent value="type" className="space-y-3 mt-3">
                <div>
                  <Label>Food Name</Label>
                  <Input
                    value={foodName}
                    onChange={e => { setFoodName(e.target.value); setResult(null); }}
                    placeholder="e.g., Grilled Chicken, Dosa, Rice..."
                  />
                </div>
                <Button onClick={lookupByName} className="w-full" disabled={!foodName.trim() || analyzing}>
                  {analyzing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  Predict Nutrition
                </Button>
              </TabsContent>

              <TabsContent value="upload" className="space-y-3 mt-3">
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors min-h-[140px]"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Food" className="max-h-32 rounded-lg object-cover" />
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-2">
                        <Camera className="w-6 h-6 text-accent-foreground" />
                      </div>
                      <p className="text-sm font-medium">Upload Food Image</p>
                      <p className="text-xs text-muted-foreground">Click to select</p>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                {imagePreview && !analyzing && !result && (
                  <Button onClick={analyzeImage} className="w-full">
                    <Sparkles className="w-4 h-4 mr-2" /> Analyze with AI
                  </Button>
                )}
              </TabsContent>
            </Tabs>

            {analyzing && (
              <div className="flex items-center justify-center gap-2 text-primary py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Analyzing food...</span>
              </div>
            )}

            {/* Result display */}
            {result && !analyzing && (
              <div className="border border-primary/20 rounded-lg p-4 bg-primary/5 space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <p className="font-semibold text-sm">{result.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Calories', value: `${result.calories} kcal`, color: 'text-warning' },
                    { label: 'Protein', value: `${result.protein}g`, color: 'text-info' },
                    { label: 'Fat', value: `${result.fat}g`, color: 'text-destructive' },
                    { label: 'Carbs', value: `${result.carbs}g`, color: 'text-success' },
                  ].map(item => (
                    <div key={item.label} className="bg-muted/50 rounded-lg p-2">
                      <p className="text-[10px] text-muted-foreground">{item.label}</p>
                      <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-accent/50 rounded-lg p-2">
                  <p className="text-[10px] font-semibold text-primary mb-0.5">💡 AI Suggestion</p>
                  <p className="text-xs">{result.suggestion}</p>
                </div>
                <Button onClick={addToLog} className="w-full" size="sm">Add to Meal Log</Button>
              </div>
            )}
          </div>
        </div>

        {/* Meal Log */}
        <div className="lg:col-span-2 space-y-4">
          {mealGroups.map(g => (
            <div key={g.meal} className="glass-card rounded-xl p-5">
              <h4 className="font-display font-semibold capitalize flex items-center gap-2 mb-3">
                <span>{mealIcons[g.meal]}</span> {g.meal}
                <span className="text-xs text-muted-foreground ml-auto">{g.entries.length} items</span>
              </h4>
              {g.entries.length === 0 ? (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4" /> No entries yet
                </p>
              ) : (
                <div className="space-y-2">
                  {g.entries.map(e => (
                    <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        {e.imageUrl && (
                          <img src={e.imageUrl} alt={e.foodName} className="w-10 h-10 rounded-lg object-cover" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{e.foodName}</p>
                          <p className="text-xs text-muted-foreground">
                            {e.calories} kcal · P: {e.protein}g · F: {e.fat}g · C: {e.carbs}g
                          </p>
                        </div>
                      </div>
                      <button onClick={() => removeNutritionEntry(e.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
