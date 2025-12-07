let elements: HTMLElement[] = [];
let values: any[] = [];
export class HTMLReport {
    readonly elementId: number;
    readonly monitorValue: string;
    readonly valueId: number;
    constructor(
        element: HTMLElement,
        value: any,
        monitorValue: string = element.innerText
    ) {
        Object.setPrototypeOf(Object.getPrototypeOf(this), Object.create(null));
        Object.defineProperties(this, {
            valueId: {
                value: values.push(value) - 1,
                writable: false,
                enumerable: false,
            },
            elementId: {
                value: elements.push(element) - 1,
                writable: false,
                enumerable: false,
            },
            monitorValue: {
                value: monitorValue,
                writable: false,
                enumerable: false,
            },
            replace: {
                value: Object.setPrototypeOf(this.replace, Object.create(null)),
                writable: false,
                enumerable: false,
            },
            toString: {
                value: Object.setPrototypeOf(
                    this.toString,
                    Object.create(null)
                ),
                writable: false,
                enumerable: false,
            },
            valueOf: {
                value: Object.setPrototypeOf(this.valueOf, Object.create(null)),
                writable: false,
                enumerable: false,
            },
        });
        return this;
    }
    /**
     * 通过修改replace的方法，绕过blockly的encodeEntities
     * (有点蠢,但是改的少哈)
     * @returns 该report的html代码
     */
    replace() {
        return elements[this.elementId].outerHTML;
    }
    toString() {
        return this.monitorValue;
    }
    valueOf() {
        return values[this.valueId];
    }
    static [Symbol.hasInstance](inst: any) {
        if (inst?.constructor === HTMLReport) {
            return true;
        }
        return false;
    }
}
Object.setPrototypeOf(HTMLReport, Object.create(null));
Object.setPrototypeOf(HTMLReport[Symbol.hasInstance], Object.create(null));

export function patch(runtime) {
    if (runtime.visualReport.spinePatched) {
        return;
    }
    runtime.visualReport.spinePatched = true;
    const originReport: (id: string, value: string) => any =
        runtime.visualReport;
    runtime.visualReport = function (id: string, value: string | HTMLReport) {
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
            originUpdate.call(this, monitor.set('value', value.monitorValue));
        } else {
            originUpdate.call(this, monitor);
        }
    };

    //修改console.log
    const originLog = console.log;
    console.log = function (...dat) {
        if (dat.length == 1 && dat[0] instanceof HTMLReport) {
            originLog.call(this, dat[0].valueOf());
        } else {
            originLog.call(this, ...dat);
        }
    };
}
