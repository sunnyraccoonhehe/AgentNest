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
	new Date(date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

const DEMO_MESSAGES: ConsoleMessage[] = [
	{ id: '1', agent: 'assistant', text: 'Привет! Напиши запрос и я помогу тебе оптимизировать твое время!', timestamp: new Date(Date.now() - 12000), type: 'info' },
];

const Console: React.FC<ConsoleProps> = ({ messages: externalMessages, onSend }) => {
	const [internalMessages, setInternalMessages] = useState<ConsoleMessage[]>(
		externalMessages ?? DEMO_MESSAGES
	);
	const [visible, setVisible] = useState<Set<string>>(new Set(
		(externalMessages ?? DEMO_MESSAGES).map(m => m.id)
	));
	const [input, setInput] = useState('');
	const bodyRef = useRef<HTMLDivElement>(null);
	const prevIdsRef = useRef<Set<string>>(new Set());

	const scrollToBottom = () => {
		requestAnimationFrame(() => {
			if (bodyRef.current) {
				bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
			}
		});
	};

	const addMessage = (msg: ConsoleMessage) => {
		setInternalMessages(prev => [...prev, msg]);
		setTimeout(() => {
			setVisible(prev => new Set([...prev, msg.id]));
			scrollToBottom();
		}, 30);
	};

	useEffect(() => {
		if (externalMessages) {
			externalMessages.forEach(m => prevIdsRef.current.add(m.id));
		}
		setTimeout(() => scrollToBottom(), 50);
	}, []);

	useEffect(() => {
		if (!externalMessages) return;

		const newMessages = externalMessages.filter(m => !prevIdsRef.current.has(m.id));
		
		if (newMessages.length === 0) return;

		externalMessages.forEach(m => prevIdsRef.current.add(m.id));

		setInternalMessages(externalMessages);

		newMessages.forEach((m, i) => {
			setTimeout(() => {
				setVisible(prev => new Set([...prev, m.id]));
				if (i === newMessages.length - 1) scrollToBottom();
			}, i * 60);
		});
	}, [externalMessages]);

	// Начальная загрузка
	useEffect(() => {
		if (externalMessages) {
			externalMessages.forEach(m => prevIdsRef.current.add(m.id));
		}
	}, []);

	const handleSend = () => {
		const text = input.trim();
		if (!text) return;

		const userMsg: ConsoleMessage = {
			id: Date.now().toString(),
			agent: 'user',
			agentColor: '#94a3b8',
			text,
			timestamp: new Date(),
			type: 'info',
		};
		addMessage(userMsg);
		setInput('');

		if (onSend) onSend(text, addMessage);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') handleSend();
	};

	return (
		<div className={styles.console}>
			<div className={styles.body} ref={bodyRef}>
				{internalMessages.map((msg) => {
					const sym = TYPE_SYMBOLS[msg.type ?? 'info'];
					const typeClass = TYPE_CLASSES[msg.type ?? 'info'];
					return (
						<div
							key={msg.id}
							className={`${styles.row} ${visible.has(msg.id) ? styles.rowVisible : ''}`}
						>
							<span className={styles.ts}>{formatTime(msg.timestamp)}</span>
							<span className={`${styles.sym} ${typeClass}`}>{sym}</span>
							<span className={styles.agent} style={msg.agentColor ? { color: msg.agentColor } : undefined}>
								[{msg.agent}]
							</span>
							<span className={styles.text}>{msg.text}</span>
						</div>
					);
				})}
				<div />
			</div>

			<div className={styles.inputRow}>
				<span className={styles.prompt}>&gt;</span>
				<input
					className={styles.input}
					value={input}
					onChange={e => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="введи команду..."
					spellCheck={false}
					autoComplete="off"
				/>
				<button className={styles.sendBtn} onClick={handleSend}>↵</button>
			</div>
		</div>
	);
};

export default Console;