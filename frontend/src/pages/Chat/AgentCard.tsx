import styles from './AgentCard.module.css';
import type { Agent } from '../../types/types';

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  
  return (
    <div
      className={`${styles.card} ${
        agent.active ? styles.active : styles.inactive
      }`}
    >
      <div className={styles.avatar}>{agent.avatar}</div>
      <div>
        <div className={styles.name}>{agent.name}</div>
        <div className={styles.status}>{agent.status}</div>
      </div>
    </div>
  );
}