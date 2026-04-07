import React, { useRef } from 'react';

interface AuthProps {
  view: string;
  setView: (view: string) => void;
}

export const AuthPages: React.FC<AuthProps> = ({ view, setView }) => {

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (view === 'main') return null;

  const handleBack = () => {
    const routes: Record<string, string> = {
      'reg': 'main', 
      'login': 'main', 
      'reg-code': 'reg',
      'login-code': 'login', 
      'profile': 'reg-code', 
      'ready': 'main'
    };
    setView(routes[view] || 'main');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (value.length === 1 && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
    if (value.length === 1 && index === 4) {
      const fullCode = inputRefs.current.map(input => input?.value).join('');
      
      if (fullCode.length === 5) {
        setTimeout(() => {
          setView(view === 'reg-code' ? 'profile' : 'ready'); 
        }, 200);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="page-container">
      <button className="back-button" onClick={handleBack}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {/* <span>Назад</span> */}
      </button>

      <div className="auth-page">
        {/* Регистрация */}
        {view === 'reg' && (
          <div className="lines">
            <h2>Добро пожаловать в AgentNest!</h2>
            <p>Создайте свою учетную запись</p>
            <div className="input-group">
              <div className="input-wrapper">
                <span className="input-label">Адрес электронной почты / номер телефона</span>
                <input type="text" />
              </div>
              
              <div className="input-wrapper">
                <span className="input-label">Пароль</span>
                <input type="password" />
              </div>
        
              <button className="page-button" onClick={() => setView('reg-code')}>Регистрация</button>
            </div>
            
          </div>
        )}

        {/* Вход */}
        {view === 'login' && (
          <div className="lines">
            <h2>Вход</h2>
            <p>или <a onClick={() => setView('reg')}>создайте учетную запись</a></p>
            <div className="input-group">
              <div className="input-wrapper">
                <span className="input-label">Адрес электронной почты / номер телефона</span>
                <input type="text" />
              </div>
              
              <div className="input-wrapper">
                <span className="input-label">Пароль</span>
                <input type="password" />
              </div>
              
              <button className="page-button" onClick={() => setView('login-code')}>Войти</button>
            </div>
            
            <a className="secondary-link">Забыли пароль?</a>
          </div>
        )}

        {/* Ввод кода */}
        {(view === 'reg-code' || view === 'login-code') && (
          <div className="lines">
            <h2>{view === 'reg-code' ? 'Регистрация' : 'Вход'}</h2>
            <p>Введите проверочный код</p>
            <div className="code-group">
              {[...Array(5)].map((_, i) => (
                <input 
                  key={i} 
                  type="text" 
                  maxLength={1} 
                  className="code-input"
                  ref={(el) => { inputRefs.current[i] = el; }}
                  onChange={(e) => handleInputChange(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Профиль */}
        {view === 'profile' && (
          <div className="lines">
            <h2 className="final">Познакомимся?</h2>
            <div className="input-group">
              <input type="text" placeholder="Ваше имя / никнейм" />
            </div>
            <button className="page-button" onClick={() => setView('ready')}>Далее</button>
          </div>
        )}

        {/* Готово */}
        {view === 'ready' && (
          <div className="lines">
            <h2 className="final final-ready">Все готово!</h2>
            <p>Добро пожаловать в AgentNest!</p>
            <button className="page-button" onClick={() => setView('main')}>Начать планировать</button>
          </div>
        )}
      </div>
    </div>
  );
};