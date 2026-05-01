import { Navigate, Route, Routes } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Landing from './pages/Landing/Landing'
import Plannery from './pages/Plannery/Plannery'
import AuthPage from './pages/Auth/AuthPage'

function App() {
  // Создаем стейт для темы с чтением из localStorage
  const [theme, setTheme] = useState(() => {
    // Проверяем, есть ли сохраненная тема в localStorage
    const savedTheme = localStorage.getItem('app-theme')
    return savedTheme || 'dark'
  })

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }
  // При каждом изменении темы меняем атрибут у html и сохраняем в localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    // Сохраняем тему в localStorage
    localStorage.setItem('app-theme', theme)
  }, [theme])

  return (
    <Routes>
      <Route 
        path="/" 
        element={<Landing theme={theme} toggleTheme={toggleTheme} />} 
      />
      <Route 
        path="/auth" 
        element={<AuthPage />} 
      />
      <Route 
        path="/user" 
        element={<Plannery theme={theme} toggleTheme={toggleTheme} />} 
      />
      <Route path="*" element={<Navigate to="/" replace />}/>
    </Routes>
  )
}

export default App