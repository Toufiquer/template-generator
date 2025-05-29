'use client';

import React, { useState } from 'react';
import { SavedInterface, useInterfaceStore } from '@/lib/store/mainStore';
import ViewInterface from './viewInterface';
import ViewCurrentInterface from './ViewCurrentInterface';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
const InterfaceInputComponent: React.FC = () => {
  const [textareaValue, setTextareaValue] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const { updateInterface, setCurrentInterface, savedInterfaces, currentInterface, preViewPath } = useInterfaceStore();

  const handleSave = (): void => {
    if (textareaValue.trim()) {
      const newInterfaceValue: SavedInterface = {
        id: new Date().toString(),
        title,
        content: textareaValue,
        timestamp: new Date().toString(),
      };
      // Save to Zustand store
      setCurrentInterface(newInterfaceValue);
      updateInterface([newInterfaceValue, ...savedInterfaces]);
      setTextareaValue('');
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setTextareaValue(e.target.value);
  };
  return (
    <div className="w-full flex flex-col">
      {preViewPath && (
        <Link href={preViewPath} className="w-[220px] text-center py-1 px-4 rounded-full pb-2 text-sm font-semibold mb-6 mx-auto " target="_blank">
          View Generate Template
        </Link>
      )}
      <div className="mx-auto p-6 rounded-lg shadow-lg min-w-7xl">
        <h2 className="text-2xl font-bold mb-4">Interface Generator</h2>
        {/* Textarea for interface input */}
        <div className="mb-4">
          <label htmlFor="interface-input" className="block text-sm font-medium mb-2">
            Enter Interface Definition:
          </label>
          <textarea
            id="interface-input"
            value={textareaValue}
            onChange={handleTextareaChange}
            placeholder="Enter your interface definition here..."
            className="w-full h-40 p-3 border rounded-md resize-vertical focus:ring-2 focus:border-transparent outline-none"
            rows={8}
          />
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter Title"
            className="border-1 w-full mt-4 p-4 rounded-md py-2"
          />
        </div>
        <Button onClick={handleSave} disabled={!textareaValue.trim()} variant="outlineGarden">
          Save
        </Button>
        <ViewCurrentInterface />
        {savedInterfaces.length > 0 && currentInterface && <hr className="my-6" />}
        {savedInterfaces.length > 0 && (
          <div className="mt-5">
            {savedInterfaces.map((i, idx) => (
              <div key={i.id}>
                <ViewInterface currentValue={i} idx={idx + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterfaceInputComponent;
