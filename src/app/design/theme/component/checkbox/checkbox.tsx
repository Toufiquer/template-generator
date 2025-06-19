/*
|-----------------------------------------
| setting up Checkbox for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: code-generator, May, 2025
|-----------------------------------------
*/

'use client';

import { Checkbox } from '@/components/ui/checkbox';

const CheckboxNextComponent = () => {
  return (
    <div className="centralized-center">
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Accept terms and conditions
        </label>
      </div>
    </div>
  );
};
export default CheckboxNextComponent;
