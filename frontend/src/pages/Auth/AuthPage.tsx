import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AuthPages, type AuthView } from './Auth'

function AuthPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const initialView = useMemo<AuthView>(() => {
    const v = (searchParams.get('view') || 'login') as AuthView
    return v === 'main' ? 'login' : v
  }, [searchParams])

  const [view, setView] = useState<AuthView>(initialView)

  useEffect(() => {
    setView(initialView)
  }, [initialView])

  useEffect(() => {
    if (view === 'main') navigate('/', { replace: true })
  }, [navigate, view])

  return (
    <AuthPages
      view={view}
      setView={setView}
      onStartPlanning={() => navigate('/user', { replace: true })}
    />
  )
}

export default AuthPage

