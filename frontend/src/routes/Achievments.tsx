import { useState } from 'react'

const Achievments = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const staticBaseURL = import.meta.env.VITE_STATIC_BASE_URL

  const data = [
    {
      index: 0,
      src: 'first_find.png',
      tytul: 'Pierwsze znalezisko',
      czas: '17.06.2025, 12:17',
      opis: 'Odnalazłeś pierwsze miejsce',
    },
    {
      index: 1,
      src: 'three_find.png',
      tytul: 'Początek kolekcji?',
      czas: '17.06.2025, 12:17',
      opis: 'Odkryłeś już 3 miejsca',
    },
    {
      index: 2,
      src: 'five_find.png',
      tytul: 'Wysokie ambicje',
      czas: '17.06.2025, 12:17',
      opis: 'Odkryłeś już 5 miejsc',
    },
  ]

  return (
    <div className="flex min-h-screen bg-gray-850 text-white">
      <div className="hidden md:block w-64 bg-gray-900 p-6">
        <ul className="space-y-6 text-white pt-20">
          <li>
            <a href="/home">Strona główna</a>
          </li>
          <li>
            <a href="/play">Obiektyw</a>
          </li>
          <li>
            <a href="/gallery">Znaleziska</a>
          </li>
          <li>
            <a href="/ranking">Ranking</a>
          </li>
        </ul>
      </div>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="absolute top-4 left-4 p-2 bg-gray-800 rounded text-white md:hidden z-50"
      >
        ☰
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <ul className="pt-20 ps-5 space-y-6 text-white">
          <li>
            <a href="/home">Strona główna</a>
          </li>
          <li>
            <a href="/gallery">Znaleziska</a>
          </li>
          <li>
            <a href="/ranking">Ranking</a>
          </li>
          <li>
            <a href="/achievements">Osiągnięcia</a>
          </li>
        </ul>
      </div>

      <div className="flex-1 p-4 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 mt-10">Osiągnięcia</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.map((item) => (
            <div key={item.index} className="relative">
              <div className="flex">
                <img
                  src={`${staticBaseURL}/${item.src}`}
                  alt="Obraz"
                  onClick={() =>
                    setSelectedIndex(
                      selectedIndex === item.index ? null : item.index
                    )
                  }
                  className="w-full max-w-md rounded-lg shadow-md cursor-pointer"
                />
                {selectedIndex === item.index && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-3 rounded-lg shadow-md text-sm">
                    <button
                      onClick={() => setSelectedIndex(null)}
                      className="absolute top-2 right-2 text-white font-bold"
                    >
                      ✖
                    </button>
                    <p>{item.opis}</p>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-opacity-60 text-white text-sm p-2 rounded-b-lg">
                <p className="font-semibold">{item.tytul}</p>
                <p>{item.czas}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Achievments
