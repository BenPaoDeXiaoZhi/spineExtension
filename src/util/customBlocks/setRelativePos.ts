import { customBlock } from '../customBlockly';
import type { Ext } from '../..';

export const POS_FORMAT = ['[ x ]', '[ y ]', '[x,y]'];

export function setupPos(ext: Ext, NS: string) {
    const Blockly = ext.runtime.scratchBlocks;

    class PosFormatSwitch extends Blockly.FieldLabel {
        format: string[];
        listener: (this: PosFormatSwitch, e: MouseEvent) => any;
        constructor(
            format: string[],
            onFormatChange: (this: PosFormatSwitch, e: MouseEvent) => any
        ) {
            super(format[0]);
            this.listener = onFormatChange;
            this.format = format;
        }

        init() {
            super.init();
            this.setupDom();
        }

        setupDom() {
            if (this.getSvgRoot()) {
                const dom = this.getSvgRoot();
                dom.style.cursor = 'pointer';
                dom.setAttribute('stroke', 'lightblue');
                const field = this;
                Blockly.bindEventWithChecks_(
                    dom,
                    'mousedown',
                    field,
                    (e: MouseEvent) => {
                        e.stopPropagation();
                    }
                );
                Blockly.bindEventWithChecks_(
                    dom,
                    'mouseup',
                    field,
                    field.listener
                );
            }
        }

        toNextFormat() {
            const nextFormatIndex = this.format.indexOf(this.getValue()) + 1;
            this.setValue(this.format[nextFormatIndex % this.format.length]);
        }

        setValue(newValue: any, fireChangeEvent?: boolean): void {
            if (this.format && !this.format.includes(newValue)) {
                newValue = this.format[0]; // fall back
            }
            super.setValue(newValue, fireChangeEvent);
        }
    }

    customBlock(`${NS}_${ext.setRelativePos.name}`, Blockly, (orig) => {
        return {
            init() {
                orig.init.call(this);
                const input = this.appendDummyInput('FORMAT');
                if (
                    this.isInFlyout ||
                    this.isInsertionMarker_ ||
                    !this.dispose
                ) {
                    return;
                }
                const posSwitch = new PosFormatSwitch(POS_FORMAT, function (
                    e: MouseEvent
                ) {
                    this.toNextFormat();
                    e.stopPropagation();
                });
                input.appendField(posSwitch, 'FORMAT');
            },
            mutationToDom() {
                const mutation = document.createElement('mutation');
                mutation.setAttribute('format', this.getFieldValue('FORMAT'));
                return mutation;
            },
            domToMutation(element) {
                const posSwitch = this.getField('FORMAT') as PosFormatSwitch;
                posSwitch.setValue(element.getAttribute('format'));
            },
        };
    });
}
