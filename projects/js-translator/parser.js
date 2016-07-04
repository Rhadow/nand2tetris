import fs from 'fs';
import {
    ARITH,
    ARITH_TYPE_MAP,
    PUSH,
    POP,
    FUNC,
    RET,
    CALL
} from './constants.js';

class Parser {
    constructor(filePath) {
        this.lines = fs.readFileSync(filePath).toString().split('\r\n');
        this.lines = this.lines.filter((line) => {
            const isComment = (/^\/\/.*/g).test(line);
            return line && !isComment;
        });
        this.lines = this.lines.map((line) => {
            let commentIndex = line.indexOf('//');
            if (commentIndex !== -1) {
                line = line.slice(0, commentIndex);
            }
            return line.trim();
        });
        this.currentIndex = -1;
    }

    revertToStart() {
        this.currentIndex = -1;
    }

    hasMoreCommands() {
        return this.currentIndex < this.lines.length - 1;
    }
    advance() {
        if (this.hasMoreCommands()) {
            this.currentIndex += 1;
        } else {
            throw new Error('Advance can only be executed when hasMoreCommands() returns True');
        }
    }
    commandType() {
        const currentCommand = (this.currentIndex >= 0 && this.currentIndex < this.lines.length) ? this.lines[this.currentIndex] : '';
        let action;
        if (currentCommand) {
            action = currentCommand.indexOf(' ') !== -1 ? currentCommand.slice(0, currentCommand.indexOf(' ')) : currentCommand;
            if (currentCommand.startsWith('push')) {
                return PUSH;
            } else if (currentCommand.startsWith('pop')) {
                return POP;
            } else if (action in ARITH_TYPE_MAP) {
                return ARITH;
            } else {
                throw new Error('Can not find command type when current command is invalid!');
            }
        } else {
            throw new Error('Can not find command type when current command is invalid!');
        }
    }
    arg1() {
        let commandType = this.commandType();
        let currentCommand = this.lines[this.currentIndex];
        let commands = currentCommand.split(' ');
        let action = commands.length === 1 ? commands[0] : commands[1];

        if (commandType !== RET) {
            return action;
        } else {
            throw new Error('arg1 is invalid for RETURN command type');
        }
    }
    arg2() {
        let commandType = this.commandType();
        let currentCommand = this.lines[this.currentIndex];
        let commands = currentCommand.split(' ');

        if (commandType === PUSH || commandType === POP || commandType === FUNC || commandType === CALL) {
            if (commands.length >= 3) {
                return commands[2];
            } else {
                throw new Error('Invalid commands, no ARG2!');
            }
        } else {
            throw new Error('arg2 is only valid for PUSH, POP, FUNC and CALL command type');
        }
    }
}

export default Parser;
