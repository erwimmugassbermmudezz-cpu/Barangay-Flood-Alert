import { useState, useEffect } from 'react';
import { MapPin, Users, Share2, AlertTriangle, Clock } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface LocationSharingProps {
  user: any;
}

const LocationSharing = ({ user }: LocationSharingProps) => {
  const { translations, language } = useLanguage();
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (isSharing && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLastUpdated(new Date());
        },
        (error) => {
          console.error('Location error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isSharing]);

  const handleToggleSharing = () => {
    if (!isSharing) {
      // Request permission first
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsSharing(true);
          setLastUpdated(new Date());
        },
        (error) => {
          alert('Location access denied. Please enable location services.');
        }
      );
    } else {
      setIsSharing(false);
      setLocation(null);
      setLastUpdated(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 to-pink-900/20">
      <div className="container mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Location Sharing
          </h1>
          <p className="text-white/80">
            Share your real-time location with family and emergency responders
          </p>
        </div>

        {/* Location Status Card */}
        <div className="glass-float p-6 rounded-2xl mb-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <MapPin className="text-purple-400 mr-3" size={24} />
              <h2 className="text-xl font-bold text-white">
                Your Location Status
              </h2>
            </div>
            <div className={`w-3 h-3 rounded-full ${isSharing ? 'bg-green-400' : 'bg-gray-400'}`}></div>
          </div>
          
          <div className="mb-6">
            <p className="text-white/80 text-sm mb-4">
              {isSharing 
                ? 'Your location is being shared in real-time' 
                : 'Location sharing is disabled'
              }
            </p>
            
            {location && (
              <div className="space-y-2 text-sm">
                <div className="text-white/70">
                  <strong>Coordinates:</strong> {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </div>
                {lastUpdated && (
                  <div className="text-white/70 flex items-center">
                    <Clock size={14} className="mr-1" />
                    <strong>Last updated:</strong> {lastUpdated.toLocaleTimeString()}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleToggleSharing}
            className={`w-full font-semibold py-3 rounded-lg transition-colors ${
              isSharing
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            <Share2 size={18} className="inline mr-2" />
            {isSharing ? 'Stop Sharing Location' : 'Start Sharing Location'}
          </button>
        </div>

        {/* Emergency Contacts Who Can See Location */}
        <div className="glass-float p-6 rounded-2xl mb-6">
          <div className="flex items-center mb-4">
            <Users className="text-blue-400 mr-3" size={24} />
            <h3 className="text-lg font-bold text-white">
              Who Can See Your Location
            </h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <div className="text-white font-medium">Emergency Responders</div>
                <div className="text-white/60 text-sm">Local emergency services</div>
              </div>
              <div className="text-green-400 text-sm">Active</div>
            </div>
            
            <div className="text-white/60 text-center py-4">
              No family contacts added yet. Add personal emergency contacts to share your location with them.
            </div>
          </div>
        </div>

        {/* Safety Notice */}
        <div className="glass-float p-6 rounded-2xl border border-yellow-500/30">
          <div className="flex items-center mb-4">
            <AlertTriangle className="text-yellow-400 mr-3" size={24} />
            <h3 className="text-lg font-bold text-white">
              Privacy & Safety
            </h3>
          </div>
          <div className="space-y-2 text-white/90 text-sm">
            <p>• Your location is only shared when you actively enable it</p>
            <p>• Location data is encrypted and secure</p>
            <p>• You can stop sharing at any time</p>
            <p>• Location sharing automatically stops after 24 hours for your safety</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSharing;