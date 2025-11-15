import { User, LogIn, Shield, Heart, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginPromptProps {
  feature: string;
}

const LoginPrompt = ({ feature }: LoginPromptProps) => {
  const navigate = useNavigate();

  const getFeatureInfo = (feature: string) => {
    switch (feature) {
      case 'settings':
        return {
          icon: <User className="h-12 w-12 text-primary mb-4" />,
          title: 'Personal Settings',
          description: 'Access your profile, notification preferences, and account settings.',
          benefits: ['Save your location preferences', 'Customize notification settings', 'Manage your profile']
        };
      case 'personal-contacts':
        return {
          icon: <Heart className="h-12 w-12 text-primary mb-4" />,
          title: 'Personal Emergency Contacts',
          description: 'Store and manage your personal emergency contacts for quick access.',
          benefits: ['Save family and friend contacts', 'Quick dial in emergencies', 'Share your emergency plan']
        };
      case 'emergency-plan':
        return {
          icon: <Shield className="h-12 w-12 text-primary mb-4" />,
          title: 'Personal Emergency Plan',
          description: 'Create and save your personalized emergency action plan.',
          benefits: ['Customize evacuation routes', 'Set family meeting points', 'Store important documents']
        };
      case 'location-sharing':
        return {
          icon: <MapPin className="h-12 w-12 text-primary mb-4" />,
          title: 'Location Sharing',
          description: 'Share your real-time location with family and emergency responders.',
          benefits: ['Real-time location updates', 'Emergency location alerts', 'Family safety tracking']
        };
      default:
        return {
          icon: <LogIn className="h-12 w-12 text-primary mb-4" />,
          title: 'Advanced Features',
          description: 'Sign in to access advanced flood monitoring features.',
          benefits: ['Personalized alerts', 'Save your preferences', 'Advanced monitoring tools']
        };
    }
  };

  const featureInfo = getFeatureInfo(feature);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center p-4">
      <div className="glass-float p-8 rounded-2xl w-full max-w-md text-center">
        {featureInfo.icon}
        
        <h2 className="text-2xl font-bold text-white mb-3">
          {featureInfo.title}
        </h2>
        
        <p className="text-white/80 mb-6">
          {featureInfo.description}
        </p>

        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">Benefits:</h3>
          <ul className="text-white/70 text-sm space-y-2">
            {featureInfo.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/auth')}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
          >
            <LogIn size={18} className="mr-2" />
            Sign In / Register
          </button>
          
          <p className="text-white/60 text-sm">
            Basic flood alerts and safety information remain accessible without an account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;