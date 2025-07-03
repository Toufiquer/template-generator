'use client';

import React, { useState } from 'react';
import exampleInterface from './example.json';
import { ISavedInterfaceToLocalDB, useInterfaceStore } from '@/lib/store/mainStore';
import ViewInterface from './viewInterface';
// import ViewCurrentInterface from './ViewCurrentInterface';
import Link from 'next/link';
import { Button } from '@/components/ui/button';



const InterfaceInputComponent: React.FC = () => {
  const [textareaValue, setTextareaValue] = useState<string>(`${JSON.stringify(exampleInterface, null, 2)}`);
  const { updateInterface, setCurrentInterface, interfaceDBArr, currentInterface, preViewPath } = useInterfaceStore();
const [error,setError] = useState('');
const [isLoading,setIsLoading] = useState(false);
  

  console.log("exampleInterface import form example.json : ", exampleInterface);

  const handleSave = (): void => {
console.log("first load")
      try {
        setError('');
        console.log("textareaValue : ", textareaValue);
        setIsLoading(true)
        // Validate JSON
        const newInterfaceValue: ISavedInterfaceToLocalDB = {
          id: new Date().toString(),
          content: JSON.parse(textareaValue),
          timestamp: new Date().toString(),
        };
        console.log("newInterfaceValue : ", newInterfaceValue);
        
      setCurrentInterface(newInterfaceValue);
      updateInterface([newInterfaceValue, ...interfaceDBArr]);
      setTextareaValue('');
        
      } catch (err) {
        setError('Invalid JSON format. Please check your syntax.');
      } finally {
        setIsLoading(false);
      }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const data = e.target.value;
    console.log(' data : ', data);
    // console.log('  data : ', JSON.parse(data));
    setTextareaValue(e.target.value);
    if (error) setError('');
  };
  return (
    <div className="w-full flex flex-col">
      {preViewPath && (
        <Link href={preViewPath} className="w-[220px] text-center py-1 px-4 rounded-full pb-2 text-sm font-semibold mb-6 mx-auto " target="_blank">
          View Generate Template
        </Link>
      )}
      <div className="mx-auto p-6 rounded-lg shadow-lg w-full max-w-7xl">
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
            className="w-full h-40 p-3 border rounded-md resize-vertical focus:ring-2 focus:border-transparent outline-none bg-slate-800"
            rows={8}
          />
        </div>
        <div className="centralized-end">
          <Button onClick={handleSave} disabled={!textareaValue.trim() || isLoading} variant="outlineGarden" className="w-[180px]" >
          {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm  p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}
        {/* <ViewCurrentInterface /> */}
        {interfaceDBArr.length > 0 && currentInterface && <hr className="my-6" />}
        {interfaceDBArr.length > 0 && (
          <div className="mt-5s">
            {interfaceDBArr.map((i, idx) => (
              <div key={i.id} className="border-1 border-slate-200 mb-3 bg-gray-900 rounded-md">
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
