import Quiz from './pages/Quiz'
import Result from './pages/Result'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import MyPlan from './pages/MyPlan'
import MarketCart from './pages/MarketCart'
import Dashboard from './pages/Dashboard'

import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      <Route path='/quiz' element={<Quiz />} />
      <Route path='/result' element={<Result />} />
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/my-plan' element={<ProtectedRoute><MyPlan /></ProtectedRoute>} />
      <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path='/cart' element={<ProtectedRoute><MarketCart /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
