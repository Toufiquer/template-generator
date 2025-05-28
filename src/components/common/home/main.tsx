'use client';

import React, { useState } from 'react';
import { SavedInterface, useInterfaceStore } from '@/lib/store/mainStore';
import ViewInterface from './viewInterface';
import ViewCurrentInterface from './ViewCurrentInterface';
const InterfaceInputComponent: React.FC = () => {
  const [textareaValue, setTextareaValue] = useState<string>('');
  const { updateInterface, setCurrentInterface, savedInterfaces, currentInterface } = useInterfaceStore();

  const handleGenerate = (): void => {
    if (textareaValue.trim()) {
      const title = textareaValue.split(' ')[2] || `T-${Date.now()}`;
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
  console.log('savedInterfaces', savedInterfaces);
  return (
    <div className="mx-auto p-6 bg-slate-700 text-slate-200 rounded-lg shadow-lg min-w-7xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-50">Interface Generator</h2>
      {/* Textarea for interface input */}
      <div className="mb-4">
        <label htmlFor="interface-input" className="block text-sm font-medium text-gray-300 mb-2">
          Enter Interface Definition:
        </label>
        <textarea
          id="interface-input"
          value={textareaValue}
          onChange={handleTextareaChange}
          placeholder="Enter your interface definition here..."
          className="w-full h-40 p-3 border border-gray-300 rounded-md resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          rows={8}
        />
      </div>
      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!textareaValue.trim()}
        className="w-full bg-green-600 cursor-pointer hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
      >
        Generate
      </button>
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
  );
};

export default InterfaceInputComponent;
