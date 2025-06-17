import { BrowserRouter, Route, Routes } from 'react-router'
import Test from './routes/Test'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/test" Component={Test} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
