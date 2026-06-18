import { useState } from 'react';
import style from './Header.module.css'

import burg from '@assets/burg.svg';
import profile from '@assets/profile.svg';
import sun from '@assets/sun.svg';
import moon from '@assets/moon.svg'
import { useAppDispatch, useAppSelector } from '../../../../hooks/useAppDispatch';
import { toggleTheme } from '../../../../features/theme/themeSlice';
import useIsMobile from '../../../../hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import UserPopup from '../UserPopup/UserPopup';

type HeaderProps = {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const WEEKDAYS = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];

const Header = ({isOpen, setIsOpen}: HeaderProps) => {
	const isMobile = useIsMobile();
	const dispatch = useAppDispatch()
	const theme = useAppSelector(state => state.theme.mode)
	const today = new Date();
	const weekday = WEEKDAYS[today.getDay()];
	const day = today.getDate();
	const navigate = useNavigate();

	const [showUserPopup, setShowUserPopup] = useState(false);

	const handleProfileClick = () => {
		setShowUserPopup(true);
	};

	return (
		<>
			{isMobile ? (
				<div className={style['fixed-header']} style={{padding: '5px'}}>
					<div className={style['aside-cont']}>
						
						<aside className={`${style.asideMobile} ${isOpen ? style.asideOpen : ''}`}>
							<div className={style['left-placeholder']}></div>

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
							<button className={style.iconBtn} onClick={handleProfileClick}>
								<img src={profile} alt="profile" />
							</button>
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
								<button className={style.iconBtn} onClick={handleProfileClick}>
									<img src={profile} alt="profile" />
								</button>
								<button className={style.iconBtn} onClick={() => dispatch(toggleTheme())}>
									<img src={theme === 'dark' ? sun : moon} alt="theme toggle" />
								</button>
							</div>
							
						</aside>
					</div>
				</div>
			)}

			{showUserPopup && <UserPopup onClose={() => setShowUserPopup(false)} />}
		</>
	)
}
export default Header;