let instr_values = {
    IR: '0x' + binaryToHex(IR),
    AC: '0x' + binaryToHex(AC),
    DR: '0x' + binaryToHex(DR),
    PC: '0x' + binaryToHex(PC),
    AR: '0x' + binaryToHex(AR),
    Memory: '0x' + binaryToHex(AR),
    E: '0x' + E
}

const fetchBtn = document.getElementById('fetchBtn');
const decodeBtn = document.getElementById('decodeBtn');
const executeBtn = document.getElementById('executeBtn');

const end_notif_box = document.getElementById('endProgram_notif');

function disableBtn(button) {
    button.disabled = true;
    button.style.backgroundColor = 'rgb(4, 153, 153)';
}

function enableBtn(button) {
    button.disabled = false;
    button.style.backgroundColor = '#29526b';
}

function fetch_instruction() {
    clearInstTable();
    updateInstructionTable('initial')
    disableBtn(fetchBtn);
    instr_values["PC"] = '0x' + binaryToHex(PC);
    AR = PC; // T0
    console.log('in fetch:  AR: ', binaryToHex(AR), 'PC: ', binaryToHex(AR));
    let data = memory_table_contents['0' + parseInt(AR, 2).toString(16).toUpperCase()];
    instr_values['Memory'] = '0x' + data ? data : '0x' + 0;
    console.log('in fetch: memory value: ', data);

    instr_values["AR"] = '0x' + binaryToHex(AR);
    updateInstructionTable('T0');
    IR = contentToAddress(data); //T1
    console.log('in fetch:  IR: ', IR, binaryToHex(IR));

    instr_values["IR"] = '0x' + binaryToHex(IR);
    PC = addBinary(PC, '1'); // become ready for next instruction
    console.log('in fetch:  PC: ', PC);
    instr_values["PC"] = '0x' + binaryToHex(PC);
    updateInstructionTable('T1');

}
console.log(IR);

function decode_instruction() {
    disableBtn(decodeBtn);
    console.log('in Decode: IR: ', IR);
    I = IR[0];
    opcode_operation = IR.substr(1, 3); //3 bits
    AR = IR.substr(4, 16); //12 bit address
    operation_code = AR.indexOf('1');
    console.log('in Decode: AR: ', AR, binaryToHex(AR));
    instr_values["AR"] = '0x' + binaryToHex(AR);
    let data = memory_table_contents['0' + parseInt(AR, 2).toString(16)];
    instr_values['Memory'] = data ? '0x' + data : '0x' + 0;
    console.log('in decode: I=', I, 'opcode: ', opcode_operation, 'AR', AR);
    updateInstructionTable('T2');

}

function execute_instruction() {
    let opcode = parseInt(opcode_operation, 2);
    let operation = operation_code;
    console.log('opcode and operation: ', opcode, operation);

    if (opcode == 7) { //register or IO
        if (I == 0) { //register
            if (operation == 11) {
                console.log('HLT');
                disableBtn(fetchBtn);
                disableBtn(decodeBtn);
                disableBtn(executeBtn);
                end_notif_box.classList.add('show');
                return 0;
            } else if (operation == 10) {
                console.log('SZE', 'E: ', E);
                if (E == 0) {
                    console.log('if E was zero: jump', E, typeof(E));
                    PC = addBinary(PC, '1');
                    instr_values['PC'] = '0x' + binaryToHex(PC);
                }
            } else if (operation == 9) {
                console.log('SZA');
                if (AC === '0000000000000000') {
                    PC = addBinary(PC, '1');
                    instr_values['PC'] = '0x' + binaryToHex(PC);
                }
            } else if (operation == 8) {
                console.log('SNA');
                if (AC[0] === '1') {
                    PC = addBinary(PC, '1');
                    instr_values['PC'] = '0x' + binaryToHex(PC);
                }
            } else if (operation == 7) {
                console.log('SPA');
                if (AC[15] === '0') {
                    PC = addBinary(PC, '1');
                    instr_values['PC'] = '0x' + binaryToHex(PC);
                }
            } else if (operation == 6) {
                console.log('INC');
                AC = addBinary(AC, '1');
                instr_values['AC'] = '0x' + binaryToHex(AC);
            } else if (operation == 5) {
                console.log('CIL');
                let temp = AC[0];
                let ans = '';
                ans = AC.substr(1, AC.length) + E;
                AC = ans;
                E = temp;
                instr_values['AC'] = '0x' + binaryToHex(AC);
                instr_values['E'] = '0x' + E;
            } else if (operation == 4) {
                console.log('CIR');
                let temp = AC[15];
                let ans = '';
                ans = E + AC.substr(0, AC.length - 1);
                AC = ans;
                E = temp;
                instr_values['AC'] = '0x' + binaryToHex(AC);
                instr_values['E'] = '0x' + E;
            } else if (operation == 3) {
                console.log('CME');
                E = complementOne(E);
                instr_values['E'] = '0x' + E;
            } else if (operation == 2) {
                console.log('CMA');
                AC = complementOne(AC);
                instr_values['AC'] = '0x' + binaryToHex(AC);
            } else if (operation == 1) {
                console.log('CLE');
                E = 0;
                instr_values['E'] = '0x' + E;
            } else if (operation == 0) {
                console.log('CLA');
                AC = '0000000000000000';
                instr_values['AC'] = '0x' + binaryToHex(AC);
            }
            updateInstructionTable('T3');
        } else { // IO
            if (operation == 5) {
                IEN = 0;
            } else if (operation == 4) {
                IEN = 1;
            } else if (operation == 3) {
                if (FGO == 1) {
                    PC = addBinary(PC, '1'); // skip next instruction
                }
            } else if (operation == 2) {
                if (FGI == 0) {
                    PC = addBinary(PC, '1'); // skip next instruction
                }
            } else if (operation == 1) {
                OUTR = AC.substr(8, 15); //8bit low
                FGO = 0;
            } else if (operation == 0) {
                // AC[0-7] = INPR; ?????????
                FGI = 0;
            }
            updateInstructionTable('T3');
        }
    } else { //memory ref
        if (I == 1) {
            let data = memory_table_contents['0' + parseInt(AR, 2).toString(16).toUpperCase()];
            AR = isNegative(data) ? hexToBinary_signed(data, 16) : hexToBinary(data, 16);
            instr_values['AR'] = '0x' + data;
            instr_values['Memory'] = '0x' + memory_table_contents['0' + data];
        }
        if (opcode == 0) {
            console.log('AND');
            let data = memory_table_contents['0' + parseInt(AR, 2).toString(16).toUpperCase()];
            console.log('data in and: ', data);
            console.log('is negative? ', isNegative(data));
            DR = isNegative(data) ? hexToBinary_signed(data, 16) : hexToBinary(data, 16);
            console.log('DR in and: ', DR, binaryToHex(DR));
            instr_values['DR'] = '0x' + binaryToHex(DR);
            updateInstructionTable('T4');
            console.log('AC: ', AC, binaryToHex(AC));
            AC = andTwoNumbers(AC, DR); //T5
            instr_values['AC'] = '0x' + binaryToHex(AC);
            updateInstructionTable('T5');
            console.log('AC: ', AC, binaryToHex(AC));
        } else if (opcode == 1) {
            console.log('ADD');
            console.log('in ADD: DR: ', DR);
            console.log('memory: ', memory_table_contents['0' + parseInt(AR, 2).toString(16).toUpperCase()]);
            let data = memory_table_contents['0' + parseInt(AR, 2).toString(16).toUpperCase()];
            DR = isNegative(data) ? hexToBinary_signed(data, 16) : hexToBinary(data, 16);

            //add AC and DR
            console.log('in ADD: DR: ', DR);
            instr_values['DR'] = '0x' + binaryToHex(DR);
            console.log('in ADD: DR: ', DR);
            updateInstructionTable('T4');
            AC = addBinary(AC, DR); //T5
            E = Cout;
            instr_values['AC'] = '0x' + binaryToHex(AC);
            instr_values['E'] = '0x' + E;
            updateInstructionTable('T5');
        } else if (opcode == 2) {
            console.log('LDA');
            console.log('AR : ', AR, binaryToHex(AR));
            console.log('in LDA: memory[AR]: ', memory_table_contents['0' + parseInt(AR, 2).toString(16).toUpperCase()]);
            console.log('in LDA: DR before: ', DR);

            let data = memory_table_contents['0' + parseInt(AR, 2).toString(16).toUpperCase()];
            DR = isNegative(data) ? hexToBinary_signed(data, 16) : hexToBinary(data, 16);
            instr_values['DR'] = '0x' + binaryToHex(DR);
            console.log('in LDA: DR after: ', DR);
            updateInstructionTable('T4');
            AC = DR; //T5
            console.log('in LDA: AC before: ', AC);
            instr_values['AC'] = '0x' + binaryToHex(AC);
            updateInstructionTable('T5');
        } else if (opcode == 3) {
            let address = '0' + parseInt(AR, 2).toString(16).toUpperCase();
            console.log('STA');
            console.log('in STA: memory[AR]: ', memory_table_contents[address], ' AC: ', AC);
            memory_table_contents[address] = binaryToHex(AC); //T4 convert address to content
            update_memory_table(address);
            instr_values['Memory'] = '0x' + memory_table_contents[address];
            updateInstructionTable('T4');
        } else if (opcode == 4) {
            console.log('BUN');
            PC = AR;
            console.log('pc in BUN: ', PC, binaryToHex(PC));
            instr_values['PC'] = '0x' + binaryToHex(PC);
        } else if (opcode == 5) {
            console.log('BSA');
            let address = '0' + parseInt(AR, 2).toString(16).toUpperCase();
            memory_table_contents[address] = binaryToHex(PC); //T4 ????? convert address to content
            update_memory_table(address);
            AR = addBinary(AR, '1'); //T4
            instr_values['AR'] = '0x' + binaryToHex(AR);
            instr_values['Memory'] = '0x' + memory_table_contents[address];
            updateInstructionTable('T4');
            PC = AR; //T5
            instr_values['PC'] = '0x' + binaryToHex(PC);
            updateInstructionTable('T5');
        } else if (opcode == 6) {
            console.log('ISZ');
            let address = '0' + parseInt(AR, 2).toString(16).toUpperCase();
            let data = memory_table_contents[address];
            DR = isNegative(data) ? hexToBinary_signed(data, 16) : hexToBinary(data, 16);
            instr_values['DR'] = '0x' + binaryToHex(DR);
            updateInstructionTable('T4');
            if (DR == '1111111111111111') {
                DR = '0000000000000000';
            } else {
                DR = addBinary(DR, '1'); //T5
            }
            instr_values['DR'] = '0x' + binaryToHex(DR);
            updateInstructionTable('T5');

            memory_table_contents[address] = binaryToHex(DR); //T6 convert address to content
            update_memory_table(address);
            data = memory_table_contents[address];
            instr_values['Memory'] = '0x' + data;
            console.log(memory_table_contents);
            console.log('in ISZ: DR: ', DR, binaryToHex(DR));

            if (DR == 0) {
                PC = addBinary(PC, '1'); //T6
                instr_values['PC'] = '0x' + binaryToHex(PC);
                console.log('whhhhoooooooooora DR became zero...', DR);
                console.log('PC in isz: ', PC);
            }
            updateInstructionTable('T6');
        }
    }
    updateInstructionTable('final');
    enableBtn(fetchBtn);
    enableBtn(decodeBtn);
    operations_line++;
}


function contentToAddress(content) {
    let bit1 = content[0];
    bit1 = hexToBinary(bit1, 4); //convert bit 1 from hex to binary (4 bits)
    let hexcode = content.substr(1, 3); //bit 1,2,3
    let address = hexToBinary(hexcode, 12);
    return bit1 + address;
}

// function updateBit(register, index, bit) {
//     let temp = '';
//     for (let i = 0; i < register.length; i++) {
//         if (i === index) {
//             temp += bit;
//         } else {
//             temp += register[i];
//         }
//     }
//     return temp;
// }

function and(a, b) { return a == 1 && b == 1 ? 1 : 0; }

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
    let l1 = str1.length;
    let l2 = str2.length;
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
    } else {
        number = number.toString(2);
    }
    return number;
}

function hexToBinary_signed(hex_number, size_number) {
    let answer = hexToBinary(hex_number);
    let finalAns;
    let zero_added = '';
    if (answer[0] == '-') { //if negative number
        answer = answer.substr(1, answer.length - 1);
        if (answer.length < size_number) {
            for (let i = 0; i < size_number - answer.length; i++) {
                zero_added += '0';
            }
            answer = zero_added + answer; //'00000001010101' ex
            finalAns = complementOne(answer);
            finalAns = addBinary(finalAns, '1');
            console.log('final answer in hextobinary_signed func: ', finalAns);
            return finalAns;
        } else {
            console.log('in negative hextobinary func: answer: ', answer);
        }
        console.log('in negative hextobinary func: answer: ', answer);
    }
}

function isNegative(data) {
    if (hexToBinary(data)[0] == '-') {
        return 1;
    } else {
        return 0;
    }
}

function resetProgram() {
    location.reload();
}

const helpBtn = document.getElementById("helpBtn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("help");
const resetBtn = document.getElementById("resetBtn");


fetchBtn.addEventListener('click', fetch_instruction);
decodeBtn.addEventListener('click', decode_instruction);
executeBtn.addEventListener('click', execute_instruction);
helpBtn.addEventListener("click", () => {
    rules.classList.add("show");
});

closeBtn.addEventListener("click", () => {
    rules.classList.remove("show");
});

resetBtn.addEventListener('click', resetProgram);