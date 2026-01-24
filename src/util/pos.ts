export function trimPos(pos: string){ // "  [1 ,2]"
    pos = pos.trim(); // "[1 ,2]
    pos = trimChar(pos, "()");
    pos = trimChar(pos, "[]");
    pos = pos.replaceAll(" ", ""); // 1,2
    return pos;
}

export function trimChar(src: string, chr: string){
    if(!src.startsWith(chr[0])){
        return src;
    }
    if(!src.endsWith(chr[0])){
        throw new Error(
            `${src} starts with ${chr[0]} but don't ends with ${chr[1]}`
        );
    }
    return src.slice(1,-1);
}