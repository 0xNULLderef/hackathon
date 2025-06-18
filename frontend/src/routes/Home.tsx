import axios from 'axios'
import { useEffect, useState } from 'react'
import {Link} from 'react-router'

type QuestResponse = {
  id: number
  name: string
  coverURL: string
  questImageCount: number
  questImageCompleteCount: number
}[]

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [data, setData] = useState<QuestResponse | null>(null)

  const staticBaseURL = import.meta.env.VITE_STATIC_BASE_URL

  useEffect(() => {
    ;(async () => {
      setData(
        (await axios.get<QuestResponse>(`${import.meta.env.VITE_API_BASE_URL}/quests`))
          .data
      )
    })()
  }, [])
  // const data = [
  //   {
  //     index: 0,
  //     src: '/src/asetts/IMG_20250617_121752980_HDR.jpg',
  //     tytul: 'Szkoła CKZIU Jaworzno',
  //     ilosc_zdjęć: 5,
  //     progres: '10%',
  //   },
  //   {
  //     index: 1,
  //     src: '/src/asetts/IMG_20250617_121813889_HDR.jpg',
  //     tytul: 'Cekaziutek',
  //     ilosc_zdjęć: 10,
  //     progres: '50%',
  //   },
  //   {
  //     index: 2,
  //     src: '/src/asetts/IMG_20250617_121654925_HDR.jpg',
  //     tytul: 'Elektrownia Jaworzno',
  //     ilosc_zdjęć: 15,
  //     progres: '90%',
  //   },
  // ]

  return (
    <>
      {!data ? (
        <>loading...</>
      ) : (
        <div className="flex min-h-screen bg-gray-850 text-white">
          <div className="hidden md:block w-64 bg-gray-900 p-6">
            <ul className="space-y-6 text-white pt-20">
              <li>
                <Link to="/play">Obiektyw</Link>
              </li>
              <li>
                <Link to="/gallery">Znaleziska</Link>
              </li>
              <li>
                <Link to="/ranking">Ranking</Link>
              </li>
              <li>
                <Link to="/achievments">Osiągnięcia</Link>
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
                <Link to="/play">Obiektyw</Link>
              </li>
              <li>
                <Link to="/gallery">Znaleziska</Link>
              </li>
              <li>
                <Link to="/ranking">Ranking</Link>
              </li>
              <li>
                <Link to="/achievments">Osiągnięcia</Link>
              </li>
            </ul>
          </div>

          <div className="flex-1 p-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6 mt-10">Dostępne kolekcje</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.map((item) => (
                <div key={item.id} className="relative">
                  <Link to={`/play/${item.id}`} className={`flex${item.questImageCompleteCount == item.questImageCount ? ' pointer-events-none' : ''}`}>
                    <img
                      src={`${staticBaseURL}/${item.coverURL}`}
                      alt="Obraz"
                      className="w-full max-w-md rounded-lg shadow-md cursor-pointer"
                    />
                  </Link>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm p-2 rounded-b-lg">
                    <p className="font-semibold">{item.name}</p>
                    <p>Ilość zdjęć w kolekcji: {item.questImageCount}</p>
                    <p>Stopień ukończenia kolekcji: {Math.floor(item.questImageCompleteCount / item.questImageCount * 100)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Home
