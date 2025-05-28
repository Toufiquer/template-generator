'use client'

import React, { useState } from 'react'; 
import { SavedInterface, useInterfaceStore } from '@/lib/store/mainStore'; 
const InterfaceInputComponent: React.FC = () => {
  const [textareaValue, setTextareaValue] = useState<string>('');
  const { interfaceString, setInterfaceString, addInterface, savedInterfaces ,removeInterface} = useInterfaceStore();

  const handleGenerate = (): void => {
    if (textareaValue.trim()) {
      // Save to Zustand store
      setInterfaceString(textareaValue);
      addInterface(textareaValue);
      
      // Optional: Clear textarea after saving
      setTextareaValue('');
      
      console.log('Interface saved to Zustand:', textareaValue);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setTextareaValue(e.target.value);
  };
 
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

      {/* Display current saved interface */}
      {interfaceString && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Current Interface:</h3>
          <pre className="text-sm text-gray-600 whitespace-pre-wrap bg-white p-3 rounded border">
            {interfaceString}
          </pre>
        </div>
      )}

  {/* Display all saved interfaces */}
{savedInterfaces.length > 0 && (
  <div className="mt-6">
    <h3 className="text-lg font-semibold mb-3 text-gray-800">
      Saved Interfaces ({savedInterfaces.length}):
    </h3>
    <ul className="space-y-3 max-h-60 overflow-y-auto">
      {savedInterfaces.map((item: SavedInterface) => {
        // Extract const name from the interface content
        const getConstName = (content: string): string => {
          const match = content.match(/(?:const|let|var)\s+(\w+)/);
          return match ? match[1] : 'Unnamed Interface';
        };

        const constName = getConstName(item.content);
        
        return (
          <li key={item.id} className="p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900 text-base">
                {constName}
              </h4>
              <button 
                onClick={() => removeInterface(item.id)}
                className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50"
              >
                Delete
              </button>
            </div>
            <div className="text-xs text-gray-500 mb-3">
              Created: {new Date(item.timestamp).toLocaleString()}
            </div>
            <details className="group">
              <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 mb-2">
                View Code
              </summary>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border mt-2 overflow-x-auto">
                {item.content}
              </pre>
            </details>
          </li>
        );
      })}
    </ul>
  </div>
)}
    </div>
  );
};

export default InterfaceInputComponent;