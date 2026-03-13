import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Heart, Droplets, Activity, Smile,
  UtensilsCrossed, BarChart3, Apple, Shield,
  MessageCircle, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/heart', label: 'Heart Disease', icon: Heart },
  { path: '/diabetes', label: 'Diabetes', icon: Droplets },
  { path: '/blood-pressure', label: 'Blood Pressure', icon: Activity },
  { path: '/lifestyle', label: 'Lifestyle', icon: Smile },
  { path: '/diet', label: 'Diet Analyzer', icon: UtensilsCrossed },
  { path: '/nutrition', label: 'Nutrition', icon: BarChart3 },
  { path: '/diet-plan', label: 'Diet Plan', icon: Apple },
  { path: '/health-score', label: 'Health Score', icon: Shield },
  { path: '/chatbot', label: 'AI Assistant', icon: MessageCircle },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-50 transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-60"
    )}>
      <div className="flex items-center gap-2 px-4 h-16 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
          <Shield className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-display font-bold text-sidebar-foreground text-sm truncate">
            HealthPredict AI
          </span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              location.pathname === item.path
                ? "bg-sidebar-accent text-sidebar-primary font-medium"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-sidebar-border text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
