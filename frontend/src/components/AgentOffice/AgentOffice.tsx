import office from '@assets/images/office.png'

import style from './AgentOffice.module.css'

const AgentOffice: React.FC = () => {
    return (
        <>
            <img className={style['office']} src={office} alt='office' />
        </>
    )
}

export default AgentOffice;