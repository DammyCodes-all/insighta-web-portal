import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Account from './pages/Account'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import ProfileDetail from './pages/ProfileDetail'
import ProfilesList from './pages/ProfilesList'
import Search from './pages/Search'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div className="app-shell">
              <Navbar />
              <main className="content-shell">
                <Dashboard />
              </main>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profiles"
        element={
          <ProtectedRoute>
            <div className="app-shell">
              <Navbar />
              <main className="content-shell">
                <ProfilesList />
              </main>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profiles/:id"
        element={
          <ProtectedRoute>
            <div className="app-shell">
              <Navbar />
              <main className="content-shell">
                <ProfileDetail />
              </main>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <div className="app-shell">
              <Navbar />
              <main className="content-shell">
                <Search />
              </main>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <div className="app-shell">
              <Navbar />
              <main className="content-shell">
                <Account />
              </main>
            </div>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
