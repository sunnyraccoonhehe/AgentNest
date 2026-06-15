import { useEffect, useRef } from 'react';

import styles from './MessagesList.module.css';

import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

import type { Message } from '../../types/types';

interface MessagesListProps {
  messages: Message[];
}

export default function MessagesList({
  messages,
}: MessagesListProps) {
  
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <div className={styles.container}>
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
        />
      ))}

      <TypingIndicator />

      <div ref={bottomRef} />
    </div>
  );
}