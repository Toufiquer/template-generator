/*
|-----------------------------------------
| setting up BadgeNextComponent for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: code-generator, May, 2025
|-----------------------------------------
*/

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const BadgeNextComponent = () => {
  return (
    <div className="w-full flex items-center justify-center gap-4">
      <Badge variant="default">Default</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="garden">Garden</Badge>
      <Badge variant="fire">Fire</Badge>
      <Badge variant="water">Water</Badge>
      <Badge variant="outlineDefault">Water</Badge>
      <Badge variant="outlineGarden">Outline Garden</Badge>
      <Badge variant="outlineFire">Outline Fire</Badge>
      <Badge variant="outlineWater">Outline Water</Badge>
    </div>
  );
};
export default BadgeNextComponent;
