import React, { useRef } from 'react';
import styles from './Auth.module.css';
import { LabeledInput } from './components/LabeledInput';
import { PageButton } from './components/PageButton';
import { CodeInputs } from './components/CodeInputs';

export type AuthView =
  | 'main'
  | 'reg'
  | 'login'
  | 'reg-code'
  | 'login-code'
  | 'profile'
  | 'ready';

interface AuthProps {
  view: AuthView;
  setView: React.Dispatch<React.SetStateAction<AuthView>>;
  onStartPlanning?: () => void;
}

export const AuthPages: React.FC<AuthProps> = ({ view, setView, onStartPlanning }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (view === 'main') return null;

  const handleBack = () => {
    const routes: Partial<Record<AuthView, AuthView>> = {
      'reg': 'main',
      'login': 'main',
      'reg-code': 'reg',
      'login-code': 'login',
      'profile': 'reg-code',
      'ready': 'main'
    };
    setView(routes[view] ?? 'main');
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
              <LabeledInput
                classNameWrapper={styles.inputWrapper}
                classNameLabel={styles.inputLabel}
                classNameInput={styles.inputField}
                label="Адрес электронной почты / номер телефона"
              />
              <LabeledInput
                classNameWrapper={styles.inputWrapper}
                classNameLabel={styles.inputLabel}
                classNameInput={styles.inputField}
                label="Пароль"
                type="password"
              />
              <PageButton className={styles.pageButton} onClick={() => setView('reg-code')}>
                Регистрация
              </PageButton>
            </div>
          </div>
        )}

        {/* Вход */}
        {view === 'login' && (
          <div className={styles.lines}>
            <h2>Вход</h2>
            <p>или <a onClick={() => setView('reg')}>создайте аккаунт</a></p>
            <div className={styles.inputGroup}>
              <LabeledInput
                classNameWrapper={styles.inputWrapper}
                classNameLabel={styles.inputLabel}
                classNameInput={styles.inputField}
                label="Адрес электронной почты / номер телефона"
              />
              <LabeledInput
                classNameWrapper={styles.inputWrapper}
                classNameLabel={styles.inputLabel}
                classNameInput={styles.inputField}
                label="Пароль"
                type="password"
              />
              <PageButton className={styles.pageButton} onClick={() => setView('login-code')}>
                Войти
              </PageButton>
            </div>
          </div>
        )}

        {/* Код подтверждения */}
        {(view === 'reg-code' || view === 'login-code') && (
          <div className={styles.lines}>
            <h2>{view === 'reg-code' ? 'Регистрация' : 'Вход'}</h2>
            <p>Введите проверочный код</p>
            <CodeInputs
              classNameGroup={styles.codeGroup}
              classNameInput={styles.codeInput}
              inputRefs={inputRefs}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        )}

        {view === 'profile' && (
          <div className={styles.lines}>
            <h2 className={styles.final}>Познакомимся?</h2>
            <div className={styles.inputGroup}>
              <LabeledInput
                classNameWrapper={styles.inputWrapper}
                classNameLabel={styles.inputLabel}
                classNameInput={styles.inputField}
                label="Ваше имя / никнейм"
              />
            </div>
            <PageButton className={styles.pageButton} onClick={() => setView('ready')}>
              Далее
            </PageButton>
          </div>
        )}

        {view === 'ready' && (
          <div className={styles.lines}>
            <h2 className={`${styles.final} ${styles.finalReady}`}>Все готово!</h2>
            <p>Добро пожаловать в AgentNest!</p>
            <PageButton
              className={styles.pageButton}
              onClick={() => (onStartPlanning ? onStartPlanning() : setView('main'))}
            >
              Начать планировать
            </PageButton>
          </div>
        )}
      </div>
    </div>
  );
};