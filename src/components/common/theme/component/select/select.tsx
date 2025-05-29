/*
|-----------------------------------------
| setting up SelectNextComponent for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: code-generator, May, 2025
|-----------------------------------------
*/

'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';

const SelectNextComponent = () => {
  const [select, setSelect] = useState('');
  const [selectedItems, setSelectItems] = useState<string[]>([]);

  useEffect(() => {
    setSelectItems(['light', 'dark', 'system']);
  }, []);

  const handleValueChange = (value: string) => {
    setSelect(value);
  };

  return (
    <div className="centralized-center">
      <Select value={select} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={selectedItems[0] || 'Select a theme'} />
        </SelectTrigger>
        <SelectContent>
          {selectedItems.length > 0 &&
            selectedItems.map(item => (
              <SelectItem value={item} key={item}>
                {item}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectNextComponent;
