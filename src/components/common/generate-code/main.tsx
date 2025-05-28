import { Button } from '@/components/ui/button';
import { SavedInterface } from '@/lib/store/mainStore';
import { useState } from 'react';
import { toast } from 'react-toastify';

const GenerateCode = ({ currentInterface }: { currentInterface: SavedInterface }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: currentInterface.content,
          folderName: currentInterface.title.toLowerCase().replace(/ /g, '-') || 'default',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('model.ts file created successfully!');
        console.log('File created:', data.filePath);
      } else {
        toast.error(`Error: ${data.message}`);
        console.error('Error creating file:', data.message);
      }
    } catch (error) {
      toast.error('Failed to create file');
      console.error('Network error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      {/* Generate button */}
      <Button
        type="button"
        size="sm"
        onClick={handleGenerate}
        disabled={!currentInterface.content.trim() || isLoading}
        className="w-full bg-green-600 cursor-pointer hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
      >
        {isLoading ? 'Generating...' : 'Generate'}
      </Button>
    </main>
  );
};

export default GenerateCode;
