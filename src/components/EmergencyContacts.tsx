import { Phone, MapPin, Clock, Plus, Heart } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

interface Contact {
  id: string;
  name: string;
  position: string;
  phone: string;
  serviceType: string;
  priority: number;
  available: boolean;
}

interface EmergencyContactsProps {
  user?: any;
}

const EmergencyContacts = ({ user }: EmergencyContactsProps) => {
  const { translations, language } = useLanguage();
  const navigate = useNavigate();
  const contacts: Contact[] = [
    {
      id: '1',
      name: 'MDRRMO / OPCEN',
      position: 'Disaster Response Center',
      phone: '+63 916 462 6879',
      serviceType: 'Emergency Response',
      priority: 1,
      available: true
    },
    {
      id: '2', 
      name: 'MHO / SBF',
      position: 'Municipal Health Office',
      phone: '+63 910 099 0174',
      serviceType: 'Health Services',
      priority: 2,
      available: true
    },
    {
      id: '3',
      name: 'Bureau of Fire Protection Dujali',
      position: 'Fire & Rescue',
      phone: '+63 985 815 2833',
      serviceType: 'Fire & Rescue',
      priority: 2,
      available: true
    },
    {
      id: '4',
      name: 'Philippine National Police Dujali',
      position: 'Police Assistance',
      phone: '+63 929 211 3243',
      serviceType: 'Law Enforcement',
      priority: 2,
      available: true
    },
    {
      id: '5',
      name: 'Davao Light',
      position: 'Power & Electrical Emergency',
      phone: '+63 919 056 3572',
      serviceType: 'Utility Services',
      priority: 3,
      available: true
    }
  ];

  const handleCall = (phone: string, name: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = `tel:${phone}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900/20 to-orange-900/20">
      <div className="container mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 break-words px-2">
            {translations.emergencyContacts}
          </h1>
          <p className="text-white/80 text-sm sm:text-base break-words px-2">
            {language === 'en' ? 'Important Emergency Numbers' : 'Mga Importante nga Emergency Numbers'}
          </p>
        </div>

        {/* Emergency Banner */}
        <div className="glass-float p-4 sm:p-6 rounded-2xl mb-6 border-l-4 border-red-500">
          <div className="flex items-center mb-3">
            <Phone className="text-red-400 mr-2 sm:mr-3 flex-shrink-0" size={20} />
            <h2 className="text-lg sm:text-xl font-bold text-white break-words">
              Emergency Hotline: 911
            </h2>
          </div>
          <p className="text-white/90 text-xs sm:text-sm mb-4 break-words">
            For immediate life-threatening emergencies, call 911 first.
          </p>
          <button 
            onClick={() => handleCall('911', 'Emergency Hotline')}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors text-sm sm:text-base"
          >
            CALL 911 NOW
          </button>
        </div>

        {/* Personal Emergency Contacts Section */}
        {user ? (
          <div className="glass-float p-4 sm:p-6 rounded-2xl mb-6 border-l-4 border-green-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center min-w-0 flex-1">
                <Heart className="text-green-400 mr-2 sm:mr-3 flex-shrink-0" size={20} />
                <h2 className="text-base sm:text-xl font-bold text-white break-words">
                  Your Personal Contacts
                </h2>
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center text-xs sm:text-sm flex-shrink-0">
                <Plus size={14} className="mr-1" />
                Add Contact
              </button>
            </div>
            <p className="text-white/80 text-xs sm:text-sm mb-4 break-words">
              Quick access to your personal emergency contacts.
            </p>
            <div className="text-white/60 text-center py-4 text-xs sm:text-sm break-words">
              No personal contacts added yet. Click "Add Contact" to get started.
            </div>
          </div>
        ) : (
          <div className="glass-float p-4 sm:p-6 rounded-2xl mb-6 border-l-4 border-blue-500">
            <div className="flex items-center mb-4">
              <Heart className="text-blue-400 mr-2 sm:mr-3 flex-shrink-0" size={20} />
              <h2 className="text-base sm:text-xl font-bold text-white break-words">
                Personal Emergency Contacts
              </h2>
            </div>
            <p className="text-white/80 text-xs sm:text-sm mb-4 break-words">
              Save your family and friends' contacts for quick access during emergencies.
            </p>
            <button 
              onClick={() => navigate('/auth')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors text-xs sm:text-base break-words"
            >
              Sign In to Save Personal Contacts
            </button>
          </div>
        )}

        {/* Public Emergency Contacts */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 text-center break-words px-2">
            Public Emergency Services
          </h2>
        </div>

        {/* Contact List */}
        <div className="space-y-4">
          {contacts
            .sort((a, b) => a.priority - b.priority)
            .map((contact) => (
              <div key={contact.id} className="glass-float p-4 sm:p-6 rounded-2xl">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1 break-words">
                      {contact.name}
                    </h3>
                    <p className="text-white/70 text-xs sm:text-sm mb-2 break-words">
                      {contact.position}
                    </p>
                    <div className="flex items-center text-white/60 text-xs mb-2">
                      <MapPin size={12} className="mr-1 flex-shrink-0" />
                      <span className="break-words">{contact.serviceType}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      contact.available ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <span className="text-xs text-white/60 whitespace-nowrap">
                      {contact.available ? 
                        (language === 'en' ? 'Available' : 'Available') : 
                        (language === 'en' ? 'Busy' : 'Busy')
                      }
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="text-white/80 font-mono text-xs sm:text-sm break-all">
                    {contact.phone}
                  </div>
                  
                  <button
                    onClick={() => handleCall(contact.phone, contact.name)}
                    disabled={!contact.available}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all text-xs sm:text-sm flex-shrink-0 ${
                      contact.available
                        ? 'bg-green-600 hover:bg-green-700 text-white hover:glow'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Phone size={14} className="inline mr-1" />
                    {translations.call}
                  </button>
                </div>

                {contact.priority === 1 && (
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <div className="flex items-center text-yellow-400 text-xs">
                      <Clock size={12} className="mr-1" />
                      {language === 'en' ? 
                        'Primary emergency contact - Available 24/7' : 
                        'Panguna nga emergency contact - Available 24/7'
                      }
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default EmergencyContacts;