import { useState } from 'react';
import { Home, Phone, BookOpen, Settings, AlertTriangle, MapPin, Info, History as HistoryIcon } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user?: any;
}

const Navigation = ({ activeTab, onTabChange, user }: NavigationProps) => {
  const { translations } = useLanguage();
  const navigate = useNavigate();
  
  const navItems = [
    { id: 'status', icon: Home, label: translations.status },
    { id: 'contacts', icon: Phone, label: translations.emergency },
    { id: 'safety', icon: BookOpen, label: translations.safety },
    { id: 'history', icon: HistoryIcon, label: 'History', isRoute: true },
    { id: 'about', icon: Info, label: 'About', isRoute: true },
    { id: 'settings', icon: Settings, label: translations.settings }
  ];

  // Add location sharing for authenticated users
  if (user) {
    navItems.splice(3, 0, { 
      id: 'location', 
      icon: MapPin, 
      label: 'Location' 
    });
  }

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="glass-float mx-4 mb-4 rounded-2xl p-2">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.isRoute) {
                      if (item.id === 'about') navigate('/about');
                      if (item.id === 'history') navigate('/history');
                    } else {
                      onTabChange(item.id);
                    }
                  }}
                  className={`nav-tab ${isActive ? 'active' : ''} flex flex-col items-center min-w-0 flex-1`}
                >
                  <Icon size={20} className="mb-1" />
                  <span className="text-xs truncate">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Emergency FAB */}
      <button 
        className="emergency-btn"
        onClick={() => onTabChange('emergency')}
      >
        <AlertTriangle size={24} />
      </button>
    </>
  );
};

export default Navigation;