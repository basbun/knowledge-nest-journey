
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

interface CategoryHeaderProps {
  categoryId: string;
  categoryName: string;
  onAction: (categoryId: string, action: 'up' | 'down' | 'toggle') => void;
  onDelete: (categoryId: string) => void;
}

const CategoryHeader = ({ categoryId, categoryName, onAction, onDelete }: CategoryHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <h3 className="text-xl font-semibold text-hub-text">{categoryName}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction(categoryId, 'up')}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction(categoryId, 'down')}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Switch
            checked={true}
            onCheckedChange={() => onAction(categoryId, 'toggle')}
          />
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(categoryId)}
        className="text-red-500 hover:text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CategoryHeader;
