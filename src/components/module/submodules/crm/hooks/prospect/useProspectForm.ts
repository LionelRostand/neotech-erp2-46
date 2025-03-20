
import { ProspectFormData } from '../../types/crm-types';

export const useProspectForm = (
  setFormData: React.Dispatch<React.SetStateAction<ProspectFormData>>
) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      status: 'warm',
      source: 'Site web',
      lastContact: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  return {
    handleInputChange,
    handleSelectChange,
    resetForm
  };
};
