/*
|-----------------------------------------
| setting up ViewInterface for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: code-generator, May, 2025
|-----------------------------------------
*/

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { SavedInterface, useInterfaceStore } from '@/lib/store/mainStore';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const ViewInterface = ({ currentValue, idx }: { currentValue?: SavedInterface; idx?: number }) => {
  const [isContentVisible, setIsContentVisible] = useState(true);
  const { setCurrentInterface, savedInterfaces, updateInterface } = useInterfaceStore();
  const handleRemove = (item: string) => {
    const othersData = savedInterfaces.filter(i => i.id !== item);
    updateInterface(othersData);
  };
  return (
    <main>
      {currentValue && (
        <div className="mt-2 p-4 bg-gray-800 rounded-md">
          <div className="w-full flex items-center justify-between">
            <button onClick={() => setIsContentVisible(!isContentVisible)} className="w-full cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <svg
                  className={`w-4 h-4 text-gray-300 transition-transform duration-200 ${isContentVisible ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <h3 className="text-sm font-semibold text-gray-100">
                  {currentValue ? `${idx}. Interfaces` : ' Current Interface:'} - {currentValue.title} -{' '}
                  {new Date(currentValue.timestamp).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </h3>
              </div>
            </button>
            <div className="w-full flex items-center justify-end gap-4">
              {currentValue && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="min-w-[80px] bg-green-600 cursor-pointer hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                  onClick={() => setCurrentInterface(currentValue)}
                >
                  Use
                </Button>
              )}
              <Dialog>
                <DialogTrigger className="bg-rose-500 hover:bg-rose-600 cursor-pointer p-2 rounded py-1 text-sm">Delete</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-slate-50">Are you absolutely sure?</DialogTitle>
                    <DialogDescription>You want to delete this interface.</DialogDescription>
                    <Button variant="destructive" size="sm" className="cursor-pointer" onClick={() => handleRemove(currentValue.id)}>
                      Delete
                    </Button>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {isContentVisible && (
            <div className="mt-3">
              <pre className="text-sm text-gray-100 whitespace-pre-wrap bg-gray-700 p-3 rounded border">{currentValue.content.trim()}</pre>
            </div>
          )}
        </div>
      )}
    </main>
  );
};
export default ViewInterface;
