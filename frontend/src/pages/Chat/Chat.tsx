import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { sendMessage, fetchHistory } from '../../features/chat/chatSlice';

import styles from './Chat.module.css';

import ChatHeader from './ChatHeader';
import AgentsList from './AgentsList';
import MessagesList from './MessagesList';
import ChatInput from './ChatInput';

import type { Agent, Message } from '../../types/types';

import { useEffect, useMemo } from 'react';

export default function ChatScreen() {

	const dispatch = useAppDispatch();
	const status = useAppSelector((state) => state.chat.status);

	const agentStatus =
		status === 'pending'
			? 'Печатает...'
			: status === 'rejected'
			? 'Ошибка'
			: 'Готова';

	const messages = useAppSelector((state) => state.chat.history);
	const uiMessages: Message[] = messages.map((msg) => ({
		id: msg.id,
		sender: msg.agent === 'user' ? 'You' : 'Nova',
		role: msg.agent,
		text: msg.text,
		time: new Date(msg.timestamp).toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
		}),
		isOwn: msg.agent === 'user',
		avatar: msg.agent === 'user' ? '👤' : '🧠',

	}));

	const loading = useAppSelector((state) => state.chat.loading);

	const agents = useMemo<Agent[]>(() => [
	{
		name: 'Nova',
		status: agentStatus,
		avatar: status === 'pending' ? '⚡' : '😱',
		active: true,
	},
	], [agentStatus, status]);

	useEffect(() => {
		dispatch(fetchHistory());
	}, [dispatch]);


	const sendMessageHandler = (text: string) => {
		if (!text.trim()) return;

		dispatch(sendMessage(text));
	};
console.log(agents[0].status)
	return (
	<div className={styles.container}>
	<ChatHeader />

	<AgentsList agents={agents} />

	<MessagesList messages={uiMessages} loading={loading}/>

	<ChatInput onSend={sendMessageHandler} />
	</div>
	);
}