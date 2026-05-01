import { useState, useRef, useEffect } from 'react';
import AgentOffice from '../../components/AgentOffice/AgentOffice';
import Calendar from '../../components/Calendar/Calendar';
import Console from '../../components/Console/Console';
import style from './Plannery.module.css';
import plus from '@assets/plus.svg';
import burg from '@assets/burg.svg';
import profile from '@assets/profile.svg';
import chat from '@assets/chat.svg';
import sun from '@assets/sun.svg';
import moon from '@assets/moon.svg'

function Plannery({ theme, toggleTheme }) {
    const [isOpen, setIsOpen] = useState(false);
    const [blockHeight, setBlockHeight] = useState(0);

    const leftBlockRef = useRef(null);

    useEffect(() => {
        if (leftBlockRef.current) {
            setBlockHeight(leftBlockRef.current.getBoundingClientRect().height);
        }
    }, [leftBlockRef]);

    const handleOverlayClick = () => {
        setIsOpen(false);
    };

    return (
        <div className={`${style.container} ${isOpen ? style.menuOpen : ''}`}>
            {
                isOpen && (
                    <div 
                        className={`${style.overlay} ${isOpen ? style.overlayOpen : ''}`} 
                        onClick={handleOverlayClick}
                    />
                )
            }
            
            <div className={style['aside-cont']}>
                <aside className={`${style.aside} ${isOpen ? style.asideOpen : ''}`}>
                    <button 
                        className={style['burg-btn']} 
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <img src={burg} alt='menu' />
                    </button>

                    {
                        isOpen && (
                            <div className={style.menuIcons}>
                                <button className={style.iconBtn}><img src={profile} alt="profile" /></button>
                                <button className={style.iconBtn}><img src={chat} alt="chat" /></button>
                                
                                {/* Кнопка переключения */}
                                <button className={style.iconBtn} onClick={toggleTheme}>
                                    <img src={theme === 'dark' ? sun : moon} alt="theme toggle" />
                                </button>
                            </div>
                        )
                    }
                    
                </aside>
            </div>

            <div className={style['main-content']}>
                
                <div  className={style['left-content']}>
                    <div className={style['left-content']} ref={leftBlockRef}>
                        <div className={style['agent-office']}>
                            <AgentOffice/>
                        </div>
                        <div className={style.console}>
                            <Console/>
                        </div>
                    </div>
                    <div>
                        <button className={style['add-btn']}>
                            <img src={plus} alt='add' />
                        </button>
                    </div>
                </div>
                
                <div className={style['right-content']}>
                    <div className={style.calendar}>
                        <Calendar customHeight={blockHeight}/>
                    </div>
                </div>
               

            </div>
        </div>
    );
}

export default Plannery;