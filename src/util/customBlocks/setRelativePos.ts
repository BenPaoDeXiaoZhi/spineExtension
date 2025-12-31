import { customBlock } from '../customBlockly';
import type { Ext } from '../..';
import { FieldLabel, LineCursor } from 'blockly';

const POS_FORMAT = ['x', 'y', 'x,y'];

export function setupPos(ext: Ext, NS: string) {
    const Blockly = ext.runtime.scratchBlocks;

    class PosSwitchFormat extends Blockly.FieldLabel {
        format: string[];
        listener: (this: FieldLabel) => any;
        constructor(
            format: string[],
            onFormatChange: (this: FieldLabel) => any
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
            console.log('field:', this, this.getSvgRoot());
            if (this.getSvgRoot()) {
                const dom = this.getSvgRoot();
                dom.style.cursor = 'pointer';
                dom.setAttribute('stroke', 'darkgray');
                const field = this;
                dom.addEventListener('mouseup', (e) => {
                    console.log(e, field);
                    field.listener.call(field, e);
                });
                console.log(dom);
            }
        }
    }

    customBlock(`${NS}_${ext.setRelativePos.name}`, Blockly, (orig) => {
        return {
            init() {
                orig.init.call(this);
                console.log('pos', this);
                const input = this.appendDummyInput('FORMAT');
                if (
                    this.isInFlyout ||
                    this.isInsertionMarker_ ||
                    !this.dispose
                ) {
                    return;
                }
                input.appendField(
                    new PosSwitchFormat(POS_FORMAT, function () {
                        console.log(this, arguments);
                    })
                );
            },
        };
    });
}
