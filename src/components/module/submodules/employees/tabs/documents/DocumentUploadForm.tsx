
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { saveEmployeeDocument } from '../../services/documentService';
import { toast } from 'sonner';

interface DocumentUploadFormProps {
  employeeId: string;
  onUploadComplete?: () => void;
}

interface FormValues {
  file: FileList;
  type: string;
}

const documentTypes = [
  "Contrat de travail",
  "Avenant",
  "Fiche de paie",
  "Certificat de travail",
  "Diplôme",
  "Attestation",
  "Note de frais",
  "CV",
  "Autre"
];

export const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({ 
  employeeId,
  onUploadComplete 
}) => {
  const form = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      const file = data.file[0];
      if (!file) {
        toast.error("Veuillez sélectionner un fichier");
        return;
      }

      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        
        // Create document object
        const document = {
          id: `doc_${Date.now()}`,
          name: file.name,
          type: data.type,
          date: new Date().toISOString(),
          fileType: file.type,
          fileSize: file.size,
          fileData: base64Data
        };

        await saveEmployeeDocument(employeeId, document);
        toast.success("Document ajouté avec succès");
        form.reset();
        if (onUploadComplete) {
          onUploadComplete();
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Erreur lors de l'ajout du document:", error);
      toast.error("Erreur lors de l'ajout du document");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de document</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Fichier</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => onChange(e.target.files)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Ajouter le document</Button>
      </form>
    </Form>
  );
};
