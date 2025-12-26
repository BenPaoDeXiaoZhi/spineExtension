import { GandiRuntime } from './gandi-type';
declare const BlockType: {
    BOOLEAN: 'boolean';
    BUTTON: 'button';
    LABEL: 'label';
    COMMAND: 'command';
    CONDITIONAL: 'conditional';
    EVENT: 'event';
    HAT: 'hat';
    LOOP: 'loop';
    REPORTER: 'reporter';
    XML: 'xml';
};

declare const TargetType: {
    SPRITE: 'sprite';
    STAGE: 'stage';
};

declare const ArgumentType: {
    ANGLE: 'angle';
    BOOLEAN: 'Boolean';
    COLOR: 'color';
    NUMBER: 'number';
    STRING: 'string';
    MATRIX: 'matrix';
    NOTE: 'note';
    IMAGE: 'image';
    XIGUA_MATRIX: 'xigua_matrix';
    XIGUA_WHITE_BOARD_NOTE: 'xigua_white_board_note';
    CCW_HAT_PARAMETER: 'ccw_hat_parameter';
    COSTUME: 'costume';
    SOUND: 'sound';
};

declare global {
    const Scratch: {
        extensions: {
            register: (ext: any) => void;
        };
        BlockType: typeof BlockType;
        TargetType: typeof TargetType;
        ArgumentType: typeof ArgumentType;
        runtime: GandiRuntime;
    };
    type ArgumentTypeValues = (typeof ArgumentType)[keyof typeof ArgumentType];
    type TargetTypeValues = (typeof TargetType)[keyof typeof TargetType];
    type BlockTypeValues = (typeof BlockType)[keyof typeof BlockType];
}
