import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Map from './pages/Map'
import Resources from './pages/Resources'
import Farms from './pages/Farms'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/map" element={<Map />} />
      <Route path="/farms" element={<Farms />} />
      <Route path='/resources' element={<Resources/>}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
