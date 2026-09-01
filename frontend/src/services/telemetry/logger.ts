import { supabase, ORG_ID } from '../domains/common';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  metadata?: Record<string, any>;
  traceId?: string;
  timestamp: string;
  actorId?: string;
}

class ProductionLogger {
  private traceId: string;
  private minLevel: LogLevel = 'INFO';

  constructor() {
    this.traceId = this.generateTraceId();
  }

  private generateTraceId(): string {
    return 'trc_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
  }

  public getTraceId(): string {
    return this.traceId;
  }

  public setTraceId(id: string): void {
    this.traceId = id;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      DEBUG: 10,
      INFO: 20,
      WARN: 30,
      ERROR: 40,
      FATAL: 50,
    };
    return levels[level] >= levels[this.minLevel];
  }

  private formatConsole(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const prefix = `[${timestamp}] [${entry.level}] [${entry.context || 'ERP'}] [${entry.traceId}]:`;

    switch (entry.level) {
      case 'DEBUG':
        console.debug(prefix, entry.message, entry.metadata || '');
        break;
      case 'INFO':
        console.info(prefix, entry.message, entry.metadata || '');
        break;
      case 'WARN':
        console.warn(prefix, entry.message, entry.metadata || '');
        break;
      case 'ERROR':
      case 'FATAL':
        console.error(prefix, entry.message, entry.metadata || '');
        break;
    }
  }

  public async log(
    level: LogLevel,
    message: string,
    context?: string,
    metadata?: Record<string, any>,
    actorId?: string
  ): Promise<LogEntry> {
    const entry: LogEntry = {
      level,
      message,
      context,
      metadata,
      traceId: this.traceId,
      timestamp: new Date().toISOString(),
      actorId,
    };

    if (this.shouldLog(level)) {
      this.formatConsole(entry);
    }

    // If WARN, ERROR, or FATAL, or explicit audit action, record to Supabase audit log asynchronously
    if (level === 'ERROR' || level === 'FATAL' || (metadata && metadata.isAudit)) {
      this.streamAuditLog(entry).catch((err) => {
        console.warn('Audit stream notice:', err);
      });
    }

    return entry;
  }

  private async streamAuditLog(entry: LogEntry): Promise<void> {
    try {
      await supabase.from('audit_logs').insert({
        organization_id: ORG_ID,
        actor_id: entry.actorId || null,
        action: entry.context || 'SYSTEM_EVENT',
        entity_type: entry.metadata?.entityType || 'General',
        entity_id: entry.metadata?.entityId || null,
        status: entry.level === 'ERROR' || entry.level === 'FATAL' ? 'FAILURE' : 'SUCCESS',
        metadata: {
          message: entry.message,
          traceId: entry.traceId,
          level: entry.level,
          ...entry.metadata,
        },
        created_at: entry.timestamp,
      });
    } catch {}
  }

  public debug(message: string, context?: string, metadata?: Record<string, any>) {
    return this.log('DEBUG', message, context, metadata);
  }

  public info(message: string, context?: string, metadata?: Record<string, any>, actorId?: string) {
    return this.log('INFO', message, context, metadata, actorId);
  }

  public warn(message: string, context?: string, metadata?: Record<string, any>, actorId?: string) {
    return this.log('WARN', message, context, metadata, actorId);
  }

  public error(message: string, context?: string, metadata?: Record<string, any>, actorId?: string) {
    return this.log('ERROR', message, context, metadata, actorId);
  }

  public audit(action: string, entityType: string, entityId?: string, metadata?: Record<string, any>, actorId?: string) {
    return this.log('INFO', `Audit event: ${action} on ${entityType}`, action, {
      isAudit: true,
      entityType,
      entityId,
      ...metadata,
    }, actorId);
  }
}

export const logger = new ProductionLogger();
