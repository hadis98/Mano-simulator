const fetchBtn = document.getElementById('fetchBtn');
const decodeBtn = document.getElementById('decodeBtn');
const executeBtn = document.getElementById('executeBtn');


function fetch_instruction() {
    fetchBtn.disabled = true;
    fetchBtn.style.backgroundColor = 'rgb(4, 153, 153)';
    current_clock = 'T0';
    AR = PC; // T0
    IR = memory_table[AR]; //T1
    current_clock = 'T1';
    addBinary(PC, '1');
    SC = 1;
}
console.log(IR);

function decode_instruction() {
    // get opcode of instruction
    decodeBtn.disabled = true;
    decodeBtn.style.backgroundColor = 'rgb(4, 153, 153)';
    console.log(hexToBinary(IR));
    I = IR[0];
    opcode_operation = IR.slice(12, 15); //3 bits
    AR = IR.slice(0, 12); //0-11
    current_clock = 'T2';
    // T2
    // base of opcode we decide to execute
}

function execute_instruction(instruction) {
    // if opcode !== 7
    //then the operation is a memory refrence and starts at T4
    // if I=1 =>> is indirect
    //else is direct
    //else
    //if I=1 then it is IO refrence and starts at T3
    //else it is register refrence  and starts at T3
    // if(opcode_operation ==='111'){

    // }
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
function hexToBinary(number) {
    number = parseInt(number, 16);
    console.log(number);
    // If that returns a nonzero value, you know it is negative.
    if ((number & 0x8000) > 0) {
        number = number - 0x10000;
    }

    console.log(number);
    return number.toString(2);
    // return parseInt(number, 16).toString(2);
}

fetchBtn.addEventListener('click', fetch_instruction);
decodeBtn.addEventListener('click', decode_instruction);
executeBtn.addEventListener('click', execute_instruction);