import styles from './AgentList.module.css';
import AgentCard from './AgentCard';
import type { Agent } from '../../types/types';

interface AgentsListProps {
  agents: Agent[];
}

export default function AgentsList({ agents }: AgentsListProps) {
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        {agents.map((agent) => (
          <AgentCard key={agent.name} agent={agent} />
        ))}
      </div>
    </div>
  );
}