import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import rhombus from '@assets/Vector.svg'
import logoBlack from '@assets/logo_black.svg'
import logoPink from '@assets/logo_pink.svg'
import profile from '@assets/profile.svg'
import sun from '@assets/sun.svg'
import moon from '@assets/moon.svg' 

import style from './Landing.module.css'
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch'
import { toggleTheme } from '../../features/theme/themeSlice'

function Landing() {
    const dispatch = useAppDispatch();
    const theme = useAppSelector(state => state.theme.mode);
    const [step, setStep] = useState(0);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate()

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

    useEffect(() => {
        const setHeight = () => {
            setViewportHeight(window.innerHeight);
            document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        };
        
        setHeight();
        window.addEventListener('resize', setHeight);
        window.addEventListener('orientationchange', setHeight);
        
        return () => {
            window.removeEventListener('resize', setHeight);
            window.removeEventListener('orientationchange', setHeight);
        };
    }, []);

    const handleProfileClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowPopup(prev => !prev);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <div 
            className={`${style['full-screen']} ${step >= 4 ? style['final-stage'] : ''} ${theme === 'light' ? style['light-theme'] : ''}`}
            style={{ minHeight: viewportHeight }}
        >
            <div className={style["nav-bar"]}>
                <div className={style["top-icons"]}>
                    <img 
                        className={style.icon} 
                        src={profile} 
                        alt="profile" 
                        onClick={handleProfileClick}
                    />
                    <img 
                        className={style.icon} 
                        src={theme === 'dark' ? sun : moon} 
                        alt="theme toggle" 
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(toggleTheme());
                        }} 
                    />
                </div>
                <div className={style.auth}>
                    <Link to="/auth?view=login">Вход</Link> / <Link to="/auth?view=reg">Регистрация</Link>
                </div>
            </div>

            {/* Попап по центру экрана */}
            {showPopup && (
                <>
                    <div className={style['popup-overlay']} onClick={handleClosePopup} />
                    <div className={style['popup-center']}>
                        <button 
                            className={style['popup-close']} 
                            onClick={handleClosePopup}
                        >
                            ×
                        </button>
                        <p className={style['popup-message']}>
                            Присоединяйтесь к нам, нажав на надпись{' '}
                            <Link to="/auth?view=reg" className={style['popup-link']}>
                                Регистрация
                            </Link>
                        </p>
                    </div>
                </>
            )}

            <div className={style["rhombus-container"]}>
                <img 
                    src={rhombus} 
                    alt="rhombus"
                    className={`${style['rhombus-svg']} ${step >= 1 ? style['shown'] : ''} ${step >= 2 ? style['expanded'] : ''}`} 
                />
            </div>

            <div className={`${style['logo-wrapper']} ${step >= 3 ? `${style['falling']}` : ''} ${step >= 4 ? `${style['switched']}` : ''} ${step >= 5 ? `${style['move-up']}` : ''}`}>
                <img src={logoBlack} className={`${style["logo"]} ${style['black']}`} alt="logo black" />
                <img src={logoPink} className={`${style["logo"]} ${style['pink']}`} alt="logo pink" />
            </div>

            <button
                className={`${style['main-button']} ${step >= 5 ? style['visible'] : ''}`}
                onClick={() => navigate('/auth?view=reg')}
            >
                Начать планировать
            </button>
        </div>
    )
}

export default Landing;