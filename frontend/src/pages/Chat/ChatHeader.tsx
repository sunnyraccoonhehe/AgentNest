import { IoChevronBack } from 'react-icons/io5';
import styles from './ChatHeader.module.css';
import { useNavigate } from 'react-router-dom';

export default function ChatHeader() {
	const navigate = useNavigate();
	return (
	<header className={styles.header}>
		<div onClick={() => navigate('/user')}>
			<IoChevronBack size={20} />
		</div>
		<div>
		<h1 className={styles.title}>AI чатик</h1>
		<p className={styles.subtitle}>Нова к Вашим услугам</p>
		</div>

		<button className={styles.menuButton}>⋯</button>
	</header>
	);
}