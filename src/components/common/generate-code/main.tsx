/*
|-----------------------------------------
| setting up GenerateCode for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: code-generator, May, 2025
|-----------------------------------------
*/

import { Button } from '@/components/ui/button';
import { SavedInterface } from '@/lib/store/mainStore';

const GenerateCode = ({ currentInterface }: { currentInterface: SavedInterface }) => {
  const handleGenerate = (): void => {};
  return (
    <main>
      {/* Generate button */}
      <Button
        type="button"
        size="sm"
        onClick={handleGenerate}
        disabled={!currentInterface.content.trim()}
        className="w-full bg-green-600 cursor-pointer hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
      >
        Generate
      </Button>
    </main>
  );
};
export default GenerateCode;
