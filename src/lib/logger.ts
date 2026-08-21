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
    const formatDetails = (det: any): string => {
      if (det === undefined || det === null) return '';
      if (typeof det === 'string') return det;
      if (det instanceof Error) {
        return JSON.stringify(
          {
            name: det.name,
            message: det.message,
            stack: det.stack,
            cause: (det as any).cause,
          },
          null,
          2
        );
      }
      if (typeof det === 'object') {
        try {
          const cleanObj: Record<string, any> = {};
          for (const key of Object.keys(det)) {
            const val = det[key];
            if (val instanceof Error) {
              cleanObj[key] = {
                name: val.name,
                message: val.message,
                stack: val.stack,
              };
            } else {
              cleanObj[key] = val;
            }
          }
          // If object had no own enumerable keys but was an error-like or non-empty
          if (Object.keys(cleanObj).length === 0 && (det.message || det.name || det.stack)) {
            cleanObj.message = det.message;
            cleanObj.name = det.name;
            cleanObj.stack = det.stack;
          }
          return JSON.stringify(cleanObj, null, 2);
        } catch {
          return String(det);
        }
      }
      return String(det);
    };

    const entry: LogEntry = {
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      details: formatDetails(details),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      path: typeof window !== 'undefined' ? window.location.search || '/' : '/',
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
      // Ignore benign script noise or resize observer loops
      const msgStr = String(message || '');
      if (msgStr.includes('ResizeObserver loop') || msgStr.includes('Script error')) {
        return;
      }

      AppLogger.error('WindowUncaught', msgStr, {
        source,
        line: lineno,
        col: colno,
        message: error?.message || msgStr,
        stack: error?.stack,
      });
    };

    window.onunhandledrejection = (event) => {
      const reason = event.reason;
      // If reason is empty or null or cancelled, ignore
      if (!reason) return;

      const reasonMsg =
        typeof reason === 'string'
          ? reason
          : reason?.message || (typeof reason === 'object' && Object.keys(reason).length > 0 ? JSON.stringify(reason) : 'Promise Rejection');

      // Ignore benign vite websocket disconnection notices
      if (reasonMsg.includes('failed to connect to websocket') || reasonMsg.includes('WebSocket')) {
        return;
      }

      AppLogger.warn('UnhandledPromise', reasonMsg, reason);
    };
  }
}
