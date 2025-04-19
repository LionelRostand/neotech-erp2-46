
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Consultation } from './types/health-types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ConsultationDetailsFormProps {
  consultation: Consultation;
  onSubmit: (data: Partial<Consultation>) => void;
  onCancel: () => void;
  isReadOnly?: boolean;
}

const formSchema = z.object({
  chiefComplaint: z.string().optional(),
  symptoms: z.string().optional(),
  physicalExam: z.string().optional(),
  assessment: z.string().optional(),
  plan: z.string().optional(),
  medicalHistory: z.string().optional(),
  notes: z.string().optional(),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  vitalSigns: z.object({
    temperature: z.string().optional(),
    heartRate: z.string().optional(),
    respiratoryRate: z.string().optional(),
    oxygenSaturation: z.string().optional(),
    bloodPressure: z.string().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    pain: z.string().optional(),
  }).optional(),
  followUp: z.string().optional(),
});

export const ConsultationDetailsForm: React.FC<ConsultationDetailsFormProps> = ({
  consultation,
  onSubmit,
  onCancel,
  isReadOnly = false,
}) => {
  const [activeTab, setActiveTab] = useState('subjective');
  
  // Convert symptoms array to string for the form if it exists
  const symptomsString = consultation.symptoms ? consultation.symptoms.join(', ') : '';
  
  // Initialize form with consultation data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chiefComplaint: consultation.chiefComplaint || '',
      symptoms: symptomsString,
      physicalExam: consultation.physicalExam || '',
      assessment: consultation.assessment || '',
      plan: consultation.plan || '',
      medicalHistory: consultation.medicalHistory || '',
      notes: consultation.notes || '',
      diagnosis: consultation.diagnosis || '',
      treatment: consultation.treatment || '',
      vitalSigns: {
        temperature: consultation.vitalSigns?.temperature?.toString() || '',
        bloodPressure: consultation.vitalSigns?.bloodPressure || '',
        heartRate: consultation.vitalSigns?.heartRate?.toString() || '',
        respiratoryRate: consultation.vitalSigns?.respiratoryRate?.toString() || '',
        oxygenSaturation: consultation.vitalSigns?.oxygenSaturation?.toString() || '',
        height: consultation.vitalSigns?.height?.toString() || '',
        weight: consultation.vitalSigns?.weight?.toString() || '',
        pain: consultation.vitalSigns?.pain?.toString() || '',
      },
      followUp: consultation.followUp || '',
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    // Convert form data back to consultation format
    const updatedConsultation: Partial<Consultation> = {
      ...data,
      // Convert string symptoms back to array if provided
      symptoms: data.symptoms ? data.symptoms.split(',').map(s => s.trim()) : undefined,
      // Convert string vital signs to numbers
      vitalSigns: {
        temperature: data.vitalSigns?.temperature ? parseFloat(data.vitalSigns.temperature) : undefined,
        bloodPressure: data.vitalSigns?.bloodPressure,
        heartRate: data.vitalSigns?.heartRate ? parseFloat(data.vitalSigns.heartRate) : undefined,
        respiratoryRate: data.vitalSigns?.respiratoryRate ? parseFloat(data.vitalSigns.respiratoryRate) : undefined,
        oxygenSaturation: data.vitalSigns?.oxygenSaturation ? parseFloat(data.vitalSigns.oxygenSaturation) : undefined,
        height: data.vitalSigns?.height ? parseFloat(data.vitalSigns.height) : undefined,
        weight: data.vitalSigns?.weight ? parseFloat(data.vitalSigns.weight) : undefined,
        pain: data.vitalSigns?.pain ? parseFloat(data.vitalSigns.pain) : undefined,
      }
    };
    
    onSubmit(updatedConsultation);
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="subjective">Subjective</TabsTrigger>
              <TabsTrigger value="objective">Objective</TabsTrigger>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="plan">Plan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="subjective" className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="chiefComplaint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chief Complaint</FormLabel>
                    <FormControl>
                      <Textarea disabled={isReadOnly} placeholder="Patient's main complaint" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symptoms</FormLabel>
                    <FormControl>
                      <Textarea 
                        disabled={isReadOnly} 
                        placeholder="List of symptoms, comma separated" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="medicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical History</FormLabel>
                    <FormControl>
                      <Textarea 
                        disabled={isReadOnly} 
                        placeholder="Relevant medical history" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            
            <TabsContent value="objective" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="vitalSigns.temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperature (°C)</FormLabel>
                      <FormControl>
                        <Input disabled={isReadOnly} type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="vitalSigns.bloodPressure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Pressure (mmHg)</FormLabel>
                      <FormControl>
                        <Input disabled={isReadOnly} placeholder="e.g., 120/80" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="vitalSigns.heartRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heart Rate (bpm)</FormLabel>
                      <FormControl>
                        <Input disabled={isReadOnly} type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="vitalSigns.respiratoryRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Respiratory Rate</FormLabel>
                      <FormControl>
                        <Input disabled={isReadOnly} type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="vitalSigns.oxygenSaturation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Oxygen Saturation (%)</FormLabel>
                      <FormControl>
                        <Input disabled={isReadOnly} type="number" max="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="vitalSigns.height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input disabled={isReadOnly} type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="vitalSigns.weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input disabled={isReadOnly} type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="vitalSigns.pain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pain (0-10)</FormLabel>
                      <FormControl>
                        <Input disabled={isReadOnly} type="number" min="0" max="10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="physicalExam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Physical Examination</FormLabel>
                    <FormControl>
                      <Textarea 
                        disabled={isReadOnly} 
                        placeholder="Physical examination findings" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            
            <TabsContent value="assessment" className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="assessment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assessment</FormLabel>
                    <FormControl>
                      <Textarea 
                        disabled={isReadOnly} 
                        placeholder="Clinical assessment" 
                        className="min-h-[150px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagnosis</FormLabel>
                    <FormControl>
                      <Textarea 
                        disabled={isReadOnly} 
                        placeholder="Clinical diagnosis" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            
            <TabsContent value="plan" className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treatment Plan</FormLabel>
                    <FormControl>
                      <Textarea 
                        disabled={isReadOnly} 
                        placeholder="Treatment plan details" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="treatment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treatment</FormLabel>
                    <FormControl>
                      <Textarea 
                        disabled={isReadOnly} 
                        placeholder="Prescribed treatment" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="followUp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Follow-up</FormLabel>
                    <FormControl>
                      <Input 
                        disabled={isReadOnly} 
                        placeholder="e.g., 2 weeks" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        disabled={isReadOnly} 
                        placeholder="Additional notes" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>

          {!isReadOnly && (
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          )}
        </form>
      </Form>
    </Card>
  );
};
