import { useState, useEffect } from 'react'
import { AuthPages } from '../Auth/Auth'
import rhombus from '@assets/Vector.svg'
import logoBlack from '@assets/logo_black.svg'
import logoPink from '@assets/logo_pink.svg'
import icon1 from '@assets/icon1.svg'
import icon2 from '@assets/icon2.svg'
import icon3 from '@assets/icon3.svg'
import icon4 from '@assets/icon4.svg'
import style from './Landing.module.css'

function Landing() {
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
        <div className={`${style['full-screen']} ${step >= 4 ? `${style['final-stage']}` : ''}`}>
        <div className={style["nav-bar"]}>
            <div className={style["top-icons"]}>
            {[icon1, icon2, icon3, icon4].map((icon, i) => (
                <img key={i} className={style.icon} src={icon} alt={style["nav-icon"]} />
            ))}
            </div>
            <div className={style.auth}>
            <a onClick={() => setView('login')}>Вход</a> / <a onClick={() => setView('reg')}>Регистрация</a>
            </div>
        </div>

        {view === 'main' && (
            <>
            <div className={style["rhombus-container"]}>
                <img 
                src={rhombus} 
                className={`${style['rhombus-svg']} ${step >= 1 ? `${style['shown']}` : ''} ${step >= 2 ? `${style['expanded']}` : ''}`} 
                />
            </div>
            <div className={`${style['logo-wrapper']} ${step >= 3 ? `${style['falling']}` : ''} ${step >= 4 ? `${style['switched']}` : ''} ${step >= 5 ? `${style['move-up']}` : ''}`}>
                <img src={logoBlack} className={`${style["logo" ]} ${style['black']}`}/>
                <img src={logoPink} className={`${style["logo" ]} ${style['pink']}`} />
            </div>
            <button className={`${style['main-button']} ${step >= 5 ? `${style['visible']}` : ''}`} onClick={() => setView('reg')}>
                Начать планировать
            </button>
            </>
        )}

        <AuthPages view={view} setView={setView} /> //в роуты добавь!
        </div>
    )
}

export default Landing;