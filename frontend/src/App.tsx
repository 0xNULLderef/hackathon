import { BrowserRouter, Route, Routes } from 'react-router'
import Test from './routes/Test'
import Home from './routes/Home'
import Upload from './routes/Upload'
import Gallery from './routes/Gallery'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/test" Component={Test} />
          <Route path="/home" Component={Home} />
          <Route path="/upload" Component={Upload} />
          <Route path="/gallery" Component={Gallery} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
