import { useState } from 'react'

const Upload = () => {
  const [value, setValue] = useState(0)
  const [isSent, setIsSent] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false) // Dodane do obsługi menu

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-850 text-black dark:text-white relative">
      {/* Przycisk menu mobilnego */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="absolute top-4 left-4 p-2 bg-gray-800 rounded text-white md:hidden z-50"
      >
        ☰
      </button>

      {/* Nawigacja boczna */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <ul className="p-14 space-y-6 text-white">
          <li>
            <a href="/home" className="">
              Strona główna
            </a>
          </li>
          <li>
            <a href="/gallery" className="">
              Znaleziska
            </a>
          </li>
          <li>
            <a href="/ranking" className="">
              Ranking
            </a>
          </li>
          <li>
            <a href="/achievements" className="">
              Osiągnięcia
            </a>
          </li>
        </ul>
      </div>

      {/* Główna zawartość uploadu */}
      <input
        type="file"
        className="mt-20 border border-gray-300 rounded-lg shadow-sm px-4 py-2 bg-white dark:bg-gray-900"
      />

      <p className="mt-2 text-white">Skala dokładności zdjęcia: {value}</p>

      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="mt-4 w-full max-w-md accent-blue-500 bg-transparent rounded-lg cursor-pointer"
      />

      <button
        onClick={() => setIsSent(!isSent)}
        className="w-full max-w-md py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
      >
        Prześlij
      </button>

      {isSent && (
        <h4 className="mt-4 text-green-500">Plik został przesłany!</h4>
      )}
    </div>
  )
}

export default Upload
