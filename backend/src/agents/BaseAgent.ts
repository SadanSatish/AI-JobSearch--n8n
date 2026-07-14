import { query } from '../config/db';
import { logger } from '../config/logger';

export abstract class BaseAgent<TInput, TOutput> {
  protected agentName: string;

  constructor(agentName: string) {
    this.agentName = agentName;
  }

  /**
   * Main entry point for the agent execution
   */
  async execute(input: TInput, userId: string): Promise<TOutput> {
    const runId = await this.logRunStart(input, userId);
    
    try {
      logger.info(`[${this.agentName}] Execution started`);
      const startTime = Date.now();
      
      const result = await this.performTask(input, userId);
      
      const executionTime = Date.now() - startTime;
      await this.logRunSuccess(runId, result, executionTime);
      logger.info(`[${this.agentName}] Execution finished successfully in ${executionTime}ms`);
      
      return result;
    } catch (error: any) {
      await this.logRunFailure(runId, error.message);
      logger.error(`[${this.agentName}] Execution failed`, { error: error.message });
      throw error;
    }
  }

  /**
   * The actual business logic to be implemented by child agents
   */
  protected abstract performTask(input: TInput, userId: string): Promise<TOutput>;

  private async logRunStart(payload: any, userId: string): Promise<string> {
    const res = await query(
      `INSERT INTO agent_runs (agent_name, user_id, payload, status) VALUES ($1, $2, $3, 'running') RETURNING id`,
      [this.agentName, userId, JSON.stringify(payload)]
    );
    return res.rows[0].id;
  }

  private async logRunSuccess(runId: string, result: any, executionTimeMs: number) {
    await query(
      `UPDATE agent_runs SET status = 'success', result = $1, execution_time_ms = $2 WHERE id = $3`,
      [JSON.stringify(result), executionTimeMs, runId]
    );
  }

  private async logRunFailure(runId: string, errorMessage: string) {
    await query(
      `UPDATE agent_runs SET status = 'failed', error_message = $1 WHERE id = $2`,
      [errorMessage, runId]
    );
  }
}
