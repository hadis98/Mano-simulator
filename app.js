// instructions

// memory instructions
// only we define opcodes here
const memory_instructions = {
    AND: [0, 8],
    ADD: [1, 9],
    LDA: [2, "A"],
    STA: [3, "B"],
    BUN: [4, "C"],
    BSA: [5, "D"],
    ISZ: [6, "E"],
};

// registor instructions
const register_instructions = {
    CLA: "7800",
    CLE: "7400",
    CMA: "7200",
    CIR: "7080",
    CIL: "7040",
    INC: "7020",
    SPA: "7010",
    SNA: "7008",
    SZA: "7004",
    SZE: "7002",
    HLT: "7001",
};

// input output instructions
const IO_instructions = {
    INP: "F800",
    OUT: "F400",
    SKI: "F200",
    SKO: "F100",
    ION: "F080",
    IOF: "F040",
};

let AC = '0000000000000000';
let DR = '0000000000000000';
let AR = '000000000000';
let IR = '0000000000000000';
let PC = '000000000000';
let TR = '0000000000000000';
let INR = '00000000';
let OUTR = '00000000';

let I = 0;
let SC = 0;
let S = 0; //start or stop
let E = 0;
let opcode_operation;
let current_clock = '';
let numberOfAddress = 0;
let startAddress = 0;
// console.log(registers);
const labels_table = {};
const memory_table = {};
const assemblerBtn = document.getElementById("assemblerBtn");
let editor_contents;
let results;
let results_index = 0;
// firt level of simulations:

// line counter
let LC = 0;

// in this function we calculate label_table and check every line of codes in editor
function firstStep() {
    for (let i = 0; i < results.length; i++) {
        scanEveryLine_first();
    }
}

function secondStep() {
    LC = 0;
    results_index = 0;
    for (let i = 0; i < results.length; i++) {
        scanEveryLine_second();
    }
}

// this function scans every line of codes in editor
function scanEveryLine_first() {
    let ith_line = results[results_index]; // ith line of results in string
    let results_contents = results[results_index].split(/[ ,]+/);
    if (!ith_line.includes(",")) {
        //dont have label:
        if (ith_line.includes("ORG")) {
            LC = parseInt(results_contents[1]);
            console.log("lc: ", LC);
        } else {
            if (ith_line.includes("END")) {
                // start second step
            } else {
                LC++;
            }
        }
    } else {
        const symbol = results_contents[0];
        labels_table[symbol] = LC;
        LC++;
    }

    results_index++; //be ready to scan next line
}

function scanEveryLine_second() {
    let ith_line = results[results_index];
    let results_contents = results[results_index].split(/[ ,]+/);
    if (
        ith_line.includes("ORG") ||
        ith_line.includes("END") ||
        ith_line.includes("HEX") ||
        ith_line.includes("DEC")
    ) {
        if (ith_line.includes("ORG")) {
            LC = parseInt(results_contents[1]);
            startAddress = LC;
            PC.value = parseInt(results_contents[1]);
        } else if (ith_line.includes("END")) {
            console.log('end of program');
            // end of program
        } else if (ith_line.includes("HEX")) {
            if (results_contents[0] === 'HEX') {
                memory_table[LC] = writeHexNum(results_contents[1]);
            } else if (results_contents[1] === 'HEX') {
                memory_table[LC] = writeHexNum(results_contents[2]);
            }
            LC++;
            numberOfAddress++;
        } else if (ith_line.includes("DEC")) {
            if (results_contents[0] === 'DEC') {
                memory_table[LC] = DecToHex(results_contents[1]);
            } else if (results_contents[1] === 'DEC') {
                memory_table[LC] = DecToHex(results_contents[2]);
            }
            LC++;
            numberOfAddress++;
        }
    } else {
        // if it is memory refrence:
        let target = results_contents[0];
        if (search_in_object(memory_instructions, target)) {
            // if it is memory instruction:
            // format: instruction label or format: instruction label I
            let opcode; //x
            if (results_contents.includes('I')) {
                opcode = memory_instructions[target][1]; //x
            } else {
                opcode = memory_instructions[target][0]; //x
            }
            let address;
            let variable = results_contents[1];
            address = labels_table[variable]; //xxx
            let full_address = opcode.toString() + address.toString();
            console.log(opcode, address, full_address);
            memory_table[LC] = full_address;
            LC++;
            numberOfAddress++;

        } else if (search_in_object(register_instructions, target)) {
            let opcode = register_instructions[target];
            memory_table[LC] = opcode;
            LC++;
            numberOfAddress++;

        } else if (search_in_object(IO_instructions, target)) {
            let opcode = IO_instructions[target];
            memory_table[LC] = opcode;
            LC++;
            numberOfAddress++;
        } else {
            console.log('waaaaaaaaaaarning!!!! in line: ' + LC + ' of memory');
            console.log('instruction doesnt exist');
            LC++;
            numberOfAddress++;
        }
    }
    results_index++;
}

// get contents of editor
// click on assemble button
assemblerBtn.addEventListener("click", () => {
    const strings = document.getElementById("editor").value;
    editor_contents = strings;
    results = editor_contents.split("\n");
    console.log(editor_contents);
    console.log(results);
    firstStep();
    secondStep();
    console.log(labels_table);
    console.log(memory_table);
    updateContentsColumn();
    assemblerBtn.disabled = true;
    assemblerBtn.style.backgroundColor = 'rgb(4, 153, 153)';
});


function search_in_object(object, target) {
    for (let i = 0; i < Object.keys(object).length; i++) {
        if (object[target]) {
            return object[target];
        }
    }
    return 0;
}

function DecToHex(decimal) { // Data (decimal)

    length = -1; // Base string length
    string = ''; // Source 'string'

    characters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']; // character array

    do { // Grab each nibble in reverse order because JavaScript has no unsigned left shift

        string += characters[decimal & 0xF]; // Mask byte, get that character
        ++length; // Increment to length of string

    } while (decimal >>>= 4); // For next character shift right 4 bits, or break on 0

    decimal += 'x'; // Convert that 0 into a hex prefix string -> '0x'

    do
        decimal += string[length];
    while (length--); // Flip string forwards, with the prefixed '0x'
    if (decimal.slice(2).length > 4) {
        decimal = decimal.split('').slice(-4).join('');
    } else if (decimal.slice(2).length <= 4) {
        let number_of_zero = '';
        for (let i = 0; i < 4 - decimal.slice(2).length; i++) {
            number_of_zero += '0';
        }
        decimal = decimal.split('').slice(-decimal.slice(2).length).join('');
        decimal = number_of_zero + decimal;
    }
    return (decimal); // return (hexadecimal);
}

function writeHexNum(number) {
    if (number.length <= 4) {
        let number_of_zero = '';
        for (let i = 0; i < 4 - number.length; i++) {
            number_of_zero += '0';
        }
        return number = number_of_zero + number;
    }
}