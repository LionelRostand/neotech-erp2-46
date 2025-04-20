
import { useState } from 'react';
import { SmtpConfig } from '@/types/smtp';
import { toast } from 'sonner';

export const useSmtpTest = () => {
  const [isTesting, setIsTesting] = useState(false);

  const testSmtpConfig = async (config: SmtpConfig) => {
    setIsTesting(true);
    try {
      const response = await fetch('/api/test-smtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du test SMTP');
      }

      toast.success('Configuration SMTP testée avec succès');
      return true;
    } catch (error) {
      console.error('Erreur test SMTP:', error);
      toast.error('Échec du test de la configuration SMTP');
      return false;
    } finally {
      setIsTesting(false);
    }
  };

  return {
    isTesting,
    testSmtpConfig
  };
};
