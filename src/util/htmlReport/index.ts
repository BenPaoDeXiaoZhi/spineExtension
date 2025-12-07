import VM from 'scratch-vm';

export class HTMLReport {
    element: HTMLElement;
    monitorValue: string;
    value: any;
    constructor(
        element: HTMLElement,
        value: any = element.innerText,
        monitorValue: string = element.innerText
    ) {
        this.value = value;
        this.element = element;
        this.monitorValue = monitorValue;
    }
    /**
     * 通过修改replace的方法，绕过blockly的encodeEntities
     * (有点蠢,但是改的少哈)
     * @returns 该report的html代码
     */
    replace() {
        return this.element.outerHTML;
    }
    toString() {
        return this.monitorValue;
    }
    valueOf() {
        return this.value;
    }
}
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
}
