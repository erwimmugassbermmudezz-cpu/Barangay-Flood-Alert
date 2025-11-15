import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const About = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen w-full container-gradient p-8 pt-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="glass-float"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="space-y-12 text-center glass-float p-8 md:p-12 rounded-3xl shadow-2xl border border-white/10">
        {/* Title */}
        <div className="space-y-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold gradient-text leading-tight">
            Barangay Flood Alert System
          </h1>
          
          <p className="font-serif text-2xl md:text-3xl text-white/90 italic">
            A Science Investigatory Project
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

        {/* Presented to */}
        <div className="space-y-4">
          <p className="font-serif text-xl text-white/70">
            Presented to
          </p>
          <p className="font-serif text-xl font-semibold text-white">
            Clem Bryan T. Paclibar, LPT
          </p>
          <p className="font-serif text-lg text-white/80">
            Santo Tomas College of Agriculture, Sciences and Technology
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

        {/* Requirements */}
        <div className="space-y-4">
          <p className="font-serif text-xl text-white/70">
            In Partial Fulfillment
          </p>
          <p className="font-serif text-xl text-white/70">
            of the Requirements for the Course
          </p>
          <p className="font-serif text-xl font-semibold text-white">
            Science, Technology, and Society
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

        {/* Authors */}
        <div className="space-y-4">
          <p className="font-serif text-xl text-white/70 mb-6">
            Presented by:
          </p>
          <div className="space-y-2">
            <p className="font-serif text-lg text-white/90">Erwin M. Bermudez</p>
            <p className="font-serif text-lg text-white/90">Rico L. Tacogue</p>
            <p className="font-serif text-lg text-white/90">Mark Jade E. Lucero</p>
            <p className="font-serif text-lg text-white/90">Mark Niel E. Lucero</p>
            <p className="font-serif text-lg text-white/90">Rhodel Rey D. Calibayan</p>
            <p className="font-serif text-lg text-white/90">Francis Mike M. Gemone</p>
            <p className="font-serif text-lg text-white/90">Rollie Penario Andresio Jr.</p>
            <p className="font-serif text-lg text-white/90">Reymon B. Cordero</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

        {/* Date */}
        <div className="pt-8">
          <p className="font-serif text-2xl text-white glow">
            November 2025
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default About;
