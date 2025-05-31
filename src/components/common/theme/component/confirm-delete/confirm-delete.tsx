/*
|-----------------------------------------
| setting up ConfirmDeleteNextComponent for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: code-generator, May, 2025
|-----------------------------------------
*/

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, interFateConfirmDeleteVariant } from './dialog';

const ConfirmDeleteNextComponent = ({
  onClickFunction,
  variant,
  title,
  confirmTitle,
  className,
}: {
  className?: string | null;
  confirmTitle?: string | null;
  title?: string | null;
  variant?: interFateConfirmDeleteVariant['variant'];
  onClickFunction: () => void;
}) => {
  return (
    <div className="w-full flex items-center justify-end gap-4">
      <Dialog>
        <DialogTrigger className={className || ''} size="sm" variant={variant || 'outlineFire'}>
          {title || 'Delete'}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-slate-50">Are you absolutely sure?</DialogTitle>
            <DialogDescription>You want to delete this interface.</DialogDescription>
            <Button variant={variant || 'outlineFire'} size="sm" className="cursor-pointer" onClick={onClickFunction}>
              {confirmTitle || 'Delete'}
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default ConfirmDeleteNextComponent;
