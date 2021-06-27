let instr_values = {
    IR: binaryToHex(IR),
    AC: binaryToHex(AC),
    DR: binaryToHex(DR),
    PC: binaryToHex(PC),
    AR: binaryToHex(AR),
    Memory: binaryToHex(AR),
    E: E
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
    if (instructions_arr[operations_line] != undefined) {
        clearInstTable();
        disableBtn(fetchBtn);
        // current_clock = 'T0';
        instr_values["PC"] = binaryToHex(PC);
        AR = PC; // T0
        console.log('in fetch:  AR: ', AR, 'PC: ', PC);
        instr_values["AR"] = binaryToHex(AR);
        console.log('AR', AR);
        updateInstructionTable('T0');
        console.log('in fetch: memory value: ', memory_table_contents['0' + parseInt(AR, 2).toString(16)]);
        IR = contentToAddress(memory_table_contents['0' + parseInt(AR, 2).toString(16)]); //T1
        console.log('in fetch:  IR: ', IR);
        let data = memory_table_contents['0' + parseInt(AR, 2).toString(16)];
        instr_values['Memory'] = data ? data : 0;
        instr_values["IR"] = binaryToHex(IR);
        current_clock = 'T1';
        PC = addBinary(PC, '1');
        console.log('in fetch:  PC: ', PC);
        instr_values["PC"] = binaryToHex(PC);
        SC = 1;
        updateInstructionTable('T1');
    }
}
console.log(IR);

function decode_instruction() {
    if (instructions_arr[operations_line] != undefined) {
        disableBtn(decodeBtn);
        // IR = hexToBinary(IR, 16);
        console.log('in Decode: IR: ', IR);
        I = IR[0];
        opcode_operation = IR.substr(1, 3); //3 bits
        AR = IR.substr(5, 16); //12 bit address
        console.log('in Decode: AR: ', AR, binaryToHex(AR));
        instr_values["AR"] = binaryToHex(AR);
        let data = memory_table_contents['0' + parseInt(AR, 2).toString(16)];
        instr_values['Memory'] = data ? data : 0;
        console.log('in decode: ', I, opcode_operation, AR);
        // current_clock = 'T2';
        updateInstructionTable('T2');
    }
    // base of opcode we decide to execute
}

function execute_instruction() {
    let instruction = instructions_arr[operations_line];
    console.log('instruction: ', instruction);
    // executeBtn.style.backgroundColor = 'rgb(4, 153, 153)';
    if (instruction != undefined) {
        if (search_in_object(register_instructions, instruction)) {
            if (instruction === 'HLT') {
                console.log('HLT');
                disableBtn(fetchBtn);
                disableBtn(decodeBtn);
                disableBtn(executeBtn);
                end_notif_box.classList.add('show');
                // setTimeout(() => {
                //     end_notif_box.classList.remove('show');
                // }, 3000);
                S = 0;
                return 0;
            } else if (instruction === 'SZE') {
                if (!E) {
                    //increment pc
                    PC = addBinary(PC, '1');
                    instr_values['PC'] = binaryToHex(PC);
                }
            } else if (instruction === 'SZA') {
                if (AC === '0000000000000000') {
                    PC = addBinary(PC, '1');
                    instr_values['PC'] = binaryToHex(PC);
                }
            } else if (instruction === 'SNA') {
                if (AC[0] === '1') {
                    PC = addBinary(PC, '1');
                    instr_values['PC'] = binaryToHex(PC);
                }
            } else if (instruction === 'SPA') {
                if (AC[15] === '0') {
                    PC = addBinary(PC, '1');
                    instr_values['PC'] = binaryToHex(PC);
                }
            } else if (instruction === 'INC') {
                AC = addBinary(AC, '1');
                instr_values['AC'] = binaryToHex(AC);
            } else if (instruction === 'CIR') {
                // shift to right AC
                AC >> 1;
                AC = updateBit(AC, 0, E);
                E = AC[15];
                instr_values['AC'] = AC;
                instr_values['E'] = E;
            } else if (instruction === 'CIL') {
                // shift to left AC , AC should be in binary
                AC << 1;
                AC = updateBit(AC, 15, E);
                E = AC[0];
                instr_values['AC'] = AC;
                instr_values['E'] = E;
            } else if (instruction === 'CME') {
                E = complementOne(E);
                instr_values['E'] = E;
            } else if (instruction === 'CMA') {
                AC = complementOne(AC);
                instr_values['AC'] = binaryToHex(AC);
            } else if (instruction === 'CLE') {
                E = 0;
                instr_values['E'] = E;
            } else if (instruction === 'CLA') {
                AC = '0000000000000000';
                instr_values['AC'] = binaryToHex(AC);
            }
            // current_clock = 'T3';
            updateInstructionTable('T3');
            SC = 0;
        } else if (search_in_object(memory_instructions, instruction)) {
            if (instruction === 'AND') {
                // DR = hexToBinary_signed(memory_table_contents['0' + parseInt(AR, 2).toString(16)], 16); //T4
                let data = memory_table_contents['0' + parseInt(AR, 2).toString(16)];
                DR = isNegative(data) ? hexToBinary_signed(data, 16) : hexToBinary(data, 16);
                console.log(DR);
                instr_values['DR'] = binaryToHex(DR);
                updateInstructionTable('T4');
                AC = andTwoNumbers(AC, DR); //T5
                instr_values['AC'] = binaryToHex(AC);
                updateInstructionTable('T5');
            } else if (instruction === 'ADD') {
                console.log('in ADD: DR: ', DR);
                console.log('memory: ', memory_table_contents['0' + parseInt(AR, 2).toString(16)]);
                let data = memory_table_contents['0' + parseInt(AR, 2).toString(16)];
                DR = isNegative(data) ? hexToBinary_signed(data, 16) : hexToBinary(data, 16);

                //add AC and DR
                console.log('in ADD: DR: ', DR);
                instr_values['DR'] = binaryToHex(DR);
                console.log('in ADD: DR: ', DR);
                updateInstructionTable('T4');
                AC = addBinary(AC, DR); //T5
                E = Cout;
                instr_values['AC'] = binaryToHex(AC);
                instr_values['E'] = E;
                updateInstructionTable('T5');
            } else if (instruction === 'LDA') {
                console.log('in LDA: memory[AR]: ', memory_table_contents['0' + parseInt(AR, 2).toString(16)]);
                console.log('in LDA: DR before: ', DR);

                let data = memory_table_contents['0' + parseInt(AR, 2).toString(16)];
                DR = isNegative(data) ? hexToBinary_signed(data, 16) : hexToBinary(data, 16);
                instr_values['DR'] = binaryToHex(DR);
                console.log('in LDA: DR after: ', DR);
                updateInstructionTable('T4');
                AC = DR; //T5
                console.log('in LDA: AC before: ', AC);
                instr_values['AC'] = binaryToHex(AC);
                updateInstructionTable('T5');
            } else if (instruction === 'STA') {
                console.log('in STA: memory[AR]: ', memory_table_contents['0' + parseInt(AR, 2).toString(16)], ' AC: ', AC);
                memory_table_contents['0' + parseInt(AR, 2).toString(16)] = binaryToHex(AC); //T4 convert address to content
                update_memory_table('0' + parseInt(AR, 2).toString(16));
                instr_values['Memory'] = memory_table_contents['0' + parseInt(AR, 2).toString(16)];
                updateInstructionTable('T4');
            } else if (instruction === 'BUN') {
                PC = AR;
                instr_values['PC'] = binaryToHex(PC);
                updateInstructionTable('T4');
            } else if (instruction === 'BSA') {
                memory_table_contents['0' + parseInt(AR, 2).toString(16)] = PC; //T4 ????? convert address to content
                update_memory_table('0' + parseInt(AR, 2).toString(16));
                AR = addBinary(AR, '1'); //T4
                instr_values['AR'] = binaryToHex(AR);
                updateInstructionTable('T4');
                PC = AR; //T5
                instr_values['PC'] = binaryToHex(PC);
                updateInstructionTable('T5');
            } else if (instruction === 'ISZ') {
                DR = hexToBinary_signed(memory_table_contents['0' + parseInt(AR, 2).toString(16)], 16);
                instr_values['DR'] = binaryToHex(DR);
                updateInstructionTable('T4');
                DR = addBinary(DR, '1'); //T5
                instr_values['DR'] = binaryToHex(DR);
                updateInstructionTable('T5');
                memory_table_contents['0' + parseInt(AR, 2).toString(16)] = DR; //T6 convert address to content
                update_memory_table('0' + parseInt(AR, 2).toString(16));
                instr_values['Memory'] = memory_table_contents['0' + parseInt(AR, 2).toString(16)];
                if (DR == 0) {
                    PC = addBinary(PC, '1'); //T6
                    instr_values['PC'] = binaryToHex(PC);
                }
                updateInstructionTable('T6');
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
            updateInstructionTable('T3');
            // updateInstructionTable('final');
            current_clock = 'T3';
        }
        updateInstructionTable('final');
        enableBtn(fetchBtn);
        enableBtn(decodeBtn);
        // executeBtn.style.backgroundColor = '#29526b';
        operations_line++;
    }
}

function contentToAddress(content) {
    let bit1 = content[0];
    //convert bit 1 from decimal to binary (4 bits)
    bit1 = parseInt(bit1).toString(2);
    let number_of_zero = 0;
    let zero_added = '';
    if (bit1.length < 4) {
        number_of_zero = 4 - bit1.length;
        for (let i = 0; i < number_of_zero; i++) {
            zero_added += '0';
        }
        bit1 = zero_added + bit1;
    }
    let hexcode = content.substr(1, 3); //bit 1,2,3
    let address = hexToBinary(hexcode, 12);
    return bit1 + address;
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
        // return number;
    } else {
        // return number.toString(2);
        number = number.toString(2);
    }
    return number;
    // return parseInt(number, 16).toString(2);
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
            console.log('final answer in hextobinary func: ', finalAns);
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


const helpBtn = document.getElementById("helpBtn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("help");

fetchBtn.addEventListener('click', fetch_instruction);
decodeBtn.addEventListener('click', decode_instruction);
executeBtn.addEventListener('click', execute_instruction);
helpBtn.addEventListener("click", () => {
    rules.classList.add("show");
});

closeBtn.addEventListener("click", () => {
    rules.classList.remove("show");
});