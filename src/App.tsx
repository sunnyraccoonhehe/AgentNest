import { useState, useEffect } from 'react'
import { AuthPages } from './components/AuthPages'
import rhombus from './assets/Vector.svg'
import logoBlack from './assets/logo_black.svg'
import logoPink from './assets/logo_pink.svg'
import icon1 from './assets/icon1.svg'
import icon2 from './assets/icon2.svg'
import icon3 from './assets/icon3.svg'
import icon4 from './assets/icon4.svg'
import './App.css'

function App() {
  const [step, setStep] = useState(0);
  const [view, setView] = useState('main');

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 300),
      setTimeout(() => setStep(2), 3000),
      setTimeout(() => setStep(3), 4000),
      setTimeout(() => setStep(4), 5000),
      setTimeout(() => setStep(5), 6000)
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`full-screen ${step >= 4 ? 'final-stage' : ''}`}>
      <div className="nav-bar">
        <div className="top-icons">
          {[icon1, icon2, icon3, icon4].map((icon, i) => (
            <img key={i} className="icon" src={icon} alt="nav-icon" />
          ))}
        </div>
        <div className="auth">
          <a onClick={() => setView('login')}>Вход</a> / <a onClick={() => setView('reg')}>Регистрация</a>
        </div>
      </div>

      {view === 'main' && (
        <>
          <div className="rhombus-container">
            <img 
              src={rhombus} 
              className={`rhombus-svg ${step >= 1 ? 'shown' : ''} ${step >= 2 ? 'expanded' : ''}`} 
            />
          </div>
          <div className={`logo-wrapper ${step >= 3 ? 'falling' : ''} ${step >= 4 ? 'switched' : ''} ${step >= 5 ? 'move-up' : ''}`}>
            <img src={logoBlack} className="logo black" />
            <img src={logoPink} className="logo pink" />
          </div>
          <button className={`main-button ${step >= 5 ? 'visible' : ''}`} onClick={() => setView('reg')}>
            Начать планировать
          </button>
        </>
      )}

      <AuthPages view={view} setView={setView} />
    </div>
  )
}

export default App