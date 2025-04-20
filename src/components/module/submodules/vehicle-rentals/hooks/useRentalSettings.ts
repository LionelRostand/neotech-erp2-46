
import { useState, useEffect } from 'react';
import { RentalSettings } from '../types/settings-types';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useFirestore } from '@/hooks/useFirestore';

const defaultSettings: RentalSettings = {
  companyName: '',
  currency: 'EUR',
  defaultRentalDuration: 7,
  minRentalDuration: 1,
  maxRentalDuration: 30,
  allowWeekendRentals: true,
  requireDeposit: true,
  depositAmount: 500,
  defaultPickupLocation: '',
  notifications: {
    emailNotifications: true,
    smsNotifications: false
  }
};

export const useRentalSettings = () => {
  const [settings, setSettings] = useState<RentalSettings>(defaultSettings);
  const { getDocument, updateDocument } = useFirestore(COLLECTIONS.TRANSPORT.SETTINGS);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const fetchedSettings = await getDocument('rental-settings');
        if (fetchedSettings) {
          setSettings({ ...defaultSettings, ...fetchedSettings });
        }
      } catch (error) {
        console.error('Error fetching rental settings', error);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<RentalSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      await updateDocument('rental-settings', updatedSettings);
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating rental settings', error);
    }
  };

  return { settings, updateSettings };
};
