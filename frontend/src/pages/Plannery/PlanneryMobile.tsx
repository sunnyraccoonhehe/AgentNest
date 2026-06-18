import { useState } from "react";
import style from './Plannery.module.css';
import Header from "./components/Header/Header";
import AgentOffice from "../../components/AgentOffice/AgentOffice";
import AddEventForm from "../../components/AddEventForm/AddEventForm";
import { useNavigate } from "react-router-dom";

function PlanneryMobile() {
	const [isOpen, setIsOpen] = useState(false);
	const [showAddForm, setShowAddForm] = useState(false);
	const navigate = useNavigate();

	const handleOverlayClick = () => {
		setIsOpen(false);
	};
	
	return (
		<div className={`${style.container} ${isOpen ? style.menuOpen : ''}`}>
			<div 
				className={`${style.overlay} ${isOpen ? style.overlayOpen : ''}`} 
				onClick={handleOverlayClick}
			/>
			
			<Header
				isOpen={isOpen}
				setIsOpen={setIsOpen}
			/>
			
			<div className={style['main-content']}>
				<div className={style['left-content']}>
					<div className={style['left-top']}>
						<div className={style['agent-office']}>
							<AgentOffice/>
						</div>
					</div>
				</div>
				
				<div className={style['mobile-buttons']}>
					<button 
						className={style['btn-plan']} 
						onClick={() => navigate('/chat')}
					>
						Спланировать
					</button>
					
					<button 
						className={style['btn-add-mobile']}
						onClick={() => setShowAddForm(true)}
					>
						+ Новая задача
					</button>
				</div>
			</div>

			{showAddForm && (
				<AddEventForm onClose={() => setShowAddForm(false)} />
			)}
		</div>
	)
}

export default PlanneryMobile;