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
import SelectNextComponent from './component/select/select';
import TextAreaNextComponent from './component/text-area/text-area';
import CheckboxNextComponent from './component/checkbox/checkbox';
import TextBoxNextComponent from './component/text-box/text-box';
import TableNextComponent from './component/table/table';
import MainConfirmNextComponent from './component/confirm-delete/main';

const MainThemeDemoNextComponents = () => {
  return (
    <div className="w-full min-h-screen border-1 max-w-7xl flex flex-col gap-4 p-4">
      <ButtonNextComponent />
      <HeadingNextComponent />
      <InputNextComponent />
      <CardNextComponent />
      <TextNextComponent />
      <BadgeNextComponent />
      <SelectNextComponent />
      <TextAreaNextComponent />
      <CheckboxNextComponent />
      <TextBoxNextComponent />
      <TableNextComponent />
      <MainConfirmNextComponent />
    </div>
  );
};
export default MainThemeDemoNextComponents;
