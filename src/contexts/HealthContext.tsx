import React, { createContext, useContext, useState, ReactNode } from 'react';
import { HealthProfile, defaultProfile, NutritionEntry } from '@/lib/health-utils';

interface HealthContextType {
  profile: HealthProfile;
  setProfile: (p: HealthProfile) => void;
  updateProfile: (partial: Partial<HealthProfile>) => void;
  nutritionLog: NutritionEntry[];
  addNutritionEntry: (entry: NutritionEntry) => void;
  removeNutritionEntry: (id: string) => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export function HealthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<HealthProfile>(defaultProfile);
  const [nutritionLog, setNutritionLog] = useState<NutritionEntry[]>([]);

  const updateProfile = (partial: Partial<HealthProfile>) => {
    setProfile(prev => ({ ...prev, ...partial }));
  };

  const addNutritionEntry = (entry: NutritionEntry) => {
    setNutritionLog(prev => [...prev, entry]);
  };

  const removeNutritionEntry = (id: string) => {
    setNutritionLog(prev => prev.filter(e => e.id !== id));
  };

  return (
    <HealthContext.Provider value={{ profile, setProfile, updateProfile, nutritionLog, addNutritionEntry, removeNutritionEntry }}>
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  const ctx = useContext(HealthContext);
  if (!ctx) throw new Error('useHealth must be used within HealthProvider');
  return ctx;
}
