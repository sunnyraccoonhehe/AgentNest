import { useState } from 'react';

import styles from './ChatInput.module.css';

interface ChatInputProps {
  onSend: (text: string) => void;
}

export default function ChatInput({
  onSend,
}: ChatInputProps) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim()) return;

    onSend(value);

    setValue('');
  };

  return (
    <div className={styles.wrapper}>
      <input
        className={styles.input}
        placeholder='Как провести каникулы..'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSend();
          }
        }}
      />

      <button
        className={styles.sendButton}
        onClick={handleSend}
      >
        Отправить
      </button>
    </div>
  );
}