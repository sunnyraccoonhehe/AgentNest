import React, { useEffect, useRef, useState } from 'react';
import styles from './Console.module.css';
import type { ConsoleMessage } from '../../types/types';

interface ConsoleProps {
	messages?: ConsoleMessage[];
	onSend?: (text: string, addMessage: (msg: ConsoleMessage) => void) => void;
}

const TYPE_SYMBOLS: Record<string, string> = {
	info: '●',
	success: '✔',
	error: '✖',
	warn: '▲',
};

const TYPE_CLASSES: Record<string, string> = {
	info: styles.typeInfo,
	success: styles.typeSuccess,
	error: styles.typeError,
	warn: styles.typeWarn,
};

const formatTime = (date: Date | string) =>
	new Date(date).toLocaleTimeString('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	});

const DEMO_MESSAGES: ConsoleMessage[] = [
	{
		id: '1',
		agent: 'assistant',
		text: 'Привет! Напиши запрос и я помогу тебе оптимизировать твое время!',
		timestamp: new Date(Date.now() - 12000),
		type: 'info',
	},
];

const Console: React.FC<ConsoleProps> = ({ messages: externalMessages, onSend }) => {
	const bodyRef = useRef<HTMLDivElement>(null);

	// ✅ один источник правды
	const messages = externalMessages?.length ? externalMessages : DEMO_MESSAGES;

	const [visible, setVisible] = useState<Set<string>>(new Set());

	const prevIds = useRef<Set<string>>(new Set());

	const scrollToBottom = () => {
		if (bodyRef.current) {
			bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// анимация появления ТОЛЬКО новых сообщений
	useEffect(() => {
		const newMessages = messages.filter(m => !prevIds.current.has(m.id));

		newMessages.forEach((m, i) => {
			setTimeout(() => {
				setVisible(prev => {
					const next = new Set(prev);
					next.add(m.id);
					return next;
				});
			}, i * 40);

			prevIds.current.add(m.id);
		});
	}, [messages]);

	// локальное добавление (только через parent)
	const addMessage = (msg: ConsoleMessage) => {
		// не даём визуальному эффекту задублировать
		setVisible(prev => {
			const next = new Set(prev);
			next.add(msg.id);
			return next;
		});
	};

	const handleSend = (text: string) => {
		if (!text.trim()) return;

		if (onSend) {
			onSend(text, addMessage);
		}
	};

	return (
		<div className={styles.console}>
			<div className={styles.body} ref={bodyRef}>
				{messages.map(msg => {
					const sym = TYPE_SYMBOLS[msg.type ?? 'info'];
					const typeClass = TYPE_CLASSES[msg.type ?? 'info'];

					return (
						<div
							key={msg.id}
							className={`${styles.row} ${
								visible.has(msg.id) ? styles.rowVisible : ''
							}`}
						>
							<span className={styles.ts}>
								{formatTime(msg.timestamp)}
							</span>

							<span className={`${styles.sym} ${typeClass}`}>
								{sym}
							</span>

							<span
								className={styles.agent}
								style={
									msg.agentColor
										? { color: msg.agentColor }
										: undefined
								}
							>
								[{msg.agent}]
							</span>

							<span className={styles.text}>{msg.text}</span>
						</div>
					);
				})}
			</div>

			<div className={styles.inputRow}>
				<span className={styles.prompt}>&gt;</span>

				<input
					className={styles.input}
					onKeyDown={e => {
						if (e.key === 'Enter') {
							const value = (e.target as HTMLInputElement).value;
							(e.target as HTMLInputElement).value = '';
							handleSend(value);
						}
					}}
					placeholder="введи команду..."
					spellCheck={false}
				/>
			</div>
		</div>
	);
};

export default Console;