import { useState, useEffect } from 'react';
import { User, Save, LogOut, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
interface Profile {
  id: string;
  user_id: string;
  name: string;
  barangay: string | null;
  language: string;
  notifications: boolean;
}
const UserSettings = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const {
    toast
  } = useToast();
  const {
    translations,
    setLanguage
  } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    barangay: '',
    language: 'en',
    notifications: true
  });
  useEffect(() => {
    const getProfile = async () => {
      try {
        const {
          data: {
            user
          }
        } = await supabase.auth.getUser();
        if (!user) return;
        setUser(user);
        const {
          data,
          error
        } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
          return;
        }
        if (data) {
          setProfile(data);
          setFormData({
            name: data.name || '',
            barangay: data.barangay || '',
            language: data.language || 'en',
            notifications: data.notifications ?? true
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, []);
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const {
        error
      } = await supabase.from('profiles').update({
        name: formData.name,
        barangay: formData.barangay,
        language: formData.language,
        notifications: formData.notifications
      }).eq('user_id', user.id);
      if (error) throw error;

      // Update language context
      setLanguage(formData.language as 'en' | 'ceb');
      toast({
        title: translations.settingsSaved,
        description: translations.profileUpdated
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: translations.error,
        description: translations.failedToSave,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-900/20 to-blue-900/20 flex items-center justify-center">
        <div className="text-white">{translations.loading}</div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-purple-900/20 to-blue-900/20">
      <div className="container mx-auto px-4 py-8 pb-24">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{translations.settings}</h1>
          <p className="text-white/80">Manage your profile and preferences</p>
        </div>

        {/* Profile Settings */}
        <div className="glass-float p-6 rounded-2xl mb-6">
          <div className="flex items-center mb-6">
            <User className="text-primary mr-3" size={24} />
            <h2 className="text-xl font-bold text-white">{translations.profileInfo}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                {translations.fullName}
              </label>
              <input type="text" value={formData.name} onChange={e => setFormData(prev => ({
              ...prev,
              name: e.target.value
            }))} className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-primary focus:outline-none" placeholder="Enter your full name" />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                {translations.barangay}
              </label>
              <input type="text" value={formData.barangay} onChange={e => setFormData(prev => ({
              ...prev,
              barangay: e.target.value
            }))} className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-primary focus:outline-none" placeholder="Enter your barangay" />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                {translations.language}
              </label>
              <select value={formData.language} onChange={e => setFormData(prev => ({
              ...prev,
              language: e.target.value
            }))} className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-primary focus:outline-none">
                <option value="en" className="bg-gray-800">English</option>
                <option value="ceb" className="bg-gray-800">Cebuano</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">
                  {translations.notifications}
                </label>
                <p className="text-white/50 text-xs">{translations.receiveAlerts}</p>
              </div>
              <input type="checkbox" checked={formData.notifications} onChange={e => setFormData(prev => ({
              ...prev,
              notifications: e.target.checked
            }))} className="w-5 h-5 text-primary bg-white/10 border-white/20 rounded focus:ring-primary" />
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center">
            <Save size={16} className="mr-2" />
            {saving ? translations.saving : translations.saveChanges}
          </button>
        </div>

        {/* System Status */}
        

        {/* Account Actions */}
        <div className="glass-float p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-4">{translations.account}</h2>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span className="text-white/70 text-sm sm:text-base">{translations.email}:</span>
              <span className="text-white text-sm sm:text-base break-all sm:text-right max-w-full overflow-hidden">{user?.email}</span>
            </div>
            <button onClick={handleSignOut} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center">
              <LogOut size={16} className="mr-2" />
              {translations.signOut}
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default UserSettings;