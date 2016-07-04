import fs from 'fs';
import path from 'path';
import Parser from './parser.js';
import CodeWriter from './code-writer.js';
import {
    ARITH,
    PUSH,
    POP
} from './constants.js';

let input = process.argv[2];
let isFile = path.extname(input) !== '';
let fileSrc = isFile ? [path.basename(input)] : fs.readdirSync(input);
let writer = new CodeWriter(input);
let parser;

fileSrc.filter((file) => {
    return path.extname(file) === '.vm';
}).map((file) => {
    return isFile ? `${path.dirname(input)}/${file}` : `${input}/${file}`;
}).forEach((file) => {
    parser = new Parser(file);
    while (parser.hasMoreCommands()) {
        parser.advance();
        if (parser.commandType() === ARITH) {
            writer.writeArith(parser.arg1());
        } else if (parser.commandType() === PUSH || parser.commandType() === POP) {
            writer.writePushPop(parser.commandType(), parser.arg1(), parser.arg2());
        }
    }
});
