
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface CategoryFieldProps {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
  onAddCategory: () => void;
}

export const CategoryField = ({ categories, value, onChange, onAddCategory }: CategoryFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">Category</Label>
      <div className="flex gap-2">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          type="button" 
          size="icon" 
          variant="outline" 
          onClick={onAddCategory}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
