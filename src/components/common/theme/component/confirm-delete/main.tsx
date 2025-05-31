/*
|-----------------------------------------
| setting up MainConfirmNextComponent for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: code-generator, May, 2025
|-----------------------------------------
*/

'use client';

import ConfirmDeleteNextComponent from './confirm-delete';

const MainConfirmNextComponent = () => {
  const handleClick = () => {};
  return (
    <main className="centralized-center gap-4">
      <ConfirmDeleteNextComponent className="grow-1" onClickFunction={handleClick} variant="default" title="Default" confirmTitle="Delete" />
      <ConfirmDeleteNextComponent className="grow-1" onClickFunction={handleClick} variant="destructive" title="destructive" confirmTitle="destructive" />
      <ConfirmDeleteNextComponent className="grow-1" onClickFunction={handleClick} variant="ghost" title="ghost" confirmTitle="ghost" />
      <ConfirmDeleteNextComponent className="grow-1" onClickFunction={handleClick} variant="link" title="link" confirmTitle="link" />
      <ConfirmDeleteNextComponent className="grow-1" onClickFunction={handleClick} variant="outline" title="outline" confirmTitle="outline" />
      <ConfirmDeleteNextComponent className="grow-1" onClickFunction={handleClick} variant="secondary" title="secondary" confirmTitle="secondary" />
      <ConfirmDeleteNextComponent className="grow-1" onClickFunction={handleClick} variant="garden" title="garden" confirmTitle="garden" />
      <ConfirmDeleteNextComponent className="grow-1" onClickFunction={handleClick} variant="fire" title="fire" confirmTitle="fire" />
      <ConfirmDeleteNextComponent className="grow-1" onClickFunction={handleClick} variant="water" title="water" confirmTitle="water" />
      <ConfirmDeleteNextComponent
        className="grow-1"
        onClickFunction={handleClick}
        variant="outlineDefault"
        title="outlineDefault"
        confirmTitle="outlineDefault"
      />
      <ConfirmDeleteNextComponent className="grow-1" onClickFunction={handleClick} variant="outlineGarden" title="outlineGarden" confirmTitle="outlineGarden" />
      <ConfirmDeleteNextComponent className="grow-1" onClickFunction={handleClick} variant="outlineFire" title="outlineFire" confirmTitle="outlineFire" />
      <ConfirmDeleteNextComponent className="grow-1" onClickFunction={handleClick} variant="outlineWater" title="outlineWater" confirmTitle="outlineWater" />
    </main>
  );
};
export default MainConfirmNextComponent;
