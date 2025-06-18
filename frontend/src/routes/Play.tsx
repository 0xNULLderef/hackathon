import { useEffect, useState } from 'react'
import CameraCanvas from '../components/CameraCanvas'
import { redirect, useNavigate, useParams } from 'react-router'
import axios from 'axios'

interface Resp {
  id: number
  name: string
  url: string
  done?: boolean
}

const Play = () => {
  const { questId } = useParams()
  const navigate = useNavigate()

  const [isVisible, setIsVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showContinue, setShowContinue] = useState(false)
  const [similarity, setSimilarity] = useState(0.0)
  const [response, setResposne] = useState<Resp | null>(null)

  const staticBaseURL = import.meta.env.VITE_STATIC_BASE_URL

  const minSimilarity = 0.6

  useEffect(() => {
    axios
      .get<Resp>(`${import.meta.env.VITE_API_BASE_URL}/quest_image_next/${questId}`)
      .then((r) => {
        setResposne(r.data)
        if(r.data.done) {
          navigate('/home')
        }
      })
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
            {showContinue ? (<div className='flex items-center justify-center' style={{ height: '512px' }}><p>Znalazłeś {response.name}!</p></div>) : (!isVisible ? (
              <img
                src={`${staticBaseURL}/${response.url}`}
                alt="Obraz"
                className="w-full rounded-lg shadow-md"
              />
            ) : (
              <>
                <CameraCanvas
                  className="w-full rounded-lg shadow-md overflow-hidden"
                  targetURL={`${staticBaseURL}/${response.url}`}
                  onSimilarityUpdate={(similarity) => setSimilarity(similarity)}
                  onCheckShouldStop={(similarity) => {
                    if (similarity >= minSimilarity) {
                      // set the flag here...
                      setShowContinue(true)
                      axios.get(`${import.meta.env.VITE_API_BASE_URL}/quest_image_mark/${response.id}`)
                      return true
                    } else {
                      return false
                    }
                  }}
                />
                <div className="absolute top-4 left-4 bg-black/30 text-white text-sm px-2 py-1 rounded">
                  <div>Dokładność: {Math.round(Math.max(similarity, 0) * 100)}%</div>
                  <div>
                    Minimalna wymagana: {Math.round(minSimilarity * 100)}%
                  </div>
                </div>
              </>
            ))}
          </div>

          <button
            onClick={() => setIsVisible((prevIsVisible) => !prevIsVisible)}
            className="w-full max-w-md py-2 mt-4 bg-gray-800 rounded"
            style={{ display: showContinue ? 'none' : 'unset' }}
          >
            {isVisible ? 'Podgląd' : 'Szukaj'}
          </button>
          <button
            onClick={() => { /* HACKHACK */ window.location.reload() }}
            className="w-full max-w-md py-2 mt-4 bg-gray-800 rounded"
            style={{ display: !showContinue ? 'none' : 'unset' }}
          >
            Kontynuuj
          </button>
        </div>
      )}
    </>
  )
}

export default Play
