import { useState, useEffect } from 'react';
import FloodStatus from '@/components/FloodStatus';
import AppDrawer from '@/components/AppDrawer';
import EmergencyContacts from '@/components/EmergencyContacts';
import SafetyTips from '@/components/SafetyTips';
import UserSettings from '@/components/UserSettings';
import LocationSharing from '@/components/LocationSharing';
import LoginPrompt from '@/components/LoginPrompt';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

type FloodLevel = 'SAFE' | 'CAUTION' | 'DANGER' | 'CRITICAL';

interface FloodData {
  currentLevel: FloodLevel;
  waterLevelCm: number;
  lastUpdated: Date;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('status');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [floodData, setFloodData] = useState<FloodData>({
    currentLevel: 'SAFE',
    waterLevelCm: 0,
    lastUpdated: new Date()
  });
  const [previousLevel, setPreviousLevel] = useState<FloodLevel>('SAFE');

  // Request notification permission on mount
  useEffect(() => {
    console.log('Notification support:', 'Notification' in window);
    console.log('Current permission:', Notification.permission);
    
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission result:', permission);
      });
    }
  }, []);

  // Check authentication and set up auth listener (optional)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Starting auth check...');
        
        // Set a timeout to prevent hanging
        const authPromise = supabase.auth.getUser();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth timeout')), 5000)
        );
        
        const { data: { user } } = await Promise.race([authPromise, timeoutPromise]) as any;
        console.log('Auth check completed:', user ? 'User found' : 'No user');
        setUser(user);
      } catch (error) {
        console.error('Auth check failed:', error);
        // Continue without auth - app should still work
        setUser(null);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Calculate flood status based on water depth (matches Arduino sensor thresholds)
  // SAFE: 0-5 cm | CAUTION: 5-12 cm | DANGER: 12-23.9 cm | CRITICAL: ≥ 24 cm
  const calculateFloodStatus = (waterLevelCm: number): FloodLevel => {
    if (waterLevelCm <= 5) return 'SAFE';
    if (waterLevelCm <= 12) return 'CAUTION';
    if (waterLevelCm < 24) return 'DANGER';
    return 'CRITICAL';
  };

  // Fetch real-time flood data from Supabase (accessible to all)
  useEffect(() => {
    const fetchFloodData = async () => {
      const { data, error } = await supabase
        .from('flood_data')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (data && !error) {
        const waterLevel = data.water_level_cm || 0;
        const calculatedStatus = calculateFloodStatus(waterLevel);
        
        setFloodData({
          currentLevel: calculatedStatus,
          waterLevelCm: waterLevel,
          lastUpdated: new Date(data.last_updated || Date.now())
        });

        // Update the database with calculated status if different
        if (data.current_status !== calculatedStatus) {
          await supabase
            .from('flood_data')
            .update({ current_status: calculatedStatus })
            .eq('id', 1);
        }
      }
    };

    fetchFloodData();

    // Set up real-time subscription for flood data updates from ESP32
    const channel = supabase
      .channel('flood-data-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'flood_data'
        },
        (payload) => {
          const data = payload.new;
          const waterLevel = data.water_level_cm || 0;
          const calculatedStatus = calculateFloodStatus(waterLevel);
          
          setFloodData({
            currentLevel: calculatedStatus,
            waterLevelCm: waterLevel,
            lastUpdated: new Date(data.last_updated || Date.now())
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Show notification when flood status changes
  useEffect(() => {
    console.log('Flood level changed:', floodData.currentLevel, 'Previous:', previousLevel);
    
    // Only show notification if status actually changed
    if (floodData.currentLevel !== previousLevel && previousLevel !== null) {
      console.log('Attempting to show flood status notification...');
      
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          let title = '';
          let body = '';
          let requireInteraction = false;
          
          switch (floodData.currentLevel) {
            case 'SAFE':
              title = '✅ Flood Status: SAFE';
              body = `Water level is safe at ${floodData.waterLevelCm.toFixed(2)} cm. Normal conditions.`;
              break;
            case 'CAUTION':
              title = '⚠️ Flood Alert: CAUTION';
              body = `Water level rising to ${floodData.waterLevelCm.toFixed(2)} cm. Stay alert and monitor conditions.`;
              break;
            case 'DANGER':
              title = '🔴 Flood Warning: DANGER';
              body = `Water level at ${floodData.waterLevelCm.toFixed(2)} cm. Prepare to evacuate if needed.`;
              requireInteraction = true;
              break;
            case 'CRITICAL':
              title = '🚨 CRITICAL FLOOD ALERT';
              body = `Water level CRITICAL at ${floodData.waterLevelCm.toFixed(2)} cm. Evacuate immediately!`;
              requireInteraction = true;
              break;
          }
          
          const notification = new Notification(title, {
            body,
            icon: '/favicon.ico',
            requireInteraction,
            tag: 'flood-status'
          });
          
          console.log('Notification created successfully:', title);
          
          notification.onclick = () => {
            window.focus();
            notification.close();
          };
        } catch (error) {
          console.error('Error creating notification:', error);
        }
      } else {
        console.warn('Cannot show notification - permission:', Notification.permission);
      }
    }
    setPreviousLevel(floodData.currentLevel);
  }, [floodData.currentLevel]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'status':
        return (
          <FloodStatus 
            currentLevel={floodData.currentLevel}
            waterLevelCm={floodData.waterLevelCm}
            lastUpdated={floodData.lastUpdated}
          />
        );
      case 'contacts':
      case 'emergency':
        return <EmergencyContacts user={user} />;
      case 'safety':
        return <SafetyTips user={user} />;
      case 'location':
        return user ? <LocationSharing user={user} /> : <LoginPrompt feature="location-sharing" />;
      case 'settings':
        return user ? <UserSettings /> : <LoginPrompt feature="settings" />;
      default:
        return (
          <FloodStatus 
            currentLevel={floodData.currentLevel}
            waterLevelCm={floodData.waterLevelCm}
            lastUpdated={floodData.lastUpdated}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center">
        <div className="text-white text-xl">Loading Flood Monitor...</div>
      </div>
    );
  }


  return (
    <>
      {renderActiveTab()}
      <AppDrawer 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        user={user}
        currentLevel={floodData.currentLevel}
        waterLevelCm={floodData.waterLevelCm}
        lastUpdated={floodData.lastUpdated}
      />
    </>
  );
};

export default Index;
