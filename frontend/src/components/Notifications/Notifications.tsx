import { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import styles from './Notifications.module.css';

interface Notification {
	id: string;
	title: string;
	startTime: string;
}

export default function Notifications() {
	const [notifications, setNotifications] = useState<Notification[]>([]);

	useEffect(() => {
		const check = async () => {
			try {
				const { data } = await api.get('events/reminders/pending');
				if (data.length > 0) {
					const newOnes = data.map((n: any) => ({
						...n,
						id: Date.now().toString() + Math.random(),
					}));
					setNotifications(prev => [...prev, ...newOnes]);
				}
			} catch {}
		};

		check();
		const interval = setInterval(check, 30000);
		return () => clearInterval(interval);
	}, []);

	const dismiss = (id: string) => {
		setNotifications(prev => prev.filter(n => n.id !== id));
	};

	if (notifications.length === 0) return null;

	return (
		<div className={styles.container}>
			{notifications.map(n => (
				<div key={n.id} className={styles.toast}>
					<div className={styles.icon}>🔔</div>
					<div className={styles.content}>
						<div className={styles.title}>{n.title}</div>
						<div className={styles.time}>
							{new Date(n.startTime).toLocaleTimeString('ru-RU', {
								hour: '2-digit', minute: '2-digit'
							})}
						</div>
					</div>
					<button className={styles.close} onClick={() => dismiss(n.id)}>✕</button>
				</div>
			))}
		</div>
	);
}