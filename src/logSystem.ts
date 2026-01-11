let logger: {
    log(...dat: any[]): void;
    warn(...dat: any[]): void;
    error(...dat: any[]): void;
};
export function getLogger(type?: 'console' | 'gandi', prefix = '[EXT]') {
    if (!type) {
        if (logger) {
            return logger;
        } else {
            throw new Error('logger未初始化');
        }
    }
    if (type === 'console') {
        logger = {
            log(...dat) {
                console.log(prefix, ...dat);
            },
            warn(...dat) {
                console.warn(prefix, ...dat);
            },
            error(...dat) {
                console.error(prefix, ...dat);
            },
        };
    } else {
        const logSystem = Scratch.runtime.logSystem;
        if (!logSystem) {
            console.warn('未发现logSystem,回退至console');
            return getLogger('console', prefix);
        }
        logger = {
            log(...dat) {
                logSystem.log(prefix, ...dat);
            },
            warn(...dat) {
                logSystem.warn(prefix, ...dat);
            },
            error(...dat) {
                logSystem.error(prefix, ...dat);
            },
        };
    }
    return getLogger();
}
