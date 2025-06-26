/*
|-----------------------------------------
| setting up ViewInterface for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: code-generator, May, 2025
|-----------------------------------------
*/

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { IJsonData, SavedInterface, useInterfaceStore } from '@/lib/store/mainStore';
import ConfirmDeleteNextComponent from '../../design/theme/component/confirm-delete/confirm-delete';

const ViewInterface = ({ currentValue, idx }: { currentValue?: SavedInterface; idx?: number }) => {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const { setCurrentInterface, savedInterfaces, updateInterface } = useInterfaceStore();
  const handleRemove = (item: string) => {
    const othersData = savedInterfaces.filter(i => i.id !== item);
    updateInterface(othersData);
  };
  const handleClick = () => {
    if (currentValue?.id) {
      handleRemove(currentValue.id);
    }
  };

  console.log('currentValue : ', currentValue);
  let currentJsonValue: IJsonData | null = null;
  if (currentValue?.content) {
    try {
      currentJsonValue = JSON.parse(currentValue.content as string) as IJsonData;
    } catch (e) {
      console.error('Failed to parse content:', e);
      currentJsonValue = null;
    }
  }
  console.log('currentJsonValue : ', currentJsonValue?.baseinfo?.title);
  const getTitleValue = (currentJsonValue?.baseinfo?.title as string) || '';
  return (
    <main>
      {currentValue && (
        <div className="p-2 rounded-md">
          <div className="w-full flex items-center justify-between">
            <button onClick={() => setIsContentVisible(!isContentVisible)} className="w-full cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <svg
                  className={`w-4 h-4  transition-transform duration-200 ${isContentVisible ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <h3 className="text-sm font-semibold  ">
                  {idx}. {getTitleValue} - {' :: '}
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
            <div className=" flex items-center justify-end gap-2">
              {currentValue && (
                <Button variant="outlineGarden" size="sm" onClick={() => setCurrentInterface(currentValue)}>
                  Use
                </Button>
              )}
              <ConfirmDeleteNextComponent onClickFunction={handleClick} />
            </div>
          </div>

          {isContentVisible && (
            <div className="mt-3  bg-gray-800">
              <pre className="text-sm whitespace-pre-wrap p-3 border-1 rounded-md">
                {typeof currentValue.content === 'string' ? currentValue.content.trim() : JSON.stringify(currentValue.content, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </main>
  );
};
export default ViewInterface;
