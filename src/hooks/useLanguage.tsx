import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LanguageContextType {
  language: 'en' | 'ceb';
  translations: any;
  setLanguage: (lang: 'en' | 'ceb') => void;
}

const translations = {
  en: {
    // Navigation
    status: 'Status',
    emergency: 'Emergency',
    safety: 'Safety',
    settings: 'Settings',
    
    // Flood Status
    floodStatus: 'Flood Status',
    currentLevel: 'Current Level',
    waterLevel: 'Water Level',
    lastUpdated: 'Last Updated',
    safe: 'SAFE',
    caution: 'CAUTION',
    danger: 'DANGER',
    critical: 'CRITICAL',
    safeDesc: 'Water levels are normal. No immediate risk.',
    cautionDesc: 'Water levels are rising. Stay alert.',
    dangerDesc: 'High water levels. Prepare for evacuation.',
    criticalDesc: 'EVACUATE IMMEDIATELY! Extreme flood danger.',
    
    // Emergency Contacts
    emergencyContacts: 'Emergency Contacts',
    call: 'Call',
    
    // Safety Tips
    safetyTips: 'Safety Tips',
    before: 'Before',
    during: 'During',
    after: 'After',
    preparedness: 'Emergency Preparedness',
    
    // Safety Tips Content
    tip1: 'Prepare an emergency kit with water, food, flashlight, radio, and first aid supplies.',
    tip2: 'Know your evacuation routes and nearest evacuation centers.',
    tip3: 'Stay away from floodwater. Just 6 inches can knock you down.',
    tip4: 'Do not drive through flooded roads. Turn around, don\'t drown.',
    tip5: 'Check for injuries and give first aid if needed.',
    tip6: 'Stay out of buildings with standing water until authorities say it\'s safe.',
    
    // Emergency Kit Items
    water3days: 'Water (3 days supply)',
    nonPerishableFood: 'Non-perishable food',
    flashlightBatteries: 'Flashlight & batteries',
    firstAidKit: 'First aid kit',
    radio: 'Radio',
    importantDocs: 'Important documents',
    
    // Settings
    profileInfo: 'Profile Information',
    fullName: 'Full Name',
    barangay: 'Barangay',
    language: 'Language',
    notifications: 'Notifications',
    receiveAlerts: 'Receive flood alerts and updates',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    systemStatus: 'System Status',
    dataSource: 'Data Source',
    liveSensors: 'Live Sensors',
    esp32Ready: 'ESP32 Ready',
    realtime: 'Real-time',
    active: 'Active',
    account: 'Account',
    email: 'Email',
    signOut: 'Sign Out',
    
    // Messages
    settingsSaved: 'Settings saved',
    profileUpdated: 'Your profile has been updated successfully.',
    error: 'Error',
    failedToSave: 'Failed to save settings. Please try again.',
    loading: 'Loading...',
    
    // Time
    justNow: 'Just now',
    minutesAgo: 'minutes ago',
    hoursAgo: 'hours ago',
    daysAgo: 'days ago',
    
    // Common
    welcome: 'Welcome',
    remember: 'Remember',
    emergencyText: 'In case of life-threatening emergency, call 911 immediately. Your safety is the top priority.',
    highPriority: 'HIGH PRIORITY',
    mediumPriority: 'MEDIUM PRIORITY',
    lowPriority: 'LOW PRIORITY',
    appTitle: 'Barangay Flood Alert',
    appSubtitle: 'Real-time Flood Monitoring System',
    noWater: 'No Water',
    callEmergency: 'CALL EMERGENCY'
  },
  ceb: {
    // Navigation  
    status: 'Sitwasyon',
    emergency: 'Emerhensya',
    safety: 'Kaligtasan',
    settings: 'Settings',
    
    // Flood Status
    floodStatus: 'Sitwasyon sa Baha',
    currentLevel: 'Karon nga Lebel',
    waterLevel: 'Lebel sa Tubig',
    lastUpdated: 'Katapusang Na-update',
    safe: 'LUWAS',
    caution: 'PAGBANTAY',
    danger: 'PELIGRO',
    critical: 'GRABENG PELIGRO',
    safeDesc: 'Normal ra ang lebel sa tubig. Walay peligro.',
    cautionDesc: 'Nagsaka ang lebel sa tubig. Magbantay.',
    dangerDesc: 'Taas ang lebel sa tubig. Pag-andam sa evacuation.',
    criticalDesc: 'EVACUAR DAYON! Grabeng peligro sa baha.',
    
    // Emergency Contacts
    emergencyContacts: 'Emergency Contacts',
    call: 'Tawag',
    
    // Safety Tips
    safetyTips: 'Mga Tip sa Kaligtasan',
    before: 'Sa Wala Pa',
    during: 'Sa Panahon',
    after: 'Human',
    preparedness: 'Pagpangandam sa Emerhensya',
    
    // Safety Tips Content
    tip1: 'Pag-andam ug emergency kit nga adunay tubig, pagkaon, flashlight, radio, ug first aid supplies.',
    tip2: 'Hibal-i ang imong evacuation routes ug duol nga evacuation centers.',
    tip3: 'Layoi ang tubig-baha. 6 ka pulgada lang makapahulog nimo.',
    tip4: 'Ayaw pagmaneho sa nabahaan nga dalan. Balik, ayaw lalom.',
    tip5: 'Susiha kung adunay nasamdan ug hatagi ug first aid kon kinahanglan.',
    tip6: 'Ayaw pagsulod sa mga building nga dunay standing water hangtod moingon ang mga awtoridad nga safe na.',
    
    // Emergency Kit Items
    water3days: 'Tubig (3 ka adlaw)',
    nonPerishableFood: 'Pagkaon nga dili madunot',
    flashlightBatteries: 'Flashlight ug batteries',
    firstAidKit: 'First aid kit',
    radio: 'Radio',
    importantDocs: 'Importante nga papel',
    
    // Settings
    profileInfo: 'Impormasyon sa Profile',
    fullName: 'Tibuok nga Ngalan',
    barangay: 'Barangay',
    language: 'Lengguwahe',
    notifications: 'Mga Pahibalo',
    receiveAlerts: 'Makadawat og mga alerto sa baha ug mga update',
    saveChanges: 'I-save ang mga Kausaban',
    saving: 'Nag-save...',
    systemStatus: 'Status sa Sistema',
    dataSource: 'Tinubdan sa Data',
    liveSensors: 'Live Sensors',
    esp32Ready: 'ESP32 Andam',
    realtime: 'Real-time',
    active: 'Aktibo',
    account: 'Account',
    email: 'Email',
    signOut: 'Sign Out',
    
    // Messages
    settingsSaved: 'Na-save na ang settings',
    profileUpdated: 'Na-update na ang imong profile.',
    error: 'Error',
    failedToSave: 'Dili ma-save ang settings. Sulayi pag-usab.',
    loading: 'Nag-load...',
    
    // Time
    justNow: 'Karon lang',
    minutesAgo: 'ka minuto ang milabay',
    hoursAgo: 'ka oras ang milabay',
    daysAgo: 'ka adlaw ang milabay',
    
    // Common
    welcome: 'Maayong pag-abot',
    remember: 'Hinumdumi',
    emergencyText: 'Kon dunay emergency nga makahulga sa kinabuhi, tawaga dayon ang 911. Ang imong kaligtasan mao ang pinakaimportante.',
    highPriority: 'TAAS NGA PRIORITY',
    mediumPriority: 'MEDIUM NGA PRIORITY',
    lowPriority: 'UBOS NGA PRIORITY',
    appTitle: 'Barangay Alerto sa Baha',
    appSubtitle: 'Real-time nga Sistema sa Pagmonitor sa Baha',
    noWater: 'Walay Tubig',
    callEmergency: 'TAWAG EMERHENSYA'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<'en' | 'ceb'>('en');

  useEffect(() => {
    const loadUserLanguage = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from('profiles')
          .select('language')
          .eq('user_id', user.id)
          .single();

        if (data?.language) {
          setLanguageState(data.language as 'en' | 'ceb');
        }
      } catch (error) {
        console.error('Error loading user language:', error);
      }
    };

    loadUserLanguage();
  }, []);

  const setLanguage = async (lang: 'en' | 'ceb') => {
    setLanguageState(lang);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('profiles')
        .update({ language: lang })
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{
      language,
      translations: translations[language],
      setLanguage
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};