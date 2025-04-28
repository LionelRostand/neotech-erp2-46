
import { Dialog, DialogContent } from "@/components/ui/dialog";
import TimesheetForm from "./TimesheetForm";
import { addTimeSheet } from "./services/timesheetService";
import { toast } from "sonner";

interface CreateTimesheetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CreateTimesheetDialog: React.FC<CreateTimesheetDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const handleSubmit = async (data: any) => {
    try {
      // Add the timesheet to Firestore
      const success = await addTimeSheet(data);
      
      if (success) {
        // Notify the parent component that submission was successful
        onSuccess();
        onOpenChange(false);
        toast.success("Feuille de temps créée avec succès");
      } else {
        toast.error("Erreur lors de la création de la feuille de temps");
      }
    } catch (error) {
      console.error("Erreur lors de la création de la feuille de temps:", error);
      toast.error("Erreur lors de la création de la feuille de temps");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <TimesheetForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTimesheetDialog;
