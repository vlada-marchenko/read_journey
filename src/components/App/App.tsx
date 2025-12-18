
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Login } from '../../pages/Login/Login.tsx'
import { Registration } from '../../pages/Registration/Registration.tsx'
import ProtectedRoute from '../../auth/ProtectedRoute'
import PublicRoute from '../../auth/PublicRoute'
import Library from '../../pages/Library/Library.tsx'
import Recommended from '../../pages/Recommended/Recomended'
import Reading from '../../pages/Reading/Reading.tsx'

function App() {
return (
  <Routes>
    <Route path="/register" element={<PublicRoute><Registration /></PublicRoute>} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} /> 

    <Route path='/' element={<ProtectedRoute><Recommended /></ProtectedRoute>} />
    <Route path='/library' element={<ProtectedRoute><Library /></ProtectedRoute>} />
    <Route path='/recommended' element={<ProtectedRoute><Recommended /></ProtectedRoute>} />
    <Route path='/reading/:bookId' element={<ProtectedRoute><Reading /></ProtectedRoute>} />
  </Routes>
)
}

export default App
