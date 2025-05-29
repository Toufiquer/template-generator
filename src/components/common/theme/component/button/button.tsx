/*
|-----------------------------------------
| setting up Button for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: code-generator, May, 2025
|-----------------------------------------
*/

import { Button } from '@/components/ui/button';

const ButtonNextComponent = () => {
  return (
    <div className="w-full flex items-center justify-center gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="garden">Garden</Button>
      <Button variant="fire">Fire</Button>
      <Button variant="water">Water</Button>
      <Button variant="outlineGarden">O Garden</Button>
      <Button variant="outlineFire">O Fire</Button>
      <Button variant="outlineWater">O Water</Button>
    </div>
  );
};
export default ButtonNextComponent;
