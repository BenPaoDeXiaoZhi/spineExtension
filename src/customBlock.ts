export function setupCustomBlocks(ext,NS){
const ext = this;
const Blockly = ext.runtime.scratchBlocks;
customBlock(`${NS}_${ext.getSthOf.name}`, Blockly, function (orig) {
    return {
        init(this: BlockSvg) {
            orig.init.call(this);
            console.log('getSth', this);
            const keyInput = this.appendDummyInput();
            keyInput.appendField(
                new Blockly.FieldDropdown([['Foo', 'Bar']]),
                'KEY'
            );
            if (this.isInFlyout || this.isInsertionMarker_ || !this.dispose) {
                return;
            }
            const dataInput = this.getInput('DATA');
            keyInput.removeField('KEY');
            keyInput.appendField(
                new Blockly.FieldDropdown(() => {
                    const op =
                        dataInput.connection.targetBlock()?.type || 'none';
                    return [
                        [op, op],
                        ['a', 'b'],
                    ];
                }),
                'KEY'
            );
        },
    };
});
}