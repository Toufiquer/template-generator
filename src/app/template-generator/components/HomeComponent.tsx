/*
|-----------------------------------------
| setting up HomeComponent for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: template-generator, July, 2025
|-----------------------------------------
*/
const HomeComponent= () => {
return <main> <div className="w-full flex flex-col">

<div className="mx-auto p-6 rounded-lg shadow-lg w-full max-w-7xl">
  <h2 className="text-2xl font-bold mb-4">Interface Generator</h2>
  {/* Textarea for interface input */}
  <div className="mb-4">
    <label htmlFor="interface-input" className="block text-sm font-medium mb-2">
      Enter Interface Definition:
    </label>
    <textarea
      id="interface-input"
      value={textareaValue}
      onChange={handleTextareaChange}
      placeholder="Enter your interface definition here..."
      className="w-full h-40 p-3 border rounded-md resize-vertical focus:ring-2 focus:border-transparent outline-none bg-slate-800"
      rows={8}
    />
  </div>
  <div className="centralized-end">
    <Button onClick={handleSave} disabled={!textareaValue.trim() || isLoading} variant="outlineGarden" className="w-[180px]" >
    {isLoading ? 'Saving...' : 'Save'}
    </Button>
  </div>
    {/* Error Message */}
    {error && (
      <div className="text-red-600 text-sm  p-3 rounded-md border border-red-200">
        {error}
      </div>
    )}
  {/* <ViewCurrentInterface /> */}
  {interfaceDBArr.length > 0 && currentInterface && <hr className="my-6" />}
  {interfaceDBArr.length > 0 && (
    <div className="mt-5s">
      {interfaceDBArr.map((i, idx) => (
        <div key={i.id} className="border-1 border-slate-200 mb-3 bg-gray-900 rounded-md">
          <ViewInterface currentValue={i} idx={idx + 1} />
        </div>
      ))}
    </div>
  )}
</div>
</div></main>;
}
export default HomeComponent