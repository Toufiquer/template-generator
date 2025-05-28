/*
|-----------------------------------------
| setting up CurrentInterface for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: code-generator, May, 2025
|-----------------------------------------
*/

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useInterfaceStore } from '@/lib/store/mainStore';

const CurrentInterface = () => {
  const { currentInterface, savedInterfaces, setCurrentInterface } = useInterfaceStore();
  const [isContentVisible, setIsContentVisible] = useState(true);
  useEffect(() => {
    if (!currentInterface?.content && savedInterfaces.length > 0) {
      setCurrentInterface(savedInterfaces[0]);
    }
  }, []);
  return (
    <main>
      {currentInterface && (
        <div className="mt-6 p-4 bg-gray-800 rounded-md">
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
                <h3 className="text-lg font-semibold text-gray-100">
                  Current Interface: - {currentInterface.title} -{' '}
                  {new Date(currentInterface.timestamp).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </h3>
              </div>
            </button>
            <Button variant="destructive" size="sm" className="cursor-pointer" onClick={() => setCurrentInterface(null)}>
              Delete
            </Button>
          </div>

          {isContentVisible && (
            <div className="mt-3">
              <pre className="text-sm text-gray-100 whitespace-pre-wrap bg-gray-700 p-3 rounded border">{currentInterface.content.trim()}</pre>
            </div>
          )}
        </div>
      )}
    </main>
  );
};
export default CurrentInterface;
