import { useState } from 'react';

import styles from './Chat.module.css';

import ChatHeader from './ChatHeader';
import AgentsList from './AgentsList';
import MessagesList from './MessagesList';
import ChatInput from './ChatInput';

import type { Agent, Message } from '../../types/types';

import { useEffect } from 'react';
import { loadMessages, saveMessages } from './messageUtil';

export default function ChatScreen() {
	const agents: Agent[] = [
		{
		name: 'Nova',
		status: 'Thinking',
		avatar: '🧠',
		active: true,
		},
		{
		name: 'Misha',
		status: 'Chilling',
		avatar: '🥰',
		active: true,
		},
		{
		name: 'Alisa',
		status: 'Waiting',
		avatar: '😱',
		active: true,
		},
	];

	const [messages, setMessages] = useState<Message[]>(() => {
		const cached = loadMessages();
		return cached?.length ? cached : [
		{
			id: 1,
			sender: 'Nova',
			role: 'Strategy Agent',
			text: 'How can I help?',
			time: new Date().toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			}),
			isOwn: false,
			avatar: '🧠',
			},
		];
	});

	useEffect(() => {
		const cached = loadMessages();

		if (cached?.length) {
			setMessages(cached);
		}
		}, []);

	useEffect(() => {
		saveMessages(messages);
	}, [messages]);

	const sendMessage = (text: string) => {
		if (!text.trim()) return;

		const newMessage: Message = {
			id: Date.now(),
			sender: 'You',
			role: 'Operator',
			text,
			time: new Date().toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			}),
			isOwn: true,
			avatar: '👤',
		};

		setMessages((prev) => [...prev, newMessage]);

		setTimeout(() => {
			const aiReply: Message = {
			id: Date.now() + 1,
			sender: 'Nova',
			role: 'Strategy Agent',
			text: 'Processing your request...',
			time: new Date().toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			}),
			isOwn: false,
			avatar: '🧠',
			};

			setMessages((prev) => [...prev, aiReply]);
		}, 1200);
	};

	return (
	<div className={styles.container}>
	<ChatHeader />

	<AgentsList agents={agents} />

	<MessagesList messages={messages} />

	<ChatInput onSend={sendMessage} />
	</div>
	);
}