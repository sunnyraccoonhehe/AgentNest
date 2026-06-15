import { useState } from "react";
import styles from "./Daily.module.css";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import AddEventForm from "../../components/AddEventForm/AddEventForm";

const DAYS_SHORT = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS = [
	"Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
	"Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря",
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
	const dispatch = useAppDispatch();
	const { events } = useAppSelector(state => state.events);
	
	const today = new Date();
	const [selectedDate, setSelectedDate] = useState<Date>(propDate ?? today);
	const [showAddForm, setShowAddForm] = useState(false);
	const weekDays = getCurrentWeekDays(selectedDate);

	// Загружаем события при изменении д

	// Фильтруем события для выбранной даты
	const dayEvents = events.filter(event => {
		const eventDate = new Date(event.startTime);
		return isSameDay(eventDate, selectedDate);
	});

	const handleBack = () => {
		if (onBack) onBack();
	};

	const handleAddEvent = () => {
		setShowAddForm(true);
	};

	const calYear = selectedDate.getFullYear();
	const calMonth = selectedDate.getMonth();
	const daysInMonth = getDaysInMonth(calYear, calMonth);
	const firstDay = getFirstDayOfMonth(calYear, calMonth);

	const calendarCells: (number | null)[] = [
		...Array<null>(firstDay).fill(null),
		...Array.from({ length: daysInMonth }, (_, i) => i + 1),
	];

	// Форматирование времени для отображения
	const formatEventTime = (event: any) => {
		const start = new Date(event.startTime);
		const end = new Date(event.endTime);
		return `${start.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}–${end.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
	};

	// Получение иконки по названию события
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
		<div className={styles.planner} style={
			{
				maxHeight: customHeight ? `${customHeight}px` : '100%',
				maxWidth: customWidth ? `${customWidth}px` : '100%',
				overflowY: 'auto'
			}}>

			<div className={styles.header}>
				<div className={styles.headerLeft}>
					<button className={styles.backBtn} onClick={handleBack}>‹</button>
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
					]
						.filter(Boolean)
						.join(" ");

					return (
						<div
							key={i}
							className={styles.weekDay}
							onClick={() => setSelectedDate(new Date(day))}
						>
							<span
								className={[
									styles.weekLabel,
									isToday ? styles.weekLabelToday : "",
								]
									.filter(Boolean)
									.join(" ")}
							>
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
					<div className={styles.calGrid}>
						{DAYS_SHORT.map((d) => (
							<div key={d} className={styles.calHeader}>{d}</div>
						))}
						{calendarCells.map((cell, i) => {
							if (cell === null) return <div key={`empty-${i}`} />;

							const cellDate = new Date(calYear, calMonth, cell);
							const isToday = isSameDay(cellDate, today);
							const isSelected = isSameDay(cellDate, selectedDate);

							const cellClass = [
								styles.calCell,
								isToday && !isSelected ? styles.calCellToday : "",
								isSelected ? styles.calCellSelected : "",
							]
								.filter(Boolean)
								.join(" ");

							return (
								<div
									key={cell}
									className={cellClass}
									onClick={() => setSelectedDate(cellDate)}
								>
									{cell}
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
							className={styles.eventCard}
							style={{ borderColor: event.color || '#F4A7B9' }}
						>
							<div className={styles.eventLeft}>
								<span className={styles.eventIcon}>{getEventIcon(event.title)}</span>
								<span className={styles.eventLabel}>{event.title}</span>
							</div>
							<span
								className={styles.eventTime}
								style={{ color: event.color || '#F4A7B9' }}
							>
								{formatEventTime(event)}
							</span>
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
		</div>
	);
}