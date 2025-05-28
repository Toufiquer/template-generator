import { SavedInterface, useInterfaceStore } from '@/lib/store/mainStore'

/*
|-----------------------------------------
| setting up AllInterface for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: code-generator, May, 2025
|-----------------------------------------
*/
const AllInterface = () => {
  const { removeInterface, savedInterfaces } = useInterfaceStore()
  return (
    <main>
      {/* Display all saved interfaces */}
      {savedInterfaces.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-300">
            Saved Interfaces ({savedInterfaces.length}):
          </h3>
          <ul className="space-y-3 max-h-60 overflow-y-auto">
            {savedInterfaces.map((item: SavedInterface) => {
              // Extract const name from the interface content
              const getConstName = (content: string): string => {
                const match = content.match(/(?:const|let|var)\s+(\w+)/)
                return match ? match[1] : 'Unnamed Interface'
              }

              const constName = getConstName(item.content)

              return (
                <li
                  key={item.id}
                  className="p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 text-base">
                      {constName}
                    </h4>
                    <button
                      onClick={() => removeInterface(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    Created: {new Date(item.timestamp).toLocaleString()}
                  </div>
                  <details className="group">
                    <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 mb-2">
                      View Code
                    </summary>
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border mt-2 overflow-x-auto">
                      {item.content}
                    </pre>
                  </details>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </main>
  )
}
export default AllInterface
