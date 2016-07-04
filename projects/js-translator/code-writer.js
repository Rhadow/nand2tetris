import fs from 'fs';
import path from 'path';
import {
    PUSH,
    CONSTANT,
    ACTION_MAP,
    ARITH_TYPE_MAP
} from './constants.js';

class CodeWriter {
    constructor(filePath) {
        let targetFolder = path.extname(filePath) ? path.dirname(filePath) : filePath;
        this._fd = fs.openSync(`${targetFolder}/${path.basename(filePath, '.vm')}.asm`, 'w');
        this._stack = [];
        this._ram = [];
        this.pointers = {
            sp: 0,
            stack: 256
        };
        fs.writeSync(this._fd, `@${this.pointers.stack}\n`);
        fs.writeSync(this._fd, ACTION_MAP.a2d);
        fs.writeSync(this._fd, `@${this.pointers.sp}\n`);
        fs.writeSync(this._fd, ACTION_MAP.d2m);
    }
    stackPush(item) {
        fs.writeSync(this._fd, `@${this.pointers.sp}\n`);
        fs.writeSync(this._fd, `${ACTION_MAP['m+1']}`);
        this.pointers.stack += 1;
        this._stack.push(item);
    }
    stackPop() {
        fs.writeSync(this._fd, `@${this.pointers.sp}\n`);
        fs.writeSync(this._fd, `${ACTION_MAP['m-1']}`);
        this.pointers.stack -= 1;
        return this._stack.pop();
    }
    writeArith(cmd) {
        let addr1;
        let addr2;

        if (cmd === ARITH_TYPE_MAP.neg || cmd === ARITH_TYPE_MAP.not) {
            addr1 = this._stack[this._stack.length - 1];
            fs.writeSync(this._fd, `@${addr1}\n`);
            fs.writeSync(this._fd, ACTION_MAP[cmd]);
        } else {
            addr1 = this.stackPop();
            addr2 = this._stack[this._stack.length - 1];
            switch (cmd) {
            case ARITH_TYPE_MAP.eq:
                fs.writeSync(this._fd, `@${addr2}\n`);
                fs.writeSync(this._fd, this._ram[addr1] === this._ram[addr2] ? `${ACTION_MAP.mTrue}` : `${ACTION_MAP.mFalse}`);
                break;
            case ARITH_TYPE_MAP.gt:
                fs.writeSync(this._fd, `@${addr2}\n`);
                fs.writeSync(this._fd, this._ram[addr2] > this._ram[addr1] ? `${ACTION_MAP.mTrue}` : `${ACTION_MAP.mFalse}`);
                break;
            case ARITH_TYPE_MAP.lt:
                fs.writeSync(this._fd, `@${addr2}\n`);
                fs.writeSync(this._fd, this._ram[addr2] < this._ram[addr1] ? `${ACTION_MAP.mTrue}` : `${ACTION_MAP.mFalse}`);
                break;
            default:
                fs.writeSync(this._fd, `@${addr2}\n`);
                fs.writeSync(this._fd, ACTION_MAP.m2d);
                fs.writeSync(this._fd, `@${addr1}\n`);
                fs.writeSync(this._fd, ACTION_MAP[cmd]);
                fs.writeSync(this._fd, `@${addr2}\n`);
                fs.writeSync(this._fd, ACTION_MAP.d2m);
            }
        }
    }
    writePushPop(type, seg, index) {
        if (type === PUSH) {
            switch (seg) {
            case CONSTANT:
                fs.writeSync(this._fd, `@${index}\n`);
                fs.writeSync(this._fd, ACTION_MAP.a2d);
                this._ram[this.pointers.stack] = index;
                fs.writeSync(this._fd, `@${this.pointers.stack}\n`);
                fs.writeSync(this._fd, ACTION_MAP.d2m);
                this.stackPush(this.pointers.stack);
                break;
            default:
                throw new Error('Invalid segment!');
            }
        }
    }
    close() {
        fs.closeSync(this._fd);
    }
}

export default CodeWriter;
