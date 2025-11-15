import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MobileBackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="md:hidden fixed top-4 left-4 z-50 glass-float rounded-full p-2 hover:scale-110 transition-transform duration-200"
      aria-label="Go back"
    >
      <ChevronLeft size={24} className="text-primary" />
    </button>
  );
};

export default MobileBackButton;
