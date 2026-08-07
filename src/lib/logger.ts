export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'fatal';
  category: string;
  message: string;
  details?: string;
  userAgent?: string;
  path?: string;
}

const LOGS_STORAGE_KEY = 'inception_error_logs';
const MAX_LOGS = 100;

export class AppLogger {
  private static getLogsFromStorage(): LogEntry[] {
    try {
      const data = localStorage.getItem(LOGS_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read logs from storage', e);
    }
    return [];
  }

  private static saveLogsToStorage(logs: LogEntry[]) {
    try {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs.slice(-MAX_LOGS)));
    } catch (e) {
      console.error('Failed to save logs to storage', e);
    }
  }

  public static log(
    level: 'info' | 'warn' | 'error' | 'fatal',
    category: string,
    message: string,
    details?: any
  ) {
    const entry: LogEntry = {
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      details: typeof details === 'object' ? JSON.stringify(details, null, 2) : String(details || ''),
      userAgent: navigator.userAgent,
      path: window.location.search || '/',
    };

    // Print to developer console
    if (level === 'error' || level === 'fatal') {
      console.error(`[${level.toUpperCase()}] [${category}] ${message}`, details || '');
    } else if (level === 'warn') {
      console.warn(`[${level.toUpperCase()}] [${category}] ${message}`, details || '');
    } else {
      console.log(`[${level.toUpperCase()}] [${category}] ${message}`);
    }

    // Persist
    const current = this.getLogsFromStorage();
    current.push(entry);
    this.saveLogsToStorage(current);
  }

  public static info(category: string, message: string, details?: any) {
    this.log('info', category, message, details);
  }

  public static warn(category: string, message: string, details?: any) {
    this.log('warn', category, message, details);
  }

  public static error(category: string, message: string, details?: any) {
    this.log('error', category, message, details);
  }

  public static fatal(category: string, message: string, details?: any) {
    this.log('fatal', category, message, details);
  }

  public static getLogs(): LogEntry[] {
    return this.getLogsFromStorage();
  }

  public static clearLogs() {
    try {
      localStorage.removeItem(LOGS_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  }

  public static initializeGlobalErrorListeners() {
    if (typeof window === 'undefined') return;

    window.onerror = (message, source, lineno, colno, error) => {
      AppLogger.error('WindowUncaught', String(message), {
        source,
        line: lineno,
        col: colno,
        stack: error?.stack,
      });
    };

    window.onunhandledrejection = (event) => {
      AppLogger.error('UnhandledPromise', event.reason?.message || 'Promise Rejected', {
        reason: event.reason,
      });
    };
  }
}
