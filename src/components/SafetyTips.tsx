import { useState } from 'react';
import { AlertTriangle, Home, Users, Droplets, MapPin, CheckCircle, Shield, Plus } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

interface SafetyTip {
  id: string;
  category: string;
  icon: React.ElementType;
  englishText: string;
  cebuanoText: string;
  priority: 'high' | 'medium' | 'low';
}

interface SafetyTipsProps {
  user?: any;
}

const SafetyTips = ({ user }: SafetyTipsProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('before');
  const { translations, language } = useLanguage();
  const navigate = useNavigate();

  const safetyTips: SafetyTip[] = [
    {
      id: '1',
      category: 'before',
      icon: Home,
      englishText: translations.tip1,
      cebuanoText: translations.tip1,
      priority: 'high'
    },
    {
      id: '2',
      category: 'before',
      icon: MapPin,
      englishText: translations.tip2,
      cebuanoText: translations.tip2,
      priority: 'high'
    },
    {
      id: '3',
      category: 'during',
      icon: AlertTriangle,
      englishText: translations.tip3,
      cebuanoText: translations.tip3,
      priority: 'high'
    },
    {
      id: '4',
      category: 'during',
      icon: Droplets,
      englishText: translations.tip4,
      cebuanoText: translations.tip4,
      priority: 'high'
    },
    {
      id: '5',
      category: 'after',
      icon: CheckCircle,
      englishText: translations.tip5,
      cebuanoText: translations.tip5,
      priority: 'high'
    },
    {
      id: '6',
      category: 'after',
      icon: Home,
      englishText: translations.tip6,
      cebuanoText: translations.tip6,
      priority: 'medium'
    }
  ];

  const categories = [
    { id: 'before', label: translations.before, color: 'text-blue-400' },
    { id: 'during', label: translations.during, color: 'text-orange-400' },
    { id: 'after', label: translations.after, color: 'text-green-400' }
  ];

  const filteredTips = safetyTips.filter(tip => tip.category === selectedCategory);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-yellow-500';
      case 'low': return 'border-green-500';
      default: return 'border-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900/20 to-purple-900/20">
      <div className="container mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 break-words px-2">
            {translations.safetyTips}
          </h1>
          <p className="text-white/80 text-sm sm:text-base break-words px-2">
            {language === 'en' ? 'Emergency Safety Guidelines' : 'Mga Giya sa Kaligtasan'}
          </p>
        </div>

        {/* Personal Emergency Plan Section */}
        {user ? (
          <div className="mb-8 glass-float p-4 sm:p-6 rounded-2xl border-l-4 border-purple-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center min-w-0 flex-1">
                <Shield className="text-purple-400 mr-2 sm:mr-3 flex-shrink-0" size={20} />
                <h2 className="text-base sm:text-xl font-bold text-white break-words">
                  Your Emergency Plan
                </h2>
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg flex items-center text-xs sm:text-sm flex-shrink-0">
                <Plus size={14} className="mr-1" />
                Create Plan
              </button>
            </div>
            <p className="text-white/80 text-xs sm:text-sm mb-4 break-words">
              Create and save your personalized emergency action plan.
            </p>
            <div className="text-white/60 text-center py-4 text-xs sm:text-sm break-words">
              No emergency plan created yet. Click "Create Plan" to get started.
            </div>
          </div>
        ) : (
          <div className="mb-8 glass-float p-4 sm:p-6 rounded-2xl border-l-4 border-blue-500">
            <div className="flex items-center mb-4">
              <Shield className="text-blue-400 mr-2 sm:mr-3 flex-shrink-0" size={20} />
              <h2 className="text-base sm:text-xl font-bold text-white break-words">
                Personal Emergency Plan
              </h2>
            </div>
            <p className="text-white/80 text-xs sm:text-sm mb-4 break-words">
              Create a customized emergency plan with evacuation routes, meeting points, and important documents.
            </p>
            <button 
              onClick={() => navigate('/auth')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors text-xs sm:text-base break-words"
            >
              Sign In to Create Your Emergency Plan
            </button>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex justify-center mb-8 px-2">
          <div className="glass-float p-1 rounded-xl flex flex-wrap justify-center gap-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all text-xs sm:text-sm ${
                  selectedCategory === category.id
                    ? `bg-primary/20 ${category.color} glow font-semibold`
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <div className="font-medium whitespace-nowrap">
                  {category.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Safety Tips List */}
        <div className="space-y-4">
          {filteredTips
            .sort((a, b) => {
              const priorityOrder = { high: 0, medium: 1, low: 2 };
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            })
            .map((tip, index) => {
              const Icon = tip.icon;
              return (
                <div 
                  key={tip.id} 
                  className={`glass-float p-4 sm:p-6 rounded-2xl border-l-4 ${getPriorityColor(tip.priority)} animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Icon className="text-primary" size={20} />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                          tip.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          tip.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {tip.priority === 'high' ? translations.highPriority :
                           tip.priority === 'medium' ? translations.mediumPriority :
                           translations.lowPriority}
                        </span>
                      </div>
                      
                      <p className="text-white text-sm sm:text-base leading-relaxed break-words">
                        {language === 'en' ? tip.englishText : tip.cebuanoText}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Emergency Reminder */}
        <div className="mt-8 glass-float p-4 sm:p-6 rounded-2xl border border-red-500/30">
          <div className="flex items-center mb-4">
            <AlertTriangle className="text-red-400 mr-2 sm:mr-3 flex-shrink-0" size={20} />
            <h3 className="text-base sm:text-lg font-bold text-white break-words">
              {translations.remember}
            </h3>
          </div>
          <p className="text-white/90 mb-4 text-sm sm:text-base break-words">
            {translations.emergencyText}
          </p>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors text-xs sm:text-base break-words">
            {translations.emergencyContacts.toUpperCase()}
          </button>
        </div>

        {/* Preparedness Checklist */}
        <div className="mt-8">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 text-center break-words px-2">
            {translations.preparedness}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { en: translations.water3days, ceb: translations.water3days },
              { en: translations.nonPerishableFood, ceb: translations.nonPerishableFood },
              { en: translations.flashlightBatteries, ceb: translations.flashlightBatteries },
              { en: translations.firstAidKit, ceb: translations.firstAidKit },
              { en: translations.radio, ceb: translations.radio },
              { en: translations.importantDocs, ceb: translations.importantDocs }
            ].map((item, index) => (
              <div key={index} className="glass p-3 rounded-lg flex items-center space-x-2">
                <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                <span className="text-white text-xs sm:text-sm break-words">
                  {language === 'en' ? item.en : item.ceb}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyTips;