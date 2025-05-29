import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './dialog';

/*
|-----------------------------------------
| setting up ConfirmDeleteNextComponent for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: code-generator, May, 2025
|-----------------------------------------
*/
const ConfirmDeleteNextComponent = ({ onClickFunction }: { onClickFunction: () => void }) => {
  return (
    <div className="w-full flex items-center justify-end gap-4">
      <Dialog>
        <DialogTrigger size="sm">Delete</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-slate-50">Are you absolutely sure?</DialogTitle>
            <DialogDescription>You want to delete this interface.</DialogDescription>
            <Button variant="outlineFire" size="sm" className="cursor-pointer" onClick={() => onClickFunction()}>
              Delete
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default ConfirmDeleteNextComponent;
