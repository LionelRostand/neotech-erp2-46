
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import MonthlyTimeSheetForm from './MonthlyTimeSheetForm';

interface TimesheetFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const TimesheetForm: React.FC<TimesheetFormProps> = ({ onSubmit, onCancel }) => {
  return <MonthlyTimeSheetForm onSubmit={onSubmit} onCancel={onCancel} />;
};

export default TimesheetForm;
