class SymbolTable {

    constructor() {
        this._table = {
	    SP: 0,
	    LCL: 1,
	    ARG: 2,
	    THIS: 3,
	    THAT: 4,
	    R0: 0,
	    R1: 1,
	    R2: 2,
	    R3: 3,
	    R4: 4,
	    R5: 5,
	    R6: 6,
	    R7: 7,
	    R8: 8,
	    R9: 9,
	    R10: 10,
	    R11: 11,
	    R12: 12,
	    R13: 13,
	    R14: 14,
	    R15: 15,
	    SCREEN: 16384,
	    KBD: 24576
	};
    }

    addEntry(key, addr) {
        if (key in this._table) {
            throw new Error('Duplicate symbols!');
        } else {
            this._table[key] = addr;
        }
    }
    
    contains(key) {
        return key in this._table;
    }

    getAddress(key) {
	if (key in this._table) {
	    return this._table[key];
	} else {
	    throw new Error('Symbol not in symbol table!');
	}
    }

}

export default SymbolTable;
