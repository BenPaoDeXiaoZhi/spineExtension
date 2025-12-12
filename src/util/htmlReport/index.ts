export interface IHTMLReport<T = any> {
    /**
     * used by blockly report
     * @returns a html string
     */
    replace(): string;

    /**
     * used by extensions
     * @returns origin value
     */
    valueOf(): T;

    /**
     * used by monitor
     * @returns a text used in monitor
     */
    toString(): string;
}

/**
 * cleans an function's prototype
 */
export function clean<T extends object>(obj: T): T {
    if ('prototype' in obj) {
        obj.prototype = Object.create(null);
    }
    Object.setPrototypeOf(obj, Object.create(null));
    console.log(obj);
    if (
        Object.getPrototypeOf(obj).constructor ||
        (obj as any)?.prototype?.constructor
    ) {
        console.warn('clean失败', obj);
    }
    return obj;
}

export class HTMLReport<T> {
    constructor(element: HTMLElement | string, value: T, monitorValue: string) {
        const htmlText =
            element instanceof HTMLElement ? element.innerHTML : element;
        const report: IHTMLReport<T> = {
            replace: clean(() => htmlText),
            valueOf: clean(() => value),
            toString: clean(() => monitorValue),
        };
        Object.assign(this, report);
        clean(Object.getPrototypeOf(this));
    }
}
clean(HTMLReport.prototype.constructor);
// class 太难搞了...

export function patch(runtime: any) {
    if (runtime.visualReport.spinePatched) {
        return;
    }
    runtime.visualReport.spinePatched = true;
    const originReport: (id: string, value: string) => any =
        runtime.visualReport;
    runtime.visualReport = function (
        id: string,
        value: string | IHTMLReport<any>
    ) {
        if (value instanceof HTMLReport) {
            const Runtime = this.constructor;
            this.emit(Runtime.VISUAL_REPORT, { id, value }); //不进行tostring
        } else {
            originReport.call(this, id, value); //原版会调用toString
        }
    };

    const originUpdate: (
        monitor: Map<'id' | 'value', string | IHTMLReport>
    ) => any = runtime.requestUpdateMonitor;

    runtime.requestUpdateMonitor = function (
        monitor: Map<'id' | 'value', string | IHTMLReport>
    ) {
        const value = monitor.get('value');
        if (value instanceof HTMLReport) {
            originUpdate.call(this, monitor.set('value', value.toString()));
        } else {
            originUpdate.call(this, monitor);
        }
    };

    //修改console
    console.log = patchLog(console.log);
    console.info = patchLog(console.info);
}
function patchLog(func: (...dat) => any) {
    return function (...dat) {
        const args = dat.map((arg: string | IHTMLReport) => {
            if (arg && arg instanceof HTMLReport) {
                return Object.assign(
                    new String(arg.toString().replaceAll('\n', '  ')),
                    {
                        value: arg.valueOf(),
                    }
                );
            }
            return arg;
        });
        func.call(this, ...args);
    };
}
