export const ARITH = 'ARITH';
export const PUSH = 'PUSH';
export const POP = 'POP';
export const LABEL = 'LABEL';
export const GOTO = 'GOTO';
export const IF = 'IF';
export const FUNC = 'FUNC';
export const RET = 'RET';
export const CALL = 'CALL';
export const CONSTANT = 'constant';
export const ACTION_MAP = {
    'add': 'D=D+M\n',
    'sub': 'D=D-M\n',
    'neg': 'M=-M\n',
    'and': 'D=D&M\n',
    'or': 'D=D|M\n',
    'not': 'M=!M\n',
    'm2d': 'D=M\n',
    'd2m': 'M=D\n',
    'a2d': 'D=A\n',
    'mTrue': 'M=-1\n',
    'mFalse': 'M=0\n',
    'm+1': 'M=M+1\n',
    'm-1': 'M=M-1\n'
};
export const ARITH_TYPE_MAP = {
    'add': 'add',
    'sub': 'sub',
    'neg': 'neg',
    'eq': 'eq',
    'gt': 'gt',
    'lt': 'lt',
    'and': 'and',
    'or': 'or',
    'not': 'not'
};
