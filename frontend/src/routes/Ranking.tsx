import { useState } from 'react'

const Ranking = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const users = [
    { miejsce: 1, nazwa: "Jan Kowalski", odkrycia: 45 },
    { miejsce: 2, nazwa: "Anna Nowak", odkrycia: 38 },
    { miejsce: 3, nazwa: "Ty", odkrycia: 32 },
    { miejsce: 4, nazwa: "Karolina Jankowska", odkrycia: 30 },
    { miejsce: 5, nazwa: "Piotr Zieliński", odkrycia: 25 },
    { miejsce: 6, nazwa: "Magdalena Kamińska", odkrycia: 21 },
    { miejsce: 7, nazwa: "Tomasz Lewandowski", odkrycia: 18 },
  ]

  const mojeMiejsce = users.find((user) => user.nazwa === "Ty");

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
            <a href="/achievments">Osiągnięcia</a>
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
            <a href="/play">Obiektyw</a>
          </li>
          <li>
            <a href="/gallery">Znaleziska</a>
          </li>
          <li>
            <a href="/achievments">Osiągnięcia</a>
          </li>
        </ul>
      </div>

      {/* Ranking */}
      <div className="flex flex-col items-center justify-center w-full max-w-3xl text-center p-1">
        <h2 className="text-3xl font-bold mb-6">Ranking Uczestników</h2>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full">
          <table className="w-full text-center">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-4">Miejsce</th>
                <th className="p-4">Uczestnik</th>
                <th className="p-4">Odkryte miejsca</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.miejsce}
                  className={`border-b border-gray-700 ${
                    mojeMiejsce?.miejsce === user.miejsce ? "bg-blue-700 text-white font-bold" : "bg-gray-800"
                  }`}
                >
                  <td className="p-4">{user.miejsce}</td>
                  <td className="p-4">{user.nazwa}</td>
                  <td className="p-4">{user.odkrycia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Ranking
