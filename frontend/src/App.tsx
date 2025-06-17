import { BrowserRouter, Route, Routes } from 'react-router'
import Test from './routes/Test'
import Home from './routes/Home'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/test" Component={Test} />
          <Route path="/home" Component={Home} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
