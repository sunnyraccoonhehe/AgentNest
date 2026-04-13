import AgentOffice from '../../components/AgentOffice/AgentOffice';
import Calendar from '../../components/Calendar/Calendar';
import Console from '../../components/Console/Console';
import style from './Plannery.module.css';

function Plannery() {
    return (
        <div className={style.container}>

            <aside>
                aside menu
            </aside>

            <div className={style['main-content']}>
                <div className={style['left-content']}>
                    <div className={style['agent-office']}>
                        <AgentOffice/>
                    </div>
                    <div className={style.console}>
                        <Console/>
                    </div>
                    <button className={style['add-btn']}>
                        plus
                    </button>
                </div>
                <div className={style['right-content']}>
                    <div className={style.calendar}>
                        <Calendar/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Plannery