import { useEffect, useState } from 'react';
import { 
  Home, Phone, BookOpen, Settings, MapPin, Info, History as HistoryIcon,
  Menu, X, Shield, TrendingUp, TrendingDown, Minus, Clock, Wifi, CheckCircle,
  Upload, LogOut, Bell
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface AppDrawerProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user?: any;
  currentLevel: 'SAFE' | 'CAUTION' | 'DANGER' | 'CRITICAL';
  waterLevelCm: number;
  lastUpdated: Date;
}

const AppDrawer = ({ 
  activeTab, 
  onTabChange, 
  user,
  currentLevel,
  waterLevelCm,
  lastUpdated 
}: AppDrawerProps) => {
  const { translations } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [trend, setTrend] = useState<'rising' | 'stable' | 'falling'>('stable');
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    setProfile(data);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsOpen(false);
  };

  const handleEmergencyCall = () => {
    if (window.confirm('Call emergency services (911)?')) {
      window.location.href = 'tel:911';
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const getStatusColor = () => {
    switch (currentLevel) {
      case 'SAFE': return 'status-safe';
      case 'CAUTION': return 'status-caution';
      case 'DANGER': return 'status-danger';
      case 'CRITICAL': return 'status-critical';
      default: return 'status-safe';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-3 h-3 text-red-400" />;
      case 'falling': return <TrendingDown className="w-3 h-3 text-green-400" />;
      default: return <Minus className="w-3 h-3 text-gray-400" />;
    }
  };

  return (
    <>
      {/* Menu Trigger Button - Fixed Top Left */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 w-12 h-12 rounded-xl glass-float flex items-center justify-center text-white hover:scale-110 transition-transform"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-sm transition-opacity duration-280"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full z-[70] w-[85%] max-w-[340px] transition-transform duration-280 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(180deg, #0F7A57 0%, #0A5F47 100%)',
        }}
      >
        {/* Header Section */}
        <div className="p-4 border-b border-white/12" style={{ background: 'rgba(15, 122, 87, 1.1)' }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white/70 text-xs font-medium">Welcome back</p>
                <p className="text-white text-base font-bold">
                  {profile?.name || user?.email?.split('@')[0] || 'Resident'}
                </p>
                <p className="text-white/70 text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {profile?.barangay || 'Your Barangay'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto h-[calc(100%-180px)] px-4 py-4">
          {/* Live Status Card - MOST PROMINENT */}
          <div 
            className="glass-card mb-6 cursor-pointer hover:scale-[0.98] active:scale-95 transition-transform"
            onClick={() => handleTabChange('status')}
            role="button"
            tabIndex={0}
            aria-label={`Current status: ${currentLevel}, water level ${waterLevelCm.toFixed(2)} cm`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-${getStatusColor()}/15 border-2 border-${getStatusColor()}/50`}>
                <Shield className={`w-4 h-4 text-${getStatusColor()}`} />
                <span className={`text-sm font-bold text-${getStatusColor()}`}>{currentLevel}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-white/70">Live</span>
              </div>
            </div>

            <div className="text-center mb-2">
              <div className="text-white text-3xl font-extrabold mb-1">
                {waterLevelCm.toFixed(2)} cm
              </div>
              {waterLevelCm === 0 ? (
                <div className="text-white/70 text-sm">No Water Detected</div>
              ) : (
                <div className="text-white/70 text-sm">Water Level</div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-white/60">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatDistanceToNow(lastUpdated, { addSuffix: true })}</span>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                <span className="capitalize">{trend}</span>
              </div>
            </div>
          </div>

          {/* Navigation Sections */}
          
          {/* MONITORING Section */}
          <div className="mb-6">
            <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mb-2 px-2">
              Monitoring
            </div>
            <div className="space-y-1">
              <DrawerMenuItem
                icon={Home}
                label="Home / Status"
                isActive={activeTab === 'status'}
                onClick={() => handleTabChange('status')}
              />
              <DrawerMenuItem
                icon={HistoryIcon}
                label="History"
                onClick={() => handleNavigate('/history')}
                badge="NEW"
              />
              {user && (
                <DrawerMenuItem
                  icon={MapPin}
                  label="Location / Map"
                  isActive={activeTab === 'location'}
                  onClick={() => handleTabChange('location')}
                />
              )}
            </div>
          </div>

          {/* EMERGENCY Section */}
          <div className="mb-6">
            <div className="text-red-300 text-xs uppercase tracking-wider font-semibold mb-2 px-2">
              Emergency
            </div>
            <div className="space-y-1">
              <DrawerMenuItem
                icon={Phone}
                label="Emergency Call"
                subtitle="Dial 911"
                onClick={handleEmergencyCall}
                variant="emergency"
              />
              <DrawerMenuItem
                icon={Upload}
                label="Report Flood"
                subtitle="Quick Report"
                onClick={() => handleTabChange('emergency')}
                variant="accent"
              />
            </div>
          </div>

          {/* INFORMATION Section */}
          <div className="mb-6">
            <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mb-2 px-2">
              Information
            </div>
            <div className="space-y-1">
              <DrawerMenuItem
                icon={BookOpen}
                label="Safety Tips"
                isActive={activeTab === 'safety'}
                onClick={() => handleTabChange('safety')}
              />
              <DrawerMenuItem
                icon={Info}
                label="About"
                onClick={() => handleNavigate('/about')}
              />
              <DrawerMenuItem
                icon={Bell}
                label="Notifications"
                badge={unreadNotifications > 0 ? unreadNotifications.toString() : undefined}
              />
            </div>
          </div>

          {/* SETTINGS Section */}
          <div className="mb-4">
            <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mb-2 px-2">
              Settings
            </div>
            <div className="space-y-1">
              <DrawerMenuItem
                icon={Settings}
                label="Settings"
                isActive={activeTab === 'settings'}
                onClick={() => handleTabChange('settings')}
              />
              {user && (
                <DrawerMenuItem
                  icon={LogOut}
                  label="Logout"
                  onClick={handleLogout}
                  variant="muted"
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0A5F47] border-t border-white/12">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>v1.0.0</span>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span>Synced {formatDistanceToNow(lastUpdated, { addSuffix: true })}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/60 mt-1">
            <Wifi className="w-3 h-3 text-green-400" />
            <span>ESP32 Connected</span>
          </div>
        </div>
      </div>
    </>
  );
};

interface DrawerMenuItemProps {
  icon: any;
  label: string;
  subtitle?: string;
  isActive?: boolean;
  onClick?: () => void;
  badge?: string;
  variant?: 'default' | 'emergency' | 'accent' | 'muted';
}

const DrawerMenuItem = ({ 
  icon: Icon, 
  label, 
  subtitle,
  isActive, 
  onClick,
  badge,
  variant = 'default'
}: DrawerMenuItemProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'emergency':
        return 'bg-red-500/15 hover:bg-red-500/25 border-red-500/20';
      case 'accent':
        return 'bg-emerald-400/15 hover:bg-emerald-400/25 border-emerald-400/20';
      case 'muted':
        return 'hover:bg-white/5';
      default:
        return isActive 
          ? 'bg-emerald-400/20 shadow-lg shadow-emerald-400/20' 
          : 'hover:bg-white/8';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${getVariantClasses()}`}
      style={{ minHeight: '56px' }}
      aria-label={label}
    >
      <Icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-white' : 'text-white/80'}`} />
      <div className="flex-1 text-left">
        <div className={`text-base font-medium ${isActive ? 'text-white' : 'text-white/90'}`}>
          {label}
        </div>
        {subtitle && (
          <div className="text-xs text-white/60">{subtitle}</div>
        )}
      </div>
      {badge && (
        <div className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
          {badge}
        </div>
      )}
    </button>
  );
};

export default AppDrawer;
