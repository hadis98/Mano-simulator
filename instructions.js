const fetchBtn = document.getElementById('fetchBtn');
const decodeBtn = document.getElementById('decodeBtn');
const executeBtn = document.getElementById('executeBtn');


function fetch_instruction() {
    fetchBtn.disabled = true;
    fetchBtn.style.backgroundColor = 'rgb(4, 153, 153)';
    current_clock = 'T0';
    AR = PC; // T0
    console.log(AR);
    //IR : 16bit
    IR = memory_table_contents['0' + parseInt(AR, 2).toString(16)]; //T1
    console.log(IR);
    current_clock = 'T1';
    addBinary(PC, '1');
    SC = 1;
}
console.log(IR);

function decode_instruction() {
    // get opcode of instruction
    decodeBtn.disabled = true;
    decodeBtn.style.backgroundColor = 'rgb(4, 153, 153)';
    IR = hexToBinary(IR, 16);
    console.log(IR);
    I = IR[0];
    opcode_operation = IR.substr(12, 15); //3 bits
    AR = IR.substr(0, 12); //0-11
    console.log(I, opcode_operation, AR);
    current_clock = 'T2';
    // T2
    // base of opcode we decide to execute
}

function execute_instruction(instruction) {
    executeBtn.disabled = true;
    executeBtn.style.backgroundColor = 'rgb(4, 153, 153)';
    if (search_in_object(register_instructions, instruction)) {
        if (instruction === 'HLT') {
            S = 0;
        } else if (instruction === 'SZE') {
            if (!E) {
                //increment pc
                PC = addBinary(PC, '1');
            }
        } else if (instruction === 'SZA') {
            if (AC === '0000000000000000') {
                PC = addBinary(PC, '1');
            }
        } else if (instruction === 'SNA') {
            if (AC[0] === '1') {
                PC = addBinary(PC, '1');
            }
        } else if (instruction === 'SPA') {
            if (AC[15] === '0') {
                PC = addBinary(PC, '1');
            }
        } else if (instruction === 'INC') {
            AC = addBinary(AC, '1');
        } else if (instruction === 'CIR') {
            // shift to right AC
            AC >> 1;
            AC = updateBit(AC, 0, E);
            E = AC[15];
        } else if (instruction === 'CIL') {
            // shift to left AC , AC should be in binary
            AC << 1;
            AC = updateBit(AC, 15, E);
            E = AC[0];

        } else if (instruction === 'CME') {
            E = complementOne(E);
        } else if (instruction === 'CMA') {
            AC = complementOne(AC);
        } else if (instruction === 'CLE') {
            E = 0;
        } else if (instruction === 'CLA') {
            AC = '0000000000000000';
        }
        current_clock = 'T3';
        SC = 0;
    } else if (search_in_object(memory_instructions, instruction)) {
        if (instruction === 'AND') {
            // start from T4
            DR = memory_table_contents['0' + parseInt(AR, 2).toString(16)]; //T4
            console.log(DR);
            AC = andTwoNumbers(AC, DR);
        } else if (instruction === 'ADD') {
            DR = memory_table_contents['0' + parseInt(AR, 2).toString(16)]; //T4
            //add AC and DR
            AC = addBinary(AC, DR); //T5
            E = Cout;
        } else if (instruction === 'LDA') {
            DR = memory_table_contents['0' + parseInt(AR, 2).toString(16)]; //T4
            AC = DR;
        } else if (instruction === 'STA') {
            memory_table_contents['0' + parseInt(AR, 2).toString(16)] = AC;
        } else if (instruction === 'BUN') {
            PC = AR;
        } else if (instruction === 'BSA') {
            memory_table_contents['0' + parseInt(AR, 2).toString(16)] = PC; //T4
            AR = addBinary(AR, '1'); //T4
            PC = AR; //T5
        } else if (instruction === 'ISZ') {
            DR = memory_table_contents['0' + parseInt(AR, 2).toString(16)]; //T4
            DR = addBinary(DR, '1'); //T5
            memory_table_contents['0' + parseInt(AR, 2).toString(16)] = DR; //T6
            if (DR == 0) {
                PC = addBinary(PC, '1'); //T6
            }
        }
        SC = 0;
    } else if (search_in_object(IO_instructions, instruction)) {
        if (instruction === 'IOF') {
            IEN = 0;
        } else if (instruction === 'ION') {
            IEN = 1;
        } else if (instruction === 'SKO') {
            if (FGO == 1) {
                PC = addBinary(PC, '1'); // skip next instruction
            }
        } else if (instruction === 'SKI') {
            if (FGI == 0) {
                PC = addBinary(PC, '1'); // skip next instruction
            }
        } else if (instruction === 'OUT') {
            OUTR = AC.substr(8, 15); //8bit low
            FGO = 0;
        } else if (instruction === 'INP') {
            // AC[0-7] = INPR; ?????????
            FGI = 0;
        }
        SC = 0;
        current_clock = 'T3';
    }

}

function updateBit(register, index, bit) {
    let temp = '';
    for (let i = 0; i < register.length; i++) {
        if (i === index) {
            temp += bit;
        } else {
            temp += register[i];
        }
    }
    return temp;
}

function xor(a, b) { return (a === b ? 0 : 1); }

function and(a, b) { return a == 1 && b == 1 ? 1 : 0; }

function or(a, b) { return (a || b); }

function andTwoNumbers(num1, num2) {
    let result = '';
    for (let i = 0; i < num1.length; i++) {
        result += and(num1[i], num2[i]);
    }
    return result;
}
const addBinary = (str1, str2) => {
    let carry = 0;
    const res = [];
    let l1 = str1.length,
        l2 = str2.length;
    for (let i = l1 - 1, j = l2 - 1; 0 <= i || 0 <= j; --i, --j) {
        let a = 0 <= i ? Number(str1[i]) : 0,
            b = 0 <= j ? Number(str2[j]) : 0;
        res.push((a + b + carry) % 2);
        carry = 1 < a + b + carry;
    };
    if (carry) {
        res.push(1);
        Cout = 1;
    }
    return res.reverse().join('');
};


function complementOne(number) {
    if (typeof(number) == "string") {
        let ans = '';
        for (let i = 0; i < number.length; i++) {
            if (number[i] === '1') {
                ans += '0';
            } else {
                ans += '1';
            }
        }
        return ans;
    } else {
        if (number === 0) {
            return 1;
        } else {
            return 0
        }
    }
}


function binaryToHex(number) {
    return parseInt(number, 2).toString(16).toUpperCase();
}

// number should be in string formS
function hexToBinary(number, size_number) {
    number = parseInt(number, 16);
    let zero_added = '';
    // If that returns a nonzero value, you know it is negative.
    if ((number & 0x8000) > 0) {
        number = number - 0x10000;
    }

    if (number.toString(2).length < size_number) {
        for (let i = 0; i < size_number - number.toString(2).length; i++) {
            zero_added += '0';
        }
        number = zero_added + number.toString(2);
        return number;

    } else {
        return number.toString(2);
    }
    // return parseInt(number, 16).toString(2);
}

fetchBtn.addEventListener('click', fetch_instruction);
decodeBtn.addEventListener('click', decode_instruction);
executeBtn.addEventListener('click', execute_instruction);