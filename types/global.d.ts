declare const BlockType:{
    BOOLEAN : "boolean",
    BUTTON : "button",
    LABEL : "label",
    COMMAND : "command",
    CONDITIONAL : "conditional",
    EVENT : "event",
    HAT : "hat",
    LOOP : "loop",
    REPORTER : "reporter",
    XML : "xml",
}
declare type BlockTypeValues = typeof BlockType[keyof typeof BlockType]

declare const TargetType: {
    "SPRITE": "sprite",
    "STAGE": "stage"
}
declare type TargetTypeValues = typeof TargetType[keyof typeof TargetType]

declare const ArgumentType: {
    "ANGLE": "angle",
    "BOOLEAN": "Boolean",
    "COLOR": "color",
    "NUMBER": "number",
    "STRING": "string",
    "MATRIX": "matrix",
    "NOTE": "note",
    "IMAGE": "image",
    "XIGUA_MATRIX": "xigua_matrix",
    "XIGUA_WHITE_BOARD_NOTE": "xigua_white_board_note",
    "CCW_HAT_PARAMETER": "ccw_hat_parameter",
    "COSTUME": "costume",
    "SOUND": "sound"
}
declare type ArgumentTypeValues = typeof ArgumentType[keyof typeof ArgumentType]

declare const Scratch: {
    extensions: {
        register: (ext: any) => void;
    }
    BlockType: typeof BlockType
    TargetType: typeof TargetType
    ArgumentType: typeof ArgumentType
    runtime: any
};
