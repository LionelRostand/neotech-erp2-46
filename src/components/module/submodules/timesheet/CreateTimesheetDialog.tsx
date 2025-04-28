
import { Dialog, DialogContent } from "@/components/ui/dialog";
import TimesheetForm from "./TimesheetForm";

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
      // Implémenter la logique de soumission
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la création de la feuille de temps:", error);
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
