import fs from 'fs';
import {A_COM, C_COM, L_COM } from './constants.js';

class Parser {
    constructor(filePath) {
        this.lines = fs.readFileSync(filePath).toString().split('\r\n');
	this.lines = this.lines.filter((line) => {
	    const isComment = (/^\/\/.*/g).test(line);
	    return line && !isComment;
	});
	this.lines = this.lines.map((line) => {
	    let commentIndex = line.indexOf('//');
	    if (commentIndex != -1) {
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
	const lComReg = /^\(.*\)$/;
	const cComReg = /^.+(=|;).+$/;
	const currentCommand = (this.currentIndex >= 0 && this.currentIndex < this.lines.length) ? this.lines[this.currentIndex] : '';
	if (currentCommand) {
	    if (currentCommand.startsWith('@')) {
	        return A_COM;
	    } else if (lComReg.test(currentCommand)) {
	        return L_COM;
	    } else if (cComReg.test(currentCommand)) {
	        return C_COM;
	    } else {
	        throw new Error('Can not find command type when current command is invalid!');
	    }
	} else {
	    throw new Error('Can not find command type when current command is invalid!');
	}
    }
    validateSymbol(sym) {
	if (sym < 0 || sym > 65535) {
	    return false;
	} else if (/[0-9]\D+/.test(sym)) {
	    return false;
	} else if (sym.match(/[^0-9a-zA-Z_:$.]/)) {
	    return false;
	} else {
	    return true;
	}
    }
    symbol() {
        const commandType = this.commandType();
	const currentCommand = this.lines[this.currentIndex];
	let symbol;
        if (commandType === A_COM) {
	    symbol = currentCommand.slice(1);
	} else if (commandType === L_COM) {
	    symbol = currentCommand.slice(1, -1);
	} else {
	    throw new Error('Can only get symbol from A type command or L type command!');
	}
	if (this.validateSymbol(symbol)) {
	    return symbol;
	} else {
	    throw new Error('Invalid symbol syntax');
	}
    }
    dest() {
        const commandType = this.commandType();
	const currentCommand = this.lines[this.currentIndex];
        if (commandType === C_COM) {
	    const hasEqual = currentCommand.indexOf('=') !== -1;
            return hasEqual ? currentCommand.slice(0, currentCommand.indexOf('=')) : '';
	} else {
	    throw new Error('Can only get destination from C type command!');
	}
    }
    comp() {
        const commandType = this.commandType();
	const currentCommand = this.lines[this.currentIndex];
        if (commandType === C_COM) {
	    const hasEqual = currentCommand.indexOf('=') !== -1;
            const hasSemi = currentCommand.indexOf(';') !== -1;
	    if (hasEqual) {
	        return currentCommand.slice(currentCommand.indexOf('=') + 1);
	    } else if (hasSemi) {
	        return currentCommand.slice(0, currentCommand.indexOf(';'));
	    } else {
	        throw new Error('Cannot get computing command with no equal sign and no semicolon in C type command');
	    }
	} else {
	    throw new Error('Can only get computing command from C type command!');
	}
    }
    jump() {
        const commandType = this.commandType();
	const currentCommand = this.lines[this.currentIndex];
        if (commandType === C_COM) {
            const hasSemi = currentCommand.indexOf(';') !== -1;
	    return hasSemi ? currentCommand.slice(currentCommand.indexOf(';') + 1) : '';
	} else {
	    throw new Error('Can only get jump from C type command!');
	}
    }
}

export default Parser;
