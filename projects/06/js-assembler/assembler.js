import path from 'path';
import fs from 'fs';
import Parser from './parser.js';
import Code from './code.js';
import SymbolTable from './symbolTable.js';
import { A_COM, C_COM, L_COM } from './constants.js';

console.log('Start Assembling...');
const filePath = process.argv[2] || '';
const parser = new Parser(filePath);
const code = new Code();
const symbolTable = new SymbolTable();
const targetFileName = filePath.replace('.asm', '.hack');
let pc = 0,
    fd = fs.openSync(targetFileName, 'w'),
    availableAddr = 16,
    commandType, tmp, tmpSym;

while (parser.hasMoreCommands()) {
    parser.advance();
    commandType = parser.commandType();
    if (commandType === L_COM) {
	symbolTable.addEntry(parser.symbol(), pc);
    } else {
        pc += 1;
    }
}

parser.revertToStart();

while (parser.hasMoreCommands()) {
    tmp = '';
    parser.advance();
    commandType = parser.commandType();
    try {
        if (commandType === C_COM) {
            tmp += '111';
            tmp += code.comp(parser.comp());
            tmp += code.dest(parser.dest());
            tmp += code.jump(parser.jump());
        } else if (commandType === A_COM) {
            tmp += '0';
	    tmpSym = parser.symbol();
            if (tmpSym.match(/[a-zA-Z]/)) {
	        if (symbolTable.contains(tmpSym)) {
		    tmpSym = symbolTable.getAddress(tmpSym);
		} else {
		    symbolTable.addEntry(tmpSym, availableAddr);
		    tmpSym = availableAddr;
		    availableAddr += 1;
		    if (availableAddr >= 16384) {
		        throw new Error('Maximum memory exceeded!');
		    }
		}
	    }
	    tmpSym = (+tmpSym).toString(2);
	    if (tmpSym.length < 15) {
	        tmpSym = '0'.repeat(15-tmpSym.length) + tmpSym;
	    }
            tmp += tmpSym;
        }
    } catch (e) {
	fs.closeSync(fd);
	throw new Error('Invalid syntax');
    }
    if (commandType === C_COM || commandType === A_COM) {
        tmp += '\n';
        console.log(`writing ${tmp}`);
        fs.writeSync(fd, tmp);
    }
}

fs.closeSync(fd);
console.log('Done!');
