import { useState, useRef, useEffect } from 'react';
import AgentOffice from '../../components/AgentOffice/AgentOffice';
import Calendar from '../../components/Calendar/Calendar';
import Console from '../../components/Console/Console';
import Daily from '../Daily/Daily';
import style from './Plannery.module.css';
import Header from './components/Header/Header.tsx';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchEventsByMonth } from '../../features/events/eventsSlice';
import { sendMessage, fetchHistory } from '../../features/chat/chatSlice';
import type { ConsoleMessage } from '../../types/types';
import Notifications from '../../components/Notifications/Notifications';

function PlanneryDesktop() {

	const dispatch = useAppDispatch();
	const { events } = useAppSelector(state => state.events);

	const { history } = useAppSelector(state => state.chat);

	useEffect(() => {
		dispatch(fetchHistory());
	}, []);

	const handleChatSend = async (text: string, addMessage: (msg: ConsoleMessage) => void) => {
		try {
			const reply = await dispatch(sendMessage(text)).unwrap();

			addMessage({
				id: Date.now().toString(),
				agent: 'assistant',
				agentColor: '#fe88f2',
				text: reply,
				timestamp: new Date(),
				type: 'success',
			});

			dispatch(fetchEventsByMonth({
				year: today.getFullYear(),
				month: today.getMonth() + 1,
			}));

		} catch {
			addMessage({
				id: Date.now().toString(),
				agent: 'assistant',
				agentColor: '#f87171',
				text: 'Ошибка соединения с ИИ',
				timestamp: new Date(),
				type: 'error',
			});
		}
	};

	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [showDaily, setShowDaily] = useState(false); // ← новый стейт
	const today = new Date();

	useEffect(() => {
		dispatch(fetchEventsByMonth({
		year: today.getFullYear(),
		month: today.getMonth() + 1
		}));
	}, []);
  
	const [isOpen, setIsOpen] = useState(false);
	const [blockHeight, setBlockHeight] = useState(0);

	const eventDates = events.map(e => new Date(e.startTime));
	const leftBlockRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (leftBlockRef.current) {
		setBlockHeight(leftBlockRef.current.getBoundingClientRect().height);
		}
	}, [leftBlockRef]);

	const handleOverlayClick = () => setIsOpen(false);

	const handleMonthChange = (year: number, month: number) => {
		dispatch(fetchEventsByMonth({ year, month }));
	};

	const handleSelectDate = (date: Date) => {
		setSelectedDate(date);
		setShowDaily(true);
	};

	const handleBackToCalendar = () => {
		setShowDaily(false);
	};



return (
	<div className={`${style.container} ${isOpen ? style.menuOpen : ''}`}>
		<Notifications/>
	<div 
		className={`${style.overlay} ${isOpen ? style.overlayOpen : ''}`} 
		onClick={handleOverlayClick}
	/>
	
	<Header isOpen={isOpen} setIsOpen={setIsOpen} />

	<div className={style['main-content']}>
		<div className={style['left-content']}>
		<div className={style['left-top']} ref={leftBlockRef}>
			<div className={style['agent-office']}>
			<AgentOffice/>
			</div>
			<div className={style.console}>
			<Console
				messages={history.length > 0 ? history : undefined}
				onSend={handleChatSend}
			/>
			</div>
		</div>
		</div>

		<div className={style['right-content']}>
		{showDaily ? (
			<Daily 
			customHeight={blockHeight}
			customWidth={380}
			isCalView={false}
			selectedDate={selectedDate ?? new Date()} 
			onBack={handleBackToCalendar} // ← кнопка назад
			/>
		) : (
			<div className={style.calendar}>
			<Calendar 
				onMonthChange={handleMonthChange}
				selectedDate={selectedDate}
				onSelectDate={handleSelectDate}
				plans={eventDates}
				customHeight={blockHeight}
			/>
			</div>
		)}
		</div>
	</div>
	</div>
	);
}

export default PlanneryDesktop;