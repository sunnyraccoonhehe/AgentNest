import { useEffect, useState } from "react";
import styles from "./Daily.module.css";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import AddEventForm from "../../components/AddEventForm/AddEventForm";
import { useNavigate } from "react-router-dom";
import useIsMobile from "../../hooks/useIsMobile";
import { fetchEvents, deleteEvent } from "../../features/events/eventsSlice";
import { MdChevronLeft, MdChevronRight, MdDeleteOutline } from "react-icons/md";

const DAYS_SHORT = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS = [
	"Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
	"Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря",
];
const MONTHS_NOM = [
	"Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
	"Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

function monWeekday(date: Date): number {
	const d = date.getDay();
	return d === 0 ? 6 : d - 1;
}

function getWeekStart(date: Date): Date {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	d.setDate(d.getDate() - monWeekday(d));
	return d;
}

function getCurrentWeekDays(date: Date): Date[] {
	const monday = getWeekStart(date);
	return Array.from({ length: 7 }, (_, i) => {
		const d = new Date(monday);
		d.setDate(monday.getDate() + i);
		return d;
	});
}

function getDaysInMonth(year: number, month: number): number {
	return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
	const d = new Date(year, month, 1).getDay();
	return d === 0 ? 6 : d - 1;
}

function isSameDay(a: Date, b: Date): boolean {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

interface DailyProps {
	selectedDate?: Date;
	onBack?: () => void;
	isCalView?: boolean;
	customHeight?: number;
	customWidth?: number;
}

export default function Daily({ selectedDate: propDate, onBack, isCalView = true, customHeight, customWidth }: DailyProps) {

	const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchEvents());
	}, [dispatch]);

	const { events } = useAppSelector(state => state.events);

	const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

	const handleDeleteEvent = async (eventId: number) => {
		await dispatch(deleteEvent(eventId));
		setDeleteConfirm(null);
	};

	const navigate = useNavigate();
	const isMobile = useIsMobile();

	const today = new Date();
	const [selectedDate, setSelectedDate] = useState<Date>(propDate ?? today);
	const [showAddForm, setShowAddForm] = useState(false);

	const [calViewDate, setCalViewDate] = useState<Date>(() => {
		const d = propDate ?? today;
		return new Date(d.getFullYear(), d.getMonth(), 1);
	});

	const weekDays = getCurrentWeekDays(selectedDate);

	const dayEvents = events.filter(event => {
		const eventDate = new Date(event.startTime);
		return isSameDay(eventDate, selectedDate);
	});

	const hasEvents = (date: Date): boolean => {
		return events.some(event => isSameDay(new Date(event.startTime), date));
	};

	const handleBack = () => {
		if (onBack) onBack();
	};

	const handleAddEvent = () => {
		setShowAddForm(true);
	};

	const handlePrevMonth = () => {
		setCalViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
	};

	const handleNextMonth = () => {
		setCalViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
	};

	const calYear = calViewDate.getFullYear();
	const calMonth = calViewDate.getMonth();
	const daysInMonth = getDaysInMonth(calYear, calMonth);
	const firstDay = getFirstDayOfMonth(calYear, calMonth);

	const calendarCells: (number | null)[] = [
		...Array<null>(firstDay).fill(null),
		...Array.from({ length: daysInMonth }, (_, i) => i + 1),
	];

	const formatEventTime = (event: any) => {
		const start = new Date(event.startTime);
		const end = new Date(event.endTime);
		return `${start.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}–${end.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
	};

	const getEventIcon = (title: string) => {
		if (title.toLowerCase().includes('встреч')) return '👥';
		if (title.toLowerCase().includes('отчет')) return '📊';
		if (title.toLowerCase().includes('пробежк')) return '🏃';
		if (title.toLowerCase().includes('звонок')) return '📞';
		if (title.toLowerCase().includes('дедлайн')) return '⏰';
		if (title.toLowerCase().includes('созвон')) return '📞';
		if (title.toLowerCase().includes('обед')) return '🍽️';
		return '📌';
	};

	return (
		<div className={styles.planner} style={{
			maxHeight: customHeight ? `${customHeight}px` : '100%',
			maxWidth: customWidth ? `${customWidth}px` : '100%',
			overflowY: 'auto'
		}}>

			<div className={styles.header}>
				<div className={styles.headerLeft}>
					<button className={styles.backBtn} onClick={isMobile ? () => navigate(-1) : handleBack}><MdChevronLeft/></button>
					<div>
						<span className={styles.titleDate}>
							{selectedDate.getDate()} {MONTHS[selectedDate.getMonth()]}
						</span>
					</div>
				</div>
			</div>

			<div className={styles.weekStrip}>
				{weekDays.map((day, i) => {
					const isToday = isSameDay(day, today);
					const isSelected = isSameDay(day, selectedDate);

					const numClass = [
						styles.weekNum,
						isToday ? styles.weekNumToday : "",
						!isToday && isSelected ? styles.weekNumSelected : "",
					].filter(Boolean).join(" ");

					return (
						<div key={i} className={styles.weekDay} onClick={() => setSelectedDate(new Date(day))}>
							<span className={[styles.weekLabel, isToday ? styles.weekLabelToday : ""].filter(Boolean).join(" ")}>
								{DAYS_SHORT[i]}
							</span>
							<div className={numClass}>{day.getDate()}</div>
						</div>
					);
				})}
			</div>

			<div className={styles.summary}>
				<div className={styles.planTitle}>
					{isSameDay(selectedDate, today) ? "Сегодня по плану:" : "Планы на день:"}
				</div>
				<div className={styles.tags}>
					<div className={styles.tag}>
						<span>📋</span> {dayEvents.length} {dayEvents.length === 1 ? 'задача' : dayEvents.length >= 2 && dayEvents.length <= 4 ? 'задачи' : 'задач'}
					</div>
				</div>
			</div>

			{isCalView && (
				<div className={styles.miniCal}>
					{/* Шапка с навигацией по месяцам */}
					<div className={styles.calNav}>
						<button className={styles.calNavBtn} onClick={handlePrevMonth}><MdChevronLeft size={22}/></button>
						<span className={styles.calNavTitle}>
							{MONTHS_NOM[calMonth]} {calYear}
						</span>
						<button className={styles.calNavBtn} onClick={handleNextMonth}><MdChevronRight size={22}/></button>
					</div>

					<div className={styles.calGrid}>
						{DAYS_SHORT.map((d) => (
							<div key={d} className={styles.calHeader}>{d}</div>
						))}
						{calendarCells.map((cell, i) => {
							if (cell === null) return <div key={`empty-${i}`} />;

							const cellDate = new Date(calYear, calMonth, cell);
							const isToday = isSameDay(cellDate, today);
							const isSelected = isSameDay(cellDate, selectedDate);
							const hasEvent = hasEvents(cellDate);  // ← новое

							const cellClass = [
								styles.calCell,
								isToday && !isSelected ? styles.calCellToday : "",
								isSelected ? styles.calCellSelected : "",
							].filter(Boolean).join(" ");

							return (
								<div
									key={cell}
									className={cellClass}
									onClick={() => setSelectedDate(cellDate)}
								>
									{cell}
									{hasEvent && (        // ← новое
										<span className={[
											styles.calDot,
											isSelected ? styles.calDotSelected : "",
										].filter(Boolean).join(" ")} />
									)}
								</div>
							);
						})}
					</div>
				</div>
			)}

			<div className={styles.events}>
				{dayEvents.length === 0 ? (
					<div className={styles.noEvents}>
						<div className={styles.eventCard} style={{ justifyContent: 'center' }}>
							<span className={styles.eventLabel}>Нет задач на этот день</span>
						</div>
					</div>
				) : (
					dayEvents.map((event) => (
						<div
							key={event.id}
							className={`${styles.eventCard} ${expandedEvent === event.id ? styles.eventCardExpanded : ''}`}
							style={{ borderColor: event.color || '#F4A7B9' }}
							onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
						>
							<div className={styles.eventLeft}>
								<span className={styles.eventIcon}>{getEventIcon(event.title)}</span>
								<div className={styles.eventInfo}>
								<span className={styles.eventLabel}>{event.title}</span>
								<div className={styles.eventDescriptionWrapper}>
									<div className={styles.eventDescriptionInner}>
									<span className={styles.eventDescription}>
										{event.description || 'Без описания'}
									</span>
									</div>
								</div>
								</div>
							</div>
							<div className={styles.eventRight}>
								<span className={styles.eventTime} style={{ color: event.color || '#F4A7B9' }}>
									{formatEventTime(event)}
								</span>
								<button
									className={styles.deleteBtn}
									onClick={(e) => { e.stopPropagation(); setDeleteConfirm(event.id); }}
								>
									<MdDeleteOutline size={18} />
								</button>
							</div>
						</div>
					))
				)}

				<div className={styles.addBtn} onClick={handleAddEvent}>
					<span className={styles.addIcon}>＋</span> Добавить
				</div>
			</div>

			{showAddForm && (
				<AddEventForm
					onClose={() => setShowAddForm(false)}
					selectedDate={selectedDate}
				/>
			)}
			{deleteConfirm !== null && (
				<div className={styles.confirmOverlay} onClick={() => setDeleteConfirm(null)}>
					<div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
						<p className={styles.confirmText}>Удалить задачу?</p>
						<div className={styles.confirmButtons}>
							<button
								className={styles.confirmCancel}
								onClick={() => setDeleteConfirm(null)}
							>
								Отмена
							</button>
							<button
								className={styles.confirmDelete}
								onClick={() => handleDeleteEvent(deleteConfirm)}
							>
								Удалить
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}