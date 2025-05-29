/*
|-----------------------------------------
| setting up MainThemeDemoNextComponents for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: code-generator, May, 2025
|-----------------------------------------
*/

import CardNextComponent from './component/card/card';
import InputNextComponent from './component/input/input';
import HeadingNextComponent from './component/heading/heading';
import ButtonNextComponent from './component/button/button';
import TextNextComponent from './component/text/text';
import BadgeNextComponent from './component/badge/badge';

const MainThemeDemoNextComponents = () => {
  return (
    <div className="w-full min-h-screen border-1 max-w-7xl flex flex-col gap-4 p-4">
      <ButtonNextComponent />
      <HeadingNextComponent />
      <InputNextComponent />
      <CardNextComponent />
      <TextNextComponent />
      <BadgeNextComponent />
    </div>
  );
};
export default MainThemeDemoNextComponents;
