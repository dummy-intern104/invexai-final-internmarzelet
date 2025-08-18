
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useAppStore from "@/store/appStore";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddCategoryDialog = ({
  open,
  onOpenChange,
}: AddCategoryDialogProps) => {
  const [categoryName, setCategoryName] = useState("");
  const categories = useAppStore((state) => state.categories || []);
  const setCategories = useAppStore((state) => state.setCategories);

  const handleSubmit = () => {
    // Validate form data
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    // Check if category already exists
    if (categories.some(cat => cat.toLowerCase() === categoryName.toLowerCase())) {
      toast.error("This category already exists");
      return;
    }

    // Add the new category
    setCategories([...categories, categoryName]);
    toast.success("Category added successfully");
    
    // Reset form
    setCategoryName("");
    
    // Close dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Enter the name for the new product category.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category_name">Category Name</Label>
            <Input
              id="category_name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add Category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
