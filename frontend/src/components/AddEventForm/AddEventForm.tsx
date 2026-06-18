import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createEvent } from '../../features/events/eventsSlice';
import type { AppDispatch } from '../../app/store';
import './AddEventForm.css';

interface AddEventFormProps {
	onClose: () => void;
	selectedDate?: Date; // ← добавляем пропс для выбранной даты
}

const AddEventForm: React.FC<AddEventFormProps> = ({ onClose, selectedDate }) => {
	const dispatch = useDispatch<AppDispatch>();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [startTime, setStartTime] = useState('10:00');
	const [endTime, setEndTime] = useState('11:00');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const formatDate = (date: Date) => {
		const y = date.getFullYear();
		const m = String(date.getMonth() + 1).padStart(2, '0');
		const d = String(date.getDate()).padStart(2, '0');
		return `${y}-${m}-${d}`;
	};

	const defaultDate = formatDate(selectedDate ?? new Date());

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title) { setError('Заполните название'); return; }

		setLoading(true);
		setError('');

		const startDateTime = `${defaultDate}T${startTime}:00`;
		const endDateTime = `${defaultDate}T${endTime}:00`;

		try {
				const result = await dispatch(createEvent({
						title,
						description,
						startTime: startDateTime,
						endTime: endDateTime,
						allDay: false,
						color: '#FF6B6B',
						recurring: false,
						categoryIds: []
				}));

				if (result.meta.requestStatus === 'rejected') {
						throw new Error('Ошибка создания задачи');
				}

				onClose(); 
		} catch {
				setError('Ошибка создания задачи');
		} finally {
				setLoading(false);
		}
	};

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<h2>Новая задача на {defaultDate}</h2>
				
				{error && <div className="error-message">{error}</div>}
				
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						placeholder="Название задачи *"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
					
					<textarea
						placeholder="Описание"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					
					<div className="time-row">
						<div className="time-input-group">
							<label>Начало</label>
							<input
								type="time"
								value={startTime}
								onChange={(e) => setStartTime(e.target.value)}
							/>
						</div>
						<div className="time-input-group">
							<label>Конец</label>
							<input
								type="time"
								value={endTime}
								onChange={(e) => setEndTime(e.target.value)}
							/>
						</div>
					</div>
					
					<div className="modal-buttons">
						<button type="submit" disabled={loading}>
							{loading ? 'Создание...' : 'Создать'}
						</button>
						<button type="button" onClick={onClose}>Отмена</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddEventForm;