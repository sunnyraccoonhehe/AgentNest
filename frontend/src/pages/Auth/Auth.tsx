import React, { useRef } from 'react';
import styles from './Auth.module.css'; 

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
    <div className={styles.container}>
      <button className={styles.backButton} onClick={handleBack}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className={styles.authPage}>
        {/* Регистрация */}
        {view === 'reg' && (
          <div className={styles.lines}>
            <h2>Добро пожаловать в AgentNest!</h2>
            <p>Создайте свою учетную запись</p>
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <span className={styles.inputLabel}>Email / Телефон</span>
                <input type="text" className={styles.inputField} />
              </div>
              <div className={styles.inputWrapper}>
                <span className={styles.inputLabel}>Пароль</span>
                <input type="password" className={styles.inputField} />
              </div>
              <button className={styles.pageButton} onClick={() => setView('reg-code')}>Регистрация</button>
            </div>
          </div>
        )}

        {/* Вход */}
        {view === 'login' && (
          <div className={styles.lines}>
            <h2>Вход</h2>
            <p>или <a onClick={() => setView('reg')}>создайте аккаунт</a></p>
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <span className={styles.inputLabel}>Email / Телефон</span>
                <input type="text" className={styles.inputField} />
              </div>
              <div className={styles.inputWrapper}>
                <span className={styles.inputLabel}>Пароль</span>
                <input type="password" className={styles.inputField} />
              </div>
              <button className={styles.pageButton} onClick={() => setView('login-code')}>Войти</button>
            </div>
          </div>
        )}

        {/* Код подтверждения */}
        {(view === 'reg-code' || view === 'login-code') && (
          <div className={styles.lines}>
            <h2>{view === 'reg-code' ? 'Регистрация' : 'Вход'}</h2>
            <p>Введите проверочный код</p>
            <div className={styles.codeGroup}>
              {[...Array(5)].map((_, i) => (
                <input 
                  key={i} 
                  type="text" 
                  maxLength={1} 
                  className={styles.codeInput}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  onChange={(e) => handleInputChange(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                />
              ))}
            </div>
          </div>
        )}

        {view === 'profile' && (
          <div className={styles.lines}>
            <h2 className={styles.final}>Познакомимся?</h2>
            <div className={styles.inputGroup}>
               <div className={styles.inputWrapper}>
                <input type="text" placeholder="Ваше имя / никнейм" className={styles.inputField} />
              </div>
            </div>
            <button className={styles.pageButton} onClick={() => setView('ready')}>Далее</button>
          </div>
        )}

        {view === 'ready' && (
          <div className={styles.lines}>
            <h2 className={`${styles.final} ${styles.finalReady}`}>Все готово!</h2>
            <p>Добро пожаловать в AgentNest!</p>
            <button className={styles.pageButton} onClick={() => setView('main')}>Начать планировать</button>
          </div>
        )}
      </div>
    </div>
  );
};