
import './App.css'
import { Routes, Route, Navigate } from 'react-router'
import { Login } from '../../pages/Login/Login.tsx'
import { Registration } from '../../pages/Registration/Registration.tsx'
import ProtectedRoute from '../../auth/PublicRoute.tsx'
import PublicRoute from '../../auth/PublicRoute.tsx'
import Home from '../../pages/Home/Home.tsx'
import Library from '../../pages/Library/Library.tsx'
import Recommended from '../../pages/Recommended/Recommended.tsx'
import Reading from '../../pages/Reading/Reading.tsx'

function App() {
return (
  <Routes>
    <Route path="/register" element={<PublicRoute><Registration /></PublicRoute>} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

    <Route path='/' element={<ProtectedRoute><Navigate to="/recommended" replace /></ProtectedRoute>} />
    <Route path='/library' element={<ProtectedRoute><Library /></ProtectedRoute>} />
    <Route path='/recommended' element={<ProtectedRoute><Recommended /></ProtectedRoute>} />
    <Route path='/reading/:bookId' element={<ProtectedRoute><Reading /></ProtectedRoute>} />
  </Routes>
)
}

export default App
