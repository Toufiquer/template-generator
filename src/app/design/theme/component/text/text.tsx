/*
|-----------------------------------------
| setting up TextNextComponent for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: code-generator, May, 2025
|-----------------------------------------
*/
const TextNextComponent = () => {
  return (
    <main className="w-full flex flex-col gap-4 divide-y-2 divide-dotted divide-accent border-1 border-accent p-4">
      <h1 className="centralized-start" title="centralized-start">
        Text Centralized Start
      </h1>
      <h1 className="centralized-center" title="centralized-center">
        Text Centralized Center
      </h1>
      <h1 className="centralized-end" title="centralized-end">
        Text Centralized End
      </h1>
      <h1 className="centralized-between" title="centralized-between">
        <span>Text</span>
        <span>Centralized</span>
        <span>Between</span>
      </h1>
      <h1 className="centralized-around" title="centralized-arount">
        <span>Text</span>
        <span>Centralized</span>
        <span>Around</span>
      </h1>
    </main>
  );
};
export default TextNextComponent;
