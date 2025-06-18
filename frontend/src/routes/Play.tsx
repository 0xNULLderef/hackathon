import { useEffect, useState } from 'react'
import CameraCanvas from '../components/CameraCanvas'
import { useParams } from 'react-router'
import axios from 'axios'

interface Resp {
  id: number
  name: string
  url: string
  done?: boolean
}

const Play = () => {
  const { questId } = useParams()

  const [isVisible, setIsVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [similarity, setSimilarity] = useState(0.0)
  const [response, setResposne] = useState<Resp | null>(null)

  const minSimilarity = 0.5

  useEffect(() => {
    axios
      .get<Resp>(`http://localhost:3000/api/quest_image_next/${questId}`)
      .then((r) => setResposne(r.data))
  }, [])

  return (
    <>
      {!response ? (
        <>dupa</>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-850 text-white relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="absolute top-4 left-4 p-2 bg-gray-800 rounded text-white md:hidden z-50"
          >
            ☰
          </button>

          {}
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

          {}
          <div className="relative w-full max-w-md mt-4">
            {!isVisible ? (
              <img
                src={response.url}
                alt="Obraz"
                className="w-full rounded-lg shadow-md"
              />
            ) : (
              <>
                <CameraCanvas
                  className="w-full rounded-lg shadow-md overflow-hidden"
                  targetURL={response.url}
                  onSimilarityUpdate={(similarity) => setSimilarity(similarity)}
                  onCheckShouldStop={(similarity) => {
                    if (similarity >= minSimilarity) {
                      // set the flag here...
                      return true
                    } else {
                      return false
                    }
                  }}
                />
                <div className="absolute top-4 left-4 bg-black/30 text-white text-sm px-2 py-1 rounded">
                  <div>Dokładność: {Math.round(similarity * 100)}%</div>
                  <div>
                    Minimalna wymagana: {Math.round(minSimilarity * 100)}%
                  </div>
                </div>
              </>
            )}
          </div>

          {}
          <button
            onClick={() => setIsVisible((prevIsVisible) => !prevIsVisible)}
            className="w-full max-w-md py-2 mt-4 bg-gray-800 rounded"
          >
            {isVisible ? 'Podgląd' : 'Szukaj'}
          </button>
        </div>
      )}
    </>
  )
}

export default Play
