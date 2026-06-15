import style from './Header.module.css'

import burg from '@assets/burg.svg';
import profile from '@assets/profile.svg';
import chat from '@assets/chat.svg';
import sun from '@assets/sun.svg';
import moon from '@assets/moon.svg'
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppDispatch';
import { toggleTheme } from '../../../features/theme/themeSlice';
import useIsMobile from '../../../hooks/useIsMobile';
import { IoSettingsSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

type HeaderProps = {

	isOpen: boolean;
	setIsOpen: React.Dispatch<
		React.SetStateAction<boolean>
	>;

};

const WEEKDAYS = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];

const Header = ({isOpen, setIsOpen}: HeaderProps) => {
	const isMobile = useIsMobile();

	const dispatch = useAppDispatch()

	const theme = useAppSelector(
		state => state.theme.mode
	)

	const today = new Date();

	const weekday = WEEKDAYS[today.getDay()];
	const day = today.getDate();

	const navigate = useNavigate();

	return isMobile 
	? (
		<div className={style['fixed-header']} style={{padding: '5px'}}>
			<div className={style['aside-cont']}>
				
				<aside className={`${style.asideMobile} ${isOpen ? style.asideOpen : ''}`}>
					<button
						className={style['setting-btn']}
					>
						<IoSettingsSharp color='white' size={30}/>
					</button>

					<div className={style['left-btn']}>
						<button className={style['calendar-btn']} onClick={() => navigate('/daily')}>
							<div className={style.weekday}>{weekday}</div>
							<div className={style.day}>{day}</div>
							
						</button>
						<button 
							className={style['burg-btn']} 
							onClick={() => setIsOpen(!isOpen)}
						>
							<img src={burg} alt='menu' />
						</button>
					</div>
				</aside>

				<div className={`${style.menuIconsMobile} ${isOpen ? style.menuIconsMobileOpen : ''}`}>
					<button className={style.iconBtn}><img src={profile} alt="profile" /></button>
					<button className={style.iconBtn}><img src={chat} alt="chat" /></button>
					<button className={style.iconBtn} onClick={() => dispatch(toggleTheme())}>
						<img src={theme === 'dark' ? sun : moon} alt="theme toggle" />
					</button>
				</div>
			
			</div>
		</div>
	) : (
		<div className={style['fixed-header']}>
			<div className={style['aside-cont']}>
				<aside className={`${style.aside} ${isOpen ? style.asideOpen : ''}`}>
					<button 
						className={style['burg-btn']} 
						onClick={() => setIsOpen(!isOpen)}
					>
						<img src={burg} alt='menu' />
					</button>

					<div className={`${style.menuIcons} ${isOpen ? style.menuIconsOpen : ''}`}>
						<button className={style.iconBtn}><img src={profile} alt="profile" /></button>
						<button className={style.iconBtn}><img src={chat} alt="chat" /></button>
						<button className={style.iconBtn} onClick={() => dispatch(toggleTheme())}>
							<img src={theme === 'dark' ? sun : moon} alt="theme toggle" />
						</button>
					</div>
					
				</aside>
			</div>
		</div>
	)
}
export default Header;