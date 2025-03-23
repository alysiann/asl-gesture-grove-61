
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Globe } from 'lucide-react';
import { toast } from "sonner";
import { SignLanguage, getActiveSignLanguage, setActiveSignLanguage } from '@/services/trainingService';

interface LanguageSelectorProps {
  onLanguageChange?: (language: SignLanguage) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
  const [language, setLanguage] = React.useState<SignLanguage>(getActiveSignLanguage());
  
  const handleLanguageChange = (value: string) => {
    const newLanguage = value as SignLanguage;
    setLanguage(newLanguage);
    setActiveSignLanguage(newLanguage);
    
    toast.success(`Switched to ${newLanguage === 'ASL' ? 'American' : 'Filipino'} Sign Language`, {
      description: `Recognition will now use ${newLanguage} training data`,
    });
    
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
  };
  
  return (
    <motion.div 
      className="flex items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-32 h-8 text-sm">
          <SelectValue placeholder="Sign Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ASL">ASL</SelectItem>
          <SelectItem value="FSL">Filipino SL</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
};

export default LanguageSelector;
