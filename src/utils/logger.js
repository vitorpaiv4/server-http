import fs from 'fs/promises';
import path from 'path';

class Logger {
    constructor() {
        this.logPath = path.join(process.cwd(), 'logs');
        this.ensureLogDirectory();
    }

    async ensureLogDirectory() {
        try {
            await fs.access(this.logPath);
        } catch {
            await fs.mkdir(this.logPath, { recursive: true });
        }
    }

    getTimestamp() {
        return new Date().toISOString();
    }

    formatMessage(level, message, data = null) {
        const timestamp = this.getTimestamp();
        const logEntry = {
            timestamp,
            level,
            message,
            data
        };
        return JSON.stringify(logEntry);
    }

    async writeToFile(filename, message) {
        try {
            const logFile = path.join(this.logPath, filename);
            await fs.appendFile(logFile, message + '\n');
        } catch (error) {
            console.error('Erro ao escrever no arquivo de log:', error.message);
        }
    }

    info(message, data = null) {
        const formattedMessage = this.formatMessage('INFO', message, data);
        console.log(`[INFO] ${message}`, data ? data : '');
        this.writeToFile('app.log', formattedMessage);
    }

    error(message, data = null) {
        const formattedMessage = this.formatMessage('ERROR', message, data);
        console.error(`[ERROR] ${message}`, data ? data : '');
        this.writeToFile('error.log', formattedMessage);
    }

    warn(message, data = null) {
        const formattedMessage = this.formatMessage('WARN', message, data);
        console.warn(`[WARN] ${message}`, data ? data : '');
        this.writeToFile('app.log', formattedMessage);
    }

    debug(message, data = null) {
        const formattedMessage = this.formatMessage('DEBUG', message, data);
        console.log(`[DEBUG] ${message}`, data ? data : '');
        this.writeToFile('debug.log', formattedMessage);
    }

    // Método específico para logs de API
    api(method, url, statusCode, responseTime = null, data = null) {
        const message = `${method} ${url} - ${statusCode}`;
        const apiData = {
            method,
            url,
            statusCode,
            responseTime,
            ...data
        };
        
        const formattedMessage = this.formatMessage('API', message, apiData);
        console.log(`[API] ${message}`, responseTime ? `(${responseTime}ms)` : '');
        this.writeToFile('api.log', formattedMessage);
    }
}

export const logger = new Logger();
