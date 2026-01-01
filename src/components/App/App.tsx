
import './App.css'
import { Routes, Route, Outlet } from 'react-router-dom'
import { Login } from '../../pages/Login/Login.tsx'
import { Registration } from '../../pages/Registration/Registration.tsx'
import ProtectedRoute from '../../auth/ProtectedRoute'
import PublicRoute from '../../auth/PublicRoute'
import Library from '../../pages/Library/Library.tsx'
import Recommended from '../../pages/Recommended/RecomendedPage.tsx'
import Reading from '../../pages/Reading/Reading.tsx'
import Header from '../Header/Header.tsx'

function AppLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

function App() {
return (
  <Routes>
    <Route path="/register" element={<PublicRoute><Registration /></PublicRoute>} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} /> 

    <Route element={<AppLayout />}>
      <Route path='/' element={<ProtectedRoute><Recommended /></ProtectedRoute>} />
      <Route path='/library' element={<ProtectedRoute><Library /></ProtectedRoute>} />
      <Route path='/recommended' element={<ProtectedRoute><Recommended /></ProtectedRoute>} />
      <Route path='/reading/:bookId' element={<ProtectedRoute><Reading /></ProtectedRoute>} />
    </Route>
  </Routes>
)
}

export default App
