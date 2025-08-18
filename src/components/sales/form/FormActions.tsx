
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitText?: string;
}

const FormActions = ({ onCancel, onSubmit, isSubmitting, submitText }: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <Button 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Recording Sale..." : (submitText || "Record Sale")}
      </Button>
    </div>
  );
};

export default FormActions;
