import { BrowserRouter, Route, Routes } from 'react-router'
import Test from './routes/Test'
import Home from './routes/Home'
import Upload from './routes/Upload'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/test" Component={Test} />
          <Route path="/home" Component={Home} />
          <Route path="/upload" Component={Upload} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
