import styles from './MessageBubble.module.css';
import type { Message } from '../../types/types'

type MessageBubbleProps = {
  message: Message
}

export default function MessageBubble({ message } : MessageBubbleProps) {
  return (
    <div
      className={`${styles.row} ${
        message.isOwn ? styles.own : ''
      }`}
    >
      <div className={styles.content}>
        {
          !message.isOwn && <div className={styles.avatar}>{message.avatar}</div>
        }

        <div>
          <div
            className={`${styles.bubble} ${
              message.isOwn ? styles.ownBubble : styles.agentBubble
            }`}
          >
            {!message.isOwn && (
              <>
                <div className={styles.sender}>{message.sender}</div>
                <div className={styles.role}>{message.role}</div>
              </>
            )}

            <p className={styles.text}>{message.text}</p>
          </div>

          <div className={styles.time}>{message.time}</div>
        </div>
      </div>
    </div>
  );
}