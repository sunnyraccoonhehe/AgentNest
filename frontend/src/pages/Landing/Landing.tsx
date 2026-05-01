import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import rhombus from '@assets/Vector.svg'
import logoBlack from '@assets/logo_black.svg'
import logoPink from '@assets/logo_pink.svg'
import profile from '@assets/profile.svg'
import chat from '@assets/chat.svg'
import sun from '@assets/sun.svg'
import moon from '@assets/moon.svg' 

import style from './Landing.module.css'

function Landing({ theme, toggleTheme }) {
    const [step, setStep] = useState(0);
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

    return (
        <div className={`${style['full-screen']} ${step >= 4 ? style['final-stage'] : ''} ${theme === 'light' ? style['light-theme'] : ''}`}>
            <div className={style["nav-bar"]}>
                <div className={style["top-icons"]}>
                    <img className={style.icon} src={profile} alt="profile" />
                    <img className={style.icon} src={chat} alt="chat" />
                    <img 
                        className={style.icon} 
                        src={theme === 'dark' ? sun : moon} 
                        alt="theme toggle" 
                        onClick={toggleTheme} 
                    />
                </div>
                <div className={style.auth}>
                    <Link to="/auth?view=login">Вход</Link> / <Link to="/auth?view=reg">Регистрация</Link>
                </div>
            </div>

            <div className={style["rhombus-container"]}>
                <img 
                    src={rhombus} 
                    alt="rhombus"
                    className={`${style['rhombus-svg']} ${step >= 1 ? style['shown'] : ''} ${step >= 2 ? style['expanded'] : ''}`} 
                />
            </div>

            <div className={`${style['logo-wrapper']} ${step >= 3 ? `${style['falling']}` : ''} ${step >= 4 ? `${style['switched']}` : ''} ${step >= 5 ? `${style['move-up']}` : ''}`}>
                <img src={logoBlack} className={`${style["logo"]} ${style['black']}`}/>
                <img src={logoPink} className={`${style["logo"]} ${style['pink']}`} />
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