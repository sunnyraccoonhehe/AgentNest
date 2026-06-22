import React, { useRef, useState } from 'react';
import styles from './Auth.module.css';
import { LabeledInput } from './components/LabeledInput';
import { PageButton } from './components/PageButton';
import { CodeInputs } from './components/CodeInputs';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { login, register, updateProfile } from '../../features/auth/authSlice';

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

export const Auth: React.FC<AuthProps> = ({ view, setView, onStartPlanning }) => {

	const dispatch = useAppDispatch();
	
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
	
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [phone] = useState('');
	const [username, setUsername] = useState('');
	const [code, setCode] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

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
		setError('');
		setCode('');
	};

	const handleLogin = async () => {
		const result = await dispatch(login({ email, password }));
		if (login.fulfilled.match(result) && onStartPlanning) {
			onStartPlanning();
		}
	};

	const handleRegister = async () => {
		const result = await dispatch(register({ email, password }));
		if (register.fulfilled.match(result)) {
			username ? setView('ready') : setView('profile');
		}
	};

	const handleUpdateProfile = async () => {
		const result = await dispatch(updateProfile({ username }));
		if (updateProfile.fulfilled.match(result)) {
			setView('ready');
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const { value } = e.target;
		const newCode = code.split('');
		newCode[index] = value;
		const fullCode = newCode.join('');
		setCode(fullCode);
		
		if (value.length === 1 && index < 4) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
		if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
			const newCode = code.slice(0, -1);
			setCode(newCode);
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
				{error && (
					<div style={{ color: '#ff4444', textAlign: 'center', marginBottom: '15px', padding: '10px', background: 'rgba(255,68,68,0.1)', borderRadius: '8px' }}>
						{error}
					</div>
				)}

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
								value={email}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
							/>
							<LabeledInput
								classNameWrapper={styles.inputWrapper}
								classNameLabel={styles.inputLabel}
								classNameInput={styles.inputField}
								label="Пароль"
								type="password"
								value={password}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
							/>
							<PageButton 
								className={styles.pageButton} 
								onClick={handleRegister}
								disabled={loading}
							>
								{loading ? 'Регистрация...' : 'Регистрация'}
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
								value={email}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
							/>
							<LabeledInput
								classNameWrapper={styles.inputWrapper}
								classNameLabel={styles.inputLabel}
								classNameInput={styles.inputField}
								label="Пароль"
								type="password"
								value={password}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
							/>
							<PageButton 
								className={styles.pageButton} 
								onClick={handleLogin}
								disabled={loading}
							>
								{loading ? 'Вход...' : 'Войти'}
							</PageButton>
						</div>
					</div>
				)}

				{/* Код подтверждения (пока не используется) */}
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

				{/* Профиль */}
				{view === 'profile' && (
					<div className={styles.lines}>
						<h2 className={styles.final}>Познакомимся?</h2>
						<div className={styles.inputGroup}>
							<LabeledInput
								classNameWrapper={styles.inputWrapper}
								classNameLabel={styles.inputLabel}
								classNameInput={styles.inputField}
								label="Ваше имя / никнейм"
								value={username}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
							/>
						</div>
						<PageButton 
							className={styles.pageButton} 
							onClick={handleUpdateProfile}
							disabled={loading}
						>
							{loading ? 'Сохранение...' : 'Далее'}
						</PageButton>
					</div>
				)}

				{/* Готово */}
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