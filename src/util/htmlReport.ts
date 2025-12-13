/**
 * cleans an function's prototype
 */
export function clean<T extends object>(obj: T): T {
    if ('prototype' in obj) {
        obj.prototype = Object.create(null);
    }
    Object.setPrototypeOf(obj, Object.create(null));
    if (
        Object.getPrototypeOf(obj).constructor ||
        (obj as any)?.prototype?.constructor
    ) {
        console.warn('clean失败', obj);
    }
    return obj;
}

export type maybeFunc<T> = T | (() => T);

export function resolveMaybeFunc<T>(dat: maybeFunc<T>) {
    if (dat instanceof Function) {
        return dat();
    } else {
        return dat;
    }
}

export class HTMLReport<T = any> {
    /**
     * used by blockly report
     * @returns a html string
     */
    replace: () => string;

    /**
     * used by extensions
     * @returns origin value
     */
    valueOf: () => T;

    /**
     * used by monitor
     * @returns a raw text used in monitor
     */
    toString: () => string;

    constructor(
        element: maybeFunc<HTMLElement>,
        value: maybeFunc<T>,
        monitorValue: maybeFunc<string>
    ) {
        const report: HTMLReport<T> = {
            //使用闭包防修改
            replace: clean(() => resoveMaybeFunc(element).innerHTML),
            valueOf: clean(() => resoveMaybeFunc(value)),
            toString: clean(() => resoveMaybeFunc(monitorValue)),
        };
        Object.assign(this, report);
        Object.freeze(this);
    }
}

export function patch(runtime: any) {
    if (runtime.visualReport.spinePatched) {
        return;
    }
    runtime.visualReport.spinePatched = true;
    const originReport: (id: string, value: string) => any =
        runtime.visualReport;
    runtime.visualReport = function (
        id: string,
        value: string | HTMLReport<any>
    ) {
        if (value instanceof HTMLReport) {
            const Runtime = this.constructor;
            this.emit(Runtime.VISUAL_REPORT, { id, value }); //不进行tostring
        } else {
            originReport.call(this, id, value); //原版会调用toString
        }
    };

    const originUpdate: (
        monitor: Map<'id' | 'value', string | HTMLReport>
    ) => any = runtime.requestUpdateMonitor;

    runtime.requestUpdateMonitor = function (
        monitor: Map<'id' | 'value', string | HTMLReport>
    ) {
        const value = monitor.get('value');
        if (value instanceof HTMLReport) {
            originUpdate.call(this, monitor.set('value', value.toString()));
        } else {
            originUpdate.call(this, monitor);
        }
    };
}

//修改console
export function patchLog() {
    console.log = patchLogFunc(console.log);
    console.info = patchLogFunc(console.info);
}

function patchLogFunc(func: (...dat) => any) {
    return function (...dat) {
        const args = dat.map((arg: string | HTMLReport) => {
            if (arg && arg instanceof HTMLReport) {
                console.group(arg.toString());
                func(arg.valueOf());
                console.groupEnd();
                return arg.toString();
            }
            return arg;
        });
        func.call(this, ...args);
    };
}
