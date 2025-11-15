import { useEffect, useState } from 'react';
import { AlertTriangle, Shield, AlertCircle, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
type FloodLevel = 'SAFE' | 'CAUTION' | 'DANGER' | 'CRITICAL';
interface FloodStatusProps {
  currentLevel?: FloodLevel;
  waterLevelCm?: number;
  lastUpdated?: Date;
}
const FloodStatus = ({
  currentLevel = 'SAFE',
  waterLevelCm = 15,
  lastUpdated = new Date()
}: FloodStatusProps) => {
  const [backgroundClass, setBackgroundClass] = useState('');
  const [userName, setUserName] = useState<string | null>(null);
  const {
    translations
  } = useLanguage();
  useEffect(() => {
    // Dynamic background based on flood status
    const bgClasses = {
      SAFE: 'bg-status-safe',
      CAUTION: 'bg-status-caution',
      DANGER: 'bg-status-danger',
      CRITICAL: 'bg-status-critical'
    };
    setBackgroundClass(bgClasses[currentLevel]);
  }, [currentLevel]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (user) {
        const {
          data: profile
        } = await supabase.from('profiles').select('name').eq('user_id', user.id).single();
        if (profile?.name) {
          setUserName(profile.name);
        }
      }
    };
    fetchUserProfile();
  }, []);
  const getStatusIcon = () => {
    const iconProps = {
      size: 40,
      className: ""
    };
    switch (currentLevel) {
      case 'SAFE':
        return <Shield {...iconProps} className="text-status-safe" />;
      case 'CAUTION':
        return <AlertTriangle {...iconProps} className="text-status-caution" />;
      case 'DANGER':
        return <AlertCircle {...iconProps} className="text-status-danger" />;
      case 'CRITICAL':
        return <Zap {...iconProps} className="text-status-critical animate-bounce" />;
      default:
        return <Shield {...iconProps} className="text-status-safe" />;
    }
  };
  const getWaterFillHeight = () => {
    // Convert water depth to percentage (max 250cm = 100% for CRITICAL level)
    const percentage = Math.min((waterLevelCm / 250) * 100, 100);
    return `${percentage}%`;
  };
  const getStatusText = () => {
    switch (currentLevel) {
      case 'SAFE':
        return translations.safe;
      case 'CAUTION':
        return translations.caution;
      case 'DANGER':
        return translations.danger;
      case 'CRITICAL':
        return translations.critical;
      default:
        return translations.safe;
    }
  };
  const getStatusDescription = () => {
    switch (currentLevel) {
      case 'SAFE':
        return translations.safeDesc;
      case 'CAUTION':
        return translations.cautionDesc;
      case 'DANGER':
        return translations.dangerDesc;
      case 'CRITICAL':
        return translations.criticalDesc;
      default:
        return translations.safeDesc;
    }
  };
  const statusText = getStatusText();
  const statusDescription = getStatusDescription();
  return <div className={`min-h-screen transition-all duration-1000 ${backgroundClass} pb-20`}>
      <div className="container mx-auto px-4 py-4 max-w-md">
        {/* Compact Header */}
        <div className="text-center mb-4">
          {userName && <p className="text-white/90 text-base mb-1 font-medium break-words">
              Welcome back, {userName}
            </p>}
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1 drop-shadow-lg break-words leading-tight">
            {translations.appTitle}
          </h1>
          <p className="text-white/80 text-sm break-words">
            {translations.appSubtitle}
          </p>
        </div>

        {/* Main Status Display - Compact */}
        <div className="flex flex-col items-center justify-center space-y-3" role="status" aria-live="polite" aria-atomic="true">
          {/* Icon & Status Badge Combined */}
          <div className="flex flex-col items-center gap-2">
            <div className="status-icon-container">{getStatusIcon()}</div>
            
            {/* Status Badge with Pulse */}
            <div className={`status-badge status-badge-${currentLevel.toLowerCase()}`}>
              {statusText}
            </div>
          </div>
          
          {/* Status Description - Compact */}
          <p className="text-lg font-semibold text-white/95 text-center px-4 break-words leading-snug">
            {statusDescription}
          </p>

          {/* Glassmorphic Water Card */}
          <div className="water-card glass-card">
            <div className="water-container-modern">
              <div className="water-fill-animated" 
                   style={{ height: getWaterFillHeight() }}
                   data-level={currentLevel}>
                <div className="water-wave wave-1"></div>
                <div className="water-wave wave-2"></div>
                <div className="water-shimmer"></div>
              </div>
              
              {/* Water Depth - Inside Card */}
              <div className="water-depth-label">
                <span className="text-white font-bold text-3xl drop-shadow-lg">
                  {waterLevelCm < 0.5 ? translations.noWater : `${waterLevelCm.toFixed(2)}cm`}
                </span>
              </div>
            </div>
          </div>

          {/* Last Updated - Compact */}
          <p className="text-white/70 text-sm text-center">
            {translations.lastUpdated}: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Emergency Alert Overlay - Improved Accessibility */}
      {currentLevel === 'CRITICAL' && <div className="critical-overlay" role="alert" aria-live="assertive">
          <div className="text-center p-6 modern-card max-w-sm mx-4 border-2 border-red-500/50">
            <Zap size={48} className="text-white mx-auto mb-3 animate-pulse drop-shadow-lg" aria-hidden="true" />
            <h2 className="text-4xl font-black text-white mb-3 drop-shadow-md break-words">
              EMERGENCY!
            </h2>
            <p className="text-white/90 mb-5 text-xl leading-relaxed break-words">
              {translations.criticalDesc}
            </p>
            <button 
              onClick={() => window.location.href = 'tel:911'}
              className="w-full btn-emergency min-h-[44px] break-words"
              aria-label="Call emergency services 911"
            >
              {translations.callEmergency}
            </button>
          </div>
        </div>}
    </div>;
};
export default FloodStatus;