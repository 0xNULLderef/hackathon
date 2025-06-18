import { BrowserRouter, Route, Routes } from 'react-router'
import Test from './routes/Test'
import Play from './routes/Play'
import Upload from './routes/Upload'
import Gallery from './routes/Gallery'
import Ranking from './routes/Ranking'
import Achievments from './routes/Achievments'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/test" Component={Test} />
          <Route path="/play/:questId" Component={Play} />
          <Route path="/upload" Component={Upload} />
          <Route path="/gallery" Component={Gallery} />
          <Route path="/ranking" Component={Ranking} />
          <Route path="/achievments" Component={Achievments} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
