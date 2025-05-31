/*
|-----------------------------------------
| setting up ViewCurrentInterface for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: code-generator, May, 2025
|-----------------------------------------
*/

import { useState } from 'react';

import { useInterfaceStore } from '@/lib/store/mainStore';
import GenerateCode from '../generate-code/main';

const ViewCurrentInterface = () => {
  const [isContentVisible, setIsContentVisible] = useState(true);
  const { currentInterface } = useInterfaceStore();

  return (
    <main>
      {currentInterface && (
        <div className="mt-2 rounded-md">
          <div className="w-full flex items-center justify-between">
            <button onClick={() => setIsContentVisible(!isContentVisible)} className="w-full cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isContentVisible ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <h3 className="text-sm font-semibold">
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
            <div className="flex items-center justify-end gap-2">
              <GenerateCode currentInterface={currentInterface} />
            </div>
          </div>

          {isContentVisible && (
            <div className="mt-3">
              <pre className="text-sm whitespace-pre-wrap p-3 rounded border">{currentInterface.content.trim()}</pre>
            </div>
          )}
        </div>
      )}
    </main>
  );
};
export default ViewCurrentInterface;
